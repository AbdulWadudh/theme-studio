"use client";

import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { loadFontsourceFont, syncActiveFontCache } from "../core/fonts";
import { defaultPresets } from "../core/presets";
import { TACTILE_CSS_RULES } from "../core/tactile";
import { resolveActiveTokens, tokensToCssVars } from "../core/tokens";
import type {
	BaseTokens,
	ColorMode,
	CompactCookiePayload,
	ResolvedMode,
	ThemeContextValue,
	ThemeDefinition,
	ThemeStudioConfig,
	ZenithPlugin,
} from "../core/types";
import { createCookieStorage } from "../storage/cookie";
import type { StorageAdapter } from "../storage/types";
import { createSyncBus } from "../sync/bus";
import { ThemeContext } from "./context";
import { FloatingStudioTrigger } from "./floating-trigger";
import { ThemeStudioDrawer } from "./theme-studio-drawer";

export interface ThemeProviderProps<T extends BaseTokens = BaseTokens> {
	children: ReactNode;
	themes?: ThemeDefinition<T>[];
	defaultTheme?: string;
	defaultMode?: ColorMode;
	storage?: StorageAdapter;
	storageKey?: string;
	syncChannel?: string;
	enableSync?: boolean;
	plugins?: ZenithPlugin<T>[];
	studio?: boolean | ThemeStudioConfig;
	initialState?: {
		themeId?: string;
		mode?: ColorMode;
		resolvedMode?: ResolvedMode;
		delta?: Partial<T>;
	};
}

export function ThemeProvider<T extends BaseTokens = BaseTokens>({
	children,
	themes,
	defaultTheme = "dark-slate",
	defaultMode = "system",
	storage: customStorage,
	storageKey = "k79_theme_state",
	syncChannel = "k79_theme_channel",
	enableSync = true,
	plugins = [],
	studio = false,
	initialState,
}: ThemeProviderProps<T>) {
	const storage = useMemo(
		() => customStorage || createCookieStorage(),
		[customStorage],
	);

	const initialPresets = useMemo(() => {
		const list = themes || (defaultPresets as unknown as ThemeDefinition<T>[]);
		const map = new Map<string, ThemeDefinition<T>>();
		for (const t of list) {
			map.set(t.id, t);
		}
		return map;
	}, [themes]);

	const [themeRegistry, setThemeRegistry] = useState(initialPresets);

	// Lazily read client-persisted state if initialState was not provided (SPA / Vite hydration)
	const clientStored = useMemo<CompactCookiePayload<T> | null>(() => {
		if (initialState) return null;
		if (typeof window === "undefined") return null;
		try {
			const raw =
				typeof storage.getItem === "function"
					? (storage.getItem(storageKey) as string | null)
					: null;
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed?.def && parsed.def !== defaultTheme) {
					return null;
				}
				return parsed;
			}
		} catch (_e) {}
		return null;
	}, [initialState, storage, storageKey, defaultTheme]);

	const [activeThemeId, setActiveThemeId] = useState<string>(
		initialState?.themeId || clientStored?.id || defaultTheme,
	);
	const [activeMode, setActiveMode] = useState<ColorMode>(
		initialState?.mode || clientStored?.m || defaultMode,
	);
	const [customDelta, setCustomDelta] = useState<Partial<T> | undefined>(
		initialState?.delta ?? clientStored?.d,
	);
	const [isStudioOpen, setIsStudioOpen] = useState(false);

	const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
		if (typeof window !== "undefined" && window.matchMedia) {
			return window.matchMedia("(prefers-color-scheme: dark)").matches;
		}
		return false;
	});

	useEffect(() => {
		if (typeof window === "undefined" || !window.matchMedia) return;
		const mql = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, []);

	const resolvedMode: ResolvedMode = useMemo(() => {
		if (activeMode === "system") {
			return systemPrefersDark ? "dark" : "light";
		}
		return activeMode;
	}, [activeMode, systemPrefersDark]);

	const activePreset = useMemo(() => {
		return (
			themeRegistry.get(activeThemeId) ||
			initialPresets.get(defaultTheme) ||
			(defaultPresets[0] as unknown as ThemeDefinition<T>)
		);
	}, [themeRegistry, activeThemeId, initialPresets, defaultTheme]);

	const activeTokens = useMemo(() => {
		let resolved = resolveActiveTokens(activePreset, resolvedMode, customDelta);
		for (const plugin of plugins) {
			if (plugin.onTokensTransform) {
				resolved = plugin.onTokensTransform(resolved);
			}
		}
		return resolved;
	}, [activePreset, resolvedMode, customDelta, plugins]);

	const syncBusRef = useRef<ReturnType<typeof createSyncBus> | null>(null);
	useEffect(() => {
		if (!enableSync) return;
		const bus = createSyncBus(syncChannel);
		syncBusRef.current = bus;
		return () => {
			if (bus) {
				if (typeof (bus as any).destroy === "function") (bus as any).destroy();
				else if (typeof (bus as any).close === "function") (bus as any).close();
			}
		};
	}, [enableSync, syncChannel]);

	const persistState = useCallback(
		(themeId: string, mode: ColorMode, delta?: Partial<T>) => {
			const payload: CompactCookiePayload<T> = {
				id: themeId,
				m: mode,
				def: defaultTheme,
			};
			if (delta && Object.keys(delta).length > 0) {
				payload.d = delta;
			}

			const serialized = JSON.stringify(payload);
			storage.setItem(storageKey, serialized);
			syncBusRef.current?.post("THEME_CHANGE", payload);
		},
		[defaultTheme, storage, storageKey],
	);

	const applyToDom = useCallback(
		(tokens: T, currentResolvedMode: ResolvedMode) => {
			if (typeof document === "undefined") return;
			const root = document.documentElement;

			root.classList.remove("light", "dark");
			root.classList.add(currentResolvedMode);

			const cssVars = tokensToCssVars(tokens);
			for (const [key, val] of Object.entries(cssVars)) {
				if (typeof val === "string") {
					root.style.setProperty(key, val);
				}
			}

			if (tokens.radius) {
				root.style.setProperty("--radius", tokens.radius);
				root.style.setProperty("--radius-card", tokens.radius);
				root.style.setProperty("--radius-lg", tokens.radius);
				root.style.setProperty("--radius-md", `calc(${tokens.radius} * 0.75)`);
				root.style.setProperty("--radius-sm", `calc(${tokens.radius} * 0.5)`);
			}

			if (tokens.fontHeading) {
				loadFontsourceFont(tokens.fontHeading);
			} else {
				root.style.removeProperty("--font-heading");
			}

			if (tokens.fontBody) {
				loadFontsourceFont(tokens.fontBody);
				root.style.fontFamily = `var(--font-body, ${tokens.fontBody}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)`;
			} else {
				root.style.removeProperty("--font-body");
				root.style.removeProperty("font-family");
			}

			if (tokens.tactile === "true") {
				root.setAttribute("data-tactile", "true");
			} else {
				root.removeAttribute("data-tactile");
			}

			syncActiveFontCache();
		},
		[],
	);

	useEffect(() => {
		applyToDom(activeTokens, resolvedMode);
		plugins.forEach((p) => {
			p.onThemeChange?.(activePreset, resolvedMode);
		});
	}, [activeTokens, resolvedMode, activePreset, applyToDom, plugins]);

	const setTheme = useCallback(
		(themeId: string) => {
			setActiveThemeId(themeId);
			setCustomDelta((prev) => {
				persistState(themeId, activeMode, prev);
				return prev;
			});
		},
		[activeMode, persistState],
	);

	const setMode = useCallback(
		(mode: ColorMode) => {
			setActiveMode(mode);
			persistState(activeThemeId, mode, customDelta);
		},
		[activeThemeId, customDelta, persistState],
	);

	const setCustomTokens = useCallback(
		(newTokens: Partial<T>) => {
			if (typeof document !== "undefined") {
				const root = document.documentElement;
				const rawCssVars = tokensToCssVars(newTokens);
				for (const [key, val] of Object.entries(rawCssVars)) {
					if (typeof val === "string") {
						root.style.setProperty(key, val);
					}
				}
				if (newTokens.radius) {
					root.style.setProperty("--radius", newTokens.radius);
					root.style.setProperty("--radius-card", newTokens.radius);
					root.style.setProperty("--radius-lg", newTokens.radius);
					root.style.setProperty(
						"--radius-md",
						`calc(${newTokens.radius} * 0.75)`,
					);
					root.style.setProperty(
						"--radius-sm",
						`calc(${newTokens.radius} * 0.5)`,
					);
				}
				if (newTokens.fontHeading) {
					loadFontsourceFont(newTokens.fontHeading);
				}
				if (newTokens.fontBody) {
					loadFontsourceFont(newTokens.fontBody);
					root.style.fontFamily = `var(--font-body, ${newTokens.fontBody}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)`;
				}
				if (newTokens.tactile !== undefined) {
					if (newTokens.tactile === "true") {
						root.setAttribute("data-tactile", "true");
					} else {
						root.removeAttribute("data-tactile");
					}
				}
				syncActiveFontCache();
			}

			setCustomDelta((prev) => {
				const nextDelta = { ...prev, ...newTokens };
				persistState(activeThemeId, activeMode, nextDelta);
				return nextDelta;
			});
		},
		[activeThemeId, activeMode, persistState],
	);

	const resetTheme = useCallback(() => {
		setCustomDelta(undefined);
		if (typeof document !== "undefined") {
			const root = document.documentElement;
			const style = root.style;
			const toRemove: string[] = [];
			for (let i = 0; i < style.length; i++) {
				const prop = style[i];
				if (prop && prop.startsWith("--")) {
					toRemove.push(prop);
				}
			}
			toRemove.forEach((p) => style.removeProperty(p));
			root.style.removeProperty("--font-heading");
			root.style.removeProperty("--font-body");
			root.style.removeProperty("font-family");
			root.removeAttribute("data-tactile");
			try {
				const keysToRemove: string[] = [];
				for (let i = 0; i < localStorage.length; i++) {
					const k = localStorage.key(i);
					if (k && k.startsWith("k79_font_css_")) keysToRemove.push(k);
				}
				keysToRemove.forEach((k) => localStorage.removeItem(k));
			} catch (_e) {}
		}
		persistState(activeThemeId, activeMode, undefined);
	}, [activeThemeId, activeMode, persistState]);

	const studioConfig = useMemo<ThemeStudioConfig | null>(() => {
		if (typeof studio === "boolean") {
			return studio ? { enabled: true } : null;
		}
		return studio;
	}, [studio]);

	useEffect(() => {
		if (!enableSync) return;
		return syncBusRef.current?.subscribe((type, payload) => {
			if (type === "THEME_CHANGE" && payload) {
				const p = payload as CompactCookiePayload<T>;
				if (p.id) setActiveThemeId(p.id);
				if (p.m) setActiveMode(p.m);
				setCustomDelta(p.d);
			}
		});
	}, [enableSync]);

	const openStudio = useCallback(() => setIsStudioOpen(true), []);
	const closeStudio = useCallback(() => setIsStudioOpen(false), []);

	const value: ThemeContextValue<T> = useMemo(
		() => ({
			theme: activeThemeId,
			mode: activeMode,
			resolvedMode,
			tokens: activeTokens,
			themes: Array.from(themeRegistry.values()),
			hasCustomizations: Boolean(
				customDelta && Object.keys(customDelta).length > 0,
			),
			isStudioOpen,
			openStudio,
			closeStudio,
			setTheme,
			setMode,
			setCustomTokens,
			resetTheme,
			registerTheme: (theme: ThemeDefinition<T>) => {
				setThemeRegistry((prev) => new Map(prev).set(theme.id, theme));
			},
			tactile: activeTokens?.tactile === "true",
			setTactile: (enabled: boolean) => {
				setCustomTokens({ tactile: enabled ? "true" : "false" } as Partial<T>);
			},
		}),
		[
			activeThemeId,
			activeMode,
			resolvedMode,
			activeTokens,
			themeRegistry,
			customDelta,
			isStudioOpen,
			openStudio,
			closeStudio,
			setTheme,
			setMode,
			setCustomTokens,
			resetTheme,
		],
	);

	return (
		<ThemeContext.Provider
			value={value as unknown as ThemeContextValue<BaseTokens>}
		>
			<style
				id="k79-theme-tactile-provider"
				dangerouslySetInnerHTML={{ __html: TACTILE_CSS_RULES }}
			/>
			{children}
			{studioConfig && studioConfig.enabled !== false && (
				<>
					<FloatingStudioTrigger config={studioConfig} />
					<ThemeStudioDrawer />
				</>
			)}
		</ThemeContext.Provider>
	);
}

export { ThemeProvider as ThemeStudioProvider };

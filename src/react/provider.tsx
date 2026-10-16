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
	themes = defaultPresets as unknown as ThemeDefinition<T>[],
	defaultTheme = "dark-slate",
	defaultMode = "system",
	storage = createCookieStorage(),
	storageKey = "k79_theme_state",
	syncChannel = "k79-theme-sync",
	enableSync = true,
	plugins = [],
	studio = false,
	initialState,
}: ThemeProviderProps<T>) {
	const [themeRegistry, setThemeRegistry] = useState<
		Map<string, ThemeDefinition<T>>
	>(() => {
		const map = new Map<string, ThemeDefinition<T>>();
		themes.forEach((t) => {
			map.set(t.id, t);
		});
		return map;
	});

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
	const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
		if (initialState?.resolvedMode) {
			return initialState.resolvedMode === "dark";
		}
		if (typeof window !== "undefined") {
			return window.matchMedia("(prefers-color-scheme: dark)").matches;
		}
		return true;
	});
	const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);

	const syncBusRef = useRef(
		enableSync ? createSyncBus<CompactCookiePayload<T>>(syncChannel) : null,
	);

	const studioConfig: ThemeStudioConfig | null = useMemo(() => {
		if (!studio) return null;
		if (typeof studio === "boolean") return { enabled: true };
		return { enabled: true, ...studio };
	}, [studio]);

	useEffect(() => {
		plugins.forEach((p) => {
			p.onInit?.({
				registerTheme: (theme) => {
					setThemeRegistry((prev) => new Map(prev).set(theme.id, theme));
				},
			});
		});
	}, [plugins]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const mql = window.matchMedia("(prefers-color-scheme: dark)");
		setSystemIsDark(mql.matches);

		const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, []);

	const resolvedMode: ResolvedMode = useMemo(() => {
		if (activeMode === "system") {
			return systemIsDark ? "dark" : "light";
		}
		return activeMode;
	}, [activeMode, systemIsDark]);

	const activePreset = useMemo(() => {
		return (
			themeRegistry.get(activeThemeId) ||
			themes[0] ||
			(defaultPresets[0] as unknown as ThemeDefinition<T>)
		);
	}, [themeRegistry, activeThemeId, themes]);

	const activeTokens = useMemo(() => {
		let resolved = resolveActiveTokens(activePreset, resolvedMode, customDelta);
		for (const plugin of plugins) {
			if (plugin.onTokensTransform) {
				resolved = plugin.onTokensTransform(resolved);
			}
		}
		return resolved;
	}, [activePreset, resolvedMode, customDelta, plugins]);

	// Apply tokens and CSS variables to the DOM
	const applyToDom = useCallback((tokens: T, mode: ResolvedMode) => {
		if (typeof document === "undefined") return;
		const root = document.documentElement;

		root.classList.remove("light", "dark");
		root.classList.add(mode);

		const cssVars = tokensToCssVars(tokens);
		for (const [key, val] of Object.entries(cssVars)) {
			root.style.setProperty(key, val);
		}

		if (document.body) {
			document.body.style.backgroundColor = "var(--canvas)";
			document.body.style.color = "var(--text-primary)";
		}

		if (tokens.radius) {
			root.style.setProperty("--radius", tokens.radius);
			root.style.setProperty("--radius-card", tokens.radius);
			root.style.setProperty("--radius-xs", `calc(${tokens.radius} * 0.25)`);
			root.style.setProperty("--radius-sm", `calc(${tokens.radius} * 0.5)`);
			root.style.setProperty("--radius-md", `calc(${tokens.radius} * 0.75)`);
			root.style.setProperty("--radius-lg", tokens.radius);
			root.style.setProperty("--radius-xl", `calc(${tokens.radius} * 1.25)`);
			root.style.setProperty("--radius-2xl", `calc(${tokens.radius} * 1.5)`);
			root.style.setProperty("--radius-3xl", `calc(${tokens.radius} * 2)`);
		}

		if (tokens.tactile === "true") {
			root.setAttribute("data-tactile", "true");
		} else {
			root.removeAttribute("data-tactile");
		}

		if (tokens.fontHeading) {
			loadFontsourceFont(tokens.fontHeading);
			root.style.setProperty("--font-heading", tokens.fontHeading);
		}
		if (tokens.fontBody) {
			loadFontsourceFont(tokens.fontBody);
			root.style.setProperty("--font-body", tokens.fontBody);
			root.style.fontFamily = tokens.fontBody;
		}
		syncActiveFontCache(tokens.fontHeading, tokens.fontBody);

		window.dispatchEvent(
			new CustomEvent("theme-changed", { detail: { tokens, mode } }),
		);
	}, []);

	useEffect(() => {
		applyToDom(activeTokens, resolvedMode);
		plugins.forEach((p) => {
			p.onThemeChange?.(activePreset, resolvedMode);
		});
	}, [activeTokens, resolvedMode, activePreset, applyToDom, plugins]);

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
		[storage, storageKey, defaultTheme],
	);

	const setTheme = useCallback(
		(id: string) => {
			setActiveThemeId(id);
			setCustomDelta(undefined);
			persistState(id, activeMode, undefined);
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
			// 1. Direct synchronous CSS variable update on the DOM for 0ms input latency
			if (typeof document !== "undefined") {
				const root = document.documentElement;
				const cssVars = tokensToCssVars(newTokens as Record<string, string>);
				for (const [k, v] of Object.entries(cssVars)) {
					root.style.setProperty(k, v);
				}
				if (newTokens.radius) {
					root.style.setProperty("--radius", newTokens.radius);
					root.style.setProperty("--radius-card", newTokens.radius);
					root.style.setProperty(
						"--radius-xs",
						`calc(${newTokens.radius} * 0.25)`,
					);
					root.style.setProperty(
						"--radius-sm",
						`calc(${newTokens.radius} * 0.5)`,
					);
					root.style.setProperty(
						"--radius-md",
						`calc(${newTokens.radius} * 0.75)`,
					);
					root.style.setProperty("--radius-lg", newTokens.radius);
					root.style.setProperty(
						"--radius-xl",
						`calc(${newTokens.radius} * 1.25)`,
					);
					root.style.setProperty(
						"--radius-2xl",
						`calc(${newTokens.radius} * 1.5)`,
					);
					root.style.setProperty(
						"--radius-3xl",
						`calc(${newTokens.radius} * 2)`,
					);
				}
				if (newTokens.tactile !== undefined) {
					if (newTokens.tactile === "true") {
						root.setAttribute("data-tactile", "true");
					} else {
						root.removeAttribute("data-tactile");
					}
				}
				if (newTokens.fontHeading) {
					loadFontsourceFont(newTokens.fontHeading);
					root.style.setProperty("--font-heading", newTokens.fontHeading);
				}
				if (newTokens.fontBody) {
					loadFontsourceFont(newTokens.fontBody);
					root.style.setProperty("--font-body", newTokens.fontBody);
					root.style.fontFamily = newTokens.fontBody;
				}
				window.dispatchEvent(
					new CustomEvent("theme-changed", {
						detail: { tokens: newTokens, mode: resolvedMode },
					}),
				);
			}

			// 2. Compute safe delta and update state
			setCustomDelta((prev) => {
				const nextDelta = { ...prev, ...newTokens };
				persistState(activeThemeId, activeMode, nextDelta);
				return nextDelta;
			});
		},
		[resolvedMode, activeThemeId, activeMode, persistState],
	);

	const resetTheme = useCallback(() => {
		setCustomDelta(undefined);
		persistState(activeThemeId, activeMode, undefined);
	}, [activeThemeId, activeMode, persistState]);

	useEffect(() => {
		if (!syncBusRef.current) return;
		return syncBusRef.current.subscribe(
			(type, payload: CompactCookiePayload<T>) => {
				if (type === "THEME_CHANGE" && payload) {
					if (payload.id) setActiveThemeId(payload.id);
					if (payload.m) setActiveMode(payload.m);
					setCustomDelta(payload.d);
				}
			},
		);
	}, []);

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

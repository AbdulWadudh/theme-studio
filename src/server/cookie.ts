import { defaultPresets } from "../core/presets";
import { resolveActiveTokens } from "../core/tokens";
import type {
	BaseTokens,
	ColorMode,
	CompactCookiePayload,
	ThemeDefinition,
} from "../core/types";

export interface SsrThemeState<T extends BaseTokens = BaseTokens> {
	themeId: string;
	mode: ColorMode;
	delta?: Partial<T>;
	activeTokens: T;
	resolvedMode: "light" | "dark";
}

export function parseThemeCookie<T extends BaseTokens = BaseTokens>(
	rawCookieHeaderOrValue: string | undefined | null,
	cookieKey = "k79_theme_state",
	fallbackThemeId = "dark-slate",
	fallbackMode: ColorMode = "system",
): CompactCookiePayload<T> {
	if (!rawCookieHeaderOrValue) {
		return { id: fallbackThemeId, m: fallbackMode };
	}

	const str = rawCookieHeaderOrValue.trim();

	// 1. Direct JSON value string (e.g. from cookies().get("k79_theme_state")?.value)
	if (str.startsWith("{") || str.startsWith("%7B")) {
		try {
			const parsed: CompactCookiePayload<T> = JSON.parse(
				decodeURIComponent(str),
			);
			return {
				id: parsed.id || fallbackThemeId,
				m: parsed.m || fallbackMode,
				d: parsed.d,
			};
		} catch {
			// Fall through to regex match
		}
	}

	// 2. Full cookie header string (e.g. from request.headers.get("cookie"))
	const match = str.match(new RegExp(`(^|;\\s*)(${cookieKey})=([^;]*)`));
	if (match) {
		try {
			const parsed: CompactCookiePayload<T> = JSON.parse(
				decodeURIComponent(match[3]),
			);
			return {
				id: parsed.id || fallbackThemeId,
				m: parsed.m || fallbackMode,
				d: parsed.d,
			};
		} catch {
			return { id: fallbackThemeId, m: fallbackMode };
		}
	}

	return { id: fallbackThemeId, m: fallbackMode };
}

export function getSsrThemeState<T extends BaseTokens = BaseTokens>(
	cookiePayload?: CompactCookiePayload<T>,
	availableThemes?: ThemeDefinition<T>[] | Record<string, unknown>,
	systemPreferenceOrFallbackTheme: "light" | "dark" | string = "dark",
): SsrThemeState<T> {
	let themesList: ThemeDefinition<T>[];

	if (Array.isArray(availableThemes) && availableThemes.length > 0) {
		themesList = availableThemes;
	} else if (
		availableThemes &&
		typeof availableThemes === "object" &&
		!Array.isArray(availableThemes)
	) {
		const values = Object.values(availableThemes).filter(
			(v): v is ThemeDefinition<T> =>
				typeof v === "object" && v !== null && "id" in v && "tokens" in v,
		);
		themesList =
			values.length > 0
				? values
				: (defaultPresets as unknown as ThemeDefinition<T>[]);
	} else {
		themesList = defaultPresets as unknown as ThemeDefinition<T>[];
	}

	let systemPreference: "light" | "dark" = "dark";
	let fallbackThemeId: string | undefined;

	if (
		systemPreferenceOrFallbackTheme === "light" ||
		systemPreferenceOrFallbackTheme === "dark"
	) {
		systemPreference = systemPreferenceOrFallbackTheme;
	} else if (typeof systemPreferenceOrFallbackTheme === "string") {
		fallbackThemeId = systemPreferenceOrFallbackTheme;
	}

	const targetId = cookiePayload?.id || fallbackThemeId;
	const theme =
		themesList.find((t) => t && typeof t === "object" && t.id === targetId) ||
		(fallbackThemeId
			? themesList.find(
					(t) => t && typeof t === "object" && t.id === fallbackThemeId,
				)
			: undefined) ||
		themesList[0] ||
		(defaultPresets[0] as unknown as ThemeDefinition<T>);

	const mode = cookiePayload?.m || "system";
	const resolvedMode = mode === "system" ? systemPreference : mode;
	const activeTokens = resolveActiveTokens(
		theme,
		resolvedMode,
		cookiePayload?.d,
	);

	return {
		themeId: theme.id,
		mode,
		delta: cookiePayload?.d,
		activeTokens,
		resolvedMode,
	};
}

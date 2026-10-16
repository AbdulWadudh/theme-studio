import { safeMergeTokens, sanitizeCssValue } from "./sanitize";
import type { BaseTokens, ResolvedMode, ThemeDefinition } from "./types";

export function tokensToCssVars(
	tokens: Record<string, string | undefined>,
): Record<string, string> {
	const vars: Record<string, string> = {};
	for (const [key, val] of Object.entries(tokens)) {
		if (!val) continue;
		const sanitized = sanitizeCssValue(val);
		if (!sanitized) continue;

		const cssVarKey = `--${key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;
		vars[cssVarKey] = sanitized;
	}
	if (tokens.radius && !vars["--radius-card"]) {
		vars["--radius-card"] = sanitizeCssValue(tokens.radius) || tokens.radius;
	}
	return vars;
}

export function tokensToCssString(
	tokens: Record<string, string | undefined>,
): string {
	const vars = tokensToCssVars(tokens);
	return Object.entries(vars)
		.map(([k, v]) => `${k}:${v};`)
		.join("");
}

export function computeTokenDelta<T extends BaseTokens>(
	baseTokens: T,
	modifiedTokens?: Partial<T>,
): Partial<T> | undefined {
	if (!modifiedTokens) return undefined;
	const delta: Partial<T> = {};
	let hasDiff = false;

	for (const key of Object.keys(modifiedTokens) as (keyof T)[]) {
		const newVal = modifiedTokens[key];
		if (newVal !== undefined && newVal !== baseTokens[key]) {
			delta[key] = newVal;
			hasDiff = true;
		}
	}

	return hasDiff ? delta : undefined;
}

export function resolveActiveTokens<T extends BaseTokens>(
	preset: ThemeDefinition<T>,
	mode: ResolvedMode,
	delta?: Partial<T>,
): T {
	let combined = { ...preset.tokens };

	if (mode === "light" && preset.lightTokens) {
		combined = safeMergeTokens(combined, preset.lightTokens);
	} else if (mode === "dark" && preset.darkTokens) {
		combined = safeMergeTokens(combined, preset.darkTokens);
	}

	if (delta) {
		combined = safeMergeTokens(combined, delta);
	}

	return combined;
}

import { hexToRgba } from "../core/presets";
import { TACTILE_CSS_RULES, generateTactileCss } from "../core/tactile";
import type { BaseTokens } from "../core/types";

export { TACTILE_CSS_RULES, generateTactileCss };

/**
 * Generate native Tailwind v4 / CSS theme block for CSS output
 */
export function generateCssThemeBlock<T extends BaseTokens>(
	tokens: T,
	prefix = "--",
): string {
	const lines: string[] = [];

	for (const [key, val] of Object.entries(tokens)) {
		if (typeof val === "string") {
			const cssProp = `${prefix}${key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;
			lines.push(`  ${cssProp}: ${val};`);
		}
	}

	return lines.join("\n");
}

/**
 * Generates ready-to-inject CSS for Tailwind CSS v4 setup
 */
export function generateTailwindV4RootCss<T extends BaseTokens>(
	tokens: T,
): string {
	return `@theme {
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-card: var(--card);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-accent: var(--accent);
  --color-success: var(--success);
  --color-danger: var(--danger);
  --color-warning: var(--warning);
  --color-glow: var(--glow-color, #38bdf8);
  --color-text-primary: var(--text-primary);
  --color-text-muted: var(--text-muted);

  --radius-xs: calc(var(--radius) * 0.25);
  --radius-sm: calc(var(--radius) * 0.5);
  --radius-md: calc(var(--radius) * 0.75);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.25);
  --radius-2xl: calc(var(--radius) * 1.5);
  --radius-3xl: calc(var(--radius) * 2);
  --radius-card: var(--radius-card, var(--radius));

  --shadow-sm: var(--shadow-sm);
  --shadow-md: var(--shadow);
  --shadow-lg: var(--shadow-lg);

  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
}

:root {
${generateCssThemeBlock(tokens)}
  --radius-card: var(--radius);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
}`;
}

/**
 * Tailwind CSS v3 Theme Configuration Extension
 * Use in tailwind.config.js / tailwind.config.ts:
 * theme: { extend: themeStudioTailwindV3Extension }
 */
export const themeStudioTailwindV3Extension = {
	colors: {
		canvas: "var(--canvas)",
		surface: "var(--surface)",
		card: "var(--card)",
		border: "var(--border)",
		primary: "var(--primary)",
		secondary: "var(--secondary)",
		accent: "var(--accent)",
		success: "var(--success)",
		danger: "var(--danger)",
		warning: "var(--warning)",
		glow: "var(--glow-color, #38bdf8)",
		"text-primary": "var(--text-primary)",
		"text-muted": "var(--text-muted)",
	},
	borderRadius: {
		card: "var(--radius-card, var(--radius, 0.625rem))",
		btn: "var(--radius, 0.625rem)",
		input: "var(--radius, 0.625rem)",
	},
	boxShadow: {
		DEFAULT: "var(--shadow, 0 1px 3px 0 rgba(0, 0, 0, 0.1))",
		sm: "var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05))",
		lg: "var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))",
		glow: "0 0 20px -3px var(--glow-color, #38bdf8)",
		tactile: "4px 4px 0px 0px #000000",
		"tactile-hover": "2px 2px 0px 0px #000000",
		"tactile-active": "0px 0px 0px 0px #000000",
	},
	fontFamily: {
		heading: [
			"var(--font-heading)",
			"-apple-system",
			"BlinkMacSystemFont",
			"Segoe UI",
			"Roboto",
			"sans-serif",
		],
		body: [
			"var(--font-body)",
			"-apple-system",
			"BlinkMacSystemFont",
			"Segoe UI",
			"Roboto",
			"sans-serif",
		],
	},
};

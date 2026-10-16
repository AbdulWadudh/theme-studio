export const TAILWIND_V4_TOKEN_MAP = {
	canvas: "--color-canvas",
	surface: "--color-surface",
	card: "--color-card",
	border: "--color-border",
	primary: "--color-primary",
	secondary: "--color-secondary",
	accent: "--color-accent",
	success: "--color-success",
	danger: "--color-danger",
	warning: "--color-warning",
	textPrimary: "--color-text-primary",
	textMuted: "--color-text-muted",
	radius: "--radius",
	shadow: "--shadow",
	shadowSm: "--shadow-sm",
	shadowLg: "--shadow-lg",
	glowColor: "--glow-color",
	fontHeading: "--font-heading",
	fontBody: "--font-body",
} as const;

export function generateTailwindV4ThemeBlock(): string {
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
  --color-text-primary: var(--text-primary);
  --color-text-muted: var(--text-muted);

  --shadow: var(--shadow);
  --shadow-sm: var(--shadow-sm);
  --shadow-lg: var(--shadow-lg);
  --shadow-shadow: var(--shadow);

  --glow-color: var(--glow-color, #38bdf8);
  --color-glow: var(--glow-color, #38bdf8);

  --spacing-boxShadowX: 4px;
  --spacing-boxShadowY: 4px;
  --spacing-reverseBoxShadowX: -4px;
  --spacing-reverseBoxShadowY: -4px;

  --radius: var(--radius);
  --radius-card: var(--radius-card);
  --radius-xs: calc(var(--radius) * 0.25);
  --radius-sm: calc(var(--radius) * 0.5);
  --radius-md: calc(var(--radius) * 0.75);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.25);
  --radius-2xl: calc(var(--radius) * 1.5);
  --radius-3xl: calc(var(--radius) * 2);

  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
}`;
}

/**
 * Neobrutalist tactile physics CSS rules
 * Provides 2px hover displacement and 4px active press click physics.
 */
export const TACTILE_CSS_RULES = `
/* Tactile Neobrutalism on-hover and active physics */
.tactile-always-active,
[data-tactile="true"] button:not(:disabled):not([data-no-tactile]),
[data-tactile="true"] [role="button"]:not([data-no-tactile]),
[data-tactile="true"] .tactile-item {
	box-shadow: 4px 4px 0px 0px #000000 !important;
	border-color: #000000 !important;
	border-width: 2px !important;
	transition:
		transform 120ms cubic-bezier(0.16, 1, 0.3, 1),
		box-shadow 120ms cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.tactile-always-active:hover,
[data-tactile="true"] button:not(:disabled):not([data-no-tactile]):hover,
[data-tactile="true"] [role="button"]:not([data-no-tactile]):hover,
[data-tactile="true"] .tactile-item:hover {
	transform: translate(2px, 2px) !important;
	box-shadow: 2px 2px 0px 0px #000000 !important;
}

.tactile-always-active:active,
[data-tactile="true"] button:not(:disabled):not([data-no-tactile]):active,
[data-tactile="true"] [role="button"]:not([data-no-tactile]):active,
[data-tactile="true"] .tactile-item:active {
	transform: translate(4px, 4px) !important;
	box-shadow: 0px 0px 0px 0px #000000 !important;
}
`;

export function generateTactileCss(): string {
	return TACTILE_CSS_RULES;
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
		DEFAULT: "var(--radius)",
		card: "var(--radius-card)",
		xs: "calc(var(--radius) * 0.25)",
		sm: "calc(var(--radius) * 0.5)",
		md: "calc(var(--radius) * 0.75)",
		lg: "var(--radius)",
		xl: "calc(var(--radius) * 1.25)",
		"2xl": "calc(var(--radius) * 1.5)",
		"3xl": "calc(var(--radius) * 2)",
	},
	boxShadow: {
		DEFAULT: "var(--shadow)",
		sm: "var(--shadow-sm)",
		lg: "var(--shadow-lg)",
	},
	fontFamily: {
		heading: ["var(--font-heading)", "system-ui", "sans-serif"],
		body: ["var(--font-body)", "system-ui", "sans-serif"],
	},
};

import type { ReactNode } from "react";

export type ColorMode = "light" | "dark" | "system";
export type ResolvedMode = "light" | "dark";

export interface BaseTokens {
	canvas: string;
	surface: string;
	card: string;
	border: string;
	primary: string;
	secondary: string;
	accent: string;
	success: string;
	danger: string;
	warning?: string;
	textPrimary: string;
	textMuted: string;
	radius: string;
	shadow?: string;
	shadowSm?: string;
	shadowLg?: string;
	glowColor?: string;
	tactile?: "true" | "false" | string;
	fontHeading?: string;
	fontBody?: string;
	[key: string]: string | undefined;
}

export interface ShadowPresetItem {
	id: string;
	label: string;
	value: string;
	sm: string;
	lg: string;
	isGlow?: boolean;
}

export interface GlowColorChip {
	label: string;
	color: string;
}

export interface ThemeDefinition<T extends BaseTokens = BaseTokens> {
	id: string;
	name: string;
	description?: string;
	tokens: T;
	lightTokens?: Partial<T>;
	darkTokens?: Partial<T>;
	metadata?: Record<string, unknown>;
}

export interface CompactCookiePayload<T extends BaseTokens = BaseTokens> {
	id: string;
	m: ColorMode;
	d?: Partial<T>; // compact delta diff for custom overrides
	def?: string; // original defaultTheme configured by developer
}

export interface ThemeStudioConfig {
	enabled?: boolean;
	position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
	offset?: { x?: number | string; y?: number | string };
	zIndex?: number;
	className?: string;
	triggerAriaLabel?: string;
	renderTrigger?: (props: { open: () => void; isOpen: boolean }) => ReactNode;
}

export interface ThemeContextValue<T extends BaseTokens = BaseTokens> {
	theme: string;
	mode: ColorMode;
	resolvedMode: ResolvedMode;
	tokens: T;
	themes: ThemeDefinition<T>[];
	hasCustomizations: boolean;
	isStudioOpen: boolean;
	openStudio: () => void;
	closeStudio: () => void;
	setTheme: (themeId: string) => void;
	setMode: (mode: ColorMode) => void;
	setCustomTokens: (tokens: Partial<T>) => void;
	resetTheme: () => void;
	registerTheme: (theme: ThemeDefinition<T>) => void;
	tactile?: boolean;
	setTactile?: (enabled: boolean) => void;
}

export interface ZenithPlugin<T extends BaseTokens = BaseTokens> {
	name: string;
	version: string;
	onInit?(ctx: { registerTheme: (theme: ThemeDefinition<T>) => void }): void;
	onThemeChange?(theme: ThemeDefinition<T>, mode: ResolvedMode): void;
	onTokensTransform?(tokens: T): T;
}

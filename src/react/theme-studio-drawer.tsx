"use client";

import {
	Cancel01Icon,
	CheckmarkBadge01Icon,
	PaintBoardIcon,
	RotateLeft01Icon,
	Search01Icon,
	TextFontIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import {
	type FontsourceItem,
	loadFontsourceFont,
	searchFontsourceFonts,
} from "../core/fonts";
import {
	DEFINED_RADIUS_OPTIONS,
	GLOW_COLOR_CHIPS,
	getGlowValues,
	SHADOW_PRESETS,
} from "../core/presets";
import type { BaseTokens, ThemeDefinition } from "../core/types";
import { ColorPickerField } from "./color-picker-field";
import { useTheme } from "./use-theme";

const POPULAR_FONTSOURCE_FONTS: FontsourceItem[] = [
	{
		id: "inter",
		family: "Inter",
		category: "sans-serif",
		weights: [400, 500, 600, 700],
	},
	{
		id: "roboto",
		family: "Roboto",
		category: "sans-serif",
		weights: [400, 500, 700],
	},
	{
		id: "open-sans",
		family: "Open Sans",
		category: "sans-serif",
		weights: [400, 600, 700],
	},
	{
		id: "montserrat",
		family: "Montserrat",
		category: "sans-serif",
		weights: [400, 500, 600, 700],
	},
	{
		id: "poppins",
		family: "Poppins",
		category: "sans-serif",
		weights: [400, 500, 600, 700],
	},
	{ id: "lato", family: "Lato", category: "sans-serif", weights: [400, 700] },
	{
		id: "space-grotesk",
		family: "Space Grotesk",
		category: "sans-serif",
		weights: [400, 500, 700],
	},
	{
		id: "fira-code",
		family: "Fira Code",
		category: "monospace",
		weights: [400, 500, 700],
	},
	{
		id: "jetbrains-mono",
		family: "JetBrains Mono",
		category: "monospace",
		weights: [400, 500, 700],
	},
	{
		id: "playfair-display",
		family: "Playfair Display",
		category: "serif",
		weights: [400, 600, 700],
	},
	{
		id: "merriweather",
		family: "Merriweather",
		category: "serif",
		weights: [400, 700],
	},
	{
		id: "outfit",
		family: "Outfit",
		category: "sans-serif",
		weights: [400, 500, 600, 700],
	},
	{
		id: "plus-jakarta-sans",
		family: "Plus Jakarta Sans",
		category: "sans-serif",
		weights: [400, 500, 600, 700],
	},
];

const FONT_PAIRINGS = [
	{
		id: "ibm-noto",
		name: "IBM Plex Sans + Noto Sans",
		headingFontVar: "var(--font-ibm-plex)",
		bodyFontVar: "var(--font-noto-sans)",
		headingName: "IBM Plex Sans",
		bodyName: "Noto Sans",
	},
	{
		id: "jetbrains-ibm",
		name: "JetBrains Mono + IBM Plex Sans",
		headingFontVar: "var(--font-jetbrains-mono)",
		bodyFontVar: "var(--font-ibm-plex)",
		headingName: "JetBrains Mono",
		bodyName: "IBM Plex Sans",
	},
	{
		id: "inter-noto",
		name: "Inter + Noto Sans",
		headingFontVar: "var(--font-inter)",
		bodyFontVar: "var(--font-noto-sans)",
		headingName: "Inter",
		bodyName: "Noto Sans",
	},
];

function extractFontFamily(font?: string): string {
	if (!font) return "System Default";
	if (font.includes("ibm-plex")) return "IBM Plex Sans";
	if (font.includes("noto-sans")) return "Noto Sans";
	if (font.includes("jetbrains")) return "JetBrains Mono";
	if (font.includes("inter")) return "Inter";
	if (font.includes("space-grotesk") || font.includes("Space Grotesk"))
		return "Space Grotesk";
	const clean = font.split(",")[0].trim().replace(/['"]/g, "");
	return clean.startsWith("var(") ? clean : clean;
}

function getContrastColor(hexColor?: string): string {
	if (!hexColor) return "#ffffff";
	let hex = hexColor.replace("#", "").trim();
	if (hex.length === 3) {
		hex = hex
			.split("")
			.map((c) => c + c)
			.join("");
	}
	if (hex.length !== 6) return "#ffffff";
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 140 ? "#090D16" : "#FFFFFF";
}

export function ThemeStudioDrawer() {
	const {
		isStudioOpen,
		closeStudio,
		theme,
		resolvedMode,
		setMode,
		tokens,
		themes,
		setTheme,
		setCustomTokens,
		resetTheme,
	} = useTheme();

	// Smooth unmount animation lifecycle
	const [isRendered, setIsRendered] = useState(isStudioOpen);
	const [isVisible, setIsVisible] = useState(false);

	// Font Explorer State (Fontsource)
	const [showFontExplorer, setShowFontExplorer] = useState(false);
	const [fontSearch, setFontSearch] = useState("");
	const [fontCategory, setFontCategory] = useState("all");
	const [fontsList, setFontsList] = useState<FontsourceItem[]>(
		POPULAR_FONTSOURCE_FONTS,
	);
	const [isLoadingFonts, setIsLoadingFonts] = useState(false);
	const [activeFont, setActiveFont] = useState<string>("ibm-noto");

	// Tactical physics interactive state
	const [tactileClicks, setTactileClicks] = useState<number>(0);
	const [showClickFeedback, setShowClickFeedback] = useState<boolean>(false);
	const [showCustomShadowInputs, setShowCustomShadowInputs] = useState(false);

	// Inject styles for Colorshot popover, field reset, and tactile physics
	useEffect(() => {
		if (typeof document === "undefined") return;
		const id = "k79-theme-studio-tactile-style";
		if (!document.getElementById(id)) {
			const style = document.createElement("style");
			style.id = id;
			style.textContent = `
/* Ensure Colorshot popover displays above high z-index drawers/modals */
body [data-colorshot-popover],
[data-colorshot-popover] {
	z-index: 999999 !important;
}

/* Reset Colorshot trigger button to avoid weird double containers */
button[data-colorshot-field],
[data-colorshot-field],
[data-colorshot-field]:not([data-theme="light"]),
[data-colorshot-field][data-theme="dark"],
[data-colorshot-field][data-theme="light"] {
	background: transparent !important;
	background-color: transparent !important;
	border: none !important;
	padding: 0 !important;
	margin: 0 !important;
	height: auto !important;
	min-height: 0 !important;
	width: auto !important;
	min-width: 0 !important;
	box-shadow: none !important;
	outline: none !important;
	display: inline-flex !important;
	align-items: center !important;
	justify-content: center !important;
	cursor: pointer !important;
}

[data-colorshot-field]:hover,
[data-colorshot-field]:focus,
[data-colorshot-field]:focus-visible,
[data-colorshot-field][data-state="open"] {
	background: transparent !important;
	background-color: transparent !important;
	border: none !important;
	outline: none !important;
	box-shadow: none !important;
}

[data-colorshot-field] [data-part="field-text"],
[data-colorshot-field] [data-part="field-alpha"],
[data-colorshot-field] [data-part="field-swatch"] {
	display: none !important;
}

/* Sleek custom muted scrollbar for Theme Studio */
.theme-studio-scroll {
	scrollbar-width: thin !important;
	scrollbar-color: rgba(148, 163, 184, 0.25) transparent !important;
}
.theme-studio-scroll::-webkit-scrollbar {
	width: 5px !important;
	height: 5px !important;
}
.theme-studio-scroll::-webkit-scrollbar-track {
	background: transparent !important;
}
.theme-studio-scroll::-webkit-scrollbar-thumb {
	background-color: rgba(148, 163, 184, 0.25) !important;
	border-radius: 9999px !important;
}
.theme-studio-scroll::-webkit-scrollbar-thumb:hover {
	background-color: rgba(148, 163, 184, 0.45) !important;
}
.theme-studio-scroll::-webkit-scrollbar-button {
	display: none !important;
	width: 0 !important;
	height: 0 !important;
}
`;
			document.head.appendChild(style);
		}
	}, []);

	// Animation frame syncing for smooth mount / unmount
	useEffect(() => {
		if (isStudioOpen) {
			setIsRendered(true);
			const raf = requestAnimationFrame(() => {
				requestAnimationFrame(() => setIsVisible(true));
			});
			return () => cancelAnimationFrame(raf);
		}
		setIsVisible(false);
		const timer = setTimeout(() => setIsRendered(false), 260);
		return () => clearTimeout(timer);
	}, [isStudioOpen]);

	// Prevent background scroll while drawer is open
	useEffect(() => {
		if (isRendered) {
			const originalOverflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = originalOverflow;
			};
		}
	}, [isRendered]);

	// Sync font pairing state
	useEffect(() => {
		const match = FONT_PAIRINGS.find(
			(f) =>
				f.headingFontVar === tokens.fontHeading &&
				f.bodyFontVar === tokens.fontBody,
		);
		if (match) {
			setActiveFont(match.id);
		} else {
			setActiveFont("custom");
		}
	}, [tokens.fontHeading, tokens.fontBody]);

	// Debounced Fontsource search handler
	useEffect(() => {
		if (!showFontExplorer) return;
		setIsLoadingFonts(true);
		const timer = setTimeout(async () => {
			try {
				const results = await searchFontsourceFonts(fontSearch, fontCategory);
				setFontsList(results);
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoadingFonts(false);
			}
		}, 180);
		return () => clearTimeout(timer);
	}, [fontSearch, fontCategory, showFontExplorer]);

	if (!isRendered) return null;

	const isLight =
		resolvedMode === "light" ||
		(!resolvedMode &&
			(tokens.canvas?.toLowerCase().startsWith("#f") ||
				tokens.canvas?.toLowerCase() === "#ffffff" ||
				tokens.canvas?.toLowerCase().startsWith("#fa")));

	const currentPresetObj =
		themes.find((p: ThemeDefinition<BaseTokens>) => p.id === theme) ||
		themes[0];

	const selectPreset = (presetId: string) => {
		setTheme(presetId);
	};

	const selectFontPairing = (pairingId: string) => {
		const pairing = FONT_PAIRINGS.find((p) => p.id === pairingId);
		if (!pairing) return;
		setActiveFont(pairing.id);
		setCustomTokens({
			fontHeading: pairing.headingFontVar,
			fontBody: pairing.bodyFontVar,
		});
	};

	const applyCustomFont = (
		fontName: string,
		target: "heading" | "body" | "both",
	) => {
		const fontValue = `'${fontName}', sans-serif`;
		loadFontsourceFont(fontName);

		if (target === "both") {
			setCustomTokens({
				fontHeading: fontValue,
				fontBody: fontValue,
			});
		} else if (target === "heading") {
			setCustomTokens({
				fontHeading: fontValue,
			});
		} else {
			setCustomTokens({
				fontBody: fontValue,
			});
		}
		setActiveFont("custom");
	};

	const updateToken = (key: string, val: string) => {
		setCustomTokens({ [key]: val });
	};

	const toggleTactile = () => {
		const nextVal = tokens.tactile === "true" ? "false" : "true";
		setCustomTokens({ tactile: nextVal });
	};

	const applyShadowPreset = (presetId: string) => {
		const preset = SHADOW_PRESETS.find((p) => p.id === presetId);
		if (!preset) return;

		if (preset.isGlow) {
			const glowVals = getGlowValues(
				tokens.glowColor || tokens.primary || "#38BDF8",
			);
			setCustomTokens({
				shadow: glowVals.value,
				shadowSm: glowVals.sm,
				shadowLg: glowVals.lg,
			});
			return;
		}

		setCustomTokens({
			shadow: preset.value,
			shadowSm: preset.sm,
			shadowLg: preset.lg,
		});
	};

	const handleGlowColorChange = (hexOrType: string) => {
		let colorHex = hexOrType;
		if (hexOrType === "primary") colorHex = tokens.primary || "#38BDF8";
		else if (hexOrType === "accent") colorHex = tokens.accent || "#34D399";

		const glowVals = getGlowValues(colorHex);
		setCustomTokens({
			glowColor: colorHex,
			shadow: glowVals.value,
			shadowSm: glowVals.sm,
			shadowLg: glowVals.lg,
		});
	};

	const resetToDefault = () => {
		resetTheme();
		setActiveFont("ibm-noto");
	};

	const buttonContrastColor = getContrastColor(tokens.primary);

	return (
		<div
			data-lenis-prevent="true"
			onClick={closeStudio}
			className={`fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-200 cursor-pointer ${
				isVisible ? "opacity-100" : "opacity-0"
			}`}
			style={{
				position: "fixed",
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				zIndex: 99999,
				display: "flex",
				justifyContent: "flex-end",
			}}
		>
			<div
				data-lenis-prevent="true"
				onClick={(e) => e.stopPropagation()}
				className={`w-full max-w-[490px] h-full flex flex-col shadow-2xl border-l border-border transition-transform duration-200 overscroll-contain cursor-default ${
					isVisible ? "translate-x-0" : "translate-x-full"
				}`}
				style={{
					width: "100%",
					maxWidth: "490px",
					minWidth: "320px",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					backgroundColor: tokens.surface,
					color: tokens.textPrimary,
					borderLeft: `1px solid ${tokens.border || "var(--border)"}`,
					boxShadow: "-10px 0 25px -5px rgba(0, 0, 0, 0.4)",
				}}
			>
				{/* FIXED SHEET HEADER */}
				<div
					className="border-b border-border shrink-0 flex items-center justify-between z-10"
					style={{
						backgroundColor: tokens.surface,
						padding: "14px 18px",
						borderBottom: `1px solid ${tokens.border || "var(--border)"}`,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						flexShrink: 0,
					}}
				>
					<div
						className="flex items-center gap-2.5"
						style={{ display: "flex", alignItems: "center", gap: "10px" }}
					>
						<div
							className="p-1.5 rounded-btn"
							style={{
								backgroundColor: tokens.card,
								color: tokens.primary,
								padding: "6px",
								borderRadius: tokens.radius,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<HugeiconsIcon icon={PaintBoardIcon} size={18} />
						</div>
						<div>
							<h3 className="font-semibold text-sm tracking-tight font-heading m-0">
								Theme Studio
							</h3>
							<p
								className="text-[11px] m-0"
								style={{ color: tokens.textMuted }}
							>
								Live Tailwind v4 variable inspector
							</p>
						</div>
					</div>
					<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						{/* APPEARANCE MODE TOGGLE */}
						<button
							type="button"
							onClick={() =>
								setMode(resolvedMode === "dark" ? "light" : "dark")
							}
							className="px-2 py-1 text-xs font-semibold rounded-btn border border-border hover:bg-card transition-colors cursor-pointer flex items-center gap-1.5"
							style={{
								backgroundColor: tokens.card,
								border: `1px solid ${tokens.border || "var(--border)"}`,
								color: tokens.textPrimary,
								borderRadius: tokens.radius,
								display: "flex",
								alignItems: "center",
								gap: "6px",
								padding: "4px 8px",
								fontSize: "11px",
								fontWeight: 600,
								cursor: "pointer",
								userSelect: "none",
								transition: "all 0.15s ease",
							}}
							title={`Switch to ${resolvedMode === "dark" ? "Light" : "Dark"} Mode`}
						>
							<span>{resolvedMode === "dark" ? "🌙 Dark" : "☀️ Light"}</span>
						</button>
						<button
							type="button"
							onClick={closeStudio}
							className="p-1 rounded-btn hover:bg-card transition-colors cursor-pointer border-0 bg-transparent"
							style={{
								color: tokens.textPrimary,
								cursor: "pointer",
								background: "transparent",
								border: "none",
								padding: "4px",
							}}
							aria-label="Close Theme Studio"
						>
							<HugeiconsIcon icon={Cancel01Icon} size={18} />
						</button>
					</div>
				</div>

				{/* SCROLLABLE SHEET BODY */}
				<div
					data-lenis-prevent="true"
					onWheel={(e) => e.stopPropagation()}
					className="theme-studio-scroll flex-1 overflow-y-auto min-h-0 overscroll-contain"
					style={{
						flex: 1,
						overflowY: "auto",
						padding: "14px 16px",
						display: "flex",
						flexDirection: "column",
						gap: "14px",
						scrollbarWidth: "thin",
						scrollbarColor: "rgba(148, 163, 184, 0.25) transparent",
					}}
				>
					{/* SECTION 1: PALETTES & PRESETS */}
					<div>
						<label
							className="text-[11px] font-semibold tracking-wider uppercase block"
							style={{
								color: tokens.textMuted,
								display: "block",
								marginBottom: "6px",
							}}
						>
							Palettes &amp; Presets
						</label>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
								gap: "6px",
							}}
						>
							{themes
								
								.map((p: ThemeDefinition<BaseTokens>) => {
									const isSelected = theme === p.id;
									const previewColors =
										isLight && p.lightTokens
											? { ...p.tokens, ...p.lightTokens }
											: p.tokens;

									return (
										<button
											type="button"
											key={p.id}
											onClick={() => selectPreset(p.id)}
											className={`text-left rounded-card border text-xs transition-all cursor-pointer flex flex-col justify-between ${
												isSelected
													? "border-primary ring-1 ring-primary"
													: "border-border hover:border-text-muted"
											}`}
											style={{
												backgroundColor: tokens.card,
												borderRadius: tokens.radius,
												padding: "10px 12px",
												display: "flex",
												flexDirection: "column",
												justifyContent: "space-between",
												minHeight: "52px",
												textAlign: "left",
											}}
										>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													marginBottom: "6px",
												}}
											>
												<span className="font-semibold font-heading">
													{p.name}
												</span>
												{isSelected && (
													<HugeiconsIcon
														icon={CheckmarkBadge01Icon}
														size={14}
														className="text-primary"
													/>
												)}
											</div>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "6px",
												}}
											>
												<span
													style={{
														width: "14px",
														height: "14px",
														minWidth: "14px",
														minHeight: "14px",
														borderRadius: "9999px",
														backgroundColor: previewColors.canvas,
														display: "inline-block",
														flexShrink: 0,
													}}
												/>
												<span
													style={{
														width: "14px",
														height: "14px",
														minWidth: "14px",
														minHeight: "14px",
														borderRadius: "9999px",
														backgroundColor: previewColors.primary,
														display: "inline-block",
														flexShrink: 0,
													}}
												/>
												<span
													style={{
														width: "14px",
														height: "14px",
														minWidth: "14px",
														minHeight: "14px",
														borderRadius: "9999px",
														backgroundColor: previewColors.secondary,
														display: "inline-block",
														flexShrink: 0,
													}}
												/>
												<span
													style={{
														width: "14px",
														height: "14px",
														minWidth: "14px",
														minHeight: "14px",
														borderRadius: "9999px",
														backgroundColor: previewColors.accent,
														display: "inline-block",
														flexShrink: 0,
													}}
												/>
											</div>
										</button>
									);
								})}
						</div>
					</div>

					{/* SECTION 2: TYPOGRAPHY SYSTEM */}
					<div
						style={{
							marginTop: "6px",
							paddingTop: "12px",
							borderTop: `1px solid ${tokens.border || "var(--border)"}`,
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: "6px",
							}}
						>
							<label
								className="text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5"
								style={{
									color: tokens.textMuted,
									display: "flex",
									alignItems: "center",
									gap: "6px",
								}}
							>
								<HugeiconsIcon icon={TextFontIcon} size={15} />
								Typography System
							</label>
							<span
								className="text-[10px] font-mono px-2 py-0.5 rounded-badge bg-primary/10 text-primary border border-primary/20"
								style={{
									padding: "2px 8px",
									borderRadius: "9999px",
									fontSize: "10px",
								}}
							>
								{activeFont === "custom" ? "Custom Font" : "Preset"}
							</span>
						</div>

						{/* Current Active Fonts Indicator */}
						<div
							className={`rounded-card border text-xs transition-all ${
								activeFont === "custom"
									? "border-primary ring-1 ring-primary"
									: "border-border"
							}`}
							style={{
								backgroundColor: tokens.card,
								borderRadius: tokens.radius,
								padding: "8px 12px",
								marginBottom: "8px",
								display: "flex",
								flexDirection: "column",
								gap: "4px",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "6px",
									}}
								>
									<span style={{ color: tokens.textMuted }}>Heading:</span>
									<span className="font-semibold text-primary font-mono text-[11px]">
										{extractFontFamily(tokens.fontHeading)}
									</span>
								</div>
								{activeFont === "custom" && (
									<span
										className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20"
										style={{
											display: "inline-flex",
											alignItems: "center",
											gap: "4px",
											padding: "1px 6px",
											borderRadius: "9999px",
										}}
									>
										<HugeiconsIcon icon={CheckmarkBadge01Icon} size={11} />
										Active
									</span>
								)}
							</div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "6px",
									}}
								>
									<span style={{ color: tokens.textMuted }}>Body:</span>
									<span className="font-semibold text-secondary font-mono text-[11px]">
										{extractFontFamily(tokens.fontBody)}
									</span>
								</div>
							</div>
						</div>

						{/* Preset Pairings */}
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "6px",
								marginBottom: "8px",
							}}
						>
							{FONT_PAIRINGS.map((f) => {
								const isSelected = activeFont === f.id;
								return (
									<button
										type="button"
										key={f.id}
										onClick={() => selectFontPairing(f.id)}
										className={`w-full text-left rounded-card border text-xs transition-all flex items-center justify-between cursor-pointer ${
											isSelected
												? "border-primary ring-1 ring-primary"
												: "border-border hover:border-text-muted"
										}`}
										style={{
											backgroundColor: tokens.card,
											borderRadius: tokens.radius,
											padding: "8px 12px",
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											width: "100%",
											textAlign: "left",
										}}
									>
										<div>
											<p className="font-medium m-0 text-xs">{f.name}</p>
											<p
												className="text-[10px] m-0"
												style={{ color: tokens.textMuted }}
											>
												UI: {f.headingName} • Body: {f.bodyName}
											</p>
										</div>
										{isSelected && (
											<HugeiconsIcon
												icon={CheckmarkBadge01Icon}
												size={15}
												className="text-primary"
											/>
										)}
									</button>
								);
							})}
						</div>

						{/* Fontsource Fonts Explorer Toggle */}
						<div
							className="rounded-card border overflow-hidden transition-all"
							style={{
								backgroundColor: tokens.card,
								borderColor: tokens.border,
								borderRadius: tokens.radius,
							}}
						>
							<button
								type="button"
								onClick={() => setShowFontExplorer(!showFontExplorer)}
								className="w-full text-xs font-medium flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer border-0 bg-transparent text-left"
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									padding: "8px 12px",
									width: "100%",
									color: tokens.textPrimary,
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "8px",
									}}
								>
									<HugeiconsIcon
										icon={Search01Icon}
										size={14}
										className="text-primary"
									/>
									<span>Search &amp; Explore Fontsource Fonts</span>
								</div>
								<span className="text-[10px] text-primary underline">
									{showFontExplorer ? "Close" : "Open"}
								</span>
							</button>

							{showFontExplorer && (
								<div
									style={{
										padding: "10px",
										borderTop: `1px solid ${tokens.border || "var(--border)"}`,
										display: "flex",
										flexDirection: "column",
										gap: "8px",
									}}
								>
									<div style={{ display: "flex", gap: "6px" }}>
										<input
											type="text"
											placeholder="Search font (e.g. Inter, Outfit)..."
											value={fontSearch}
											onChange={(e) => setFontSearch(e.target.value)}
											className="flex-1 text-xs rounded bg-canvas border border-border text-text-primary"
											style={{
												flex: 1,
												backgroundColor: tokens.canvas,
												borderColor: tokens.border,
												color: tokens.textPrimary,
												padding: "6px 8px",
												borderRadius: tokens.radius,
											}}
										/>
										<select
											value={fontCategory}
											onChange={(e) => setFontCategory(e.target.value)}
											className="text-xs rounded bg-canvas border border-border text-text-primary"
											style={{
												backgroundColor: tokens.canvas,
												borderColor: tokens.border,
												color: tokens.textPrimary,
												padding: "6px 8px",
												borderRadius: tokens.radius,
											}}
										>
											<option value="all">All</option>
											<option value="sans-serif">Sans Serif</option>
											<option value="serif">Serif</option>
											<option value="monospace">Monospace</option>
										</select>
									</div>

									<div
										className="theme-studio-scroll"
										style={{
											maxHeight: "180px",
											overflowY: "auto",
											display: "flex",
											flexDirection: "column",
											gap: "4px",
											scrollbarWidth: "thin",
											scrollbarColor: "rgba(148, 163, 184, 0.25) transparent",
										}}
									>
										{isLoadingFonts ? (
											<p
												className="text-xs text-center py-3 m-0"
												style={{ color: tokens.textMuted }}
											>
												Loading fonts...
											</p>
										) : fontsList.length === 0 ? (
											<p
												className="text-xs text-center py-3 m-0"
												style={{ color: tokens.textMuted }}
											>
												No fonts found.
											</p>
										) : (
											fontsList.map((f) => (
												<div
													key={f.id}
													className="rounded border text-xs"
													style={{
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between",
														padding: "6px 8px",
														borderRadius: tokens.radius,
														backgroundColor: tokens.surface,
														borderColor: tokens.border,
													}}
												>
													<div>
														<span className="font-medium block text-xs">
															{f.family}
														</span>
														<span
															className="text-[9px] capitalize"
															style={{ color: tokens.textMuted }}
														>
															{f.category}
														</span>
													</div>
													<div
														style={{
															display: "flex",
															alignItems: "center",
															gap: "4px",
														}}
													>
														<button
															type="button"
															onClick={() =>
																applyCustomFont(f.family, "heading")
															}
															className="text-[10px] rounded border border-border hover:bg-primary/20 text-primary cursor-pointer"
															title="Apply to Headings"
															style={{
																padding: "2px 6px",
																borderRadius: "4px",
															}}
														>
															H
														</button>
														<button
															type="button"
															onClick={() => applyCustomFont(f.family, "body")}
															className="text-[10px] rounded border border-border hover:bg-secondary/20 text-secondary cursor-pointer"
															title="Apply to Body"
															style={{
																padding: "2px 6px",
																borderRadius: "4px",
															}}
														>
															B
														</button>
														<button
															type="button"
															onClick={() => applyCustomFont(f.family, "both")}
															className="text-[10px] rounded font-medium cursor-pointer"
															title="Apply to Both"
															style={{
																padding: "2px 6px",
																borderRadius: "4px",
																backgroundColor: tokens.primary,
																color: buttonContrastColor,
															}}
														>
															Both
														</button>
													</div>
												</div>
											))
										)}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* SECTION 3: SURFACES & ACCENTS */}
					<div
						style={{
							marginTop: "6px",
							paddingTop: "12px",
							borderTop: `1px solid ${tokens.border || "var(--border)"}`,
						}}
					>
						<label
							className="text-[11px] font-semibold tracking-wider uppercase block"
							style={{
								color: tokens.textMuted,
								display: "block",
								marginBottom: "6px",
							}}
						>
							Surfaces &amp; Accents
						</label>

						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "5px",
							}}
						>
							{[
								{
									key: "canvas" as const,
									label: "App Background / Canvas",
									title: "Canvas Background",
								},
								{
									key: "surface" as const,
									label: "Sheet Surface / Menus",
									title: "Surface Elevation",
								},
								{
									key: "card" as const,
									label: "Card / Panel Surface",
									title: "Card Elevation",
								},
								{
									key: "border" as const,
									label: "Border / Dividers",
									title: "Border Stroke",
								},
								{
									key: "primary" as const,
									label: "Primary Accent",
									title: "Primary Brand",
								},
								{
									key: "secondary" as const,
									label: "Secondary Accent",
									title: "Secondary System",
								},
								{
									key: "accent" as const,
									label: "Live Indicator / Accent",
									title: "Accent Glow",
								},
							].map(({ key, label, title }) => {
								const presetTokensForCurrentMode =
									isLight && currentPresetObj.lightTokens
										? {
												...currentPresetObj.tokens,
												...currentPresetObj.lightTokens,
											}
										: currentPresetObj.tokens;
								const originalColor = (
									presetTokensForCurrentMode as Record<
										string,
										string | undefined
									>
								)[key];
								const isCustomized =
									Boolean(originalColor) &&
									tokens[key]?.toLowerCase() !== originalColor?.toLowerCase();

								return (
									<div
										key={key}
										className="rounded-card border border-border"
										style={{
											backgroundColor: tokens.card,
											borderRadius: tokens.radius,
											padding: "7px 12px",
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
										}}
									>
										<span className="text-xs">{label}</span>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "8px",
											}}
										>
											{isCustomized && originalColor ? (
												<button
													type="button"
													onClick={() => updateToken(key, originalColor)}
													title={`Reset to ${currentPresetObj.name} default (${originalColor})`}
													className="rounded hover:bg-white/10 text-primary transition-colors cursor-pointer flex items-center justify-center border-0 bg-transparent"
													style={{
														padding: "2px",
														borderRadius: "4px",
														cursor: "pointer",
														background: "transparent",
														border: "none",
														color: tokens.primary,
													}}
												>
													<HugeiconsIcon icon={RotateLeft01Icon} size={13} />
												</button>
											) : null}
											<span className="font-mono text-[11px] opacity-75">
												{tokens[key]}
											</span>
											<ColorPickerField
												value={tokens[key] || "#38BDF8"}
												onChange={(val) => updateToken(key, val)}
												title={title}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* SECTION 4: TEXT & TYPOGRAPHY COLORS (SEPARATED FROM CANVAS) */}
					<div
						style={{
							marginTop: "6px",
							paddingTop: "12px",
							borderTop: `1px solid ${tokens.border || "var(--border)"}`,
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: "6px",
							}}
						>
							<label
								className="text-[11px] font-semibold tracking-wider uppercase block"
								style={{
									color: tokens.textMuted,
									display: "block",
								}}
							>
								Text &amp; Typography Colors
							</label>
							<span
								className="text-[10px] font-mono opacity-70"
								style={{ color: tokens.textMuted }}
							>
								Independent of Canvas
							</span>
						</div>

						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "5px",
							}}
						>
							{[
								{
									key: "textPrimary" as const,
									label: "Heading & Primary Text",
									title: "Primary Text Color",
								},
								{
									key: "textMuted" as const,
									label: "Muted & Secondary Text",
									title: "Muted Text Color",
								},
							].map(({ key, label, title }) => {
								const presetTokensForCurrentMode =
									isLight && currentPresetObj.lightTokens
										? {
												...currentPresetObj.tokens,
												...currentPresetObj.lightTokens,
											}
										: currentPresetObj.tokens;
								const originalColor = (
									presetTokensForCurrentMode as Record<
										string,
										string | undefined
									>
								)[key];
								const isCustomized =
									Boolean(originalColor) &&
									tokens[key]?.toLowerCase() !== originalColor?.toLowerCase();

								return (
									<div
										key={key}
										className="rounded-card border border-border"
										style={{
											backgroundColor: tokens.card,
											borderRadius: tokens.radius,
											padding: "7px 12px",
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
										}}
									>
										<span className="text-xs">{label}</span>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "8px",
											}}
										>
											{isCustomized && originalColor ? (
												<button
													type="button"
													onClick={() => updateToken(key, originalColor)}
													title={`Reset to default (${originalColor})`}
													className="rounded hover:bg-white/10 text-primary transition-colors cursor-pointer flex items-center justify-center border-0 bg-transparent"
													style={{
														padding: "2px",
														borderRadius: "4px",
														cursor: "pointer",
														background: "transparent",
														border: "none",
														color: tokens.primary,
													}}
												>
													<HugeiconsIcon icon={RotateLeft01Icon} size={13} />
												</button>
											) : null}
											<span className="font-mono text-[11px] opacity-75">
												{tokens[key]}
											</span>
											<ColorPickerField
												value={tokens[key] || "#FFFFFF"}
												onChange={(val) => updateToken(key, val)}
												title={title}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* SECTION 5: CARD CORNER RADIUS */}
					<div
						style={{
							marginTop: "6px",
							paddingTop: "12px",
							borderTop: `1px solid ${tokens.border || "var(--border)"}`,
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: "6px",
							}}
						>
							<span
								className="text-[11px] font-semibold tracking-wider uppercase"
								style={{ color: tokens.textMuted }}
							>
								Card Corner Radius
							</span>
							<span className="text-xs font-mono text-primary font-bold">
								{tokens.radius}
							</span>
						</div>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
								gap: "4px",
							}}
						>
							{DEFINED_RADIUS_OPTIONS.map((rad: string) => {
								const isSelected =
									tokens.radius === rad ||
									(rad === "0rem" &&
										(tokens.radius === "0" ||
											tokens.radius === "0px" ||
											tokens.radius === "0rem"));
								return (
									<button
										type="button"
										key={rad}
										onClick={() => updateToken("radius", rad)}
										className={`py-1.5 text-[11px] font-mono border transition-all cursor-pointer ${
											isSelected
												? "border-primary ring-1 ring-primary font-bold text-primary"
												: "border-border hover:border-text-muted text-text-muted"
										}`}
										style={{
											backgroundColor: tokens.card,
											borderRadius: rad,
											padding: "6px 0",
											textAlign: "center",
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										{rad}
									</button>
								);
							})}
						</div>
					</div>

					{/* SECTION 6: TACTICAL EFFECT (TACTILE PHYSICS) */}
					<div
						style={{
							marginTop: "6px",
							paddingTop: "12px",
							borderTop: `1px solid ${tokens.border || "var(--border)"}`,
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: "6px",
							}}
						>
							<span
								className="text-[11px] font-semibold tracking-wider uppercase"
								style={{ color: tokens.textMuted }}
							>
								Tactical Effect (Tactile Physics)
							</span>
							<button
								type="button"
								onClick={toggleTactile}
								className={`px-2 py-0.5 rounded-badge text-[10px] font-mono font-bold border transition-all cursor-pointer ${
									tokens.tactile === "true"
										? "border-primary bg-primary/20 text-primary ring-1 ring-primary"
										: "border-border text-text-muted hover:border-text-muted"
								}`}
								style={{
									padding: "2px 8px",
									borderRadius: "9999px",
									fontSize: "10px",
									cursor: "pointer",
								}}
							>
								{tokens.tactile === "true" ? "ACTIVE" : "DISABLED"}
							</button>
						</div>
						<div
							className="rounded-card border border-border"
							style={{
								backgroundColor: tokens.card,
								borderRadius: tokens.radius,
								padding: "10px 12px",
								display: "flex",
								flexDirection: "column",
								gap: "8px",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<span className="text-xs font-medium text-text-primary">
									Interactive Physics Test
								</span>
								<span
									className="text-[10px] font-mono px-2 py-0.5 rounded-badge bg-primary/10 text-primary border border-primary/20"
									style={{ padding: "2px 6px", borderRadius: "9999px" }}
								>
									{tactileClicks > 0
										? `${tactileClicks} Click${tactileClicks > 1 ? "s" : ""}`
										: "Ready"}
								</span>
							</div>
							<button
								type="button"
								onClick={() => {
									setTactileClicks((c) => c + 1);
									setShowClickFeedback(true);
									setTimeout(() => setShowClickFeedback(false), 500);
									if (typeof window !== "undefined" && "vibrate" in navigator) {
										navigator.vibrate?.(20);
									}
								}}
								className={`tactile-item tactile-always-active w-full py-1.5 px-3 rounded-btn font-mono text-xs font-bold transition-all cursor-pointer select-none text-center ${
									showClickFeedback
										? "bg-accent scale-95"
										: "bg-primary hover:opacity-95"
								}`}
								style={{
									borderRadius: tokens.radius,
									backgroundColor: showClickFeedback
										? tokens.accent
										: tokens.primary,
									color: "#FFFFFF",
									width: "100%",
									padding: "6px 10px",
									cursor: "pointer",
								}}
							>
								{showClickFeedback
									? "💥 Pulse Registered!"
									: "Click & Feel Physics"}
							</button>
						</div>
					</div>

					{/* SECTION 7: ELEVATION & SHADOWS */}
					<div
						style={{
							marginTop: "6px",
							paddingTop: "12px",
							borderTop: `1px solid ${tokens.border || "var(--border)"}`,
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: "6px",
							}}
						>
							<span
								className="text-[11px] font-semibold tracking-wider uppercase"
								style={{ color: tokens.textMuted }}
							>
								Elevation &amp; Shadows
							</span>
							<span className="text-[11px] font-mono text-primary font-bold">
								{SHADOW_PRESETS.find((p) => p.value === tokens.shadow)?.label ||
									(tokens.shadow?.startsWith("0 0 20px")
										? "Neon Glow"
										: "Custom")}
							</span>
						</div>

						{/* Shadow Presets Grid */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
								gap: "6px",
								marginBottom: "8px",
							}}
						>
							{SHADOW_PRESETS.map((p) => {
								const isSelected =
									p.value === tokens.shadow ||
									(p.isGlow && tokens.shadow?.startsWith("0 0 20px"));
								return (
									<button
										type="button"
										key={p.id}
										onClick={() => applyShadowPreset(p.id)}
										className={`rounded-btn text-xs text-left border transition-all cursor-pointer flex flex-col justify-between ${
											isSelected
												? "border-primary ring-1 ring-primary font-bold text-primary"
												: "border-border hover:border-text-muted text-text-muted"
										}`}
										style={{
											backgroundColor: tokens.card,
											borderRadius: tokens.radius,
											padding: "6px 8px",
											height: "48px",
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between",
											textAlign: "left",
										}}
									>
										<span className="truncate text-xs">{p.label}</span>
										<span className="text-[9px] font-mono opacity-60 truncate">
											{p.isGlow
												? "Glow"
												: p.value === "none"
													? "Flat"
													: "Elevated"}
										</span>
									</button>
								);
							})}
						</div>

						{/* Glow Color Customizer */}
						<div
							className="rounded-card border border-border"
							style={{
								backgroundColor: tokens.card,
								borderRadius: tokens.radius,
								padding: "8px 10px",
								display: "flex",
								flexDirection: "column",
								gap: "6px",
								marginBottom: "8px",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<span className="text-xs font-medium text-text-primary">
									Neon Glow Color
								</span>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "6px",
									}}
								>
									<span className="text-[10px] font-mono text-text-muted">
										{tokens.glowColor || "#38BDF8"}
									</span>
									<ColorPickerField
										value={tokens.glowColor || "#38BDF8"}
										onChange={(val) => handleGlowColorChange(val)}
										size="sm"
										title="Choose custom neon glow color"
									/>
								</div>
							</div>
							<div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
								{GLOW_COLOR_CHIPS.map((chip) => {
									const chipHex =
										chip.color === "primary"
											? tokens.primary || "#38BDF8"
											: chip.color === "accent"
												? tokens.accent || "#34D399"
												: chip.color;
									const isActive = tokens.glowColor === chipHex;
									return (
										<button
											type="button"
											key={chip.label}
											onClick={() => handleGlowColorChange(chip.color)}
											className={`text-[10px] border flex items-center gap-1 transition-all cursor-pointer ${
												isActive
													? "border-primary text-primary font-bold ring-1 ring-primary"
													: "border-border text-text-muted hover:border-text-muted"
											}`}
											style={{
												display: "inline-flex",
												alignItems: "center",
												gap: "4px",
												padding: "2px 6px",
												borderRadius: "9999px",
												cursor: "pointer",
											}}
										>
											<span
												style={{
													width: "8px",
													height: "8px",
													borderRadius: "9999px",
													backgroundColor: chipHex,
													display: "inline-block",
													flexShrink: 0,
												}}
											/>
											<span>{chip.label}</span>
										</button>
									);
								})}
							</div>
						</div>

						{/* Live Elevation Preview Card */}
						<div
							className="rounded-card border border-border text-center transition-all"
							style={{
								backgroundColor: tokens.card,
								boxShadow: tokens.shadow || "none",
								borderRadius: tokens.radius,
								padding: "10px",
								margin: "6px 0",
								textAlign: "center",
							}}
						>
							<span className="text-xs font-medium block text-text-primary">
								Elevation Preview
							</span>
							<span className="text-[10px] font-mono text-text-muted">
								{tokens.shadow === "none" || !tokens.shadow
									? "Flat (Elevation 0)"
									: "Elevated Box Shadow Active"}
							</span>
						</div>

						{/* Collapsible Custom Shadow Inputs */}
						<div style={{ marginTop: "4px" }}>
							<button
								type="button"
								onClick={() =>
									setShowCustomShadowInputs(!showCustomShadowInputs)
								}
								className="text-[10px] font-mono text-primary hover:underline cursor-pointer flex items-center gap-1 border-0 bg-transparent p-0"
								style={{
									cursor: "pointer",
									background: "transparent",
									border: "none",
									padding: 0,
									color: tokens.primary,
								}}
							>
								<span>
									{showCustomShadowInputs
										? "Hide Raw Shadow CSS"
										: "Edit Raw Shadow CSS"}
								</span>
							</button>
							{showCustomShadowInputs && (
								<div
									style={{
										marginTop: "6px",
										paddingTop: "6px",
										borderTop: `1px solid ${tokens.border || "var(--border)"}`,
										display: "flex",
										flexDirection: "column",
										gap: "6px",
									}}
								>
									<div>
										<span className="text-[9px] font-mono text-text-muted block">
											--shadow
										</span>
										<input
											type="text"
											value={tokens.shadow || ""}
											onChange={(e) => updateToken("shadow", e.target.value)}
											className="w-full text-[10px] font-mono rounded bg-canvas border border-border text-text-primary"
											placeholder="0 4px 6px -1px rgba(0,0,0,0.1)..."
											style={{
												backgroundColor: tokens.canvas,
												borderColor: tokens.border,
												color: tokens.textPrimary,
												width: "100%",
												padding: "4px 6px",
												borderRadius: tokens.radius,
											}}
										/>
									</div>
									<div>
										<span className="text-[9px] font-mono text-text-muted block">
											--shadow-sm
										</span>
										<input
											type="text"
											value={tokens.shadowSm || ""}
											onChange={(e) => updateToken("shadowSm", e.target.value)}
											className="w-full text-[10px] font-mono rounded bg-canvas border border-border text-text-primary"
											placeholder="0 1px 2px 0 rgba(0,0,0,0.05)..."
											style={{
												backgroundColor: tokens.canvas,
												borderColor: tokens.border,
												color: tokens.textPrimary,
												width: "100%",
												padding: "4px 6px",
												borderRadius: tokens.radius,
											}}
										/>
									</div>
									<div>
										<span className="text-[9px] font-mono text-text-muted block">
											--shadow-lg
										</span>
										<input
											type="text"
											value={tokens.shadowLg || ""}
											onChange={(e) => updateToken("shadowLg", e.target.value)}
											className="w-full text-[10px] font-mono rounded bg-canvas border border-border text-text-primary"
											placeholder="0 10px 15px -3px rgba(0,0,0,0.1)..."
											style={{
												backgroundColor: tokens.canvas,
												borderColor: tokens.border,
												color: tokens.textPrimary,
												width: "100%",
												padding: "4px 6px",
												borderRadius: tokens.radius,
											}}
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* FIXED SHEET FOOTER: INLINE FLOATING RIGHT */}
				<div
					style={{
						backgroundColor: tokens.surface,
						padding: "12px 16px",
						borderTop: `1px solid ${tokens.border || "var(--border)"}`,
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-end",
						gap: "8px",
						flexShrink: 0,
					}}
				>
					<button
						type="button"
						onClick={resetToDefault}
						className="flex items-center justify-center gap-1.5 text-xs rounded-btn border border-border hover:bg-card hover:text-text-primary transition-colors cursor-pointer text-text-muted whitespace-nowrap"
						title="Reset all settings to default theme"
						style={{
							height: "34px",
							borderRadius: tokens.radius,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "6px",
							cursor: "pointer",
							backgroundColor: "transparent",
							border: `1px solid ${tokens.border || "var(--border)"}`,
							color: tokens.textMuted,
							padding: "0 12px",
						}}
					>
						<HugeiconsIcon
							icon={RotateLeft01Icon}
							size={13}
							className="shrink-0"
						/>
						<span>Reset</span>
					</button>

					<button
						type="button"
						onClick={closeStudio}
						className="text-xs rounded-btn font-medium font-heading transition-all active:scale-[0.99] cursor-pointer shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
						style={{
							height: "34px",
							backgroundColor: tokens.primary,
							color: buttonContrastColor,
							borderRadius: tokens.radius,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontWeight: 600,
							cursor: "pointer",
							border: "none",
							padding: "0 16px",
						}}
					>
						Apply &amp; Close
					</button>
				</div>
			</div>
		</div>
	);
}

export default ThemeStudioDrawer;

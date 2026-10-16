"use client";

import {
	Cancel01Icon,
	CheckmarkBadge01Icon,
	Globe02Icon,
	LockKeyIcon,
	PaintBoardIcon,
	RotateLeft01Icon,
	Search01Icon,
	SparklesIcon,
	TextFontIcon,
	ViewIcon,
	ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type React from "react";
import { useEffect, useState } from "react";
import {
	type FontsourceItem,
	loadFontsourceFont,
	POPULAR_FONTSOURCE_FONTS,
	searchFontsourceFonts,
} from "../core/fonts";
import {
	DEFINED_RADIUS_OPTIONS,
	GLOW_COLOR_CHIPS,
	getGlowValues,
	SHADOW_PRESETS,
} from "../core/presets";
import type { BaseTokens } from "../core/types";
import { ColorPickerField } from "./color-picker-field";
import { useTheme } from "./use-theme";

export interface FontPairing {
	id: string;
	name: string;
	headingFontVar: string;
	bodyFontVar: string;
	headingName: string;
	bodyName: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
	{
		id: "ibm-noto",
		name: "IBM Plex Sans + Noto Sans (Default)",
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

export function ThemeStudioDrawer() {
	const {
		isStudioOpen,
		closeStudio,
		theme,
		resolvedMode,
		tokens,
		themes,
		setTheme,
		setCustomTokens,
		resetTheme,
	} = useTheme();

	// Smooth unmount animation lifecycle
	const [isRendered, setIsRendered] = useState(isStudioOpen);
	const [isVisible, setIsVisible] = useState(false);

	// Font Explorer State
	const [showGoogleFonts, setShowGoogleFonts] = useState(false);
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

	// Global Theme Modal & Admin Auth State
	const [showGlobalModal, setShowGlobalModal] = useState(false);
	const [adminPassword, setAdminPassword] = useState("");
	const [showAdminPassword, setShowAdminPassword] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);
	const [publishFeedback, setPublishFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);
	const [showCustomShadowInputs, setShowCustomShadowInputs] = useState(false);

	// Inject styles for Colorshot popover and tactile physics
	useEffect(() => {
		if (typeof document === "undefined") return;
		const id = "k79-theme-studio-tactile-style";
		if (!document.getElementById(id)) {
			const style = document.createElement("style");
			style.id = id;
			style.textContent = `
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

/* Ensure Colorshot popover displays above high z-index drawers/modals */
body [data-colorshot-popover] {
	z-index: 999999 !important;
}

/* Reset Colorshot trigger button to avoid weird double containers */
[data-colorshot-field] {
	background: transparent !important;
	border: none !important;
	padding: 0 !important;
	height: auto !important;
	min-height: 0 !important;
	box-shadow: none !important;
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
	border: none !important;
	outline: none !important;
	box-shadow: none !important;
}
[data-colorshot-field] [data-part="field-text"],
[data-colorshot-field] [data-part="field-alpha"] {
	display: none !important;
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

	// Debounced font search handler
	useEffect(() => {
		if (!showGoogleFonts) return;
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
	}, [fontSearch, fontCategory, showGoogleFonts]);

	if (!isRendered) return null;

	const updateToken = <K extends keyof BaseTokens>(
		key: K,
		value: BaseTokens[K],
	) => {
		setCustomTokens({ [key]: value });
	};

	const applyShadowPreset = (presetId: string) => {
		const preset = SHADOW_PRESETS.find((p) => p.id === presetId);
		if (!preset) return;
		if (preset.isGlow) {
			const glowHex = tokens.glowColor || tokens.primary || "#38BDF8";
			const vals = getGlowValues(glowHex);
			setCustomTokens({
				shadow: vals.value,
				shadowSm: vals.sm,
				shadowLg: vals.lg,
				glowColor: glowHex,
			});
		} else {
			setCustomTokens({
				shadow: preset.value,
				shadowSm: preset.sm,
				shadowLg: preset.lg,
			});
		}
	};

	const handleGlowColorChange = (newColor: string) => {
		let resolved = newColor;
		if (newColor === "primary") resolved = tokens.primary;
		if (newColor === "accent") resolved = tokens.accent;
		const vals = getGlowValues(resolved);
		setCustomTokens({
			glowColor: resolved,
			shadow: vals.value,
			shadowSm: vals.sm,
			shadowLg: vals.lg,
		});
	};

	const toggleTactile = () => {
		const nextVal = tokens.tactile === "true" ? "false" : "true";
		setCustomTokens({ tactile: nextVal });
	};

	const selectPreset = (presetId: string) => {
		setTheme(presetId);
	};

	const selectFontPairing = (pairingId: string) => {
		const pairing = FONT_PAIRINGS.find((p) => p.id === pairingId);
		if (!pairing) return;
		setCustomTokens({
			fontHeading: pairing.headingFontVar,
			fontBody: pairing.bodyFontVar,
		});
		setActiveFont(pairing.id);
	};

	const applyCustomFont = (
		fontItem: FontsourceItem,
		target: "heading" | "body" | "both",
	) => {
		loadFontsourceFont(fontItem.id);
		const formatted = `"${fontItem.family}", ${fontItem.category}`;
		if (target === "heading") {
			setCustomTokens({ fontHeading: formatted });
		} else if (target === "body") {
			setCustomTokens({ fontBody: formatted });
		} else {
			setCustomTokens({ fontHeading: formatted, fontBody: formatted });
		}
		setActiveFont("custom");
	};

	const handlePublishGlobalTheme = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!adminPassword.trim()) {
			setPublishFeedback({
				type: "error",
				message: "Please enter your admin password.",
			});
			return;
		}
		setIsPublishing(true);
		setPublishFeedback(null);
		try {
			// Copy config to clipboard as well for easy developer export
			if (typeof navigator !== "undefined" && navigator.clipboard) {
				await navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
			}
			setPublishFeedback({
				type: "success",
				message:
					"Theme successfully deployed as Global Default! (JSON copied to clipboard)",
			});
			setAdminPassword("");
			setTimeout(() => {
				setShowGlobalModal(false);
				setPublishFeedback(null);
			}, 1800);
		} catch {
			setPublishFeedback({
				type: "error",
				message: "Failed to publish global theme.",
			});
		} finally {
			setIsPublishing(false);
		}
	};

	const resetToDefault = () => {
		resetTheme();
		setActiveFont("ibm-noto");
	};

	const currentPresetObj =
		themes.find((p) => p.id === theme) ||
		themes.find((p) => p.id === "dark-slate") ||
		themes[0];

	const isLight =
		resolvedMode === "light" ||
		(tokens.canvas &&
			(tokens.canvas.toLowerCase().startsWith("#f") ||
				tokens.canvas.toLowerCase() === "#ffffff" ||
				tokens.canvas.toLowerCase().startsWith("#fa")));

	return (
		<div
			data-lenis-prevent="true"
			onClick={closeStudio}
			className={`fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-200 cursor-pointer ${
				isVisible ? "opacity-100" : "opacity-0"
			}`}
		>
			<div
				data-lenis-prevent="true"
				onClick={(e) => e.stopPropagation()}
				className={`w-full max-w-[490px] h-full flex flex-col shadow-2xl border-l border-border transition-transform duration-200 overscroll-contain cursor-default ${
					isVisible ? "translate-x-0" : "translate-x-full"
				}`}
				style={{
					backgroundColor: tokens.surface,
					color: tokens.textPrimary,
				}}
			>
				{/* FIXED SHEET HEADER */}
				<div
					className="p-4 sm:p-5 border-b border-border shrink-0 flex items-center justify-between z-10"
					style={{ backgroundColor: tokens.surface }}
				>
					<div className="flex items-center gap-2.5">
						<div
							className="p-2 rounded-btn"
							style={{
								backgroundColor: tokens.card,
								color: tokens.primary,
							}}
						>
							<HugeiconsIcon icon={PaintBoardIcon} size={20} />
						</div>
						<div>
							<h3 className="font-semibold text-base tracking-tight font-heading">
								Theme Studio
							</h3>
							<p className="text-xs" style={{ color: tokens.textMuted }}>
								Live Tailwind v4 variable inspector
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={closeStudio}
						className="p-1.5 rounded-btn hover:bg-card transition-colors cursor-pointer"
						aria-label="Close Theme Studio"
					>
						<HugeiconsIcon icon={Cancel01Icon} size={20} />
					</button>
				</div>

				{/* SCROLLABLE SHEET BODY */}
				<div
					data-lenis-prevent="true"
					onWheel={(e) => e.stopPropagation()}
					className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 min-h-0 overscroll-contain"
				>
					{/* SECTION 1: PALETTES & PRESETS */}
					<div>
						<label
							className="text-xs font-semibold tracking-wider uppercase block mb-2.5"
							style={{ color: tokens.textMuted }}
						>
							Palettes &amp; Presets
						</label>
						<div className="grid grid-cols-2 gap-2">
							{themes.map((p) => {
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
										className={`text-left p-3 rounded-card border text-xs transition-all cursor-pointer flex flex-col justify-between ${
											isSelected
												? "border-primary ring-1 ring-primary"
												: "border-border hover:border-text-muted"
										}`}
										style={{ backgroundColor: tokens.card }}
									>
										<div className="flex items-center justify-between mb-2">
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
										<div className="flex items-center gap-1.5">
											<span
												className="w-3.5 h-3.5 rounded-full border border-border/40 shadow-xs"
												style={{ backgroundColor: previewColors.canvas }}
											/>
											<span
												className="w-3.5 h-3.5 rounded-full border border-border/40 shadow-xs"
												style={{ backgroundColor: previewColors.primary }}
											/>
											<span
												className="w-3.5 h-3.5 rounded-full border border-border/40 shadow-xs"
												style={{ backgroundColor: previewColors.secondary }}
											/>
											<span
												className="w-3.5 h-3.5 rounded-full border border-border/40 shadow-xs"
												style={{ backgroundColor: previewColors.accent }}
											/>
										</div>
									</button>
								);
							})}
						</div>
					</div>

					{/* SECTION 2: TYPOGRAPHY SYSTEM */}
					<div className="mt-6">
						<div className="flex items-center justify-between mb-2.5">
							<label
								className="text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5"
								style={{ color: tokens.textMuted }}
							>
								<HugeiconsIcon icon={TextFontIcon} size={16} />
								Typography System
							</label>
							<span className="text-[10px] font-mono px-2 py-0.5 rounded-badge bg-primary/10 text-primary border border-primary/20">
								{activeFont === "custom" ? "Custom Google Font" : "Preset"}
							</span>
						</div>

						{/* Current Active Fonts Indicator */}
						<div
							className={`p-2.5 rounded-card border mb-3 text-xs space-y-1.5 transition-all ${
								activeFont === "custom"
									? "border-primary ring-1 ring-primary"
									: "border-border"
							}`}
							style={{ backgroundColor: tokens.card }}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-1.5">
									<span style={{ color: tokens.textMuted }}>Heading Font:</span>
									<span className="font-semibold text-primary font-mono text-[11px]">
										{extractFontFamily(tokens.fontHeading)}
									</span>
								</div>
								{activeFont === "custom" && (
									<span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
										<HugeiconsIcon icon={CheckmarkBadge01Icon} size={12} />
										Active Custom Font
									</span>
								)}
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-1.5">
									<span style={{ color: tokens.textMuted }}>Body Font:</span>
									<span className="font-semibold text-secondary font-mono text-[11px]">
										{extractFontFamily(tokens.fontBody)}
									</span>
								</div>
							</div>
						</div>

						{/* Preset Pairings */}
						<div className="space-y-2 mb-3">
							{FONT_PAIRINGS.map((f) => {
								const isSelected = activeFont === f.id;
								return (
									<button
										type="button"
										key={f.id}
										onClick={() => selectFontPairing(f.id)}
										className={`w-full text-left px-3.5 py-2.5 rounded-card border text-xs transition-all flex items-center justify-between cursor-pointer ${
											isSelected
												? "border-primary ring-1 ring-primary"
												: "border-border hover:border-text-muted"
										}`}
										style={{ backgroundColor: tokens.card }}
									>
										<div>
											<p className="font-medium">{f.name}</p>
											<p
												className="text-[11px]"
												style={{ color: tokens.textMuted }}
											>
												UI: {f.headingName} • Body: {f.bodyName}
											</p>
										</div>
										{isSelected && (
											<HugeiconsIcon
												icon={CheckmarkBadge01Icon}
												size={16}
												className="text-primary"
											/>
										)}
									</button>
								);
							})}
						</div>

						{/* Custom Google Fonts Explorer Toggle */}
						<div
							className="rounded-card border overflow-hidden transition-all"
							style={{
								backgroundColor: tokens.card,
								borderColor: tokens.border,
							}}
						>
							<button
								type="button"
								onClick={() => setShowGoogleFonts(!showGoogleFonts)}
								className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium cursor-pointer hover:bg-white/5 transition-colors"
							>
								<div className="flex items-center gap-2 text-text-primary">
									<HugeiconsIcon
										icon={SparklesIcon}
										size={15}
										className="text-primary"
									/>
									<span>Explore 1,900+ Google Fonts</span>
								</div>
								<span className="text-[10px] font-mono px-2 py-0.5 rounded-badge bg-primary/10 text-primary">
									{showGoogleFonts ? "Collapse" : "Open API Explorer"}
								</span>
							</button>

							{showGoogleFonts && (
								<div className="p-3 border-t border-border/80 space-y-3">
									{/* Search Input */}
									<div className="relative">
										<HugeiconsIcon
											icon={Search01Icon}
											size={14}
											className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
										/>
										<input
											type="text"
											value={fontSearch}
											onChange={(e) => setFontSearch(e.target.value)}
											placeholder="Search Google Fonts (e.g. Outfit, Space Grotesk)..."
											className="w-full pl-8 pr-3 py-1.5 rounded-btn bg-canvas text-xs text-text-primary placeholder:text-text-muted border border-border focus:outline-none focus:border-primary font-mono"
											style={{
												backgroundColor: tokens.canvas,
												borderColor: tokens.border,
												color: tokens.textPrimary,
											}}
										/>
									</div>

									{/* Category Tabs */}
									<div className="flex flex-wrap gap-1">
										{["all", "sans-serif", "monospace", "serif", "display"].map(
											(cat) => (
												<button
													type="button"
													key={cat}
													onClick={() => setFontCategory(cat)}
													className={`px-2 py-0.5 rounded-badge text-[10px] capitalize transition-all cursor-pointer ${
														fontCategory === cat
															? "bg-primary text-canvas font-medium"
															: "bg-canvas text-text-muted hover:text-text-primary border border-border"
													}`}
													style={{
														backgroundColor:
															fontCategory === cat
																? tokens.primary
																: tokens.card,
														color:
															fontCategory === cat
																? tokens.canvas
																: tokens.textMuted,
														borderColor: tokens.border,
													}}
												>
													{cat}
												</button>
											),
										)}
									</div>

									{/* Font List Container */}
									<div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
										{isLoadingFonts ? (
											<p className="text-center py-4 text-[11px] text-text-muted font-mono animate-pulse">
												Loading Fonts...
											</p>
										) : fontsList.length === 0 ? (
											<p className="text-center py-4 text-[11px] text-text-muted font-mono">
												No matching fonts found
											</p>
										) : (
											fontsList.map((f) => {
												const currentHeading = extractFontFamily(
													tokens.fontHeading,
												);
												const currentBody = extractFontFamily(tokens.fontBody);
												const isHeading =
													currentHeading.toLowerCase() ===
													f.family.toLowerCase();
												const isBody =
													currentBody.toLowerCase() === f.family.toLowerCase();

												return (
													<div
														key={f.id}
														className="flex items-center justify-between p-2 rounded-btn bg-canvas/80 border border-border/70 hover:border-border text-xs"
														style={{
															backgroundColor: tokens.card,
															borderColor: tokens.border,
														}}
													>
														<div className="truncate mr-2">
															<p className="font-medium truncate text-text-primary">
																{f.family}
															</p>
															<span className="text-[9px] text-text-muted font-mono capitalize">
																{f.category}
															</span>
														</div>
														<div className="flex items-center gap-1 shrink-0">
															<button
																type="button"
																onClick={() => applyCustomFont(f, "heading")}
																title="Set as Heading Font"
																className={`px-2 py-1 rounded-badge text-[10px] font-mono transition-colors cursor-pointer ${
																	isHeading
																		? "bg-primary text-canvas font-bold"
																		: "bg-card text-text-muted hover:text-primary border border-border"
																}`}
																style={{
																	backgroundColor: isHeading
																		? tokens.primary
																		: tokens.canvas,
																	color: isHeading
																		? tokens.canvas
																		: tokens.textMuted,
																	borderColor: tokens.border,
																}}
															>
																H
															</button>
															<button
																type="button"
																onClick={() => applyCustomFont(f, "body")}
																title="Set as Body Font"
																className={`px-2 py-1 rounded-badge text-[10px] font-mono transition-colors cursor-pointer ${
																	isBody
																		? "bg-secondary text-canvas font-bold"
																		: "bg-card text-text-muted hover:text-secondary border border-border"
																}`}
																style={{
																	backgroundColor: isBody
																		? tokens.secondary
																		: tokens.canvas,
																	color: isBody
																		? tokens.canvas
																		: tokens.textMuted,
																	borderColor: tokens.border,
																}}
															>
																B
															</button>
															<button
																type="button"
																onClick={() => applyCustomFont(f, "both")}
																title="Set for Both"
																className="px-2 py-1 rounded-badge text-[10px] font-mono bg-card text-text-muted hover:text-text-primary border border-border transition-colors cursor-pointer"
																style={{
																	backgroundColor: tokens.canvas,
																	color: tokens.textMuted,
																	borderColor: tokens.border,
																}}
															>
																Both
															</button>
														</div>
													</div>
												);
											})
										)}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* SECTION 3: SURFACES & ACCENTS */}
					<div className="mt-6">
						<label
							className="text-xs font-semibold tracking-wider uppercase block mb-2.5"
							style={{ color: tokens.textMuted }}
						>
							Surfaces &amp; Accents
						</label>
						<div className="space-y-2.5 text-xs">
							{[
								{
									key: "canvas" as const,
									label: "Canvas Background",
									title: "Canvas Background",
								},
								{
									key: "surface" as const,
									label: "Elevated Surface",
									title: "Elevated Surface",
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
										className="flex items-center justify-between p-2.5 rounded-card border border-border"
										style={{ backgroundColor: tokens.card }}
									>
										<span>{label}</span>
										<div className="flex items-center gap-2">
											{isCustomized && originalColor ? (
												<button
													type="button"
													onClick={() => updateToken(key, originalColor)}
													title={`Reset to ${currentPresetObj.name} default (${originalColor})`}
													className="p-1 rounded hover:bg-white/10 text-primary transition-colors cursor-pointer flex items-center justify-center"
												>
													<HugeiconsIcon icon={RotateLeft01Icon} size={13} />
												</button>
											) : null}
											<span className="font-mono text-[11px] opacity-75">
												{tokens[key]}
											</span>
											<ColorPickerField
												value={tokens[key]}
												onChange={(val) => updateToken(key, val)}
												title={title}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* SECTION 4: CARD CORNER RADIUS */}
					<div className="mt-6 pb-2">
						<div className="flex items-center justify-between text-xs mb-2">
							<span
								className="font-semibold tracking-wider uppercase"
								style={{ color: tokens.textMuted }}
							>
								Card Corner Radius
							</span>
							<span className="font-mono text-primary font-bold">
								{tokens.radius}
							</span>
						</div>
						<div className="grid grid-cols-6 gap-1">
							{DEFINED_RADIUS_OPTIONS.map((rad) => {
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
										className={`py-2 text-[11px] font-mono border transition-all cursor-pointer ${
											isSelected
												? "border-primary ring-1 ring-primary font-bold text-primary"
												: "border-border hover:border-text-muted text-text-muted"
										}`}
										style={{
											backgroundColor: tokens.card,
											borderRadius: rad,
										}}
									>
										{rad}
									</button>
								);
							})}
						</div>
					</div>

					{/* SECTION 5: TACTICAL EFFECT (TACTILE PHYSICS) */}
					<div className="mt-6 pt-5 border-t border-border">
						<div className="flex items-center justify-between text-xs mb-2">
							<div className="flex items-center gap-1.5">
								<span
									className="font-semibold tracking-wider uppercase"
									style={{ color: tokens.textMuted }}
								>
									Tactical Effect (Tactile Physics)
								</span>
							</div>
							<button
								type="button"
								onClick={toggleTactile}
								className={`px-2.5 py-1 rounded-badge text-[11px] font-mono font-bold border transition-all cursor-pointer ${
									tokens.tactile === "true"
										? "border-primary bg-primary/20 text-primary ring-1 ring-primary"
										: "border-border text-text-muted hover:border-text-muted"
								}`}
							>
								{tokens.tactile === "true" ? "ACTIVE" : "DISABLED"}
							</button>
						</div>
						<p
							className="text-[11px] leading-relaxed mb-3"
							style={{ color: tokens.textMuted }}
						>
							Mechanical 2px hover displacement &amp; 4px active press click
							physics on buttons &amp; cards.
						</p>
						<div
							className="p-3.5 rounded-card border border-border space-y-2.5"
							style={{ backgroundColor: tokens.card }}
						>
							<div className="flex items-center justify-between text-xs">
								<span className="font-medium text-text-primary">
									Interactive Physics Test
								</span>
								<span className="text-[10px] font-mono px-2 py-0.5 rounded-badge bg-primary/10 text-primary border border-primary/20">
									{tactileClicks > 0
										? `${tactileClicks} Click${tactileClicks > 1 ? "s" : ""} Registered`
										: "Ready to Test"}
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
								className={`tactile-item tactile-always-active w-full py-2 px-3 rounded-btn font-mono text-xs font-bold transition-all cursor-pointer select-none text-center ${
									showClickFeedback
										? "bg-accent text-canvas scale-95"
										: "bg-primary text-canvas hover:opacity-95"
								}`}
								style={{
									borderRadius: tokens.radius,
									backgroundColor: showClickFeedback
										? tokens.accent
										: tokens.primary,
									color: tokens.canvas,
								}}
							>
								{showClickFeedback
									? "💥 Mechanical Pulse Registered!"
									: "Click & Feel Physics"}
							</button>
						</div>
					</div>

					{/* SECTION 6: ELEVATION & SHADOWS */}
					<div className="mt-6 pt-5 border-t border-border">
						<div className="flex items-center justify-between text-xs mb-2">
							<span
								className="font-semibold tracking-wider uppercase"
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
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
							{SHADOW_PRESETS.map((p) => {
								const isSelected =
									p.value === tokens.shadow ||
									(p.isGlow && tokens.shadow?.startsWith("0 0 20px"));
								return (
									<button
										type="button"
										key={p.id}
										onClick={() => applyShadowPreset(p.id)}
										className={`p-2 rounded-btn text-xs text-left border transition-all cursor-pointer flex flex-col justify-between h-14 ${
											isSelected
												? "border-primary ring-1 ring-primary font-bold text-primary"
												: "border-border hover:border-text-muted text-text-muted"
										}`}
										style={{ backgroundColor: tokens.card }}
									>
										<span className="truncate">{p.label}</span>
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
							className="p-3 rounded-card border border-border space-y-2 mb-3"
							style={{ backgroundColor: tokens.card }}
						>
							<div className="flex items-center justify-between text-xs">
								<span className="font-medium text-text-primary">
									Neon Glow Color
								</span>
								<div className="flex items-center gap-1.5">
									<span className="text-[10px] font-mono text-text-muted">
										{tokens.glowColor || "#38BDF8"}
									</span>
									<ColorPickerField
										value={tokens.glowColor || "#38BDF8"}
										onChange={(val) => handleGlowColorChange(val)}
										size="sm"
										title="Choose custom neon glow color or gradient"
									/>
								</div>
							</div>
							<div className="flex flex-wrap gap-1.5">
								{GLOW_COLOR_CHIPS.map((chip) => {
									const chipHex =
										chip.color === "primary"
											? tokens.primary
											: chip.color === "accent"
												? tokens.accent
												: chip.color;
									const isActive = tokens.glowColor === chipHex;
									return (
										<button
											type="button"
											key={chip.label}
											onClick={() => handleGlowColorChange(chip.color)}
											className={`px-2 py-0.5 rounded-badge text-[10px] border flex items-center gap-1 transition-all cursor-pointer ${
												isActive
													? "border-primary text-primary font-bold ring-1 ring-primary"
													: "border-border text-text-muted hover:border-text-muted"
											}`}
										>
											<span
												className="w-2 h-2 rounded-full inline-block"
												style={{ backgroundColor: chipHex }}
											/>
											<span>{chip.label}</span>
										</button>
									);
								})}
							</div>
						</div>

						{/* Live Elevation Preview Card */}
						<div
							className="p-3.5 rounded-card border border-border text-center transition-all my-3"
							style={{
								backgroundColor: tokens.card,
								boxShadow: tokens.shadow || "none",
								borderRadius: tokens.radius,
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
						<div>
							<button
								type="button"
								onClick={() =>
									setShowCustomShadowInputs(!showCustomShadowInputs)
								}
								className="text-[11px] font-mono text-primary hover:underline cursor-pointer flex items-center gap-1"
							>
								<span>
									{showCustomShadowInputs
										? "Hide Custom CSS Shadows"
										: "Edit Raw Shadow CSS"}
								</span>
							</button>
							{showCustomShadowInputs && (
								<div className="space-y-2 mt-2 pt-2 border-t border-border">
									<div>
										<span className="text-[10px] font-mono text-text-muted block">
											--shadow
										</span>
										<input
											type="text"
											value={tokens.shadow || ""}
											onChange={(e) => updateToken("shadow", e.target.value)}
											className="w-full px-2 py-1 text-[11px] font-mono rounded bg-canvas border border-border text-text-primary"
											placeholder="0 4px 6px -1px rgba(0,0,0,0.1)..."
											style={{
												backgroundColor: tokens.canvas,
												borderColor: tokens.border,
												color: tokens.textPrimary,
											}}
										/>
									</div>
									<div>
										<span className="text-[10px] font-mono text-text-muted block">
											--shadow-sm
										</span>
										<input
											type="text"
											value={tokens.shadowSm || ""}
											onChange={(e) => updateToken("shadowSm", e.target.value)}
											className="w-full px-2 py-1 text-[11px] font-mono rounded bg-canvas border border-border text-text-primary"
											placeholder="0 1px 2px 0 rgba(0,0,0,0.05)..."
											style={{
												backgroundColor: tokens.canvas,
												borderColor: tokens.border,
												color: tokens.textPrimary,
											}}
										/>
									</div>
									<div>
										<span className="text-[10px] font-mono text-text-muted block">
											--shadow-lg
										</span>
										<input
											type="text"
											value={tokens.shadowLg || ""}
											onChange={(e) => updateToken("shadowLg", e.target.value)}
											className="w-full px-2 py-1 text-[11px] font-mono rounded bg-canvas border border-border text-text-primary"
											placeholder="0 10px 15px -3px rgba(0,0,0,0.1)..."
											style={{
												backgroundColor: tokens.canvas,
												borderColor: tokens.border,
												color: tokens.textPrimary,
											}}
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* FIXED SHEET FOOTER */}
				<div
					className="p-4 border-t border-border shrink-0 flex flex-col gap-2.5 z-10"
					style={{ backgroundColor: tokens.surface }}
				>
					<div className="grid grid-cols-3 gap-2">
						<button
							type="button"
							onClick={resetToDefault}
							className="flex items-center justify-center gap-1.5 text-xs h-9 px-2 rounded-btn border border-border hover:bg-card hover:text-text-primary transition-colors cursor-pointer text-text-muted whitespace-nowrap"
							title="Reset all settings to default theme"
						>
							<HugeiconsIcon
								icon={RotateLeft01Icon}
								size={14}
								className="shrink-0"
							/>
							<span>Reset</span>
						</button>

						<button
							type="button"
							onClick={() => {
								setAdminPassword("");
								setPublishFeedback(null);
								setShowGlobalModal(true);
							}}
							className="flex items-center justify-center gap-1.5 text-xs h-9 px-2 rounded-btn border border-border hover:border-primary/50 text-text-muted hover:text-text-primary bg-card/60 transition-all cursor-pointer whitespace-nowrap"
							title="Promote this custom theme to Global Default"
						>
							<HugeiconsIcon
								icon={Globe02Icon}
								size={14}
								className="shrink-0"
							/>
							<span>Set Global</span>
						</button>

						<a
							href="/admin"
							onClick={() => closeStudio()}
							className="flex items-center justify-center gap-1.5 text-xs h-9 px-2 rounded-btn border border-border hover:border-primary/50 text-text-muted hover:text-text-primary transition-colors font-mono whitespace-nowrap"
							title="Open Global Theme Admin Console"
						>
							<HugeiconsIcon
								icon={LockKeyIcon}
								size={14}
								className="text-primary shrink-0"
							/>
							<span>Admin</span>
						</a>
					</div>

					<button
						type="button"
						onClick={closeStudio}
						className="w-full h-10 text-xs rounded-btn font-medium font-heading transition-all active:scale-[0.99] cursor-pointer shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
						style={{
							backgroundColor: tokens.primary,
							color: tokens.canvas,
						}}
					>
						Apply &amp; Close
					</button>
				</div>

				{/* GLOBAL THEME CONFIRMATION MODAL */}
				{showGlobalModal && (
					<div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
						<div
							className="w-full max-w-sm rounded-card border border-border p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
							style={{ backgroundColor: tokens.surface }}
						>
							<button
								type="button"
								onClick={() => {
									setShowGlobalModal(false);
									setPublishFeedback(null);
								}}
								className="absolute top-3 right-3 p-1 rounded-badge text-text-muted hover:text-text-primary border border-border hover:border-text-muted cursor-pointer"
							>
								<HugeiconsIcon icon={Cancel01Icon} size={14} />
							</button>

							<div className="flex items-center gap-2 mb-2 text-primary">
								<HugeiconsIcon icon={Globe02Icon} size={20} />
								<h4 className="font-heading font-bold text-sm text-text-primary">
									Set Global Default Theme
								</h4>
							</div>
							<p
								className="text-xs mb-4 leading-relaxed"
								style={{ color: tokens.textMuted }}
							>
								Save your active theme settings as the global default for all
								visitors. Enter the admin password to confirm.
							</p>

							<form onSubmit={handlePublishGlobalTheme} className="space-y-3">
								<div className="relative">
									<input
										type={showAdminPassword ? "text" : "password"}
										value={adminPassword}
										onChange={(e) => setAdminPassword(e.target.value)}
										placeholder="Enter admin password..."
										className="w-full px-3 py-2 pr-10 text-xs rounded-btn bg-canvas border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary font-mono"
										style={{
											backgroundColor: tokens.canvas,
											borderColor: tokens.border,
											color: tokens.textPrimary,
										}}
										required
									/>
									<button
										type="button"
										onClick={() => setShowAdminPassword(!showAdminPassword)}
										className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary cursor-pointer"
									>
										<HugeiconsIcon
											icon={showAdminPassword ? ViewOffIcon : ViewIcon}
											size={14}
										/>
									</button>
								</div>

								{publishFeedback && (
									<div
										className={`p-2.5 rounded-btn text-xs border ${
											publishFeedback.type === "success"
												? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
												: "bg-red-500/10 border-red-500/30 text-red-400"
										}`}
									>
										{publishFeedback.message}
									</div>
								)}

								<div className="flex items-center justify-end gap-2 pt-2">
									<button
										type="button"
										onClick={() => {
											setShowGlobalModal(false);
											setPublishFeedback(null);
										}}
										className="px-3 py-1.5 rounded-btn text-xs border border-border text-text-muted hover:bg-card cursor-pointer"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={isPublishing}
										className="px-4 py-1.5 rounded-btn text-xs font-bold font-heading text-canvas transition-all active:scale-95 cursor-pointer disabled:opacity-50"
										style={{ backgroundColor: tokens.primary }}
									>
										{isPublishing ? "Saving..." : "Confirm & Deploy"}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

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
	DEFINED_RADIUS_OPTIONS,
	GLOW_COLOR_CHIPS,
	getGlowValues,
	SHADOW_PRESETS,
} from "../core/presets";
import type { BaseTokens, ThemeDefinition } from "../core/types";
import { ColorPickerField } from "./color-picker-field";
import { useTheme } from "./use-theme";

interface FontsourceItem {
	id: string;
	family: string;
	category: string;
}

const POPULAR_FONTSOURCE_FONTS: FontsourceItem[] = [
	{ id: "inter", family: "Inter", category: "sans-serif" },
	{ id: "roboto", family: "Roboto", category: "sans-serif" },
	{ id: "open-sans", family: "Open Sans", category: "sans-serif" },
	{ id: "montserrat", family: "Montserrat", category: "sans-serif" },
	{ id: "poppins", family: "Poppins", category: "sans-serif" },
	{ id: "lato", family: "Lato", category: "sans-serif" },
	{ id: "space-grotesk", family: "Space Grotesk", category: "sans-serif" },
	{ id: "fira-code", family: "Fira Code", category: "monospace" },
	{ id: "jetbrains-mono", family: "JetBrains Mono", category: "monospace" },
	{ id: "playfair-display", family: "Playfair Display", category: "serif" },
	{ id: "merriweather", family: "Merriweather", category: "serif" },
	{ id: "outfit", family: "Outfit", category: "sans-serif" },
	{
		id: "plus-jakarta-sans",
		family: "Plus Jakarta Sans",
		category: "sans-serif",
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

	// Inject styles for Colorshot popover, field reset, and tactile physics
	useEffect(() => {
		if (typeof document === "undefined") return;
		const id = "k79-theme-studio-tactile-style";
		if (!document.getElementById(id)) {
			const style = document.createElement("style");
			style.id = id;
			style.textContent = `
.tactile-always-active,
[data-tactile="true"] button:not(:disabled):not([data-no-tactile]):not([data-colorshot-field]),
[data-tactile="true"] [role="button"]:not([data-no-tactile]):not([data-colorshot-field]),
[data-tactile="true"] .tactile-item {
	box-shadow: 4px 4px 0px 0px #000000 !important;
	border-color: #000000 !important;
	border-width: 2px !important;
	transition:
		transform 120ms cubic-bezier(0.16, 1, 0.3, 1),
		box-shadow 120ms cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.tactile-always-active:hover,
[data-tactile="true"] button:not(:disabled):not([data-no-tactile]):not([data-colorshot-field]):hover,
[data-tactile="true"] [role="button"]:not([data-no-tactile]):not([data-colorshot-field]):hover,
[data-tactile="true"] .tactile-item:hover {
	transform: translate(2px, 2px) !important;
	box-shadow: 2px 2px 0px 0px #000000 !important;
}

.tactile-always-active:active,
[data-tactile="true"] button:not(:disabled):not([data-no-tactile]):not([data-colorshot-field]):active,
[data-tactile="true"] [role="button"]:not([data-no-tactile]):not([data-colorshot-field]):active,
[data-tactile="true"] .tactile-item:active {
	transform: translate(4px, 4px) !important;
	box-shadow: 0px 0px 0px 0px #000000 !important;
}

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
		if (typeof document !== "undefined") {
			const linkId = `google-font-${fontName.toLowerCase().replace(/\s+/g, "-")}`;
			if (!document.getElementById(linkId)) {
				const link = document.createElement("link");
				link.id = linkId;
				link.rel = "stylesheet";
				link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}:wght@400;500;600;700&display=swap`;
				document.head.appendChild(link);
			}
		}

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

	const handleSaveGlobalTheme = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!adminPassword.trim()) {
			setPublishFeedback({
				type: "error",
				message: "Admin password is required.",
			});
			return;
		}

		setIsPublishing(true);
		setPublishFeedback(null);

		try {
			const res = await fetch("/api/admin/theme", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					tokens,
					presetId: theme,
					adminPassword,
				}),
			});

			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Failed to update global theme");
			}

			setPublishFeedback({
				type: "success",
				message: "Global theme updated successfully in database!",
			});
			setTimeout(() => {
				setShowGlobalModal(false);
				setPublishFeedback(null);
				setAdminPassword("");
			}, 1500);
		} catch (err: unknown) {
			setPublishFeedback({
				type: "error",
				message: err instanceof Error ? err.message : "Network error occurred",
			});
		} finally {
			setIsPublishing(false);
		}
	};

	const resetToDefault = () => {
		resetTheme();
		setActiveFont("ibm-noto");
	};

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
					className="p-4 sm:p-5 border-b border-border shrink-0 flex items-center justify-between z-10"
					style={{
						backgroundColor: tokens.surface,
						padding: "16px 20px",
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
							className="p-2 rounded-btn"
							style={{
								backgroundColor: tokens.card,
								color: tokens.primary,
								padding: "8px",
								borderRadius: tokens.radius,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<HugeiconsIcon icon={PaintBoardIcon} size={20} />
						</div>
						<div>
							<h3 className="font-semibold text-base tracking-tight font-heading m-0">
								Theme Studio
							</h3>
							<p className="text-xs m-0" style={{ color: tokens.textMuted }}>
								Live Tailwind v4 variable inspector
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={closeStudio}
						className="p-1.5 rounded-btn hover:bg-card transition-colors cursor-pointer border-0 bg-transparent"
						style={{
							color: tokens.textPrimary,
							cursor: "pointer",
							background: "transparent",
							border: "none",
							padding: "6px",
						}}
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
					style={{
						flex: 1,
						overflowY: "auto",
						padding: "20px",
						display: "flex",
						flexDirection: "column",
						gap: "24px",
					}}
				>
					{/* SECTION 1: PALETTES & PRESETS */}
					<div>
						<label
							className="text-xs font-semibold tracking-wider uppercase block mb-2.5"
							style={{
								color: tokens.textMuted,
								display: "block",
								marginBottom: "10px",
							}}
						>
							Palettes &amp; Presets
						</label>
						<div
							className="grid grid-cols-2 gap-2"
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
								gap: "8px",
							}}
						>
							{themes.map((p: ThemeDefinition<BaseTokens>) => {
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
										style={{
											backgroundColor: tokens.card,
											borderRadius: tokens.radius,
											padding: "12px",
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between",
											minHeight: "56px",
											textAlign: "left",
										}}
									>
										<div
											className="flex items-center justify-between mb-2"
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												marginBottom: "8px",
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
											className="flex items-center gap-1.5"
											style={{
												display: "flex",
												alignItems: "center",
												gap: "6px",
											}}
										>
											<span
												className="w-3.5 h-3.5 rounded-full border border-border/40 shadow-xs"
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
												className="w-3.5 h-3.5 rounded-full border border-border/40 shadow-xs"
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
												className="w-3.5 h-3.5 rounded-full border border-border/40 shadow-xs"
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
												className="w-3.5 h-3.5 rounded-full border border-border/40 shadow-xs"
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
					<div className="mt-6" style={{ marginTop: "24px" }}>
						<div
							className="flex items-center justify-between mb-2.5"
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: "10px",
							}}
						>
							<label
								className="text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5"
								style={{
									color: tokens.textMuted,
									display: "flex",
									alignItems: "center",
									gap: "6px",
								}}
							>
								<HugeiconsIcon icon={TextFontIcon} size={16} />
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
							style={{
								backgroundColor: tokens.card,
								borderRadius: tokens.radius,
								padding: "10px 12px",
								marginBottom: "12px",
								display: "flex",
								flexDirection: "column",
								gap: "6px",
							}}
						>
							<div
								className="flex items-center justify-between"
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<div
									className="flex items-center gap-1.5"
									style={{ display: "flex", alignItems: "center", gap: "6px" }}
								>
									<span style={{ color: tokens.textMuted }}>Heading Font:</span>
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
											padding: "2px 8px",
											borderRadius: "9999px",
										}}
									>
										<HugeiconsIcon icon={CheckmarkBadge01Icon} size={12} />
										Active Custom Font
									</span>
								)}
							</div>
							<div
								className="flex items-center justify-between"
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<div
									className="flex items-center gap-1.5"
									style={{ display: "flex", alignItems: "center", gap: "6px" }}
								>
									<span style={{ color: tokens.textMuted }}>Body Font:</span>
									<span className="font-semibold text-secondary font-mono text-[11px]">
										{extractFontFamily(tokens.fontBody)}
									</span>
								</div>
							</div>
						</div>

						{/* Preset Pairings */}
						<div
							className="space-y-2 mb-3"
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "8px",
								marginBottom: "12px",
							}}
						>
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
										style={{
											backgroundColor: tokens.card,
											borderRadius: tokens.radius,
											padding: "10px 14px",
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											width: "100%",
											textAlign: "left",
										}}
									>
										<div>
											<p className="font-medium m-0">{f.name}</p>
											<p
												className="text-[11px] m-0"
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
								borderRadius: tokens.radius,
							}}
						>
							<button
								type="button"
								onClick={() => setShowGoogleFonts(!showGoogleFonts)}
								className="w-full px-3.5 py-2.5 text-xs font-medium flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer border-0 bg-transparent text-left"
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									padding: "10px 14px",
									width: "100%",
									color: tokens.textPrimary,
								}}
							>
								<div
									className="flex items-center gap-2"
									style={{ display: "flex", alignItems: "center", gap: "8px" }}
								>
									<HugeiconsIcon
										icon={Search01Icon}
										size={14}
										className="text-primary"
									/>
									<span>Search &amp; Explore Google Fonts</span>
								</div>
								<span className="text-[10px] text-primary underline">
									{showGoogleFonts ? "Close" : "Open"}
								</span>
							</button>

							{showGoogleFonts && (
								<div
									className="p-3 border-t border-border space-y-3"
									style={{
										padding: "12px",
										borderTop: `1px solid ${tokens.border || "var(--border)"}`,
										display: "flex",
										flexDirection: "column",
										gap: "12px",
									}}
								>
									<div
										className="flex gap-2"
										style={{ display: "flex", gap: "8px" }}
									>
										<input
											type="text"
											placeholder="Search Google Font..."
											value={fontSearch}
											onChange={(e) => setFontSearch(e.target.value)}
											className="flex-1 px-2.5 py-1.5 text-xs rounded bg-canvas border border-border text-text-primary"
											style={{
												flex: 1,
												backgroundColor: tokens.canvas,
												borderColor: tokens.border,
												color: tokens.textPrimary,
												padding: "6px 10px",
												borderRadius: tokens.radius,
											}}
										/>
										<select
											value={fontCategory}
											onChange={(e) => setFontCategory(e.target.value)}
											className="px-2 py-1.5 text-xs rounded bg-canvas border border-border text-text-primary"
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
										className="max-h-48 overflow-y-auto space-y-1.5 pr-1"
										style={{
											maxHeight: "192px",
											overflowY: "auto",
											display: "flex",
											flexDirection: "column",
											gap: "6px",
										}}
									>
										{isLoadingFonts ? (
											<p
												className="text-xs text-center py-4"
												style={{ color: tokens.textMuted }}
											>
												Loading fonts...
											</p>
										) : fontsList.length === 0 ? (
											<p
												className="text-xs text-center py-4"
												style={{ color: tokens.textMuted }}
											>
												No fonts found.
											</p>
										) : (
											fontsList.map((f) => (
												<div
													key={f.id}
													className="flex items-center justify-between p-2 rounded bg-surface/50 border border-border/50 text-xs"
													style={{
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between",
														padding: "8px",
														borderRadius: tokens.radius,
														backgroundColor: tokens.surface,
													}}
												>
													<div>
														<span className="font-medium block">
															{f.family}
														</span>
														<span
															className="text-[10px] capitalize"
															style={{ color: tokens.textMuted }}
														>
															{f.category}
														</span>
													</div>
													<div
														className="flex items-center gap-1"
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
															className="px-2 py-0.5 text-[10px] rounded border border-border hover:bg-primary/20 text-primary cursor-pointer"
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
															className="px-2 py-0.5 text-[10px] rounded border border-border hover:bg-secondary/20 text-secondary cursor-pointer"
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
															className="px-2 py-0.5 text-[10px] rounded bg-primary text-canvas font-medium cursor-pointer"
															title="Apply to Both"
															style={{
																padding: "2px 6px",
																borderRadius: "4px",
																backgroundColor: tokens.primary,
																color: tokens.canvas,
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
					<div className="mt-6" style={{ marginTop: "24px" }}>
						<label
							className="text-xs font-semibold tracking-wider uppercase block mb-2.5"
							style={{
								color: tokens.textMuted,
								display: "block",
								marginBottom: "10px",
							}}
						>
							Surfaces &amp; Accents
						</label>
						<div
							className="space-y-2.5 text-xs"
							style={{ display: "flex", flexDirection: "column", gap: "10px" }}
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
										className="flex items-center justify-between p-2.5 rounded-card border border-border"
										style={{
											backgroundColor: tokens.card,
											borderRadius: tokens.radius,
											padding: "10px 14px",
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
										}}
									>
										<span>{label}</span>
										<div
											className="flex items-center gap-2"
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
													className="p-1 rounded hover:bg-white/10 text-primary transition-colors cursor-pointer flex items-center justify-center border-0 bg-transparent"
													style={{
														padding: "4px",
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

					{/* SECTION 4: CARD CORNER RADIUS */}
					<div
						className="mt-6 pb-2"
						style={{ marginTop: "24px", paddingBottom: "8px" }}
					>
						<div
							className="flex items-center justify-between text-xs mb-2"
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: "8px",
							}}
						>
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
						<div
							className="grid grid-cols-6 gap-1"
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
										className={`py-2 text-[11px] font-mono border transition-all cursor-pointer ${
											isSelected
												? "border-primary ring-1 ring-primary font-bold text-primary"
												: "border-border hover:border-text-muted text-text-muted"
										}`}
										style={{
											backgroundColor: tokens.card,
											borderRadius: rad,
											padding: "8px 0",
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

					{/* SECTION 5: TACTICAL EFFECT (TACTILE PHYSICS) */}
					<div
						className="mt-6 pt-5 border-t border-border"
						style={{
							marginTop: "24px",
							paddingTop: "20px",
							borderTop: `1px solid ${tokens.border || "var(--border)"}`,
						}}
					>
						<div
							className="flex items-center justify-between text-xs mb-2"
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: "8px",
							}}
						>
							<div
								className="flex items-center gap-1.5"
								style={{ display: "flex", alignItems: "center", gap: "6px" }}
							>
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
								style={{
									padding: "4px 10px",
									borderRadius: "9999px",
									fontSize: "11px",
									cursor: "pointer",
								}}
							>
								{tokens.tactile === "true" ? "ACTIVE" : "DISABLED"}
							</button>
						</div>
						<p
							className="text-[11px] leading-relaxed mb-3"
							style={{
								color: tokens.textMuted,
								fontSize: "11px",
								marginBottom: "12px",
							}}
						>
							Mechanical 2px hover displacement &amp; 4px active press click
							physics on buttons &amp; cards.
						</p>
						<div
							className="p-3.5 rounded-card border border-border space-y-2.5"
							style={{
								backgroundColor: tokens.card,
								borderRadius: tokens.radius,
								padding: "14px",
								display: "flex",
								flexDirection: "column",
								gap: "10px",
							}}
						>
							<div
								className="flex items-center justify-between text-xs"
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<span className="font-medium text-text-primary">
									Interactive Physics Test
								</span>
								<span
									className="text-[10px] font-mono px-2 py-0.5 rounded-badge bg-primary/10 text-primary border border-primary/20"
									style={{ padding: "2px 8px", borderRadius: "9999px" }}
								>
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
									width: "100%",
									padding: "8px 12px",
									cursor: "pointer",
								}}
							>
								{showClickFeedback
									? "💥 Mechanical Pulse Registered!"
									: "Click & Feel Physics"}
							</button>
						</div>
					</div>

					{/* SECTION 6: ELEVATION & SHADOWS */}
					<div
						className="mt-6 pt-5 border-t border-border"
						style={{
							marginTop: "24px",
							paddingTop: "20px",
							borderTop: `1px solid ${tokens.border || "var(--border)"}`,
						}}
					>
						<div
							className="flex items-center justify-between text-xs mb-2"
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginBottom: "8px",
							}}
						>
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
						<div
							className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3"
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
								gap: "8px",
								marginBottom: "12px",
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
										className={`p-2 rounded-btn text-xs text-left border transition-all cursor-pointer flex flex-col justify-between h-14 ${
											isSelected
												? "border-primary ring-1 ring-primary font-bold text-primary"
												: "border-border hover:border-text-muted text-text-muted"
										}`}
										style={{
											backgroundColor: tokens.card,
											borderRadius: tokens.radius,
											padding: "8px",
											height: "56px",
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between",
											textAlign: "left",
										}}
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
							style={{
								backgroundColor: tokens.card,
								borderRadius: tokens.radius,
								padding: "12px",
								display: "flex",
								flexDirection: "column",
								gap: "8px",
								marginBottom: "12px",
							}}
						>
							<div
								className="flex items-center justify-between text-xs"
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<span className="font-medium text-text-primary">
									Neon Glow Color
								</span>
								<div
									className="flex items-center gap-1.5"
									style={{ display: "flex", alignItems: "center", gap: "6px" }}
								>
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
							<div
								className="flex flex-wrap gap-1.5"
								style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
							>
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
											className={`px-2 py-0.5 rounded-badge text-[10px] border flex items-center gap-1 transition-all cursor-pointer ${
												isActive
													? "border-primary text-primary font-bold ring-1 ring-primary"
													: "border-border text-text-muted hover:border-text-muted"
											}`}
											style={{
												display: "inline-flex",
												alignItems: "center",
												gap: "4px",
												padding: "2px 8px",
												borderRadius: "9999px",
												cursor: "pointer",
											}}
										>
											<span
												className="w-2 h-2 rounded-full inline-block"
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
							className="p-3.5 rounded-card border border-border text-center transition-all my-3"
							style={{
								backgroundColor: tokens.card,
								boxShadow: tokens.shadow || "none",
								borderRadius: tokens.radius,
								padding: "14px",
								margin: "12px 0",
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
						<div>
							<button
								type="button"
								onClick={() =>
									setShowCustomShadowInputs(!showCustomShadowInputs)
								}
								className="text-[11px] font-mono text-primary hover:underline cursor-pointer flex items-center gap-1 border-0 bg-transparent p-0"
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
										? "Hide Custom CSS Shadows"
										: "Edit Raw Shadow CSS"}
								</span>
							</button>
							{showCustomShadowInputs && (
								<div
									className="space-y-2 mt-2 pt-2 border-t border-border"
									style={{
										marginTop: "8px",
										paddingTop: "8px",
										borderTop: `1px solid ${tokens.border || "var(--border)"}`,
										display: "flex",
										flexDirection: "column",
										gap: "8px",
									}}
								>
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
												width: "100%",
												padding: "4px 8px",
												borderRadius: tokens.radius,
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
												width: "100%",
												padding: "4px 8px",
												borderRadius: tokens.radius,
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
												width: "100%",
												padding: "4px 8px",
												borderRadius: tokens.radius,
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
					style={{
						backgroundColor: tokens.surface,
						padding: "16px",
						borderTop: `1px solid ${tokens.border || "var(--border)"}`,
						display: "flex",
						flexDirection: "column",
						gap: "10px",
						flexShrink: 0,
					}}
				>
					<div
						className="grid grid-cols-3 gap-2"
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
							gap: "8px",
						}}
					>
						<button
							type="button"
							onClick={resetToDefault}
							className="flex items-center justify-center gap-1.5 text-xs h-9 px-2 rounded-btn border border-border hover:bg-card hover:text-text-primary transition-colors cursor-pointer text-text-muted whitespace-nowrap"
							title="Reset all settings to default theme"
							style={{
								height: "36px",
								borderRadius: tokens.radius,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "6px",
								cursor: "pointer",
								backgroundColor: "transparent",
								border: `1px solid ${tokens.border || "var(--border)"}`,
								color: tokens.textMuted,
							}}
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
							className="flex items-center justify-center gap-1.5 text-xs h-9 px-2 rounded-btn border border-primary/40 text-primary hover:bg-primary/10 transition-colors cursor-pointer whitespace-nowrap"
							title="Publish theme globally across all visitors"
							style={{
								height: "36px",
								borderRadius: tokens.radius,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "6px",
								cursor: "pointer",
								backgroundColor: "transparent",
								border: `1px solid ${tokens.primary || "#38BDF8"}`,
								color: tokens.primary,
							}}
						>
							<span>Set Global</span>
						</button>

						<a
							href="/admin"
							target="_blank"
							rel="noreferrer"
							className="flex items-center justify-center gap-1.5 text-xs h-9 px-2 rounded-btn border border-border hover:bg-card hover:text-text-primary transition-colors cursor-pointer text-text-muted whitespace-nowrap no-underline"
							title="Open Full Admin Console in new tab"
							style={{
								height: "36px",
								borderRadius: tokens.radius,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "6px",
								cursor: "pointer",
								backgroundColor: "transparent",
								border: `1px solid ${tokens.border || "var(--border)"}`,
								color: tokens.textMuted,
								textDecoration: "none",
							}}
						>
							<span>Admin</span>
						</a>
					</div>

					<button
						type="button"
						onClick={closeStudio}
						className="w-full h-10 text-xs rounded-btn font-medium font-heading transition-all active:scale-[0.99] cursor-pointer shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
						style={{
							width: "100%",
							height: "40px",
							backgroundColor: tokens.primary,
							color: tokens.canvas,
							borderRadius: tokens.radius,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontWeight: 600,
							cursor: "pointer",
							border: "none",
						}}
					>
						Apply &amp; Close
					</button>
				</div>
			</div>

			{/* Global Theme Admin Auth Modal */}
			{showGlobalModal && (
				<div
					data-lenis-prevent="true"
					onClick={() => setShowGlobalModal(false)}
					className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
					style={{
						position: "fixed",
						top: 0,
						right: 0,
						bottom: 0,
						left: 0,
						zIndex: 100000,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "rgba(0,0,0,0.7)",
						backdropFilter: "blur(4px)",
						padding: "16px",
					}}
				>
					<div
						data-lenis-prevent="true"
						onClick={(e) => e.stopPropagation()}
						className="w-full max-w-sm rounded-card border border-border p-5 shadow-2xl space-y-4"
						style={{
							width: "100%",
							maxWidth: "384px",
							backgroundColor: tokens.surface,
							color: tokens.textPrimary,
							borderRadius: tokens.radius,
							padding: "20px",
							display: "flex",
							flexDirection: "column",
							gap: "16px",
						}}
					>
						<div
							className="flex items-center justify-between"
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<h4 className="font-semibold text-sm font-heading m-0">
								Publish Theme Globally
							</h4>
							<button
								type="button"
								onClick={() => setShowGlobalModal(false)}
								className="text-text-muted hover:text-text-primary border-0 bg-transparent cursor-pointer p-0"
								style={{
									color: tokens.textMuted,
									cursor: "pointer",
									background: "transparent",
									border: "none",
								}}
							>
								<HugeiconsIcon icon={Cancel01Icon} size={16} />
							</button>
						</div>

						<p
							className="text-xs leading-relaxed m-0"
							style={{ color: tokens.textMuted }}
						>
							This will set the current theme as the permanent global default
							for all visiting users across the application.
						</p>

						<form
							onSubmit={handleSaveGlobalTheme}
							className="space-y-3"
							style={{ display: "flex", flexDirection: "column", gap: "12px" }}
						>
							<div>
								<span
									className="text-xs block mb-1 font-medium"
									style={{
										color: tokens.textMuted,
										display: "block",
										marginBottom: "4px",
									}}
								>
									Admin Password
								</span>
								<div className="relative">
									<input
										type={showAdminPassword ? "text" : "password"}
										value={adminPassword}
										onChange={(e) => setAdminPassword(e.target.value)}
										placeholder="Enter admin password..."
										className="w-full px-3 py-2 text-xs rounded bg-canvas border border-border text-text-primary pr-14"
										style={{
											backgroundColor: tokens.canvas,
											borderColor: tokens.border,
											color: tokens.textPrimary,
											width: "100%",
											padding: "8px 12px",
											borderRadius: tokens.radius,
											boxSizing: "border-box",
										}}
									/>
									<button
										type="button"
										onClick={() => setShowAdminPassword(!showAdminPassword)}
										className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-primary hover:underline border-0 bg-transparent cursor-pointer"
										style={{
											position: "absolute",
											right: "8px",
											top: "50%",
											transform: "translateY(-50%)",
											background: "transparent",
											border: "none",
											color: tokens.primary,
											cursor: "pointer",
										}}
									>
										{showAdminPassword ? "Hide" : "Show"}
									</button>
								</div>
							</div>

							{publishFeedback && (
								<p
									className={`text-xs p-2 rounded ${
										publishFeedback.type === "success"
											? "bg-success/15 text-success border border-success/30"
											: "bg-danger/15 text-danger border border-danger/30"
									}`}
									style={{
										padding: "8px",
										borderRadius: tokens.radius,
										fontSize: "12px",
										margin: 0,
									}}
								>
									{publishFeedback.message}
								</p>
							)}

							<div
								className="flex items-center gap-2 pt-2"
								style={{
									display: "flex",
									alignItems: "center",
									gap: "8px",
									paddingTop: "8px",
								}}
							>
								<button
									type="button"
									onClick={() => setShowGlobalModal(false)}
									className="flex-1 py-2 text-xs rounded border border-border hover:bg-card transition-colors cursor-pointer"
									style={{
										flex: 1,
										padding: "8px",
										borderRadius: tokens.radius,
										cursor: "pointer",
										background: "transparent",
										border: `1px solid ${tokens.border || "var(--border)"}`,
										color: tokens.textPrimary,
									}}
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isPublishing}
									className="flex-1 py-2 text-xs rounded bg-primary text-canvas font-medium hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer border-0"
									style={{
										flex: 1,
										padding: "8px",
										borderRadius: tokens.radius,
										backgroundColor: tokens.primary,
										color: tokens.canvas,
										fontWeight: 600,
										cursor: isPublishing ? "not-allowed" : "pointer",
										border: "none",
									}}
								>
									{isPublishing ? "Publishing..." : "Confirm & Set"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

async function searchFontsourceFonts(
	query: string,
	category: string,
): Promise<FontsourceItem[]> {
	const trimmed = query.trim().toLowerCase();
	let results = POPULAR_FONTSOURCE_FONTS;

	if (category !== "all") {
		results = results.filter((f) => f.category === category);
	}
	if (trimmed) {
		results = results.filter((f) => f.family.toLowerCase().includes(trimmed));
	}

	return results;
}

export default ThemeStudioDrawer;

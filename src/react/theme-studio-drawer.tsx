"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
	type FontsourceItem,
	getFontCatalog,
	loadFontsourceFont,
	loadPreviewFont,
	POPULAR_FONTSOURCE_FONTS,
	searchFontsourceFonts,
} from "../core/fonts";
import type { BaseTokens, ColorMode } from "../core/types";
import {
	CheckIcon,
	CircleXIcon,
	ComputerIcon,
	Layers01Icon,
	Moon02Icon,
	Search01Icon,
	Setup01Icon,
	Sun02Icon,
	SwatchIcon,
	TextFontIcon,
} from "./icons";
import { useTheme } from "./use-theme";

function hexToRgba(hex: string, alpha: number): string {
	let c = (hex || "#38BDF8").replace("#", "").trim();
	if (c.length === 3)
		c = c
			.split("")
			.map((x) => x + x)
			.join("");
	const num = parseInt(c, 16);
	if (Number.isNaN(num) || c.length !== 6)
		return `rgba(56, 189, 248, ${alpha})`;
	const r = (num >> 16) & 255;
	const g = (num >> 8) & 255;
	const b = num & 255;
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getGlowValues(colorHex: string) {
	const c1 = hexToRgba(colorHex, 0.45);
	const c2 = hexToRgba(colorHex, 0.2);
	const c3 = hexToRgba(colorHex, 0.65);
	const c4 = hexToRgba(colorHex, 0.3);
	return {
		value: `0 0 20px ${c1}, 0 0 40px ${c2}`,
		sm: `0 0 10px ${c1}`,
		lg: `0 0 35px ${c3}, 0 0 70px ${c4}`,
	};
}

function cleanFontName(font?: string): string {
	if (!font) return "";
	return font.split(",")[0].trim().replace(/['"]/g, "").toLowerCase();
}

const curatedFontPairings = [
	{
		label: "Modern Sans",
		heading: "'Plus Jakarta Sans', sans-serif",
		body: "'Inter', sans-serif",
		desc: "Clean, high readability for modern web apps",
	},
	{
		label: "Code & Terminal",
		heading: "'Space Grotesk', sans-serif",
		body: "'JetBrains Mono', monospace",
		desc: "Developer & tech-centric aesthetic",
	},
	{
		label: "Tech Editorial",
		heading: "'Syne', sans-serif",
		body: "'Outfit', sans-serif",
		desc: "Bold expressive headers with geometric body",
	},
	{
		label: "Classic Serif",
		heading: "'Playfair Display', serif",
		body: "'Plus Jakarta Sans', sans-serif",
		desc: "Editorial elegance and luxury styling",
	},
	{
		label: "Minimalist Mono",
		heading: "'Fira Code', monospace",
		body: "'Inter', sans-serif",
		desc: "Clean monospace accent with neutral sans",
	},
];

export function ThemeStudioDrawer() {
	const {
		isStudioOpen,
		closeStudio,
		theme,
		mode,
		resolvedMode,
		tokens,
		themes,
		setTheme,
		setMode,
		setCustomTokens,
		resetTheme,
		hasCustomizations,
	} = useTheme();

	// Smooth unmount animation lifecycle
	const [isRendered, setIsRendered] = useState(isStudioOpen);
	const [isVisible, setIsVisible] = useState(false);

	// Fontsource search state
	const [fontSearch, setFontSearch] = useState("");
	const [fontCategory, setFontCategory] = useState("all");
	const [fontsList, setFontsList] = useState<FontsourceItem[]>(
		POPULAR_FONTSOURCE_FONTS,
	);
	const [isSearchingFonts, setIsSearchingFonts] = useState(false);

	const [activeTab, setActiveTab] = useState<
		"colors" | "typography" | "shadows"
	>("colors");
	const [glowColor, setGlowColor] = useState<string>(
		tokens.glowColor || tokens.primary || "#38BDF8",
	);

	useEffect(() => {
		if (tokens.glowColor && tokens.glowColor !== glowColor) {
			setGlowColor(tokens.glowColor);
		}
	}, [tokens.glowColor, glowColor]);

	// Preload fonts in typography tab so the preview displays the real typeface
	useEffect(() => {
		if (activeTab === "typography") {
			getFontCatalog().catch(() => {});
			curatedFontPairings.forEach((p) => {
				loadPreviewFont(p.heading);
				loadPreviewFont(p.body);
			});
			fontsList.slice(0, 30).forEach((f) => {
				loadPreviewFont(f.family);
			});
		}
	}, [activeTab, fontsList]);

	useEffect(() => {
		if (isStudioOpen) {
			setIsRendered(true);
			const frame1 = requestAnimationFrame(() => {
				const frame2 = requestAnimationFrame(() => {
					setIsVisible(true);
				});
				return () => cancelAnimationFrame(frame2);
			});
			return () => cancelAnimationFrame(frame1);
		} else {
			setIsVisible(false);
			const timeout = setTimeout(() => {
				setIsRendered(false);
			}, 300);
			return () => clearTimeout(timeout);
		}
	}, [isStudioOpen]);

	// Handle ESC key to close
	useEffect(() => {
		if (!isStudioOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeStudio();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isStudioOpen, closeStudio]);

	// Debounced search via Fontsource API
	useEffect(() => {
		if (!isStudioOpen || activeTab !== "typography") return;
		const timer = setTimeout(async () => {
			setIsSearchingFonts(true);
			try {
				const results = await searchFontsourceFonts(fontSearch, fontCategory);
				setFontsList(results);
				// Pre-load top results for preview
				results.slice(0, 6).forEach((f) => {
					loadPreviewFont(f.family);
				});
			} catch (err) {
				console.warn("Font search error:", err);
			} finally {
				setIsSearchingFonts(false);
			}
		}, 280);
		return () => clearTimeout(timer);
	}, [fontSearch, fontCategory, isStudioOpen, activeTab]);

	if (!isRendered) return null;

	const colorFields: { label: string; key: keyof BaseTokens }[] = [
		{ label: "Primary Accent", key: "primary" },
		{ label: "Secondary Accent", key: "secondary" },
		{ label: "Accent Highlight", key: "accent" },
		{ label: "Success State", key: "success" },
		{ label: "Danger State", key: "danger" },
		{ label: "Canvas Background", key: "canvas" },
		{ label: "Surface Background", key: "surface" },
		{ label: "Card Background", key: "card" },
		{ label: "Border Color", key: "border" },
		{ label: "Text Primary", key: "textPrimary" },
		{ label: "Text Muted", key: "textMuted" },
	];

	const currentGlow = getGlowValues(glowColor);
	const shadowPresets = [
		{
			label: "None",
			value: "none",
			sm: "none",
			lg: "none",
		},
		{
			label: "Neobrutalist (Hard)",
			value: "4px 4px 0px 0px #000000",
			sm: "2px 2px 0px 0px #000000",
			lg: "6px 6px 0px 0px #000000",
		},
		{
			label: "Subtle",
			value:
				"0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
			sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
			lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
		},
		{
			label: "Natural",
			value:
				"0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
			sm: "0 1px 2px 0 rgba(0, 0, 0, 0.1)",
			lg: "0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.15)",
		},
		{
			label: "Deep 3D",
			value:
				"0 16px 24px -4px rgba(0, 0, 0, 0.25), 0 6px 12px -3px rgba(0, 0, 0, 0.2)",
			sm: "0 2px 4px 0 rgba(0, 0, 0, 0.2)",
			lg: "0 24px 38px -6px rgba(0, 0, 0, 0.35), 0 10px 16px -4px rgba(0, 0, 0, 0.25)",
		},
		{
			label: "Neon Glow",
			value: currentGlow.value,
			sm: currentGlow.sm,
			lg: currentGlow.lg,
		},
	];

	const radiusPresets = [
		{ label: "Square", value: "0rem" },
		{ label: "Sharp", value: "0.25rem" },
		{ label: "Default", value: "0.5rem" },
		{ label: "Rounded", value: "0.75rem" },
		{ label: "Fluid", value: "1.25rem" },
	];

	const appearanceModes: {
		id: ColorMode;
		label: string;
		icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	}[] = [
		{ id: "light", label: "Light", icon: Sun02Icon },
		{ id: "dark", label: "Dark", icon: Moon02Icon },
		{ id: "system", label: "System", icon: ComputerIcon },
	];

	const applyFont = (family: string, target: "heading" | "body" | "both") => {
		loadFontsourceFont(family);
		const formatted = `'${family}', sans-serif`;
		const updates: Partial<BaseTokens> = {};
		if (target === "heading" || target === "both") {
			updates.fontHeading = formatted;
		}
		if (target === "body" || target === "both") {
			updates.fontBody = formatted;
		}
		setCustomTokens(updates);
	};

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label="Theme Studio"
			onClick={closeStudio}
			className="fixed inset-0 z-[99999] flex justify-end"
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 99999,
				display: "flex",
				justifyContent: "flex-end",
				backgroundColor: "rgba(0, 0, 0, 0.65)",
				backdropFilter: "blur(6px)",
				WebkitBackdropFilter: "blur(6px)",
				opacity: isVisible ? 1 : 0,
				pointerEvents: isVisible ? "auto" : "none",
				transition:
					"opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 300ms cubic-bezier(0.16, 1, 0.3, 1)",
			}}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-full max-w-[480px] h-full flex flex-col shadow-2xl border-l"
				style={{
					position: "relative",
					width: "100%",
					maxWidth: "480px",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					backgroundColor: "var(--surface)",
					fontFamily: "var(--font-body, system-ui, sans-serif)",
					borderColor: "var(--border)",
					color: "var(--text-primary)",
					borderLeft: "1px solid var(--border)",
					boxShadow: "-12px 0 36px rgba(0, 0, 0, 0.5)",
					overflow: "hidden",
					transform: isVisible ? "translateX(0)" : "translateX(100%)",
					transition:
						"transform 320ms cubic-bezier(0.16, 1, 0.3, 1), background-color 200ms ease, border-color 200ms ease, color 200ms ease",
				}}
			>
				{/* FIXED HEADER */}
				<div
					style={{
						padding: "16px 20px",
						borderBottom: "1px solid var(--border)",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						backgroundColor: "var(--surface)",
						flexShrink: 0,
						transition: "background-color 200ms ease, border-color 200ms ease",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
						<div
							style={{
								width: "36px",
								height: "36px",
								borderRadius: "8px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: "var(--card)",
								border: "1px solid var(--border)",
								color: "var(--primary)",
								transition: "all 200ms ease",
							}}
						>
							<SwatchIcon width={20} height={20} />
						</div>
						<div>
							<h2
								style={{
									margin: 0,
									fontSize: "15px",
									fontWeight: 600,
									letterSpacing: "-0.01em",
								}}
							>
								Theme Studio
							</h2>
							<p
								style={{
									margin: 0,
									fontSize: "12px",
									color: "var(--text-muted)",
								}}
							>
								Design system & live token engine
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={closeStudio}
						aria-label="Close Theme Studio"
						style={{
							background: "transparent",
							border: "none",
							color: "var(--text-muted)",
							cursor: "pointer",
							padding: "6px",
							borderRadius: "6px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							transition: "all 0.15s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.color = "var(--text-primary)";
							e.currentTarget.style.backgroundColor = "var(--card)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.color = "var(--text-muted)";
							e.currentTarget.style.backgroundColor = "transparent";
						}}
					>
						<CircleXIcon width={20} height={20} />
					</button>
				</div>

				{/* NAVIGATION TABS: COLORS / TYPOGRAPHY / SHADOWS */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						padding: "8px 20px",
						borderBottom: "1px solid var(--border)",
						backgroundColor: "var(--surface)",
						gap: "8px",
						flexShrink: 0,
					}}
				>
					<button
						type="button"
						onClick={() => setActiveTab("colors")}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "6px",
							padding: "7px 10px",
							fontSize: "12px",
							fontWeight: 600,
							borderRadius: "calc(var(--radius, 0.5rem) * 0.75)",
							border: "none",
							cursor: "pointer",
							backgroundColor:
								activeTab === "colors" ? "var(--card)" : "transparent",
							color:
								activeTab === "colors" ? "var(--primary)" : "var(--text-muted)",
							borderBottom:
								activeTab === "colors"
									? "2px solid var(--primary)"
									: "2px solid transparent",
							transition: "all 0.15s ease",
						}}
					>
						<SwatchIcon width={15} height={15} />
						<span>Colors</span>
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("typography")}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "6px",
							padding: "7px 10px",
							fontSize: "12px",
							fontWeight: 600,
							borderRadius: "calc(var(--radius, 0.5rem) * 0.75)",
							border: "none",
							cursor: "pointer",
							backgroundColor:
								activeTab === "typography" ? "var(--card)" : "transparent",
							color:
								activeTab === "typography"
									? "var(--primary)"
									: "var(--text-muted)",
							borderBottom:
								activeTab === "typography"
									? "2px solid var(--primary)"
									: "2px solid transparent",
							transition: "all 0.15s ease",
						}}
					>
						<TextFontIcon width={15} height={15} />
						<span>Typography</span>
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("shadows")}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "6px",
							padding: "7px 10px",
							fontSize: "12px",
							fontWeight: 600,
							borderRadius: "calc(var(--radius, 0.5rem) * 0.75)",
							border: "none",
							cursor: "pointer",
							backgroundColor:
								activeTab === "shadows" ? "var(--card)" : "transparent",
							color:
								activeTab === "shadows"
									? "var(--primary)"
									: "var(--text-muted)",
							borderBottom:
								activeTab === "shadows"
									? "2px solid var(--primary)"
									: "2px solid transparent",
							transition: "all 0.15s ease",
						}}
					>
						<Layers01Icon width={15} height={15} />
						<span>Shadows</span>
					</button>
				</div>

				{/* SCROLLABLE BODY */}
				<div
					style={{
						flex: 1,
						overflowY: "auto",
						padding: "20px",
						display: "flex",
						flexDirection: "column",
						gap: "24px",
					}}
				>
					{/* TAB 1: COLORS & PRESETS */}
					{activeTab === "colors" && (
						<>
							{/* SECTION: APPEARANCE MODE */}
							<div>
								<div
									style={{
										fontSize: "11px",
										fontWeight: 700,
										letterSpacing: "0.06em",
										textTransform: "uppercase",
										color: "var(--text-muted)",
										marginBottom: "8px",
									}}
								>
									Appearance Mode
								</div>
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "repeat(3, 1fr)",
										gap: "6px",
										padding: "4px",
										backgroundColor: "var(--card)",
										borderRadius: "var(--radius, 0.5rem)",
										border: "1px solid var(--border)",
										transition: "all 200ms ease",
									}}
								>
									{appearanceModes.map(({ id: m, label, icon: ModeIcon }) => {
										const isActive = mode === m;
										const activeFgColor =
											resolvedMode === "dark" && m !== "light"
												? "#000000"
												: "#FFFFFF";
										return (
											<button
												key={m}
												type="button"
												onClick={() => setMode(m)}
												style={{
													padding: "8px 10px",
													fontSize: "12px",
													fontWeight: 600,
													borderRadius: "calc(var(--radius, 0.5rem) * 0.75)",
													border: "none",
													cursor: "pointer",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													gap: "6px",
													transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
													backgroundColor: isActive
														? "var(--primary)"
														: "transparent",
													color: isActive ? activeFgColor : "var(--text-muted)",
													boxShadow: isActive
														? "0 2px 8px rgba(0, 0, 0, 0.15)"
														: "none",
												}}
											>
												<ModeIcon
													width={16}
													height={16}
													color={isActive ? activeFgColor : "currentColor"}
													stroke="currentColor"
												/>
												<span>{label}</span>
											</button>
										);
									})}
								</div>
							</div>

							{/* SECTION: THEME PRESETS */}
							<div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										marginBottom: "8px",
									}}
								>
									<span
										style={{
											fontSize: "11px",
											fontWeight: 700,
											letterSpacing: "0.06em",
											textTransform: "uppercase",
											color: "var(--text-muted)",
										}}
									>
										Theme Presets
									</span>
									<span
										style={{
											fontSize: "11px",
											color: "var(--primary)",
											fontWeight: 600,
										}}
									>
										{themes.length} Presets
									</span>
								</div>
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
										gap: "8px",
										maxHeight: "240px",
										overflowY: "auto",
										paddingRight: "2px",
									}}
								>
									{themes.map((t) => {
										const isSelected = t.id === theme;
										const previewTokens =
											resolvedMode === "light" && t.lightTokens
												? { ...t.tokens, ...t.lightTokens }
												: resolvedMode === "dark" && t.darkTokens
													? { ...t.tokens, ...t.darkTokens }
													: t.tokens;

										return (
											<button
												key={t.id}
												type="button"
												onClick={() => setTheme(t.id)}
												style={{
													textAlign: "left",
													padding: "10px",
													borderRadius: "var(--radius, 0.5rem)",
													cursor: "pointer",
													display: "flex",
													flexDirection: "column",
													justifyContent: "space-between",
													gap: "8px",
													border: isSelected
														? "1.5px solid var(--primary)"
														: "1px solid var(--border)",
													backgroundColor: "var(--card)",
													color: "var(--text-primary)",
													transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
												}}
											>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between",
													}}
												>
													<span
														style={{
															fontSize: "12px",
															fontWeight: 600,
															whiteSpace: "nowrap",
															overflow: "hidden",
															textOverflow: "ellipsis",
														}}
													>
														{t.name}
													</span>
													{isSelected && (
														<div
															style={{
																color: "var(--primary)",
																display: "flex",
																alignItems: "center",
															}}
														>
															<CheckIcon width={14} height={14} />
														</div>
													)}
												</div>
												{/* Swatch dots */}
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "4px",
													}}
												>
													{[
														previewTokens.canvas,
														previewTokens.primary,
														previewTokens.secondary,
														previewTokens.accent,
													].map((c, i) => (
														<span
															key={`${c}-${i}`}
															style={{
																width: "12px",
																height: "12px",
																borderRadius: "50%",
																backgroundColor: c,
																border: "1px solid rgba(255, 255, 255, 0.15)",
																boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
															}}
														/>
													))}
												</div>
											</button>
										);
									})}
								</div>
							</div>

							{/* SECTION: COLOR TOKENS */}
							<div>
								<div
									style={{
										fontSize: "11px",
										fontWeight: 700,
										letterSpacing: "0.06em",
										textTransform: "uppercase",
										color: "var(--text-muted)",
										marginBottom: "8px",
									}}
								>
									Color Tokens
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "6px",
										backgroundColor: "var(--card)",
										borderRadius: "8px",
										padding: "8px",
										border: "1px solid var(--border)",
										transition: "all 200ms ease",
									}}
								>
									{colorFields.map((field) => {
										const currentColor = (
											(tokens[field.key] as string) || "#000000"
										).trim();
										const activePreset =
											themes.find((t) => t.id === theme) || themes[0];
										const defaultTokens =
											resolvedMode === "light" && activePreset?.lightTokens
												? {
														...activePreset.tokens,
														...activePreset.lightTokens,
													}
												: resolvedMode === "dark" && activePreset?.darkTokens
													? {
															...activePreset.tokens,
															...activePreset.darkTokens,
														}
													: activePreset?.tokens || {};
										const defaultColor = (
											(defaultTokens[field.key] as string) || ""
										).trim();
										const isModified = Boolean(
											currentColor &&
												defaultColor &&
												currentColor.toLowerCase() !==
													defaultColor.toLowerCase(),
										);

										return (
											<div
												key={field.key}
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													padding: "6px 8px",
													borderRadius: "6px",
													backgroundColor: isModified
														? "rgba(var(--primary-rgb, 56, 189, 248), 0.05)"
														: "rgba(255, 255, 255, 0.02)",
													border: isModified
														? "1px solid rgba(var(--primary-rgb, 56, 189, 248), 0.2)"
														: "1px solid transparent",
													transition: "all 0.15s ease",
												}}
											>
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "6px",
													}}
												>
													<label
														htmlFor={`color-input-${field.key}`}
														style={{
															fontSize: "12px",
															fontWeight: isModified ? 600 : 500,
															color: isModified
																? "var(--primary)"
																: "var(--text-primary)",
														}}
													>
														{field.label}
													</label>
													{isModified && (
														<span
															style={{
																fontSize: "9px",
																fontWeight: 700,
																padding: "1px 4px",
																borderRadius: "3px",
																backgroundColor: "var(--primary)",
																color: "var(--canvas)",
															}}
														>
															MOD
														</span>
													)}
												</div>

												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "6px",
													}}
												>
													<input
														type="text"
														value={currentColor.toUpperCase()}
														onChange={(e) => {
															const val = e.target.value.trim();
															setCustomTokens({ [field.key]: val });
														}}
														style={{
															width: "74px",
															fontSize: "11px",
															fontFamily: "monospace",
															color: "var(--text-primary)",
															backgroundColor: "var(--surface)",
															border: isModified
																? "1px solid var(--primary)"
																: "1px solid var(--border)",
															borderRadius: "4px",
															padding: "2px 6px",
															textAlign: "center",
														}}
													/>
													<div
														style={{
															position: "relative",
															width: "24px",
															height: "24px",
															borderRadius: "6px",
															overflow: "hidden",
															border: "1px solid var(--border)",
															boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
															backgroundColor: currentColor,
															flexShrink: 0,
														}}
													>
														<input
															id={`color-input-${field.key}`}
															type="color"
															value={
																currentColor.startsWith("#")
																	? currentColor
																	: "#38BDF8"
															}
															onChange={(e) => {
																setCustomTokens({
																	[field.key]: e.target.value,
																});
															}}
															style={{
																position: "absolute",
																top: "-8px",
																left: "-8px",
																width: "40px",
																height: "40px",
																border: "none",
																cursor: "pointer",
																padding: 0,
																opacity: 0,
															}}
														/>
													</div>

													{/* Individual Reset Button for this color token */}
													{isModified && (
														<button
															type="button"
															title={`Reset ${field.label} to default (${defaultColor})`}
															onClick={() => {
																if (defaultColor) {
																	setCustomTokens({
																		[field.key]: defaultColor,
																	});
																}
															}}
															style={{
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
																width: "24px",
																height: "24px",
																borderRadius: "4px",
																border: "1px solid var(--border)",
																backgroundColor: "var(--surface)",
																color: "var(--primary)",
																cursor: "pointer",
																padding: 0,
																flexShrink: 0,
																transition: "all 0.15s ease",
															}}
														>
															<Setup01Icon width={13} height={13} />
														</button>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>

							{/* SECTION: BORDER RADIUS */}
							<div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										marginBottom: "10px",
									}}
								>
									<span
										style={{
											fontSize: "12px",
											fontWeight: 700,
											letterSpacing: "0.08em",
											textTransform: "uppercase",
											color: "var(--text-primary)",
										}}
									>
										Border Radius
									</span>
									<span
										style={{
											fontSize: "11px",
											fontFamily: "monospace",
											fontWeight: 700,
											padding: "2px 8px",
											borderRadius: "var(--radius, 0.5rem)",
											backgroundColor: "var(--card)",
											color: "var(--primary)",
											border: "1px solid var(--border)",
										}}
									>
										{tokens.radius || "0.5rem"}
									</span>
								</div>
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "repeat(5, 1fr)",
										gap: "6px",
									}}
								>
									{radiusPresets.map((r) => {
										const isActive = tokens.radius === r.value;
										return (
											<button
												key={r.value}
												type="button"
												onClick={() => setCustomTokens({ radius: r.value })}
												style={{
													padding: "10px 4px",
													fontSize: "11px",
													borderRadius: "var(--radius, 0.5rem)",
													cursor: "pointer",
													border: isActive
														? "2px solid var(--primary)"
														: "1px solid var(--border)",
													backgroundColor: isActive
														? "var(--primary)"
														: "var(--card)",
													color: isActive
														? "var(--canvas)"
														: "var(--text-primary)",
													boxShadow: isActive
														? "0 0 0 2px var(--surface), 0 4px 12px rgba(0,0,0,0.35)"
														: "none",
													transition: "all 0.15s ease",
													textAlign: "center",
												}}
											>
												<div
													style={{
														fontWeight: 700,
														fontSize: "11px",
														color: isActive
															? "var(--canvas)"
															: "var(--text-primary)",
													}}
												>
													{r.label}
												</div>
												<div
													style={{
														fontSize: "10px",
														fontFamily: "monospace",
														fontWeight: 600,
														opacity: isActive ? 1 : 0.8,
														marginTop: "3px",
														color: isActive
															? "var(--canvas)"
															: "var(--text-muted)",
													}}
												>
													{r.value}
												</div>
											</button>
										);
									})}
								</div>
							</div>
						</>
					)}

					{/* TAB 2: TYPOGRAPHY (POWERED BY FONTSOURCE.ORG) */}
					{activeTab === "typography" && (
						<>
							{/* CURRENT ACTIVE FONTS INSPECTOR */}
							<div
								style={{
									padding: "14px",
									backgroundColor: "var(--card)",
									borderRadius: "var(--radius, 0.5rem)",
									border: "1.5px solid var(--primary)",
									display: "flex",
									flexDirection: "column",
									gap: "10px",
									boxShadow: "var(--shadow-sm)",
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "6px",
										}}
									>
										<span
											style={{
												fontSize: "10px",
												fontWeight: 800,
												padding: "2px 6px",
												borderRadius: "4px",
												backgroundColor: "var(--primary)",
												color: "var(--canvas)",
											}}
										>
											H
										</span>
										<span
											style={{
												fontSize: "11px",
												fontWeight: 700,
												textTransform: "uppercase",
												color: "var(--text-primary)",
											}}
										>
											Heading Font
										</span>
									</div>
									<span
										style={{
											fontSize: "12px",
											fontWeight: 700,
											color: "var(--primary)",
											fontFamily: tokens.fontHeading || "inherit",
										}}
									>
										{cleanFontName(tokens.fontHeading) || "Space Grotesk"}
									</span>
								</div>

								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "6px",
										}}
									>
										<span
											style={{
												fontSize: "10px",
												fontWeight: 800,
												padding: "2px 6px",
												borderRadius: "4px",
												backgroundColor: "var(--primary)",
												color: "var(--canvas)",
											}}
										>
											B
										</span>
										<span
											style={{
												fontSize: "11px",
												fontWeight: 700,
												textTransform: "uppercase",
												color: "var(--text-primary)",
											}}
										>
											Body Font
										</span>
									</div>
									<span
										style={{
											fontSize: "12px",
											fontWeight: 700,
											color: "var(--primary)",
											fontFamily: tokens.fontBody || "inherit",
										}}
									>
										{cleanFontName(tokens.fontBody) || "Inter"}
									</span>
								</div>
							</div>

							{/* CURATED FONT PAIRINGS */}
							<div>
								<div
									style={{
										fontSize: "11px",
										fontWeight: 700,
										letterSpacing: "0.06em",
										textTransform: "uppercase",
										color: "var(--text-primary)",
										marginBottom: "8px",
									}}
								>
									Curated Pairings
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "8px",
									}}
								>
									{curatedFontPairings.map((pair) => {
										const isPairActive =
											cleanFontName(tokens.fontHeading) ===
												cleanFontName(pair.heading) &&
											cleanFontName(tokens.fontBody) ===
												cleanFontName(pair.body);

										return (
											<button
												key={pair.label}
												type="button"
												onClick={() => {
													loadFontsourceFont(pair.heading);
													loadFontsourceFont(pair.body);
													setCustomTokens({
														fontHeading: pair.heading,
														fontBody: pair.body,
													});
												}}
												style={{
													padding: "10px 12px",
													textAlign: "left",
													borderRadius: "var(--radius, 0.5rem)",
													border: isPairActive
														? "2px solid var(--primary)"
														: "1px solid var(--border)",
													backgroundColor: isPairActive
														? "var(--surface)"
														: "var(--card)",
													color: "var(--text-primary)",
													cursor: "pointer",
													display: "flex",
													flexDirection: "column",
													gap: "4px",
													boxShadow: isPairActive
														? "0 0 0 1px var(--primary)"
														: "none",
													transition: "all 0.15s ease",
												}}
											>
												<div
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
													}}
												>
													<span
														style={{
															fontSize: "12px",
															fontWeight: 700,
															color: isPairActive
																? "var(--primary)"
																: "var(--text-primary)",
														}}
													>
														{pair.label}
													</span>
													{isPairActive ? (
														<span
															style={{
																fontSize: "10px",
																fontWeight: 700,
																color: "var(--primary)",
																display: "flex",
																alignItems: "center",
																gap: "3px",
															}}
														>
															<CheckIcon width={12} height={12} /> Active
															Pairing
														</span>
													) : (
														<span
															style={{
																fontSize: "10px",
																color: "var(--text-muted)",
															}}
														>
															Apply Pairing
														</span>
													)}
												</div>
												<div
													style={{
														fontSize: "11px",
														color: "var(--text-muted)",
													}}
												>
													{pair.desc}
												</div>
											</button>
										);
									})}
								</div>
							</div>

							{/* FONTSOURCE LIVE SEARCH */}
							<div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										marginBottom: "8px",
									}}
								>
									<span
										style={{
											fontSize: "11px",
											fontWeight: 700,
											letterSpacing: "0.06em",
											textTransform: "uppercase",
											color: "var(--text-primary)",
										}}
									>
										Search Fontsource.org
									</span>
									<span
										style={{
											fontSize: "10px",
											fontWeight: 600,
											color: "var(--primary)",
										}}
									>
										1,500+ Open Fonts
									</span>
								</div>

								{/* Search input bar */}
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "8px",
										padding: "8px 12px",
										borderRadius: "var(--radius, 0.5rem)",
										backgroundColor: "var(--card)",
										border: "1px solid var(--border)",
										marginBottom: "8px",
									}}
								>
									<Search01Icon width={16} height={16} />
									<input
										type="text"
										value={fontSearch}
										onChange={(e) => setFontSearch(e.target.value)}
										placeholder="Search fonts (e.g. Space Grotesk, Syne, Roboto)..."
										style={{
											flex: 1,
											backgroundColor: "transparent",
											border: "none",
											outline: "none",
											fontSize: "12px",
											color: "var(--text-primary)",
										}}
									/>
									{isSearchingFonts && (
										<span
											style={{ fontSize: "10px", color: "var(--text-muted)" }}
										>
											Loading...
										</span>
									)}
								</div>

								{/* Category filters */}
								<div
									style={{
										display: "flex",
										gap: "6px",
										overflowX: "auto",
										paddingBottom: "6px",
										marginBottom: "8px",
									}}
								>
									{["all", "sans-serif", "serif", "monospace", "display"].map(
										(cat) => (
											<button
												key={cat}
												type="button"
												onClick={() => setFontCategory(cat)}
												style={{
													padding: "5px 10px",
													fontSize: "10px",
													fontWeight: 700,
													textTransform: "capitalize",
													borderRadius: "calc(var(--radius, 0.5rem) * 0.75)",
													border:
														fontCategory === cat
															? "1.5px solid var(--primary)"
															: "1px solid var(--border)",
													backgroundColor:
														fontCategory === cat
															? "var(--primary)"
															: "var(--card)",
													color:
														fontCategory === cat
															? "var(--canvas)"
															: "var(--text-primary)",
													cursor: "pointer",
													whiteSpace: "nowrap",
												}}
											>
												{cat}
											</button>
										),
									)}
								</div>

								{/* Fonts List with Clear Selection Highlighting */}
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "6px",
										maxHeight: "280px",
										overflowY: "auto",
									}}
								>
									{fontsList.length === 0 ? (
										<div
											style={{
												padding: "24px 16px",
												textAlign: "center",
												borderRadius: "var(--radius, 0.5rem)",
												backgroundColor: "var(--card)",
												border: "1px dashed var(--border)",
												color: "var(--text-muted)",
												fontSize: "12px",
											}}
										>
											No fonts found matching "{fontSearch}"
										</div>
									) : (
										fontsList.map((f) => {
											const isHeading =
												cleanFontName(tokens.fontHeading) ===
												cleanFontName(f.family);
											const isBody =
												cleanFontName(tokens.fontBody) ===
												cleanFontName(f.family);
											const isBoth = isHeading && isBody;
											const hasActiveRole = isHeading || isBody;

											return (
												<div
													key={f.id}
													style={{
														display: "flex",
														alignItems: "center",
														justifyContent: "space-between",
														padding: "8px 12px",
														borderRadius: "var(--radius, 0.5rem)",
														backgroundColor: hasActiveRole
															? "var(--surface)"
															: "var(--card)",
														border: hasActiveRole
															? "2px solid var(--primary)"
															: "1px solid var(--border)",
														boxShadow: hasActiveRole
															? "0 0 0 1px var(--primary)"
															: "none",
														transition: "all 0.15s ease",
													}}
												>
													<div
														style={{ minWidth: 0, flex: 1, marginRight: "8px" }}
													>
														<div
															style={{
																display: "flex",
																alignItems: "center",
																gap: "6px",
															}}
														>
															<span
																style={{
																	fontSize: "13px",
																	fontWeight: hasActiveRole ? 700 : 500,
																	fontFamily: `'${f.family}', sans-serif`,
																	color: hasActiveRole
																		? "var(--primary)"
																		: "var(--text-primary)",
																}}
															>
																{f.family}
															</span>
															{isBoth ? (
																<span
																	style={{
																		fontSize: "9px",
																		fontWeight: 800,
																		padding: "1px 5px",
																		borderRadius: "3px",
																		backgroundColor: "var(--primary)",
																		color: "var(--canvas)",
																	}}
																>
																	HEAD & BODY
																</span>
															) : isHeading ? (
																<span
																	style={{
																		fontSize: "9px",
																		fontWeight: 800,
																		padding: "1px 5px",
																		borderRadius: "3px",
																		backgroundColor: "var(--primary)",
																		color: "var(--canvas)",
																	}}
																>
																	HEADING
																</span>
															) : isBody ? (
																<span
																	style={{
																		fontSize: "9px",
																		fontWeight: 800,
																		padding: "1px 5px",
																		borderRadius: "3px",
																		backgroundColor: "var(--primary)",
																		color: "var(--canvas)",
																	}}
																>
																	BODY
																</span>
															) : null}
														</div>
														<div
															style={{
																fontSize: "10px",
																color: "var(--text-muted)",
															}}
														>
															{f.category} •{" "}
															{f.variable
																? "Variable"
																: `${f.weights ? f.weights.length : 1} weights`}
														</div>
														<div
															style={{
																fontSize: "11px",
																fontFamily: `'${f.family}', sans-serif`,
																color: "var(--text-muted)",
																marginTop: "3px",
																letterSpacing: "0.02em",
															}}
														>
															Sphinx of black quartz, judge my vow
														</div>
													</div>

													<div
														style={{
															display: "flex",
															gap: "4px",
															flexShrink: 0,
														}}
													>
														<button
															type="button"
															onClick={() => applyFont(f.family, "heading")}
															title={
																isHeading
																	? "Active as Heading Font"
																	: "Set as Heading Font"
															}
															style={{
																padding: "4px 8px",
																fontSize: "10px",
																fontWeight: 800,
																borderRadius:
																	"calc(var(--radius, 0.5rem) * 0.5)",
																border: isHeading
																	? "1.5px solid var(--primary)"
																	: "1px solid var(--border)",
																backgroundColor: isHeading
																	? "var(--primary)"
																	: "var(--card)",
																color: isHeading
																	? "var(--canvas)"
																	: "var(--text-primary)",
																cursor: "pointer",
																transition: "all 0.15s ease",
															}}
														>
															H
														</button>
														<button
															type="button"
															onClick={() => applyFont(f.family, "body")}
															title={
																isBody
																	? "Active as Body Font"
																	: "Set as Body Font"
															}
															style={{
																padding: "4px 8px",
																fontSize: "10px",
																fontWeight: 800,
																borderRadius:
																	"calc(var(--radius, 0.5rem) * 0.5)",
																border: isBody
																	? "1.5px solid var(--primary)"
																	: "1px solid var(--border)",
																backgroundColor: isBody
																	? "var(--primary)"
																	: "var(--card)",
																color: isBody
																	? "var(--canvas)"
																	: "var(--text-primary)",
																cursor: "pointer",
																transition: "all 0.15s ease",
															}}
														>
															B
														</button>
														<button
															type="button"
															onClick={() => applyFont(f.family, "both")}
															title="Set for Both Heading and Body"
															style={{
																padding: "4px 8px",
																fontSize: "10px",
																fontWeight: 800,
																borderRadius:
																	"calc(var(--radius, 0.5rem) * 0.5)",
																border: isBoth
																	? "1.5px solid var(--primary)"
																	: "1px solid var(--border)",
																backgroundColor: isBoth
																	? "var(--primary)"
																	: "transparent",
																color: isBoth
																	? "var(--canvas)"
																	: "var(--text-primary)",
																cursor: "pointer",
																transition: "all 0.15s ease",
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
						</>
					)}

					{/* TAB 3: SHADOW CONTROLS */}
					{activeTab === "shadows" && (
						<>
							{/* SECTION 1: TACTILE ON-HOVER PHYSICS TOGGLE */}
							<div
								style={{
									padding: "16px",
									borderRadius: "var(--radius, 0.5rem)",
									backgroundColor: "var(--card)",
									border:
										tokens.tactile === "true"
											? "2px solid var(--primary)"
											: "1px solid var(--border)",
									boxShadow:
										tokens.tactile === "true"
											? "0 0 0 1px var(--primary)"
											: "none",
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									gap: "12px",
									transition: "all 0.15s ease",
								}}
							>
								<div>
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "6px",
										}}
									>
										<span
											style={{
												fontSize: "13px",
												fontWeight: 700,
												color: "var(--text-primary)",
											}}
										>
											Tactile On-Hover Physics
										</span>
										{tokens.tactile === "true" && (
											<span
												style={{
													fontSize: "9px",
													fontWeight: 800,
													padding: "2px 6px",
													borderRadius: "3px",
													backgroundColor: "var(--primary)",
													color: "var(--canvas)",
													letterSpacing: "0.05em",
												}}
											>
												ACTIVE
											</span>
										)}
									</div>
									<div
										style={{
											fontSize: "11px",
											color: "var(--text-muted)",
											marginTop: "2px",
										}}
									>
										Mechanical 2px hover displacement & 4px active press click
										physics on buttons & cards
									</div>
								</div>

								{/* Sleek Toggle Switch */}
								<button
									type="button"
									role="switch"
									aria-checked={tokens.tactile === "true"}
									onClick={() => {
										const next = tokens.tactile === "true" ? "false" : "true";
										setCustomTokens({ tactile: next });
									}}
									style={{
										width: "48px",
										height: "26px",
										borderRadius: "13px",
										backgroundColor:
											tokens.tactile === "true"
												? "var(--primary)"
												: "var(--surface)",
										border: "1px solid var(--border)",
										position: "relative",
										cursor: "pointer",
										transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
										padding: 0,
										outline: "none",
										flexShrink: 0,
									}}
								>
									<span
										style={{
											position: "absolute",
											top: "2px",
											left: tokens.tactile === "true" ? "24px" : "2px",
											width: "20px",
											height: "20px",
											borderRadius: "50%",
											backgroundColor:
												tokens.tactile === "true"
													? "var(--canvas)"
													: "var(--text-muted)",
											transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
											boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
										}}
									/>
								</button>
							</div>

							{/* SECTION 2: GLOW COLOR SELECTOR & PICKER */}
							<div
								style={{
									padding: "16px",
									borderRadius: "var(--radius, 0.5rem)",
									backgroundColor: "var(--card)",
									border: "1px solid var(--border)",
									display: "flex",
									flexDirection: "column",
									gap: "12px",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<div>
										<span
											style={{
												fontSize: "12px",
												fontWeight: 700,
												letterSpacing: "0.06em",
												textTransform: "uppercase",
												color: "var(--text-primary)",
											}}
										>
											Glow Color Picker
										</span>
										<div
											style={{
												fontSize: "11px",
												color: "var(--text-muted)",
												marginTop: "2px",
											}}
										>
											Choose or customize the color of the Neon Glow shadow
										</div>
									</div>
									<div
										style={{
											width: "24px",
											height: "24px",
											borderRadius: "50%",
											backgroundColor: glowColor,
											border: "2px solid var(--border)",
											boxShadow: `0 0 12px ${glowColor}`,
										}}
									/>
								</div>

								{/* Preset Glow Color Chips */}
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										gap: "6px",
										alignItems: "center",
									}}
								>
									{[
										{
											label: "Theme Primary",
											color: tokens.primary || "#38BDF8",
										},
										{
											label: "Theme Accent",
											color: tokens.accent || "#34D399",
										},
										{ label: "Cyan", color: "#00F0FF" },
										{ label: "Sky Blue", color: "#38BDF8" },
										{ label: "Violet", color: "#A855F7" },
										{ label: "Hot Pink", color: "#EC4899" },
										{ label: "Emerald", color: "#10B981" },
										{ label: "Gold", color: "#F59E0B" },
										{ label: "Crimson", color: "#EF4444" },
									].map((chip) => {
										const isGlowActive =
											glowColor.toLowerCase() === chip.color.toLowerCase();
										return (
											<button
												key={chip.label}
												type="button"
												onClick={() => {
													setGlowColor(chip.color);
													const glow = getGlowValues(chip.color);
													setCustomTokens({
														shadow: glow.value,
														shadowSm: glow.sm,
														shadowLg: glow.lg,
														glowColor: chip.color,
													});
												}}
												style={{
													display: "flex",
													alignItems: "center",
													gap: "5px",
													padding: "5px 9px",
													borderRadius: "calc(var(--radius, 0.5rem) * 0.75)",
													border: isGlowActive
														? "1.5px solid var(--primary)"
														: "1px solid var(--border)",
													backgroundColor: isGlowActive
														? "var(--surface)"
														: "var(--card)",
													color: "var(--text-primary)",
													fontSize: "11px",
													fontWeight: 600,
													cursor: "pointer",
												}}
											>
												<span
													style={{
														width: "10px",
														height: "10px",
														borderRadius: "50%",
														backgroundColor: chip.color,
														boxShadow: `0 0 6px ${chip.color}`,
													}}
												/>
												{chip.label}
											</button>
										);
									})}

									{/* Custom color input */}
									<label
										style={{
											display: "flex",
											alignItems: "center",
											gap: "4px",
											padding: "5px 9px",
											borderRadius: "calc(var(--radius, 0.5rem) * 0.75)",
											border: "1px solid var(--border)",
											backgroundColor: "var(--surface)",
											fontSize: "11px",
											fontWeight: 600,
											cursor: "pointer",
											color: "var(--text-primary)",
										}}
									>
										Custom
										<input
											type="color"
											value={glowColor}
											onChange={(e) => {
												const val = e.target.value;
												setGlowColor(val);
												const glow = getGlowValues(val);
												setCustomTokens({
													shadow: glow.value,
													shadowSm: glow.sm,
													shadowLg: glow.lg,
													glowColor: val,
												});
											}}
											style={{
												width: "18px",
												height: "18px",
												padding: 0,
												border: "none",
												borderRadius: "3px",
												cursor: "pointer",
												backgroundColor: "transparent",
											}}
										/>
									</label>
								</div>
							</div>

							{/* SECTION 3: SHADOW ELEVATION PRESETS */}
							<div>
								<div
									style={{
										fontSize: "11px",
										fontWeight: 700,
										letterSpacing: "0.06em",
										textTransform: "uppercase",
										color: "var(--text-primary)",
										marginBottom: "8px",
									}}
								>
									Shadow Elevation Presets
								</div>
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "repeat(2, 1fr)",
										gap: "8px",
									}}
								>
									{shadowPresets.map((sp) => {
										const isSelected = tokens.shadow === sp.value;
										return (
											<button
												key={sp.label}
												type="button"
												onClick={() => {
													setCustomTokens({
														shadow: sp.value,
														shadowSm: sp.sm,
														shadowLg: sp.lg,
													});
												}}
												style={{
													padding: "12px",
													borderRadius: "var(--radius, 0.5rem)",
													border: isSelected
														? "2px solid var(--primary)"
														: "1px solid var(--border)",
													backgroundColor: isSelected
														? "var(--surface)"
														: "var(--card)",
													color: "var(--text-primary)",
													cursor: "pointer",
													textAlign: "left",
													display: "flex",
													flexDirection: "column",
													gap: "6px",
													boxShadow: isSelected
														? sp.value !== "none"
															? sp.value
															: "none"
														: "none",
													transition: "all 0.15s ease",
												}}
											>
												<div
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
													}}
												>
													<span
														style={{
															fontSize: "12px",
															fontWeight: 700,
															color: isSelected
																? "var(--primary)"
																: "var(--text-primary)",
														}}
													>
														{sp.label}
													</span>
													{isSelected && (
														<CheckIcon
															width={14}
															height={14}
															color="var(--primary)"
														/>
													)}
												</div>
												<div
													style={{
														fontSize: "10px",
														color: "var(--text-muted)",
													}}
												>
													{sp.label === "Neon Glow"
														? "Dynamic glow with chosen color"
														: sp.value === "none"
															? "Flat / No elevation"
															: "Multi-layer ambient depth"}
												</div>
											</button>
										);
									})}
								</div>
							</div>

							{/* SECTION 4: LIVE SHADOW PREVIEW BOX */}
							<div>
								<div
									style={{
										fontSize: "11px",
										fontWeight: 700,
										letterSpacing: "0.06em",
										textTransform: "uppercase",
										color: "var(--text-primary)",
										marginBottom: "8px",
									}}
								>
									Live Shadow Preview
								</div>
								<div
									style={{
										padding: "24px",
										borderRadius: "var(--radius, 0.5rem)",
										backgroundColor: "var(--card)",
										border: "1px solid var(--border)",
										boxShadow: tokens.shadow || "none",
										textAlign: "center",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: "8px",
										transition: "box-shadow 0.25s ease",
									}}
								>
									<Layers01Icon width={28} height={28} color="var(--primary)" />
									<div
										style={{
											fontSize: "13px",
											fontWeight: 700,
											color: "var(--text-primary)",
										}}
									>
										Active Shadow Rendering
									</div>
									<div
										style={{
											fontSize: "11px",
											color: "var(--text-muted)",
											fontFamily: "monospace",
										}}
									>
										var(--shadow)
									</div>
								</div>
							</div>

							{/* SECTION 5: DIRECT SHADOW VALUE EDITORS */}
							<div>
								<div
									style={{
										fontSize: "11px",
										fontWeight: 700,
										letterSpacing: "0.06em",
										textTransform: "uppercase",
										color: "var(--text-primary)",
										marginBottom: "8px",
									}}
								>
									Custom Shadow Variables
								</div>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "8px",
									}}
								>
									{[
										{
											label: "Default Shadow (--shadow)",
											key: "shadow" as const,
										},
										{
											label: "Small Shadow (--shadow-sm)",
											key: "shadowSm" as const,
										},
										{
											label: "Large Shadow (--shadow-lg)",
											key: "shadowLg" as const,
										},
									].map((field) => (
										<div
											key={field.key}
											style={{
												padding: "8px 10px",
												borderRadius: "var(--radius, 0.5rem)",
												backgroundColor: "var(--card)",
												border: "1px solid var(--border)",
												display: "flex",
												flexDirection: "column",
												gap: "4px",
											}}
										>
											<label
												style={{
													fontSize: "11px",
													fontWeight: 700,
													color: "var(--text-primary)",
												}}
											>
												{field.label}
											</label>
											<input
												type="text"
												value={(tokens[field.key] as string) || ""}
												onChange={(e) =>
													setCustomTokens({ [field.key]: e.target.value })
												}
												placeholder="e.g. 0 10px 15px -3px rgba(0,0,0,0.4)"
												style={{
													fontSize: "11px",
													fontFamily: "monospace",
													padding: "6px 8px",
													borderRadius: "calc(var(--radius, 0.5rem) * 0.5)",
													backgroundColor: "var(--surface)",
													color: "var(--text-primary)",
													border: "1px solid var(--border)",
													outline: "none",
												}}
											/>
										</div>
									))}
								</div>
							</div>
						</>
					)}
				</div>

				{/* FIXED FOOTER */}
				<div
					style={{
						padding: "16px 20px",
						borderTop: "1px solid var(--border)",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						backgroundColor: "var(--surface)",
						flexShrink: 0,
						transition: "background-color 200ms ease, border-color 200ms ease",
					}}
				>
					<button
						type="button"
						onClick={resetTheme}
						disabled={!hasCustomizations}
						style={{
							display: "flex",
							alignItems: "center",
							gap: "6px",
							padding: "8px 12px",
							fontSize: "12px",
							fontWeight: 600,
							borderRadius: "var(--radius, 0.5rem)",
							border: "1px solid var(--border)",
							backgroundColor: "var(--card)",
							color: hasCustomizations
								? "var(--text-primary)"
								: "var(--text-muted)",
							cursor: hasCustomizations ? "pointer" : "not-allowed",
							opacity: hasCustomizations ? 1 : 0.5,
							transition: "all 0.15s ease",
						}}
					>
						<Setup01Icon width={16} height={16} />
						<span>Reset Defaults</span>
					</button>

					<button
						type="button"
						onClick={closeStudio}
						style={{
							padding: "8px 20px",
							fontSize: "12px",
							fontWeight: 600,
							borderRadius: "var(--radius, 0.5rem)",
							border: "none",
							backgroundColor: "var(--primary)",
							color: resolvedMode === "dark" ? "#000000" : "#FFFFFF",
							cursor: "pointer",
							boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
							transition: "all 0.15s ease",
						}}
					>
						Done
					</button>
				</div>
			</div>
		</div>
	);
}

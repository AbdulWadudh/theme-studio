"use client";

import { useState } from "react";
import { useTheme } from "./use-theme";

export interface AllInOneCardProps {
	title?: string;
	subtitle?: string;
	className?: string;
}

export function AllInOneCard({
	title = "Master Design System Showcase",
	subtitle = "Every themeable component, token, typography style, button variant, and form control living harmoniously in one responsive card container.",
	className = "",
}: AllInOneCardProps) {
	let themeContext: ReturnType<typeof useTheme> | null = null;
	try {
		// biome-ignore lint/correctness/useHookAtTopLevel: safe wrapper for pre-init testing
		themeContext = useTheme();
	} catch (_e) {
		// Graceful fallback when outside ThemeProvider
	}

	const [primaryCount, setPrimaryCount] = useState(0);
	const [tactileClicks, setTactileClicks] = useState(0);
	const [isPulseActive, setIsPulseActive] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [switchOn, setSwitchOn] = useState(true);
	const [checkboxChecked, setCheckboxChecked] = useState(true);
	const [sliderVal, setSliderVal] = useState(72);
	const [activeSegment, setActiveSegment] = useState<
		"standard" | "compact" | "tokens"
	>("standard");
	const [textInputVal, setTextInputVal] = useState("developer@antigravity.io");
	const [selectVal, setSelectVal] = useState("production");

	const theme = themeContext ? themeContext.theme : "dark-slate";
	const resolvedMode = themeContext ? themeContext.resolvedMode : "dark";
	const tokens = themeContext ? themeContext.tokens : null;
	const isTactile = themeContext ? Boolean(tokens?.tactile === "true") : false;

	return (
		<div
			className={`rounded-2xl border border-border bg-card text-text-primary p-6 md:p-8 space-y-6 transition-all duration-200 ${className}`}
			style={{
				backgroundColor: tokens?.card || "var(--card, #162032)",
				borderColor: tokens?.border || "var(--border, #1e293b)",
				color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
				borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
				boxShadow:
					tokens?.shadow ||
					"var(--shadow, 0 10px 15px -3px rgba(0, 0, 0, 0.4))",
				fontFamily: tokens?.fontBody || "var(--font-body, inherit)",
				display: "flex",
				flexDirection: "column",
				gap: "1.5rem",
			}}
		>
			{/* CARD HEADER & METADATA */}
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "flex-start",
					justifyContent: "space-between",
					gap: "1rem",
					borderBottom: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
					paddingBottom: "1.25rem",
					flexWrap: "wrap",
				}}
			>
				<div style={{ maxWidth: "650px" }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
							marginBottom: "0.4rem",
							flexWrap: "wrap",
						}}
					>
						<span
							style={{
								width: "8px",
								height: "8px",
								borderRadius: "9999px",
								backgroundColor: tokens?.accent || "var(--accent, #34d399)",
								display: "inline-block",
							}}
						/>
						<span
							style={{
								fontFamily: "monospace",
								fontSize: "11px",
								fontWeight: 700,
								textTransform: "uppercase",
								letterSpacing: "0.08em",
								color: tokens?.textMuted || "var(--text-muted, #94a3b8)",
							}}
						>
							Unified Component Container
						</span>
						<span
							style={{
								fontSize: "10px",
								padding: "2px 7px",
								borderRadius: "4px",
								backgroundColor: tokens?.surface || "var(--surface, #111827)",
								border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
								color: tokens?.primary || "var(--primary, #38bdf8)",
								fontWeight: 700,
								fontFamily: "monospace",
							}}
						>
							Palette: {theme} ({resolvedMode})
						</span>
						<span
							style={{
								fontSize: "10px",
								padding: "2px 7px",
								borderRadius: "4px",
								backgroundColor: tokens?.surface || "var(--surface, #111827)",
								border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
								color: tokens?.textMuted || "var(--text-muted, #94a3b8)",
								fontWeight: 600,
								fontFamily: "monospace",
							}}
						>
							Radius: {tokens?.radius || "0.625rem"}
						</span>
					</div>

					{/* Heading with fontHeading */}
					<h2
						style={{
							fontSize: "1.65rem",
							fontWeight: 800,
							letterSpacing: "-0.02em",
							margin: 0,
							fontFamily: tokens?.fontHeading || "var(--font-heading, inherit)",
							color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							lineHeight: 1.25,
						}}
					>
						{title}
					</h2>

					{/* Subtitle / Body text with fontBody & textMuted */}
					<p
						style={{
							fontSize: "0.875rem",
							margin: "0.4rem 0 0 0",
							lineHeight: 1.5,
							color: tokens?.textMuted || "var(--text-muted, #94a3b8)",
						}}
					>
						{subtitle}{" "}
						<span
							style={{
								color: tokens?.primary || "var(--primary, #38bdf8)",
								textDecoration: "underline",
								cursor: "pointer",
								fontWeight: 600,
							}}
							onClick={() => themeContext?.openStudio()}
						>
							Launch live customizer →
						</span>
					</p>
				</div>

				{/* SEGMENTED VIEW CONTROLLER */}
				<div
					style={{
						display: "inline-flex",
						padding: "3px",
						borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
						backgroundColor: tokens?.surface || "var(--surface, #111827)",
						border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
						gap: "2px",
					}}
				>
					{(["standard", "compact", "tokens"] as const).map((seg) => (
						<button
							key={seg}
							type="button"
							onClick={() => setActiveSegment(seg)}
							style={{
								padding: "5px 12px",
								fontSize: "11px",
								fontWeight: 600,
								textTransform: "capitalize",
								cursor: "pointer",
								borderRadius: `calc(${tokens?.radius || "0.625rem"} - 2px)`,
								border: "none",
								backgroundColor:
									activeSegment === seg
										? tokens?.primary || "var(--primary, #38bdf8)"
										: "transparent",
								color:
									activeSegment === seg
										? "#ffffff"
										: tokens?.textMuted || "var(--text-muted, #94a3b8)",
								transition: "all 0.15s ease",
							}}
						>
							{seg}
						</button>
					))}
				</div>
			</div>

			{/* CONDITIONAL TOKENS VIEW */}
			{activeSegment === "tokens" && (
				<div
					style={{
						padding: "1rem",
						borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
						backgroundColor: tokens?.surface || "var(--surface, #111827)",
						border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
						display: "flex",
						flexDirection: "column",
						gap: "0.5rem",
					}}
				>
					<div
						style={{
							fontSize: "11px",
							fontWeight: 700,
							fontFamily: "monospace",
							color: tokens?.accent || "var(--accent, #34d399)",
						}}
					>
						⚡ Active Computed CSS Token Map
					</div>
					<pre
						style={{
							margin: 0,
							fontSize: "11px",
							fontFamily: "monospace",
							color: tokens?.textMuted || "var(--text-muted, #94a3b8)",
							overflowX: "auto",
							padding: "0.5rem",
							backgroundColor: tokens?.canvas || "rgba(0,0,0,0.2)",
							borderRadius: "6px",
						}}
					>
						{JSON.stringify(
							{
								theme,
								mode: resolvedMode,
								primary: tokens?.primary || "var(--primary)",
								secondary: tokens?.secondary || "var(--secondary)",
								accent: tokens?.accent || "var(--accent)",
								card: tokens?.card || "var(--card)",
								surface: tokens?.surface || "var(--surface)",
								border: tokens?.border || "var(--border)",
								radius: tokens?.radius || "var(--radius)",
								shadow: tokens?.shadow || "var(--shadow)",
								tactile: tokens?.tactile || "false",
								fontHeading: tokens?.fontHeading || "var(--font-heading)",
								fontBody: tokens?.fontBody || "var(--font-body)",
							},
							null,
							2,
						)}
					</pre>
				</div>
			)}

			{/* SECTION 1: ALL BUTTONS */}
			<div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
				<div
					style={{
						fontSize: "11px",
						fontWeight: 700,
						textTransform: "uppercase",
						letterSpacing: "0.06em",
						color: tokens?.textMuted || "var(--text-muted, #94a3b8)",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<span>1. Complete Button Suite &amp; Click States</span>
					<span
						style={{ fontSize: "10px", textTransform: "none", fontWeight: 500 }}
					>
						Hover &amp; click to preview tokens &amp; mechanical tactile physics
					</span>
				</div>

				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						alignItems: "center",
						gap: "0.65rem",
					}}
				>
					{/* Primary Solid */}
					<button
						type="button"
						onClick={() => setPrimaryCount((c) => c + 1)}
						style={{
							padding: "8px 16px",
							fontSize: "12px",
							fontWeight: 600,
							color: "#ffffff",
							backgroundColor: tokens?.primary || "var(--primary, #38bdf8)",
							border: "1px solid transparent",
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							cursor: "pointer",
							boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
							transition: "all 0.15s ease",
						}}
					>
						Primary ({primaryCount} clicks)
					</button>

					{/* Secondary Solid */}
					<button
						type="button"
						style={{
							padding: "8px 16px",
							fontSize: "12px",
							fontWeight: 600,
							color: "#ffffff",
							backgroundColor: tokens?.secondary || "var(--secondary, #818cf8)",
							border: "1px solid transparent",
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							cursor: "pointer",
							boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
							transition: "all 0.15s ease",
						}}
					>
						Secondary Action
					</button>

					{/* Accent Solid */}
					<button
						type="button"
						style={{
							padding: "8px 16px",
							fontSize: "12px",
							fontWeight: 600,
							color: "#ffffff",
							backgroundColor: tokens?.accent || "var(--accent, #34d399)",
							border: "1px solid transparent",
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							cursor: "pointer",
							boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
							transition: "all 0.15s ease",
						}}
					>
						Accent Action
					</button>

					{/* Success Solid */}
					<button
						type="button"
						style={{
							padding: "8px 16px",
							fontSize: "12px",
							fontWeight: 600,
							color: "#ffffff",
							backgroundColor: tokens?.success || "var(--success, #10b981)",
							border: "1px solid transparent",
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							cursor: "pointer",
							boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
							transition: "all 0.15s ease",
						}}
					>
						Success Confirm
					</button>

					{/* Warning Solid */}
					<button
						type="button"
						style={{
							padding: "8px 16px",
							fontSize: "12px",
							fontWeight: 600,
							color: "#ffffff",
							backgroundColor: tokens?.warning || "var(--warning, #f59e0b)",
							border: "1px solid transparent",
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							cursor: "pointer",
							boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
							transition: "all 0.15s ease",
						}}
					>
						Warning Notice
					</button>

					{/* Danger / Destructive Button with Modal Trigger */}
					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
						style={{
							padding: "8px 16px",
							fontSize: "12px",
							fontWeight: 600,
							color: "#ffffff",
							backgroundColor: tokens?.danger || "var(--danger, #ef4444)",
							border: "1px solid transparent",
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							cursor: "pointer",
							boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
							transition: "all 0.15s ease",
						}}
					>
						Destructive Dialog
					</button>

					{/* Ghost Outline Button */}
					<button
						type="button"
						style={{
							padding: "8px 16px",
							fontSize: "12px",
							fontWeight: 600,
							color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							backgroundColor: "transparent",
							border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							cursor: "pointer",
							transition: "all 0.15s ease",
						}}
					>
						Ghost Outline
					</button>

					{/* Subtle Surface Button */}
					<button
						type="button"
						style={{
							padding: "8px 16px",
							fontSize: "12px",
							fontWeight: 600,
							color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							backgroundColor: tokens?.surface || "var(--surface, #111827)",
							border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							cursor: "pointer",
							transition: "all 0.15s ease",
						}}
					>
						Subtle Surface
					</button>

					{/* Pill Button (Full Radius) */}
					<button
						type="button"
						style={{
							padding: "8px 18px",
							fontSize: "12px",
							fontWeight: 600,
							color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							backgroundColor: tokens?.surface || "var(--surface, #111827)",
							border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
							borderRadius: "9999px",
							cursor: "pointer",
							transition: "all 0.15s ease",
						}}
					>
						Pill Button (Full Radius)
					</button>

					{/* Tactile Mechanical Physics Button */}
					<button
						type="button"
						onClick={() => {
							setTactileClicks((c) => c + 1);
							setIsPulseActive(true);
							setTimeout(() => setIsPulseActive(false), 450);
							if (typeof window !== "undefined" && "vibrate" in navigator) {
								navigator.vibrate?.(25);
							}
						}}
						className="tactile-item tactile-always-active"
						style={{
							padding: "8px 16px",
							fontSize: "12px",
							fontWeight: 700,
							fontFamily: "monospace",
							color: "#ffffff",
							backgroundColor: isPulseActive
								? tokens?.accent || "var(--accent, #34d399)"
								: tokens?.primary || "var(--primary, #38bdf8)",
							border: "2px solid #000000",
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							cursor: "pointer",
							boxShadow: "4px 4px 0px 0px #000000",
							userSelect: "none",
							transition: "transform 0.08s ease, box-shadow 0.08s ease",
						}}
					>
						{isPulseActive
							? "💥 Tactile Clicked!"
							: `Mechanical Physics (${tactileClicks})`}
					</button>

					{/* Themed Icon Button */}
					<button
						type="button"
						style={{
							width: "36px",
							height: "36px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: tokens?.surface || "var(--surface, #111827)",
							border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							cursor: "pointer",
							fontSize: "14px",
						}}
						title="Themed Icon Action"
						aria-label="Themed Icon Action"
					>
						⚡
					</button>
				</div>
			</div>

			{/* SECTION 2: STATUS BADGES & GLOW CHIPS */}
			<div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
				<div
					style={{
						fontSize: "11px",
						fontWeight: 700,
						textTransform: "uppercase",
						letterSpacing: "0.06em",
						color: tokens?.textMuted || "var(--text-muted, #94a3b8)",
					}}
				>
					2. Semantic Status Chips &amp; Neon Glow
				</div>

				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						alignItems: "center",
						gap: "0.5rem",
					}}
				>
					<span
						style={{
							padding: "3px 10px",
							fontSize: "11px",
							fontWeight: 600,
							borderRadius: "9999px",
							backgroundColor: tokens?.primary || "var(--primary, #38bdf8)",
							color: "#ffffff",
						}}
					>
						Primary Chip
					</span>
					<span
						style={{
							padding: "3px 10px",
							fontSize: "11px",
							fontWeight: 600,
							borderRadius: "9999px",
							backgroundColor: tokens?.secondary || "var(--secondary, #818cf8)",
							color: "#ffffff",
						}}
					>
						Secondary Chip
					</span>
					<span
						style={{
							padding: "3px 10px",
							fontSize: "11px",
							fontWeight: 600,
							borderRadius: "9999px",
							backgroundColor: tokens?.accent || "var(--accent, #34d399)",
							color: "#ffffff",
						}}
					>
						Accent Chip
					</span>
					<span
						style={{
							padding: "3px 10px",
							fontSize: "11px",
							fontWeight: 600,
							borderRadius: "9999px",
							backgroundColor: tokens?.success || "var(--success, #10b981)",
							color: "#ffffff",
						}}
					>
						Success ● Active
					</span>
					<span
						style={{
							padding: "3px 10px",
							fontSize: "11px",
							fontWeight: 600,
							borderRadius: "9999px",
							backgroundColor: tokens?.warning || "var(--warning, #f59e0b)",
							color: "#ffffff",
						}}
					>
						Warning ● Alert
					</span>
					<span
						style={{
							padding: "3px 10px",
							fontSize: "11px",
							fontWeight: 600,
							borderRadius: "9999px",
							backgroundColor: tokens?.danger || "var(--danger, #ef4444)",
							color: "#ffffff",
						}}
					>
						Danger ● Critical
					</span>
					{/* Glow Pill */}
					<span
						style={{
							padding: "3px 12px",
							fontSize: "11px",
							fontWeight: 700,
							borderRadius: "9999px",
							backgroundColor: tokens?.surface || "var(--surface, #111827)",
							border: `1px solid ${tokens?.glowColor || tokens?.primary || "var(--primary, #38bdf8)"}`,
							color:
								tokens?.glowColor ||
								tokens?.primary ||
								"var(--primary, #38bdf8)",
							boxShadow: `0 0 12px ${tokens?.glowColor || tokens?.primary || "var(--primary, #38bdf8)"}55`,
						}}
					>
						✨ Neon Glow Token
					</span>
				</div>
			</div>

			{/* SECTION 3: FORM CONTROLS, INPUTS, TOGGLE & SLIDER */}
			<div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
				<div
					style={{
						fontSize: "11px",
						fontWeight: 700,
						textTransform: "uppercase",
						letterSpacing: "0.06em",
						color: tokens?.textMuted || "var(--text-muted, #94a3b8)",
					}}
				>
					3. Interactive Form Inputs, Dropdowns, Toggles &amp; Sliders
				</div>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
						gap: "1rem",
					}}
				>
					{/* Text Input Field */}
					<div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
						<label
							htmlFor="allinone-email"
							style={{
								fontSize: "11px",
								fontWeight: 600,
								color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							}}
						>
							Email Address (Themed Input)
						</label>
						<input
							id="allinone-email"
							type="text"
							value={textInputVal}
							onChange={(e) => setTextInputVal(e.target.value)}
							style={{
								width: "100%",
								boxSizing: "border-box",
								padding: "8px 12px",
								fontSize: "12px",
								backgroundColor: tokens?.surface || "var(--surface, #111827)",
								border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
								borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
								color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
								outline: "none",
								fontFamily: tokens?.fontBody || "inherit",
							}}
						/>
					</div>

					{/* Select Dropdown */}
					<div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
						<label
							htmlFor="allinone-select"
							style={{
								fontSize: "11px",
								fontWeight: 600,
								color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							}}
						>
							Deployment Environment (Themed Select)
						</label>
						<select
							id="allinone-select"
							value={selectVal}
							onChange={(e) => setSelectVal(e.target.value)}
							style={{
								width: "100%",
								boxSizing: "border-box",
								padding: "8px 12px",
								fontSize: "12px",
								backgroundColor: tokens?.surface || "var(--surface, #111827)",
								border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
								borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
								color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
								outline: "none",
								cursor: "pointer",
								fontFamily: tokens?.fontBody || "inherit",
							}}
						>
							<option value="production">Production Cluster (US-East)</option>
							<option value="staging">Staging Preview Network</option>
							<option value="local">Local Devnet Sandbox</option>
						</select>
					</div>

					{/* Fluid Scale Range Slider */}
					<div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<span
								style={{
									fontSize: "11px",
									fontWeight: 600,
									color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
								}}
							>
								Fluid Scale Slider
							</span>
							<span
								style={{
									fontSize: "11px",
									fontFamily: "monospace",
									color: tokens?.primary || "var(--primary, #38bdf8)",
									fontWeight: 700,
								}}
							>
								{sliderVal}%
							</span>
						</div>
						<input
							type="range"
							min="0"
							max="100"
							value={sliderVal}
							onChange={(e) => setSliderVal(Number(e.target.value))}
							style={{
								width: "100%",
								cursor: "pointer",
								accentColor: tokens?.primary || "var(--primary, #38bdf8)",
								height: "6px",
								marginTop: "6px",
							}}
						/>
						{/* Progress Bar indicator */}
						<div
							style={{
								width: "100%",
								height: "4px",
								backgroundColor: tokens?.surface || "var(--surface, #111827)",
								borderRadius: "9999px",
								overflow: "hidden",
								marginTop: "4px",
							}}
						>
							<div
								style={{
									width: `${sliderVal}%`,
									height: "100%",
									backgroundColor: tokens?.primary || "var(--primary, #38bdf8)",
									transition: "width 0.1s ease",
								}}
							/>
						</div>
					</div>

					{/* Toggles & Checkbox Box */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							padding: "8px 14px",
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							backgroundColor: tokens?.surface || "var(--surface, #111827)",
							border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
						}}
					>
						{/* Switch Toggle */}
						<label
							style={{
								display: "flex",
								alignItems: "center",
								gap: "8px",
								cursor: "pointer",
								userSelect: "none",
								fontSize: "11px",
								fontWeight: 600,
								color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							}}
						>
							<div
								onClick={() => setSwitchOn(!switchOn)}
								style={{
									width: "36px",
									height: "20px",
									borderRadius: "9999px",
									backgroundColor: switchOn
										? tokens?.primary || "var(--primary, #38bdf8)"
										: tokens?.border || "#475569",
									position: "relative",
									transition: "background-color 0.2s ease",
								}}
							>
								<div
									style={{
										width: "16px",
										height: "16px",
										borderRadius: "9999px",
										backgroundColor: "#ffffff",
										position: "absolute",
										top: "2px",
										left: switchOn ? "18px" : "2px",
										transition: "left 0.2s ease",
										boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
									}}
								/>
							</div>
							<span>Live Sync</span>
						</label>

						{/* Checkbox */}
						<label
							style={{
								display: "flex",
								alignItems: "center",
								gap: "6px",
								cursor: "pointer",
								userSelect: "none",
								fontSize: "11px",
								fontWeight: 600,
								color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							}}
						>
							<input
								type="checkbox"
								checked={checkboxChecked}
								onChange={(e) => setCheckboxChecked(e.target.checked)}
								style={{
									cursor: "pointer",
									accentColor: tokens?.accent || "var(--accent, #34d399)",
									width: "16px",
									height: "16px",
								}}
							/>
							<span>Telemetry</span>
						</label>
					</div>
				</div>
			</div>

			{/* SECTION 4: INLINE SEMANTIC CALLOUT BANNER */}
			<div
				style={{
					padding: "12px 16px",
					borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
					backgroundColor: tokens?.surface || "var(--surface, #111827)",
					borderLeft: `4px solid ${tokens?.primary || "var(--primary, #38bdf8)"}`,
					borderTop: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
					borderRight: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
					borderBottom: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: "1rem",
					flexWrap: "wrap",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<span style={{ fontSize: "20px" }}>🚀</span>
					<div>
						<div
							style={{
								fontSize: "12px",
								fontWeight: 700,
								color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
								fontFamily: tokens?.fontHeading || "inherit",
							}}
						>
							Zero-Runtime CSS Engine Active
						</div>
						<div
							style={{
								fontSize: "11px",
								color: tokens?.textMuted || "var(--text-muted, #94a3b8)",
							}}
						>
							All tokens update instantaneously via native CSS custom properties
							without re-renders.
						</div>
					</div>
				</div>

				<div style={{ display: "flex", gap: "6px" }}>
					<button
						type="button"
						style={{
							padding: "5px 12px",
							fontSize: "11px",
							fontWeight: 600,
							color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							backgroundColor: tokens?.card || "var(--card, #162032)",
							border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							cursor: "pointer",
						}}
					>
						Dismiss
					</button>
					<button
						type="button"
						onClick={() => themeContext?.openStudio()}
						style={{
							padding: "5px 12px",
							fontSize: "11px",
							fontWeight: 600,
							color: "#ffffff",
							backgroundColor: tokens?.primary || "var(--primary, #38bdf8)",
							border: "none",
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							cursor: "pointer",
						}}
					>
						Customize Tokens
					</button>
				</div>
			</div>

			{/* CARD FOOTER */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					borderTop: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
					paddingTop: "1rem",
					fontSize: "11px",
					color: tokens?.textMuted || "var(--text-muted, #94a3b8)",
					flexWrap: "wrap",
					gap: "0.75rem",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "8px",
						flexWrap: "wrap",
					}}
				>
					<span style={{ fontFamily: "monospace" }}>
						Corner: {tokens?.radius || "0.625rem"}
					</span>
					<span>•</span>
					<span style={{ fontFamily: "monospace" }}>
						Tactile: {isTactile ? "⚡ Active" : "Off"}
					</span>
					<span>•</span>
					<span style={{ fontFamily: "monospace" }}>
						Heading:{" "}
						{tokens?.fontHeading
							? tokens.fontHeading.split(",")[0].replace(/"/g, "")
							: "System"}
					</span>
					<span>•</span>
					<span style={{ fontFamily: "monospace" }}>
						Body:{" "}
						{tokens?.fontBody
							? tokens.fontBody.split(",")[0].replace(/"/g, "")
							: "System"}
					</span>
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
					<button
						type="button"
						style={{
							padding: "6px 14px",
							fontSize: "11px",
							fontWeight: 600,
							color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							backgroundColor: "transparent",
							border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							cursor: "pointer",
						}}
					>
						Reset
					</button>
					<button
						type="button"
						onClick={() => themeContext?.openStudio()}
						style={{
							padding: "6px 16px",
							fontSize: "11px",
							fontWeight: 700,
							color: "#ffffff",
							backgroundColor: tokens?.primary || "var(--primary, #38bdf8)",
							border: "none",
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							cursor: "pointer",
							boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
						}}
					>
						Open Theme Studio
					</button>
				</div>
			</div>

			{/* SIMULATED ALERT MODAL */}
			{isModalOpen && (
				<div
					style={{
						position: "fixed",
						inset: 0,
						zIndex: 50,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "rgba(0,0,0,0.65)",
						backdropFilter: "blur(4px)",
						padding: "1rem",
					}}
				>
					<div
						style={{
							width: "100%",
							maxWidth: "400px",
							padding: "1.5rem",
							backgroundColor: tokens?.surface || "var(--surface, #111827)",
							border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							boxShadow: tokens?.shadow || "0 25px 50px -12px rgba(0,0,0,0.5)",
							display: "flex",
							flexDirection: "column",
							gap: "1rem",
						}}
					>
						<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
							<span style={{ fontSize: "20px" }}>⚠️</span>
							<h3
								style={{
									margin: 0,
									fontSize: "1rem",
									fontWeight: 700,
									color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
									fontFamily: tokens?.fontHeading || "inherit",
								}}
							>
								Destructive Action Test
							</h3>
						</div>
						<p
							style={{
								margin: 0,
								fontSize: "12px",
								lineHeight: 1.5,
								color: tokens?.textMuted || "var(--text-muted, #94a3b8)",
							}}
						>
							This modal dialog confirms that backdrops, overlays, rounded
							corners, and destructive theme tokens render consistently across
							palettes.
						</p>
						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								gap: "8px",
								paddingTop: "0.5rem",
							}}
						>
							<button
								type="button"
								onClick={() => setIsModalOpen(false)}
								style={{
									padding: "6px 14px",
									fontSize: "12px",
									fontWeight: 600,
									backgroundColor: tokens?.card || "var(--card, #162032)",
									color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
									border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
									borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
									cursor: "pointer",
								}}
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => setIsModalOpen(false)}
								style={{
									padding: "6px 16px",
									fontSize: "12px",
									fontWeight: 700,
									backgroundColor: tokens?.danger || "var(--danger, #ef4444)",
									color: "#ffffff",
									border: "none",
									borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
									cursor: "pointer",
								}}
							>
								Confirm Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

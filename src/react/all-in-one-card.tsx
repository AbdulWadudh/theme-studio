"use client";

import { useState } from "react";
import { extractFontFamily } from "../core/fonts";
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
	const [isSavedFeedback, setIsSavedFeedback] = useState(false);

	const isCompact = activeSegment === "compact";

	const theme = themeContext ? themeContext.theme : "dark-slate";
	const resolvedMode = themeContext ? themeContext.resolvedMode : "dark";
	const tokens = themeContext ? themeContext.tokens : null;
	const isTactile = themeContext ? Boolean(tokens?.tactile === "true") : false;
	const tactileBtnBorder = isTactile ? "2px solid #000000" : "1px solid transparent";
	const tactileBtnShadow = isTactile ? "4px 4px 0px 0px #000000" : "0 1px 2px rgba(0,0,0,0.15)";
	const subtleBtnBorder = isTactile ? "2px solid #000000" : `1px solid ${tokens?.border || "var(--border, #1e293b)"}`;
	const subtleBtnShadow = isTactile ? "4px 4px 0px 0px #000000" : undefined;

	const handleReset = () => {
		setPrimaryCount(0);
		setTactileClicks(0);
		setSliderVal(72);
		setTextInputVal("developer@antigravity.io");
		setSelectVal("production");
		setSwitchOn(true);
		setCheckboxChecked(true);
	};

	const handleVerifySubmit = () => {
		setIsSavedFeedback(true);
		setTimeout(() => setIsSavedFeedback(false), 2000);
	};

	return (
		<div
			className={`rounded-2xl border border-border bg-card text-text-primary transition-all duration-200 ${className}`}
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
				padding: isCompact ? "1rem 1.25rem" : "1.75rem 2rem",
				gap: isCompact ? "0.9rem" : "1.5rem",
			}}
		>
			<style>{`
				/* Action Buttons: Full dynamic interaction effects */
				.aio-btn {
					cursor: pointer;
					position: relative;
					user-select: none;
					outline: none;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1), 
					            box-shadow 0.15s ease, 
					            filter 0.15s ease, 
					            background-color 0.15s ease, 
					            border-color 0.15s ease;
				}
				.aio-btn:hover {
					filter: brightness(1.12);
					transform: translateY(-2px);
					box-shadow: 0 6px 16px -2px rgba(0, 0, 0, 0.28) !important;
				}
				.aio-btn:active {
					filter: brightness(0.94);
					transform: translateY(1px) scale(0.98);
					box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18) !important;
				}
				.aio-btn-outline:hover {
					filter: none !important;
					background-color: var(--surface, #1e293b) !important;
					border-color: var(--primary, #38bdf8) !important;
					color: var(--primary, #38bdf8) !important;
					transform: translateY(-2px);
					box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.2) !important;
				}
				.aio-btn-outline:active {
					transform: translateY(1px) scale(0.98);
				}
				.aio-btn-subtle:hover {
					filter: brightness(1.15) !important;
					border-color: var(--text-muted, #94a3b8) !important;
					transform: translateY(-2px);
					box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.2) !important;
				}
				.aio-btn-subtle:active {
					transform: translateY(1px) scale(0.98);
				}
				.aio-btn-pill:hover {
					border-color: var(--primary, #38bdf8) !important;
					transform: translateY(-2px);
					box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.2) !important;
				}
				.aio-btn-pill:active {
					transform: translateY(1px) scale(0.98);
				}
				.aio-btn-tactile {
					transition: transform 0.08s ease, box-shadow 0.08s ease, filter 0.08s ease !important;
				}
				.aio-btn-tactile:hover {
					filter: none !important;
					transform: translate(-2px, -2px) !important;
					box-shadow: 6px 6px 0px 0px #000000 !important;
				}
				.aio-btn-tactile:active {
					transform: translate(3px, 3px) !important;
					box-shadow: 1px 1px 0px 0px #000000 !important;
				}
				[data-tactile="true"] .aio-btn:not([data-no-tactile]) {
					box-shadow: 4px 4px 0px 0px #000000 !important;
					border-color: #000000 !important;
					border-width: 2px !important;
				}
				[data-tactile="true"] .aio-btn:not([data-no-tactile]):hover {
					transform: translate(-1px, -1px) !important;
					box-shadow: 4px 4px 0px 0px #000000 !important;
				}
				[data-tactile="true"] .aio-btn:not([data-no-tactile]):active {
					transform: translate(2px, 2px) !important;
					box-shadow: 0px 0px 0px 0px #000000 !important;
				}

				/* Segmented View Switcher Buttons (Strictly flat, never distorted by tactile physics) */
				.aio-segment-btn {
					cursor: pointer;
					user-select: none;
					outline: none;
					border: none !important;
					box-shadow: none !important;
					transform: none !important;
					transition: background-color 0.15s ease, color 0.15s ease !important;
				}
				.aio-segment-btn:hover,
				.aio-segment-btn:active {
					border: none !important;
					box-shadow: none !important;
					transform: none !important;
					filter: none !important;
				}
			`}</style>

			{/* CARD HEADER & VIEW CONTROLLER */}
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "flex-start",
					justifyContent: "space-between",
					gap: "1rem",
					borderBottom: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
					paddingBottom: isCompact ? "0.75rem" : "1.25rem",
					flexWrap: "wrap",
				}}
			>
				<div style={{ maxWidth: "650px" }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
							marginBottom: "0.35rem",
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
								fontSize: isCompact ? "10px" : "11px",
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
							{theme} ({resolvedMode})
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
						{isCompact && (
							<span
								style={{
									fontSize: "9px",
									padding: "1px 6px",
									borderRadius: "3px",
									backgroundColor: tokens?.primary || "var(--primary, #38bdf8)",
									color: "#ffffff",
									fontWeight: 700,
									textTransform: "uppercase",
								}}
							>
								Compact Density
							</span>
						)}
					</div>

					{/* Heading with fontHeading */}
					<h2
						style={{
							fontSize: isCompact ? "1.25rem" : "1.65rem",
							fontWeight: 800,
							letterSpacing: "-0.02em",
							margin: 0,
							fontFamily: tokens?.fontHeading || "var(--font-heading, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
							color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							lineHeight: 1.25,
						}}
					>
						{title}
					</h2>

					{/* Subtitle / Body text with fontBody & textMuted */}
					{!isCompact && (
						<p
							style={{
								fontSize: "0.85rem",
								margin: "0.4rem 0 0 0",
								lineHeight: 1.5,
								color: tokens?.textMuted || "var(--text-muted, #94a3b8)",
							}}
						>
							{subtitle}
						</p>
					)}
				</div>

				{/* SEGMENTED VIEW CONTROLLER: Standard / Compact / Tokens (Protected with data-segmented & data-no-tactile) */}
				<div
					data-segmented="true"
					data-no-tactile="true"
					style={{
						display: "inline-flex",
						padding: "3px",
						borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
						backgroundColor: tokens?.surface || "var(--surface, #111827)",
						border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
						gap: "2px",
					}}
				>
					{(
						[
							{ id: "standard", label: "Standard" },
							{ id: "compact", label: "Compact" },
							{ id: "tokens", label: "Tokens" },
						] as const
					).map((seg) => (
						<button
							key={seg.id}
							type="button"
							data-no-tactile="true"
							onClick={() => setActiveSegment(seg.id)}
							className="aio-segment-btn no-tactile"
							style={{
								padding: isCompact ? "3px 10px" : "5px 12px",
								fontSize: isCompact ? "10px" : "11px",
								fontWeight: activeSegment === seg.id ? 700 : 500,
								textTransform: "capitalize",
								borderRadius: `calc(${tokens?.radius || "0.625rem"} - 2px)`,
								border: "none",
								backgroundColor:
									activeSegment === seg.id
										? tokens?.primary || "var(--primary, #38bdf8)"
										: "transparent",
								color:
									activeSegment === seg.id
										? "#ffffff"
										: tokens?.textMuted || "var(--text-muted, #94a3b8)",
							}}
						>
							{seg.label}
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
								success: tokens?.success || "var(--success)",
								warning: tokens?.warning || "var(--warning)",
								danger: tokens?.danger || "var(--danger)",
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

			{/* SECTION 1: ALL BUTTONS WITH INTERACTIVE HOVER & TACTILE PRESS */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: isCompact ? "0.4rem" : "0.6rem",
				}}
			>
				<div
					style={{
						fontSize: isCompact ? "10px" : "11px",
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
						Hover to feel interactive elevation, click to trigger state
					</span>
				</div>

				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						alignItems: "center",
						gap: isCompact ? "0.45rem" : "0.65rem",
					}}
				>
					{/* Primary Solid */}
					<button
						type="button"
						onClick={() => setPrimaryCount((c) => c + 1)}
						className="aio-btn"
						style={{
							padding: isCompact ? "5px 12px" : "8px 16px",
							fontSize: isCompact ? "11px" : "12px",
							fontWeight: 600,
							color: "#ffffff",
							backgroundColor: tokens?.primary || "var(--primary, #38bdf8)",
							border: tactileBtnBorder,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							boxShadow: tactileBtnShadow,
						}}
					>
						Primary ({primaryCount} clicks)
					</button>

					{/* Secondary Solid */}
					<button
						type="button"
						className="aio-btn"
						style={{
							padding: isCompact ? "5px 12px" : "8px 16px",
							fontSize: isCompact ? "11px" : "12px",
							fontWeight: 600,
							color: "#ffffff",
							backgroundColor: tokens?.secondary || "var(--secondary, #818cf8)",
							border: tactileBtnBorder,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							boxShadow: tactileBtnShadow,
						}}
					>
						Secondary Action
					</button>

					{/* Accent Solid */}
					<button
						type="button"
						className="aio-btn"
						style={{
							padding: isCompact ? "5px 12px" : "8px 16px",
							fontSize: isCompact ? "11px" : "12px",
							fontWeight: 600,
							color: "#ffffff",
							backgroundColor: tokens?.accent || "var(--accent, #34d399)",
							border: tactileBtnBorder,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							boxShadow: tactileBtnShadow,
						}}
					>
						Accent Action
					</button>

					{/* Success Solid */}
					<button
						type="button"
						className="aio-btn"
						style={{
							padding: isCompact ? "5px 12px" : "8px 16px",
							fontSize: isCompact ? "11px" : "12px",
							fontWeight: 600,
							color: "#ffffff",
							backgroundColor: tokens?.success || "var(--success, #10b981)",
							border: tactileBtnBorder,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							boxShadow: tactileBtnShadow,
						}}
					>
						Success Confirm
					</button>

					{/* Warning Solid */}
					<button
						type="button"
						className="aio-btn"
						style={{
							padding: isCompact ? "5px 12px" : "8px 16px",
							fontSize: isCompact ? "11px" : "12px",
							fontWeight: 600,
							color: "#ffffff",
							backgroundColor: tokens?.warning || "var(--warning, #f59e0b)",
							border: tactileBtnBorder,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							boxShadow: tactileBtnShadow,
						}}
					>
						Warning Notice
					</button>

					{/* Danger / Destructive Button with Modal Trigger */}
					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
						className="aio-btn"
						style={{
							padding: isCompact ? "5px 12px" : "8px 16px",
							fontSize: isCompact ? "11px" : "12px",
							fontWeight: 600,
							color: "#ffffff",
							backgroundColor: tokens?.danger || "var(--danger, #ef4444)",
							border: tactileBtnBorder,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							boxShadow: tactileBtnShadow,
						}}
					>
						Destructive Dialog
					</button>

					{/* Ghost Outline Button */}
					<button
						type="button"
						className="aio-btn aio-btn-outline"
						style={{
							padding: isCompact ? "5px 12px" : "8px 16px",
							fontSize: isCompact ? "11px" : "12px",
							fontWeight: 600,
							color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							backgroundColor: "transparent",
							border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
						}}
					>
						Ghost Outline
					</button>

					{/* Subtle Surface Button */}
					<button
						type="button"
						className="aio-btn aio-btn-subtle"
						style={{
							padding: isCompact ? "5px 12px" : "8px 16px",
							fontSize: isCompact ? "11px" : "12px",
							fontWeight: 600,
							color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							backgroundColor: tokens?.surface || "var(--surface, #111827)",
							border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
						}}
					>
						Subtle Surface
					</button>

					{/* Pill Button (Full Radius) */}
					<button
						type="button"
						className="aio-btn aio-btn-pill"
						style={{
							padding: isCompact ? "5px 14px" : "8px 18px",
							fontSize: isCompact ? "11px" : "12px",
							fontWeight: 600,
							color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							backgroundColor: tokens?.surface || "var(--surface, #111827)",
							border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
							borderRadius: "9999px",
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
						className="aio-btn aio-btn-tactile tactile-item tactile-always-active"
						style={{
							padding: isCompact ? "5px 12px" : "8px 16px",
							fontSize: isCompact ? "11px" : "12px",
							fontWeight: 700,
							fontFamily: "monospace",
							color: "#ffffff",
							backgroundColor: isPulseActive
								? tokens?.accent || "var(--accent, #34d399)"
								: tokens?.primary || "var(--primary, #38bdf8)",
							border: "2px solid #000000",
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							boxShadow: "4px 4px 0px 0px #000000",
						}}
					>
						{isPulseActive
							? "💥 Tactile Clicked!"
							: `Mechanical Physics (${tactileClicks})`}
					</button>

					{/* Themed Icon Button */}
					<button
						type="button"
						className="aio-btn aio-btn-subtle"
						style={{
							width: isCompact ? "30px" : "36px",
							height: isCompact ? "30px" : "36px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: tokens?.surface || "var(--surface, #111827)",
							border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							fontSize: isCompact ? "12px" : "14px",
						}}
						title="Themed Icon Action"
						aria-label="Themed Icon Action"
					>
						⚡
					</button>
				</div>
			</div>

			{/* SECTION 2: STATUS BADGES & GLOW CHIPS (Completely static indicator badges) */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: isCompact ? "0.35rem" : "0.6rem",
				}}
			>
				<div
					style={{
						fontSize: isCompact ? "10px" : "11px",
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
						gap: isCompact ? "0.35rem" : "0.5rem",
					}}
				>
					<span
						style={{
							padding: isCompact ? "2px 8px" : "3px 10px",
							fontSize: isCompact ? "10px" : "11px",
							fontWeight: 600,
							borderRadius: "9999px",
							backgroundColor: tokens?.primary || "var(--primary, #38bdf8)",
							color: "#ffffff",
							userSelect: "none",
							display: "inline-block",
						}}
					>
						Primary Chip
					</span>
					<span
						style={{
							padding: isCompact ? "2px 8px" : "3px 10px",
							fontSize: isCompact ? "10px" : "11px",
							fontWeight: 600,
							borderRadius: "9999px",
							backgroundColor: tokens?.secondary || "var(--secondary, #818cf8)",
							color: "#ffffff",
							userSelect: "none",
							display: "inline-block",
						}}
					>
						Secondary Chip
					</span>
					<span
						style={{
							padding: isCompact ? "2px 8px" : "3px 10px",
							fontSize: isCompact ? "10px" : "11px",
							fontWeight: 600,
							borderRadius: "9999px",
							backgroundColor: tokens?.accent || "var(--accent, #34d399)",
							color: "#ffffff",
							userSelect: "none",
							display: "inline-block",
						}}
					>
						Accent Chip
					</span>
					<span
						style={{
							padding: isCompact ? "2px 8px" : "3px 10px",
							fontSize: isCompact ? "10px" : "11px",
							fontWeight: 600,
							borderRadius: "9999px",
							backgroundColor: tokens?.success || "var(--success, #10b981)",
							color: "#ffffff",
							userSelect: "none",
							display: "inline-block",
						}}
					>
						Success ● Active
					</span>
					<span
						style={{
							padding: isCompact ? "2px 8px" : "3px 10px",
							fontSize: isCompact ? "10px" : "11px",
							fontWeight: 600,
							borderRadius: "9999px",
							backgroundColor: tokens?.warning || "var(--warning, #f59e0b)",
							color: "#ffffff",
							userSelect: "none",
							display: "inline-block",
						}}
					>
						Warning ● Alert
					</span>
					<span
						style={{
							padding: isCompact ? "2px 8px" : "3px 10px",
							fontSize: isCompact ? "10px" : "11px",
							fontWeight: 600,
							borderRadius: "9999px",
							backgroundColor: tokens?.danger || "var(--danger, #ef4444)",
							color: "#ffffff",
							userSelect: "none",
							display: "inline-block",
						}}
					>
						Danger ● Critical
					</span>
					{/* Glow Pill */}
					<span
						style={{
							padding: isCompact ? "2px 10px" : "3px 12px",
							fontSize: isCompact ? "10px" : "11px",
							fontWeight: 700,
							borderRadius: "9999px",
							backgroundColor: tokens?.surface || "var(--surface, #111827)",
							border: `1px solid ${tokens?.glowColor || tokens?.primary || "var(--primary, #38bdf8)"}`,
							color:
								tokens?.glowColor ||
								tokens?.primary ||
								"var(--primary, #38bdf8)",
							boxShadow: `0 0 12px ${tokens?.glowColor || tokens?.primary || "var(--primary, #38bdf8)"}55`,
							userSelect: "none",
							display: "inline-block",
						}}
					>
						✨ Neon Glow Token
					</span>
				</div>
			</div>

			{/* SECTION 3: FORM CONTROLS, INPUTS, TOGGLE & SLIDER */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: isCompact ? "0.4rem" : "0.6rem",
				}}
			>
				<div
					style={{
						fontSize: isCompact ? "10px" : "11px",
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
						gridTemplateColumns: isCompact
							? "repeat(auto-fit, minmax(200px, 1fr))"
							: "repeat(auto-fit, minmax(240px, 1fr))",
						gap: isCompact ? "0.6rem" : "1rem",
					}}
				>
					{/* Text Input Field */}
					<div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
						<label
							htmlFor="allinone-email"
							style={{
								fontSize: isCompact ? "10px" : "11px",
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
								padding: isCompact ? "5px 10px" : "8px 12px",
								fontSize: isCompact ? "11px" : "12px",
								backgroundColor: tokens?.surface || "var(--surface, #111827)",
								border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
								borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
								color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
								outline: "none",
								fontFamily: tokens?.fontBody || "inherit",
								transition: "border-color 0.15s ease",
							}}
						/>
					</div>

					{/* Select Dropdown */}
					<div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
						<label
							htmlFor="allinone-select"
							style={{
								fontSize: isCompact ? "10px" : "11px",
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
								padding: isCompact ? "5px 10px" : "8px 12px",
								fontSize: isCompact ? "11px" : "12px",
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
									fontSize: isCompact ? "10px" : "11px",
									fontWeight: 600,
									color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
								}}
							>
								Fluid Scale Slider
							</span>
							<span
								style={{
									fontSize: isCompact ? "10px" : "11px",
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
								height: isCompact ? "4px" : "6px",
								marginTop: isCompact ? "3px" : "6px",
							}}
						/>
						{/* Progress Bar indicator */}
						<div
							style={{
								width: "100%",
								height: isCompact ? "3px" : "4px",
								backgroundColor: tokens?.surface || "var(--surface, #111827)",
								borderRadius: "9999px",
								overflow: "hidden",
								marginTop: "3px",
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
							padding: isCompact ? "6px 10px" : "8px 14px",
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
								fontSize: isCompact ? "10px" : "11px",
								fontWeight: 600,
								color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							}}
						>
							<div
								onClick={() => setSwitchOn(!switchOn)}
								style={{
									width: isCompact ? "30px" : "36px",
									height: isCompact ? "18px" : "20px",
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
										width: isCompact ? "14px" : "16px",
										height: isCompact ? "14px" : "16px",
										borderRadius: "9999px",
										backgroundColor: "#ffffff",
										position: "absolute",
										top: "2px",
										left: switchOn ? (isCompact ? "14px" : "18px") : "2px",
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
								fontSize: isCompact ? "10px" : "11px",
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
									width: isCompact ? "14px" : "16px",
									height: isCompact ? "14px" : "16px",
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
					padding: isCompact ? "8px 12px" : "12px 16px",
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
					<span style={{ fontSize: isCompact ? "16px" : "20px" }}>🚀</span>
					<div>
						<div
							style={{
								fontSize: isCompact ? "11px" : "12px",
								fontWeight: 700,
								color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
								fontFamily: tokens?.fontHeading || "var(--font-heading, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
							}}
						>
							Zero-Runtime CSS Engine Active
						</div>
						<div
							style={{
								fontSize: isCompact ? "10px" : "11px",
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
						onClick={() => setActiveSegment("tokens")}
						className="aio-btn"
						style={{
							padding: isCompact ? "4px 10px" : "5px 12px",
							fontSize: isCompact ? "10px" : "11px",
							fontWeight: 600,
							color: tokens?.primary || "var(--primary, #38bdf8)",
							backgroundColor: tokens?.card || "var(--card, #162032)",
							border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
						}}
					>
						Inspect Tokens
					</button>
				</div>
			</div>

			{/* CARD FOOTER WITH METADATA & FUNCTIONAL ACTIONS */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					borderTop: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
					paddingTop: isCompact ? "0.65rem" : "1rem",
					fontSize: isCompact ? "10px" : "11px",
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
						{extractFontFamily(tokens?.fontHeading) || "System"}
					</span>
					<span>•</span>
					<span style={{ fontFamily: "monospace" }}>
						Body:{" "}
						{extractFontFamily(tokens?.fontBody) || "System"}
					</span>
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
					<button
						type="button"
						onClick={handleReset}
						className="aio-btn aio-btn-subtle"
						style={{
							padding: isCompact ? "4px 10px" : "6px 14px",
							fontSize: isCompact ? "10px" : "11px",
							fontWeight: 600,
							color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
							backgroundColor: "transparent",
							border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
						}}
					>
						Reset
					</button>

					<button
						type="button"
						onClick={handleVerifySubmit}
						className="aio-btn"
						style={{
							padding: isCompact ? "4px 12px" : "6px 16px",
							fontSize: isCompact ? "10px" : "11px",
							fontWeight: 700,
							color: "#ffffff",
							backgroundColor: isSavedFeedback
								? tokens?.success || "var(--success, #10b981)"
								: tokens?.primary || "var(--primary, #38bdf8)",
							border: "none",
							borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
							boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
						}}
					>
						{isSavedFeedback ? "✓ State Verified" : "Verify Form State"}
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
						<div
							style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
						>
							<span style={{ fontSize: "1.25rem", color: tokens?.danger }}>
								⚠️
							</span>
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
							This modal dialog confirms that overlay backdrops, borders,
							surfaces, and danger tokens respond accurately in real-time.
						</p>

						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								gap: "0.5rem",
								paddingTop: "0.5rem",
							}}
						>
							<button
								type="button"
								onClick={() => setIsModalOpen(false)}
								className="aio-btn aio-btn-subtle"
								style={{
									padding: "6px 14px",
									fontSize: "11px",
									fontWeight: 600,
									borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
									backgroundColor: tokens?.card || "var(--card, #162032)",
									color: tokens?.textPrimary || "var(--text-primary, #f8fafc)",
									border: `1px solid ${tokens?.border || "var(--border, #1e293b)"}`,
								}}
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => setIsModalOpen(false)}
								className="aio-btn"
								style={{
									padding: "6px 14px",
									fontSize: "11px",
									fontWeight: 700,
									borderRadius: tokens?.radius || "var(--radius, 0.625rem)",
									backgroundColor: tokens?.danger || "var(--danger, #ef4444)",
									color: "#ffffff",
									border: "none",
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

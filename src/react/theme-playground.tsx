"use client";

import { PaintBoardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useContext, useEffect, useState } from "react";
import type { BaseTokens, ColorMode, ThemeDefinition } from "../core/types";
import { AllInOneCard } from "./all-in-one-card";
import { ThemeContext } from "./context";

export interface ThemePlaygroundProps {
	title?: string;
	subtitle?: string;
	initialTheme?: string;
	initialMode?: ColorMode;
	availableThemes?: ThemeDefinition[];
}

export function ThemePlayground({
	title = "Interactive Theme System Playground",
	subtitle = "Zero-runtime CSS custom properties, mechanical tactile physics, and live token customization in one dashboard.",
}: ThemePlaygroundProps) {
	const themeContext = useContext(ThemeContext);

	// Fallback state if ThemeProvider is not present
	const [localTheme, _setLocalTheme] = useState("dark-slate");
	const [localMode, _setLocalMode] = useState<ColorMode>("dark");
	const [localTactile, setLocalTactile] = useState(false);

	const isTactile =
		themeContext?.tactile !== undefined
			? themeContext.tactile
			: localTactile;

	const theme = themeContext?.theme || localTheme;
	const mode = themeContext?.mode || localMode;
	const resolvedMode = themeContext?.resolvedMode || "dark";
	const tokens = themeContext?.tokens as BaseTokens | undefined;
	const hasCustomizations = themeContext?.hasCustomizations || false;

	// Keep local tactile in sync if no context
	useEffect(() => {
		if (!themeContext) {
			const hasAttr =
				document.documentElement.getAttribute("data-tactile") === "true";
			setLocalTactile(hasAttr);
		}
	}, [themeContext]);

	const toggleTactile = () => {
		if (themeContext) {
			themeContext.setTactile?.(!isTactile);
		} else {
			const next = !isTactile;
			setLocalTactile(next);
			document.documentElement.setAttribute("data-tactile", String(next));
		}
	};

	const handleOpenStudio = () => {
		if (themeContext?.openStudio) {
			themeContext.openStudio();
		} else {
			const floatingBtn = document.querySelector(
				'button[aria-label="Open Theme Studio"]',
			) as HTMLButtonElement | null;
			if (floatingBtn) {
				floatingBtn.click();
			}
		}
	};

	const toggleMode = () => {
		const next = resolvedMode === "dark" ? "light" : "dark";
		if (themeContext) {
			themeContext.setMode(next);
		} else if (typeof document !== "undefined") {
			document.documentElement.classList.remove("light", "dark");
			document.documentElement.classList.add(next);
		}
	};

	return (
		<div
			className="w-full max-w-6xl mx-auto p-6 md:p-10 space-y-8"
			style={{
				maxWidth: "72rem",
				marginLeft: "auto",
				marginRight: "auto",
				padding: "1.5rem",
				display: "flex",
				flexDirection: "column",
				gap: "2rem",
				boxSizing: "border-box",
			}}
		>
			<style>{`
				.k79-playground-header {
					display: flex;
					flex-direction: column;
					gap: 1rem;
					padding-bottom: 1.5rem;
					border-bottom: 1px solid var(--border);
				}
				@media (min-width: 640px) {
					.k79-playground-header {
						flex-direction: row;
						align-items: center;
						justify-content: space-between;
					}
				}
				.k79-top-btn {
					background-color: var(--card);
					color: var(--text-primary);
					border: 1px solid var(--border);
					border-radius: var(--radius, 0.5rem);
					padding: 6px 12px;
					font-size: 12px;
					font-weight: 600;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					gap: 6px;
					box-sizing: border-box;
					cursor: pointer;
					user-select: none;
					outline: none;
					white-space: nowrap;
					flex-shrink: 0;
					transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.15s ease, filter 0.15s ease, background-color 0.15s ease;
				}
				.k79-top-btn:hover {
					transform: translateY(-2px);
					filter: brightness(1.1);
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
				}
				.k79-top-btn:active {
					transform: translateY(1px) scale(0.98);
					filter: brightness(0.95);
				}
				.k79-top-btn-active-tactile {
					background-color: var(--primary) !important;
					color: #ffffff !important;
					border-color: var(--primary) !important;
					font-weight: 700 !important;
				}
				[data-tactile="true"] .k79-top-btn {
					box-shadow: 4px 4px 0px 0px #000000 !important;
					border-color: #000000 !important;
					border-width: 2px !important;
				}
				[data-tactile="true"] .k79-top-btn:hover {
					transform: translate(-1px, -1px);
					box-shadow: 4px 4px 0px 0px #000000 !important;
				}
				[data-tactile="true"] .k79-top-btn:active {
					transform: translate(2px, 2px);
					box-shadow: 0px 0px 0px 0px #000000 !important;
				}
				.k79-stat-grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
					gap: 1rem;
				}
				.k79-stat-card {
					padding: 1rem;
					border-radius: var(--radius-card, var(--radius, 0.625rem));
					background-color: var(--card);
					border: 1px solid var(--border);
					display: flex;
					flex-direction: column;
					gap: 0.25rem;
					box-shadow: var(--shadow-sm);
					box-sizing: border-box;
				}
			`}</style>

			{/* PLAYGROUND HEADER */}
			<div className="k79-playground-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
				<div className="min-w-0 flex-1 pr-2">
					<div
						className="flex items-center gap-2"
						style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
					>
						<span
							className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"
							style={{
								width: "10px",
								height: "10px",
								borderRadius: "9999px",
								backgroundColor: "var(--accent, #34D399)",
							}}
						/>
						<span
							className="text-xs font-mono font-semibold tracking-wider uppercase text-text-muted"
							style={{
								fontSize: "12px",
								fontFamily: "monospace",
								fontWeight: 600,
								letterSpacing: "0.05em",
								textTransform: "uppercase",
								color: "var(--text-muted, #94A3B8)",
							}}
						>
							Interactive Design Sandbox
						</span>
					</div>
					<h1
						className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary mt-1 truncate"
						style={{
							fontSize: "1.875rem",
							fontWeight: 800,
							letterSpacing: "-0.025em",
							color: "var(--text-primary, #F8FAFC)",
							margin: "0.25rem 0 0 0",
							fontFamily: tokens?.fontHeading
								? `${tokens.fontHeading}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
								: "var(--font-heading, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
						}}
					>
						{title}
					</h1>
					<p
						className="text-xs md:text-sm text-text-muted mt-1 max-w-xl"
						style={{
							fontSize: "0.875rem",
							color: "var(--text-muted, #94A3B8)",
							margin: "0.25rem 0 0 0",
							maxWidth: "36rem",
						}}
					>
						{subtitle}
					</p>
				</div>

				{/* Single non-wrapping row of clean controls (Never breaks into 2nd line on tactile toggle) */}
				<div
					className="flex items-center gap-2 shrink-0 flex-nowrap"
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
						flexWrap: "nowrap",
						flexShrink: 0,
					}}
				>
					{/* Theme Studio Drawer Button */}
					<button
						type="button"
						onClick={handleOpenStudio}
						className="k79-top-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-card text-text-primary border border-border whitespace-nowrap flex items-center justify-center gap-1.5"
						style={{
							minWidth: "115px",
							width: "115px",
							textAlign: "center",
							boxSizing: "border-box",
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "6px",
							boxShadow: isTactile ? "4px 4px 0px 0px #000000" : undefined,
							borderColor: isTactile ? "#000000" : undefined,
							borderWidth: isTactile ? "2px" : undefined,
						}}
						title="Open Theme Studio Drawer"
					>
						<HugeiconsIcon
							icon={PaintBoardIcon}
							size={14}
							className="text-primary shrink-0"
						/>
						<span>Theme Editor</span>
					</button>

					{/* Appearance Mode Toggle */}
					<button
						type="button"
						onClick={toggleMode}
						className="k79-top-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-card text-text-primary border border-border whitespace-nowrap"
						style={{
							minWidth: "105px",
							width: "105px",
							textAlign: "center",
							boxSizing: "border-box",
							boxShadow: isTactile ? "4px 4px 0px 0px #000000" : undefined,
							borderColor: isTactile ? "#000000" : undefined,
							borderWidth: isTactile ? "2px" : undefined,
						}}
					>
						Mode: {resolvedMode === "dark" ? "🌙 Dark" : "☀️ Light"}
					</button>

					{/* Tactile Physics Toggle */}
					<button
						type="button"
						onClick={toggleTactile}
						className={`k79-top-btn px-3 py-1.5 text-xs font-semibold rounded-lg border whitespace-nowrap ${
							isTactile
								? "k79-top-btn-active-tactile bg-primary text-white border-primary font-bold shadow-sm"
								: "bg-card text-text-primary border-border"
						}`}
						style={{
							minWidth: "96px",
							width: "96px",
							textAlign: "center",
							boxSizing: "border-box",
							boxShadow: isTactile ? "4px 4px 0px 0px #000000" : undefined,
							borderColor: isTactile ? "#000000" : undefined,
							borderWidth: isTactile ? "2px" : undefined,
						}}
					>
						Tactile: {isTactile ? "⚡ On" : "Off"}
					</button>
				</div>
			</div>

			{/* KPI METRIC STAT CARDS */}
			<div
				className="k79-stat-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
					gap: "1rem",
				}}
			>
				<div
					className="k79-stat-card p-4 rounded-xl bg-card border border-border space-y-1"
					style={{
						padding: "1rem",
						borderRadius: "var(--radius-card, var(--radius, 0.625rem))",
						backgroundColor: "var(--card)",
						border: "1px solid var(--border)",
						display: "flex",
						flexDirection: "column",
						gap: "0.25rem",
						boxShadow: "var(--shadow-sm)",
						boxSizing: "border-box",
					}}
				>
					<span
						className="text-xs font-medium text-text-muted"
						style={{
							fontSize: "12px",
							fontWeight: 500,
							color: "var(--text-muted, #94A3B8)",
						}}
					>
						Monthly Recurring
					</span>
					<div
						className="text-2xl font-bold text-text-primary"
						style={{
							fontSize: "1.5rem",
							fontWeight: 700,
							color: "var(--text-primary, #F8FAFC)",
							letterSpacing: "-0.02em",
						}}
					>
						$48,290
					</div>
					<div
						className="text-xs text-success font-semibold flex items-center gap-1"
						style={{
							fontSize: "12px",
							color: "var(--success, #10B981)",
							fontWeight: 600,
							display: "flex",
							alignItems: "center",
							gap: "4px",
						}}
					>
						↑ +14.2% from last month
					</div>
				</div>

				<div
					className="k79-stat-card p-4 rounded-xl bg-card border border-border space-y-1"
					style={{
						padding: "1rem",
						borderRadius: "var(--radius-card, var(--radius, 0.625rem))",
						backgroundColor: "var(--card)",
						border: "1px solid var(--border)",
						display: "flex",
						flexDirection: "column",
						gap: "0.25rem",
						boxShadow: "var(--shadow-sm)",
						boxSizing: "border-box",
					}}
				>
					<span
						className="text-xs font-medium text-text-muted"
						style={{
							fontSize: "12px",
							fontWeight: 500,
							color: "var(--text-muted, #94A3B8)",
						}}
					>
						Active Sessions
					</span>
					<div
						className="text-2xl font-bold text-text-primary"
						style={{
							fontSize: "1.5rem",
							fontWeight: 700,
							color: "var(--text-primary, #F8FAFC)",
							letterSpacing: "-0.02em",
						}}
					>
						1,429
					</div>
					<div
						className="text-xs text-primary font-semibold flex items-center gap-1"
						style={{
							fontSize: "12px",
							color: "var(--primary, #38BDF8)",
							fontWeight: 600,
							display: "flex",
							alignItems: "center",
							gap: "4px",
						}}
					>
						● Real-time telemetry
					</div>
				</div>

				<div
					className="k79-stat-card p-4 rounded-xl bg-card border border-border space-y-1"
					style={{
						padding: "1rem",
						borderRadius: "var(--radius-card, var(--radius, 0.625rem))",
						backgroundColor: "var(--card)",
						border: "1px solid var(--border)",
						display: "flex",
						flexDirection: "column",
						gap: "0.25rem",
						boxShadow: "var(--shadow-sm)",
						boxSizing: "border-box",
					}}
				>
					<span
						className="text-xs font-medium text-text-muted"
						style={{
							fontSize: "12px",
							fontWeight: 500,
							color: "var(--text-muted, #94A3B8)",
						}}
					>
						Active Theme Palette
					</span>
					<div
						className="text-2xl font-bold text-text-primary capitalize"
						style={{
							fontSize: "1.5rem",
							fontWeight: 700,
							color: "var(--text-primary, #F8FAFC)",
							letterSpacing: "-0.02em",
							textTransform: "capitalize",
						}}
					>
						{theme}
					</div>
					<div
						className="text-xs text-text-muted font-mono"
						style={{
							fontSize: "12px",
							fontFamily: "monospace",
							color: "var(--text-muted, #94A3B8)",
						}}
					>
						Mode: {mode} ({resolvedMode})
					</div>
				</div>

				<div
					className="k79-stat-card p-4 rounded-xl bg-card border border-border space-y-1"
					style={{
						padding: "1rem",
						borderRadius: "var(--radius-card, var(--radius, 0.625rem))",
						backgroundColor: "var(--card)",
						border: "1px solid var(--border)",
						display: "flex",
						flexDirection: "column",
						gap: "0.25rem",
						boxShadow: "var(--shadow-sm)",
						boxSizing: "border-box",
					}}
				>
					<span
						className="text-xs font-medium text-text-muted"
						style={{
							fontSize: "12px",
							fontWeight: 500,
							color: "var(--text-muted, #94A3B8)",
						}}
					>
						Customized Tokens
					</span>
					<div
						className="text-2xl font-bold text-text-primary"
						style={{
							fontSize: "1.5rem",
							fontWeight: 700,
							color: "var(--text-primary, #F8FAFC)",
							letterSpacing: "-0.02em",
						}}
					>
						{hasCustomizations ? "Active" : "Standard"}
					</div>
					<div
						className="text-xs text-accent font-semibold flex items-center gap-1"
						style={{
							fontSize: "12px",
							color: "var(--accent, #34D399)",
							fontWeight: 600,
							display: "flex",
							alignItems: "center",
							gap: "4px",
						}}
					>
						{tokens?.radius || "0.625rem"} radius curve
					</div>
				</div>
			</div>

			{/* ALL-IN-ONE MASTER SHOWCASE CARD */}
			<AllInOneCard />
		</div>
	);
}

export const ThemeShowcase = ThemePlayground;

"use client";

import { AllInOneCard } from "./all-in-one-card";
import { useTheme } from "./use-theme";

export interface ThemePlaygroundProps {
	title?: string;
	subtitle?: string;
}

export function ThemePlayground({
	title = "Zenith Design System & Studio",
	subtitle = "Live testing harness for zero-runtime CSS tokens, mechanical physics, fluid elevation, and dynamic Fontsource typography.",
}: ThemePlaygroundProps = {}) {
	let themeContext: ReturnType<typeof useTheme> | null = null;
	try {
		// biome-ignore lint/correctness/useHookAtTopLevel: safe wrapper for pre-init testing
		themeContext = useTheme();
	} catch (_e) {
		// Graceful fallback when outside ThemeProvider before running init
	}

	const theme = themeContext ? themeContext.theme : "dark-slate";
	const mode = themeContext ? themeContext.mode : "dark";
	const resolvedMode = themeContext ? themeContext.resolvedMode : "dark";
	const tokens = themeContext ? themeContext.tokens : null;
	const hasCustomizations = themeContext
		? themeContext.hasCustomizations
		: false;
	const isTactile = themeContext ? Boolean(tokens?.tactile === "true") : false;

	const toggleTactile = () => {
		const nextTactile = !isTactile;
		if (themeContext) {
			themeContext.setCustomTokens({ tactile: nextTactile ? "true" : "false" });
		} else if (typeof document !== "undefined") {
			if (nextTactile)
				document.documentElement.setAttribute("data-tactile", "true");
			else document.documentElement.removeAttribute("data-tactile");
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
			}}
		>
			{/* PLAYGROUND HEADER */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
				<div>
					<div className="flex items-center gap-2">
						<span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
						<span className="text-xs font-mono font-semibold tracking-wider uppercase text-text-muted">
							Interactive Design Sandbox
						</span>
					</div>
					<h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary mt-1">
						{title}
					</h1>
					<p className="text-xs md:text-sm text-text-muted mt-1 max-w-xl">
						{subtitle}
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2.5">
					<button
						type="button"
						onClick={toggleMode}
						className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-card text-text-primary border border-border hover:bg-surface cursor-pointer transition-colors"
					>
						Mode: {resolvedMode === "dark" ? "🌙 Dark" : "☀️ Light"}
					</button>

					<button
						type="button"
						onClick={toggleTactile}
						className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer transition-all ${
							isTactile
								? "bg-primary text-white border-primary font-bold shadow-sm"
								: "bg-card text-text-primary border-border hover:bg-surface"
						}`}
					>
						Tactile: {isTactile ? "⚡ Enabled" : "Off"}
					</button>

					{themeContext && (
						<button
							type="button"
							onClick={themeContext.openStudio}
							className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-primary text-white shadow-md hover:opacity-90 cursor-pointer transition-opacity"
						>
							🎨 Open Theme Studio
						</button>
					)}
				</div>
			</div>

			{/* KPI METRIC STAT CARDS */}
			<div
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
					gap: "1rem",
				}}
			>
				<div className="p-4 rounded-xl bg-card border border-border space-y-1">
					<span className="text-xs font-medium text-text-muted">
						Monthly Recurring
					</span>
					<div className="text-2xl font-bold text-text-primary">$48,290</div>
					<div className="text-xs text-success font-semibold flex items-center gap-1">
						↑ +14.2% from last month
					</div>
				</div>

				<div className="p-4 rounded-xl bg-card border border-border space-y-1">
					<span className="text-xs font-medium text-text-muted">
						Active Sessions
					</span>
					<div className="text-2xl font-bold text-text-primary">1,429</div>
					<div className="text-xs text-primary font-semibold flex items-center gap-1">
						● Real-time telemetry
					</div>
				</div>

				<div className="p-4 rounded-xl bg-card border border-border space-y-1">
					<span className="text-xs font-medium text-text-muted">
						Active Theme Palette
					</span>
					<div className="text-2xl font-bold text-text-primary capitalize">
						{theme}
					</div>
					<div className="text-xs text-text-muted font-mono">
						Mode: {mode} ({resolvedMode})
					</div>
				</div>

				<div className="p-4 rounded-xl bg-card border border-border space-y-1">
					<span className="text-xs font-medium text-text-muted">
						Customized Tokens
					</span>
					<div className="text-2xl font-bold text-text-primary">
						{hasCustomizations ? "Active" : "Standard"}
					</div>
					<div className="text-xs text-accent font-semibold flex items-center gap-1">
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

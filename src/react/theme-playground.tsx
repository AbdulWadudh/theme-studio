"use client";

import { useState } from "react";
import { useTheme } from "./use-theme";

export function ThemePlayground() {
	let themeContext: ReturnType<typeof useTheme> | null = null;
	try {
		// biome-ignore lint/correctness/useHookAtTopLevel: safe wrapper for pre-init testing
		themeContext = useTheme();
	} catch (_e) {
		// Graceful fallback when outside ThemeProvider before running init
	}

	const [localCount, setLocalCount] = useState(0);
	const [localTab, setLocalTab] = useState<
		"overview" | "components" | "tokens"
	>("overview");
	const [isAlertOpen, setIsAlertOpen] = useState(false);
	const [localMode, setLocalMode] = useState<"light" | "dark">("dark");
	const [localTactile, setLocalTactile] = useState(false);
	const [tactileClicks, setTactileClicks] = useState(0);
	const [showPulseFeedback, setShowPulseFeedback] = useState(false);

	const theme = themeContext ? themeContext.theme : "dark-slate";
	const mode = themeContext ? themeContext.mode : localMode;
	const resolvedMode = themeContext ? themeContext.resolvedMode : localMode;
	const tokens = themeContext ? themeContext.tokens : null;
	const hasCustomizations = themeContext
		? themeContext.hasCustomizations
		: false;
	const isTactile = themeContext
		? Boolean(tokens?.tactile === "true")
		: localTactile;

	const toggleTactile = () => {
		const nextTactile = !isTactile;
		if (themeContext) {
			themeContext.setCustomTokens({ tactile: nextTactile ? "true" : "false" });
		} else {
			setLocalTactile(nextTactile);
			if (typeof document !== "undefined") {
				if (nextTactile)
					document.documentElement.setAttribute("data-tactile", "true");
				else document.documentElement.removeAttribute("data-tactile");
			}
		}
	};

	const toggleMode = () => {
		const next = resolvedMode === "dark" ? "light" : "dark";
		if (themeContext) {
			themeContext.setMode(next);
		} else {
			setLocalMode(next);
			if (typeof document !== "undefined") {
				document.documentElement.classList.remove("light", "dark");
				document.documentElement.classList.add(next);
			}
		}
	};

	return (
		<div className="w-full max-w-6xl mx-auto p-6 md:p-10 space-y-8">
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
						Zenith Design System &amp; Studio
					</h1>
					<p className="text-xs md:text-sm text-text-muted mt-1 max-w-xl">
						Live testing harness for zero-runtime CSS tokens, mechanical
						physics, fluid elevation, and dynamic Google Fonts streaming.
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
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

			{/* INTERACTIVE SHOWCASE & COMPONENT DEMOS */}
			<div
				className="p-6 rounded-2xl bg-surface border border-border space-y-6"
				style={{
					boxShadow: tokens?.shadow || "var(--shadow, none)",
				}}
			>
				<div className="flex items-center justify-between border-b border-border pb-4">
					<div>
						<h2 className="text-base font-bold text-text-primary">
							Interactive Showcase &amp; Physics Playground
						</h2>
						<p className="text-xs text-text-muted">
							Hover and click buttons to test tactile physics, shadows, and
							state.
						</p>
					</div>
					<div className="flex gap-2">
						{(["overview", "components", "tokens"] as const).map((tab) => (
							<button
								key={tab}
								type="button"
								onClick={() => setLocalTab(tab)}
								className={`px-3 py-1 text-xs rounded-lg capitalize cursor-pointer border ${
									localTab === tab
										? "bg-card text-primary border-border font-bold"
										: "text-text-muted border-transparent hover:text-text-primary"
								}`}
							>
								{tab}
							</button>
						))}
					</div>
				</div>

				{/* BUTTON ACTION STATES */}
				<div className="space-y-3">
					<div className="text-xs font-semibold text-text-muted uppercase tracking-wide">
						Button Action States:
					</div>
					<div className="flex flex-wrap items-center gap-3">
						<button
							type="button"
							onClick={() => setLocalCount((c) => c + 1)}
							className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-white border border-border cursor-pointer"
						>
							Primary ({localCount} clicks)
						</button>
						<button
							type="button"
							className="px-4 py-2 text-xs font-semibold rounded-lg bg-secondary text-white border border-border cursor-pointer"
						>
							Secondary Action
						</button>
						<button
							type="button"
							onClick={toggleTactile}
							className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white border border-border cursor-pointer"
						>
							⚡ Toggle Tactile ({isTactile ? "ON" : "OFF"})
						</button>
						{/* Interactive Mechanical Physics Tester */}
						<button
							type="button"
							onClick={() => {
								setTactileClicks((c) => c + 1);
								setShowPulseFeedback(true);
								setTimeout(() => setShowPulseFeedback(false), 500);
								if (typeof window !== "undefined" && "vibrate" in navigator) {
									navigator.vibrate?.(20);
								}
							}}
							className={`tactile-item tactile-always-active px-4 py-2 text-xs font-mono font-bold rounded-lg border-2 border-black transition-all cursor-pointer select-none ${
								showPulseFeedback
									? "bg-accent text-white"
									: "bg-primary text-white"
							}`}
							style={{
								boxShadow: "4px 4px 0px 0px #000000",
							}}
						>
							{showPulseFeedback
								? "💥 Pulse Registered!"
								: `Mechanical Physics (${tactileClicks})`}
						</button>
						<button
							type="button"
							onClick={() => setIsAlertOpen(true)}
							className="px-4 py-2 text-xs font-semibold rounded-lg bg-danger text-white border border-border cursor-pointer"
						>
							Trigger Alert Dialog
						</button>
						<button
							type="button"
							className="px-4 py-2 text-xs font-semibold rounded-lg bg-card text-text-primary border border-border cursor-pointer"
						>
							Ghost Outline
						</button>
						<button
							type="button"
							className="px-4 py-2 text-xs font-semibold rounded-full border border-border bg-surface text-text-primary cursor-pointer"
						>
							Pill Button (Full Radius)
						</button>
					</div>
				</div>

				{/* BADGES & CHIPS */}
				<div className="space-y-3">
					<div className="text-xs font-semibold text-text-muted uppercase tracking-wide">
						Status Badges &amp; Tokens:
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-primary text-white">
							Primary Badge
						</span>
						<span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-secondary text-white">
							Secondary
						</span>
						<span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-success text-white">
							Success State
						</span>
						<span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-warning text-white">
							Warning State
						</span>
						<span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-danger text-white">
							Danger State
						</span>
						<span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-accent text-white">
							Accent Glow
						</span>
					</div>
				</div>

				{/* FORM INPUT CONTROLS */}
				<div className="space-y-3">
					<div className="text-xs font-semibold text-text-muted uppercase tracking-wide">
						Form Controls &amp; Text Input:
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="playground-email"
								className="block text-xs font-semibold text-text-primary mb-1"
							>
								Email Address
							</label>
							<input
								id="playground-email"
								type="email"
								placeholder="developer@antigravity.io"
								className="w-full px-3 py-2 text-xs rounded-lg bg-card border border-border text-text-primary focus:outline-none focus:border-primary"
							/>
						</div>
						<div>
							<label
								htmlFor="playground-status"
								className="block text-xs font-semibold text-text-primary mb-1"
							>
								Project Environment
							</label>
							<select
								id="playground-status"
								className="w-full px-3 py-2 text-xs rounded-lg bg-card border border-border text-text-primary focus:outline-none focus:border-primary cursor-pointer"
							>
								<option>Production (US-East)</option>
								<option>Staging Preview</option>
								<option>Local Canary</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* SIMULATED ALERT MODAL */}
			{isAlertOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
					<div className="w-full max-w-sm p-6 rounded-2xl bg-surface border border-border shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
						<div className="flex items-center gap-2">
							<span className="text-danger font-bold text-lg">⚠️</span>
							<h3 className="text-base font-bold text-text-primary">
								Destructive Action Test
							</h3>
						</div>
						<p className="text-xs text-text-muted leading-relaxed">
							This simulated alert dialog confirms that modal overlays,
							backdrops, borders, and danger colors honor your active studio
							tokens correctly.
						</p>
						<div className="flex items-center justify-end gap-2 pt-2">
							<button
								type="button"
								onClick={() => setIsAlertOpen(false)}
								className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-card text-text-primary border border-border hover:bg-surface cursor-pointer"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => setIsAlertOpen(false)}
								className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-danger text-white cursor-pointer hover:opacity-90"
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export const ThemeShowcase = ThemePlayground;

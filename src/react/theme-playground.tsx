"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./use-theme";

export interface ThemePlaygroundProps {
	title?: string;
	className?: string;
}

export function ThemePlayground({
	title = "Theme Studio Component Playground",
	className = "",
}: ThemePlaygroundProps) {
	let themeContext: ReturnType<typeof useTheme> | null = null;
	try {
		// biome-ignore lint/correctness/useHookAtTopLevel: safe wrapper for pre-init testing
		themeContext = useTheme();
	} catch (_e) {
		// Graceful fallback when outside ThemeProvider before running init
	}

	const [localCount, setLocalCount] = useState(0);
	const [tactileClicks, setTactileClicks] = useState(0);
	const [showPulseFeedback, setShowPulseFeedback] = useState(false);
	const [localTab, setLocalTab] = useState<
		"overview" | "components" | "tokens"
	>("overview");
	const [isAlertOpen, setIsAlertOpen] = useState(false);
	const [localMode, setLocalMode] = useState<"light" | "dark">("dark");
	const [localTactile, setLocalTactile] = useState(false);

	const theme = themeContext ? themeContext.theme : "dark-slate";
	const _mode = themeContext ? themeContext.mode : localMode;
	const resolvedMode = themeContext ? themeContext.resolvedMode : localMode;
	const tokens = themeContext ? themeContext.tokens : null;
	const hasCustomizations = themeContext
		? themeContext.hasCustomizations
		: false;
	const isTactile = themeContext
		? Boolean(tokens?.tactile === "true")
		: localTactile;

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
	transition: transform 120ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 120ms cubic-bezier(0.16, 1, 0.3, 1) !important;
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
`;
			document.head.appendChild(style);
		}
	}, []);

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
		}
	};

	return (
		<div
			className={`w-full max-w-5xl mx-auto p-6 space-y-8 font-sans ${className}`}
		>
			{/* HEADER & QUICK CONTROLS */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-border">
				<div>
					<div className="flex items-center gap-2">
						<span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
						<h1 className="text-xl font-bold tracking-tight text-text-primary">
							{title}
						</h1>
					</div>
					<p className="text-xs text-text-muted mt-1">
						Active Theme:{" "}
						<span className="font-semibold text-primary">{theme}</span> |
						Appearance: <span className="capitalize">{resolvedMode}</span>
						{isTactile && (
							<span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-canvas">
								TACTILE PHYSICS ACTIVE
							</span>
						)}
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2">
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
								? "bg-primary text-canvas border-primary font-bold shadow-sm"
								: "bg-card text-text-primary border-border hover:bg-surface"
						}`}
					>
						Tactile: {isTactile ? "⚡ Enabled" : "Off"}
					</button>

					{themeContext && (
						<button
							type="button"
							onClick={themeContext.openStudio}
							className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-primary text-canvas shadow-md hover:opacity-90 cursor-pointer transition-opacity"
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
						Conversion Rate
					</span>
					<div className="text-2xl font-bold text-text-primary">3.84%</div>
					<div className="text-xs text-warning font-semibold flex items-center gap-1">
						⚡ Optimizing checkout
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
							Interactive Showcase & Physics Playground
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
							className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-canvas border border-border cursor-pointer"
						>
							Primary ({localCount} clicks)
						</button>
						<button
							type="button"
							className="px-4 py-2 text-xs font-semibold rounded-lg bg-secondary text-canvas border border-border cursor-pointer"
						>
							Secondary Action
						</button>
						<button
							type="button"
							onClick={toggleTactile}
							className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-canvas border border-border cursor-pointer"
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
									? "bg-accent text-canvas"
									: "bg-primary text-canvas"
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
							className="px-4 py-2 text-xs font-semibold rounded-lg bg-danger text-canvas border border-border cursor-pointer"
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
						Status Badges & Tokens:
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-primary text-canvas">
							Primary Badge
						</span>
						<span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-secondary text-canvas">
							Secondary
						</span>
						<span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-success text-canvas">
							Success State
						</span>
						<span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-warning text-canvas">
							Warning State
						</span>
						<span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-danger text-canvas">
							Danger State
						</span>
						<span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-accent text-canvas">
							Accent Glow
						</span>
					</div>
				</div>

				{/* FORM INPUT CONTROLS */}
				<div className="space-y-3">
					<div className="text-xs font-semibold text-text-muted uppercase tracking-wide">
						Form Controls & Text Input:
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
								className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-danger text-canvas cursor-pointer hover:opacity-90"
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

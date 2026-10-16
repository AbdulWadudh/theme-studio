"use client";

import { useState } from "react";
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
	const [localTab, setLocalTab] = useState<
		"overview" | "components" | "tokens"
	>("overview");
	const [isAlertOpen, setIsAlertOpen] = useState(false);
	const [localMode, setLocalMode] = useState<"light" | "dark">("dark");
	const [localTactile, setLocalTactile] = useState(false);

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

	const presets = [
		{ id: "dark-slate", name: "Dark Slate" },
		{ id: "neobrutalism", name: "Neobrutalism" },
		{ id: "nord", name: "Nord" },
		{ id: "terminal-emerald", name: "Terminal Emerald" },
		{ id: "obsidian-cyber", name: "Obsidian Cyber" },
		{ id: "light-clean", name: "Clean Light" },
	];

	return (
		<main
			className={
				"min-h-screen p-6 sm:p-10 max-w-5xl mx-auto space-y-8 font-sans " +
				className
			}
			style={{ fontFamily: tokens?.fontBody || "inherit" }}
		>
			{/* HEADER */}
			<header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
				<div>
					<div className="flex items-center gap-2">
						<h1
							className="text-2xl font-bold tracking-tight text-text-primary"
							style={{
								fontFamily: tokens?.fontHeading || "inherit",
							}}
						>
							{title}
						</h1>
						<span className="text-xs px-2 py-0.5 rounded-lg font-mono font-bold bg-primary text-canvas">
							{themeContext ? "Studio Active" : "Pre-Init Standby"}
						</span>
					</div>
					<p className="text-sm text-text-muted mt-1">
						Client-Side Theme Engine, Live Customizer & Physics Tester
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2.5">
					{/* DIRECT ON-SCREEN TACTILE TOGGLE */}
					<button
						type="button"
						onClick={toggleTactile}
						className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
							isTactile
								? "bg-accent text-canvas border-accent"
								: "bg-surface text-text-muted border-border hover:text-text-primary"
						}`}
					>
						{isTactile ? "⚡ Tactile: ON" : "⚪ Tactile: OFF"}
					</button>

					{/* APPEARANCE MODE TOGGLE */}
					<button
						type="button"
						onClick={toggleMode}
						className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface text-text-primary border border-border cursor-pointer hover:bg-card"
					>
						{resolvedMode === "dark" ? "☀️ Light" : "🌙 Dark"}
					</button>

					{/* OPEN STUDIO DRAWER */}
					<button
						type="button"
						onClick={() => themeContext?.openStudio()}
						disabled={!themeContext}
						className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-canvas cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{themeContext ? "Open Theme Studio" : "Run CLI to Enable Studio"}
					</button>
				</div>
			</header>

			{/* QUICK PRESET SWITCHER */}
			<div className="space-y-2">
				<div className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
					Quick Preset Switcher:
				</div>
				<div className="flex flex-wrap gap-2">
					{presets.map((p) => (
						<button
							key={p.id}
							type="button"
							onClick={() => themeContext?.setTheme(p.id)}
							disabled={!themeContext}
							className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer disabled:opacity-60 ${
								theme === p.id
									? "bg-primary text-canvas border-primary font-semibold"
									: "bg-card text-text-primary border-border hover:border-primary"
							}`}
						>
							{p.name}
						</button>
					))}
				</div>
			</div>

			{/* ACTIVE STATE OVERVIEW */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
				<div
					className="p-4 rounded-lg bg-surface border border-border"
					style={{ boxShadow: "var(--shadow-sm)" }}
				>
					<div className="text-[10px] text-text-muted uppercase font-mono">
						Active Theme
					</div>
					<div className="text-sm font-semibold capitalize text-text-primary mt-1">
						{theme}
					</div>
				</div>
				<div
					className="p-4 rounded-lg bg-surface border border-border"
					style={{ boxShadow: "var(--shadow-sm)" }}
				>
					<div className="text-[10px] text-text-muted uppercase font-mono">
						Resolved Mode
					</div>
					<div className="text-sm font-semibold capitalize text-text-primary mt-1">
						{mode} ({resolvedMode})
					</div>
				</div>
				<div
					onClick={toggleTactile}
					className="p-4 rounded-lg bg-surface border border-border cursor-pointer hover:border-accent transition-colors"
					style={{ boxShadow: "var(--shadow-sm)" }}
				>
					<div className="text-[10px] text-text-muted uppercase font-mono flex items-center justify-between">
						<span>Tactile Physics</span>
						<span className="text-[9px] underline">click to toggle</span>
					</div>
					<div className="text-sm font-semibold text-accent mt-1">
						{isTactile ? "⚡ Enabled" : "Disabled"}
					</div>
				</div>
				<div
					className="p-4 rounded-lg bg-surface border border-border"
					style={{ boxShadow: "var(--shadow-sm)" }}
				>
					<div className="text-[10px] text-text-muted uppercase font-mono">
						Custom Modifications
					</div>
					<div className="text-sm font-semibold text-primary mt-1">
						{hasCustomizations ? "Modified" : "Default"}
					</div>
				</div>
			</div>

			{/* INTERACTIVE COMPONENT SHOWCASE */}
			<section
				className="p-6 rounded-card bg-surface border border-border space-y-6"
				style={{ boxShadow: "var(--shadow)" }}
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

				{/* CARD GRID */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
					<div
						className="p-5 rounded-lg bg-card border border-border flex flex-col justify-between transition-all"
						style={{ boxShadow: "var(--shadow)" }}
					>
						<div className="space-y-2">
							<div className="w-7 h-7 rounded-lg bg-primary text-canvas flex items-center justify-center font-bold text-xs">
								01
							</div>
							<h3 className="font-semibold text-sm text-text-primary">
								Surface & Canvas
							</h3>
							<p className="text-xs text-text-muted leading-relaxed">
								Tokens adapt seamlessly across dark and light palettes with
								instant CSS variable updates.
							</p>
						</div>
						<div className="pt-4 mt-auto">
							<button
								type="button"
								onClick={() => setLocalCount((c) => c + 1)}
								className="w-full py-2 text-xs font-semibold rounded-lg bg-primary text-canvas border border-border cursor-pointer"
							>
								Confirm ({localCount})
							</button>
						</div>
					</div>

					<div
						className="p-5 rounded-lg bg-card border border-border flex flex-col justify-between transition-all"
						style={{ boxShadow: "var(--shadow)" }}
					>
						<div className="space-y-2">
							<div className="w-7 h-7 rounded-lg bg-secondary text-canvas flex items-center justify-center font-bold text-xs">
								02
							</div>
							<h3 className="font-semibold text-sm text-text-primary">
								Cross-Tab Broadcast
							</h3>
							<p className="text-xs text-text-muted leading-relaxed">
								Open another browser tab and adjust colors to see synchronized
								theme updates.
							</p>
						</div>
						<div className="pt-4 mt-auto">
							<button
								type="button"
								onClick={toggleTactile}
								className="w-full py-2 text-xs font-semibold rounded-lg bg-secondary text-canvas border border-border cursor-pointer"
							>
								{isTactile ? "Disable Physics" : "Enable Physics"}
							</button>
						</div>
					</div>

					<div
						className="p-5 rounded-lg bg-card border border-border flex flex-col justify-between transition-all"
						style={{ boxShadow: "var(--shadow)" }}
					>
						<div className="space-y-2">
							<div className="w-7 h-7 rounded-lg bg-danger text-canvas flex items-center justify-center font-bold text-xs">
								03
							</div>
							<h3 className="font-semibold text-sm text-text-primary">
								Alert Confirmation
							</h3>
							<p className="text-xs text-text-muted leading-relaxed">
								Test modal overlay dialogs with theme tokens and backdrop blur.
							</p>
						</div>
						<div className="pt-4 mt-auto">
							<button
								type="button"
								onClick={() => setIsAlertOpen(true)}
								className="w-full py-2 text-xs font-semibold rounded-lg bg-danger text-canvas border border-border cursor-pointer"
							>
								Open Alert Dialog
							</button>
						</div>
					</div>
				</div>

				{/* FORM INPUTS & BADGES */}
				<div className="space-y-3 pt-2 border-t border-border">
					<div className="text-xs font-semibold text-text-muted uppercase tracking-wide">
						Form Controls & Status Badges:
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div>
							<label className="text-xs text-text-muted block mb-1">
								Text Field
							</label>
							<input
								type="text"
								placeholder="Type here..."
								defaultValue="Custom Theme Input"
								className="w-full px-3 py-1.5 text-xs rounded-lg bg-card text-text-primary border border-border focus:outline-hidden focus:border-primary"
							/>
						</div>
						<div>
							<label className="text-xs text-text-muted block mb-1">
								Semantic Badges
							</label>
							<div className="flex gap-2 items-center pt-1">
								<span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-success text-canvas">
									Success
								</span>
								<span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-warning text-canvas">
									Warning
								</span>
								<span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-danger text-canvas">
									Danger
								</span>
							</div>
						</div>
						<div>
							<label className="text-xs text-text-muted block mb-1">
								Accent Badge
							</label>
							<div className="flex gap-2 items-center pt-1">
								<span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-accent text-canvas">
									Accent Glow
								</span>
								<span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary text-canvas">
									Primary
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ALERT DIALOG MODAL */}
			{isAlertOpen && (
				<div
					role="dialog"
					aria-modal="true"
					onClick={() => setIsAlertOpen(false)}
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
				>
					<div
						onClick={(e) => e.stopPropagation()}
						className="w-full max-w-md p-6 bg-card border border-border rounded-lg space-y-4"
						style={{ boxShadow: "var(--shadow-lg)" }}
					>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<h3
									className="text-lg font-bold text-text-primary"
									style={{
										fontFamily: tokens?.fontHeading || "inherit",
									}}
								>
									Are you absolutely sure?
								</h3>
								<span className="text-xs font-mono font-bold px-2 py-0.5 rounded-sm bg-danger text-canvas">
									Alert Dialog
								</span>
							</div>
							<p className="text-xs text-text-muted leading-relaxed">
								This action cannot be undone. This will reset all customizations
								and tokens to the active preset default.
							</p>
						</div>

						<div className="flex items-center justify-end gap-3 pt-2">
							<button
								type="button"
								onClick={() => setIsAlertOpen(false)}
								className="px-4 py-2 text-xs font-semibold rounded-lg bg-card text-text-primary border border-border hover:bg-surface cursor-pointer"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={() => setIsAlertOpen(false)}
								className="px-4 py-2 text-xs font-semibold rounded-lg bg-danger text-canvas border border-border hover:opacity-90 cursor-pointer"
							>
								Continue
							</button>
						</div>
					</div>
				</div>
			)}

			{/* FOOTER */}
			<footer className="p-4 rounded-lg bg-surface border border-border flex items-center justify-between text-xs text-text-muted">
				<span>
					✨ <strong>Floating Palette:</strong> Click the floating icon at
					bottom-right to open Theme Studio.
				</span>
				<span className="font-mono text-[11px]">{title}</span>
			</footer>
		</main>
	);
}

export const ThemeShowcase = ThemePlayground;

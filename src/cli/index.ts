import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { defaultPresets } from "../core/presets";
import { backupFile, runRevert } from "./backup";

const cwd = process.cwd();

interface PackageJson {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	[key: string]: unknown;
}

function getPackageJson(): PackageJson {
	const pkgPath = path.join(cwd, "package.json");
	if (!fs.existsSync(pkgPath)) return {};
	try {
		return JSON.parse(fs.readFileSync(pkgPath, "utf8")) as PackageJson;
	} catch {
		return {};
	}
}

function getDependencies(): Record<string, string> {
	const pkg = getPackageJson();
	return { ...pkg.dependencies, ...pkg.devDependencies };
}

function copyToClipboard(text: string): boolean {
	try {
		if (process.platform === "win32") {
			execSync("clip", { input: text, stdio: ["pipe", "ignore", "ignore"] });
			return true;
		}
		if (process.platform === "darwin") {
			execSync("pbcopy", {
				input: text,
				stdio: ["pipe", "ignore", "ignore"],
			});
			return true;
		}
		try {
			execSync("xclip -selection clipboard", {
				input: text,
				stdio: ["pipe", "ignore", "ignore"],
			});
			return true;
		} catch {
			execSync("wl-copy", {
				input: text,
				stdio: ["pipe", "ignore", "ignore"],
			});
			return true;
		}
	} catch {
		return false;
	}
}

function detectPackageManager(): "bun" | "pnpm" | "npm" | "yarn" {
	if (
		fs.existsSync(path.join(cwd, "bun.lockb")) ||
		fs.existsSync(path.join(cwd, "bun.lock"))
	)
		return "bun";
	if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
	if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
	return "npm";
}

function detectFramework(): "next-app" | "next-pages" | "vite" | "react" {
	const deps = getDependencies();
	if (deps.next) {
		if (
			fs.existsSync(path.join(cwd, "app")) ||
			fs.existsSync(path.join(cwd, "src", "app"))
		) {
			return "next-app";
		}
		return "next-pages";
	}
	if (deps.vite) return "vite";
	return "react";
}

function detectNextVersion(): number {
	const deps = getDependencies();
	const nextVer = deps.next;
	if (!nextVer) return 15;
	const match = String(nextVer).match(/\d+/);
	return match ? Number.parseInt(match[0], 10) : 15;
}

function detectReactVersion(): number {
	const deps = getDependencies();
	const reactVer = deps.react;
	if (!reactVer) return 19;
	const match = String(reactVer).match(/\d+/);
	return match ? Number.parseInt(match[0], 10) : 19;
}

function detectTailwindVersion(): "v4" | "v3" | "none" {
	const deps = getDependencies();
	const twVer = String(deps.tailwindcss || "");
	if (twVer) {
		if (twVer.includes("3.")) return "v3";
		if (twVer.includes("4.")) return "v4";
	}
	if (
		fs.existsSync(path.join(cwd, "tailwind.config.js")) ||
		fs.existsSync(path.join(cwd, "tailwind.config.ts")) ||
		fs.existsSync(path.join(cwd, "tailwind.config.cjs")) ||
		fs.existsSync(path.join(cwd, "tailwind.config.mjs"))
	) {
		return "v3";
	}
	return "v4";
}

function detectNextThemes(): boolean {
	const deps = getDependencies();
	return Boolean(deps["next-themes"]);
}

function detectShadcn(): boolean {
	if (fs.existsSync(path.join(cwd, "components.json"))) return true;
	const cssFile = findCssFile();
	if (cssFile && fs.existsSync(cssFile)) {
		const content = fs.readFileSync(cssFile, "utf8");
		if (content.includes("--background") || content.includes("--foreground"))
			return true;
	}
	return false;
}

function detectDaisyUI(): boolean {
	const deps = getDependencies();
	return Boolean(deps.daisyui);
}

function detectHeroUI(): boolean {
	const deps = getDependencies();
	return Boolean(deps["@heroui/react"] || deps["@nextui-org/react"]);
}

function detectMonorepo(): boolean {
	let curr = cwd;
	for (let i = 0; i < 4; i++) {
		if (
			fs.existsSync(path.join(curr, "turbo.json")) ||
			fs.existsSync(path.join(curr, "pnpm-workspace.yaml")) ||
			fs.existsSync(path.join(curr, "lerna.json"))
		) {
			return true;
		}
		const parent = path.dirname(curr);
		if (parent === curr) break;
		curr = parent;
	}
	return false;
}

function findCssFile(): string | null {
	const candidates = [
		"src/app/globals.css",
		"app/globals.css",
		"src/globals.css",
		"src/index.css",
		"src/styles/globals.css",
		"styles/globals.css",
		"src/App.css",
	];
	for (const c of candidates) {
		const full = path.join(cwd, c);
		if (fs.existsSync(full)) return full;
	}
	return null;
}

function findLayoutFile(
	fw: "next-app" | "next-pages" | "vite" | "react",
): string | null {
	if (fw === "next-app") {
		const candidates = [
			"src/app/layout.tsx",
			"app/layout.tsx",
			"src/app/layout.jsx",
			"app/layout.jsx",
		];
		for (const c of candidates) {
			const full = path.join(cwd, c);
			if (fs.existsSync(full)) return full;
		}
		return path.join(cwd, "src/app/layout.tsx");
	}
	if (fw === "vite" || fw === "react") {
		const candidates = [
			"src/main.tsx",
			"src/main.jsx",
			"src/index.tsx",
			"src/index.jsx",
		];
		for (const c of candidates) {
			const full = path.join(cwd, c);
			if (fs.existsSync(full)) return full;
		}
		return path.join(cwd, "src/main.tsx");
	}
	return null;
}

function printCleanCodeBlock(title: string, code: string) {
	console.log(
		`\n${pc.bold(pc.cyan(`─── ${title} `))}${pc.cyan("─".repeat(Math.max(4, 55 - title.length)))}`,
	);
	console.log(code);
	console.log(`${pc.cyan("─".repeat(60))}\n`);
}

const BASE_VARIABLES_TEMPLATE = `:root {
	--canvas: #0b0f17;
	--surface: #111827;
	--card: #162032;
	--border: #1e293b;
	--primary: #38bdf8;
	--secondary: #818cf8;
	--accent: #34d399;
	--success: #10b981;
	--danger: #ef4444;
	--warning: #f59e0b;
	--text-primary: #f8fafc;
	--text-muted: #94a3b8;
	--radius: 0.625rem;
	--radius-card: 0.625rem;
	--shadow:
		0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3);
	--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
	--shadow-lg:
		0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
	--font-heading: "Space Grotesk", system-ui, sans-serif;
	--font-body: "Inter", system-ui, sans-serif;
}

body {
	background-color: var(--canvas);
	color: var(--text-primary);
	font-family: var(--font-body);
}`;

const TAILWIND_V4_THEME_TEMPLATE = `@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
	--radius-sm: calc(var(--radius) - 4px);
	--radius-md: calc(var(--radius) - 2px);
	--radius-lg: var(--radius);
	--radius-xl: calc(var(--radius) + 4px);
	--color-canvas: var(--canvas);
	--color-surface: var(--surface);
	--color-card: var(--card);
	--color-border: var(--border);
	--color-primary: var(--primary);
	--color-secondary: var(--secondary);
	--color-accent: var(--accent);
	--color-success: var(--success);
	--color-danger: var(--danger);
	--color-warning: var(--warning);
	--color-text-primary: var(--text-primary);
	--color-text-muted: var(--text-muted);

	--shadow: var(--shadow);
	--shadow-sm: var(--shadow-sm);
	--shadow-lg: var(--shadow-lg);

	--radius: var(--radius);
	--radius-card: var(--radius-card);
	--radius-xs: calc(var(--radius) * 0.25);
	--radius-sm: calc(var(--radius) * 0.5);
	--radius-md: calc(var(--radius) * 0.75);
	--radius-lg: var(--radius);
	--radius-xl: calc(var(--radius) * 1.25);
	--radius-2xl: calc(var(--radius) * 1.5);
	--radius-3xl: calc(var(--radius) * 2);

	--font-heading: var(--font-heading);
	--font-body: var(--font-body);
}`;

const TRANSITIONS_AND_TACTILE_TEMPLATE = `/* Smooth global transitions across all theme components (disabled during initial load) */
html:not(.no-transitions) *,
html:not(.no-transitions) *::before,
html:not(.no-transitions) *::after {
	transition-property:
		background-color, border-color, color, fill, stroke, box-shadow,
		border-radius;
	transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
	transition-duration: 200ms;
}

html.no-transitions *,
html.no-transitions [data-tactile="true"] button,
html.no-transitions [data-tactile="true"] [role="button"],
html.no-transitions [data-tactile="true"] .tactile-item {
	transition: none !important;
}

/* Tactile Neobrutalism on-hover and active physics */
[data-tactile="true"] button:not(:disabled),
[data-tactile="true"] [role="button"],
[data-tactile="true"] .tactile-item {
	box-shadow: 4px 4px 0px 0px #000000 !important;
	border-color: #000000 !important;
	transition:
		transform 120ms cubic-bezier(0.16, 1, 0.3, 1),
		box-shadow 120ms cubic-bezier(0.16, 1, 0.3, 1) !important;
}

[data-tactile="true"] button:not(:disabled):hover,
[data-tactile="true"] [role="button"]:hover,
[data-tactile="true"] .tactile-item:hover {
	transform: translate(2px, 2px);
	box-shadow: 2px 2px 0px 0px #000000 !important;
}

[data-tactile="true"] button:not(:disabled):active,
[data-tactile="true"] [role="button"]:active,
[data-tactile="true"] .tactile-item:active {
	transform: translate(4px, 4px) !important;
	box-shadow: 0px 0px 0px 0px #000000 !important;
}

/* Dynamic Radius Utilities (Adapts Tailwind v3, v4 and custom components) */
:root {
	--radius-xs: calc(var(--radius) * 0.25);
	--radius-sm: calc(var(--radius) * 0.5);
	--radius-md: calc(var(--radius) * 0.75);
	--radius-lg: var(--radius);
	--radius-xl: calc(var(--radius) * 1.25);
	--radius-2xl: calc(var(--radius) * 1.5);
	--radius-3xl: calc(var(--radius) * 2);
}

.rounded-xs { border-radius: var(--radius-xs) !important; }
.rounded-sm { border-radius: var(--radius-sm) !important; }
.rounded-md { border-radius: var(--radius-md) !important; }
.rounded, .rounded-lg { border-radius: var(--radius) !important; }
.rounded-xl { border-radius: var(--radius-xl) !important; }
.rounded-2xl { border-radius: var(--radius-2xl) !important; }
.rounded-3xl { border-radius: var(--radius-3xl) !important; }
.rounded-card { border-radius: var(--radius-card) !important; }

body {
	background-color: var(--canvas);
	color: var(--text-primary);
	font-family: var(--font-body, system-ui, -apple-system, sans-serif);
	margin: 0;
	min-height: 100vh;
}

h1,
h2,
h3,
h4,
h5,
h6 {
	font-family: var(--font-heading, var(--font-body, inherit));
}`;

const SHADCN_BRIDGE_TEMPLATE = `/* shadcn/ui <-> @k79/theme-studio Bridge */
:root {
	--background: var(--canvas);
	--foreground: var(--text-primary);
	--card: var(--card);
	--card-foreground: var(--text-primary);
	--popover: var(--surface);
	--popover-foreground: var(--text-primary);
	--primary: var(--primary);
	--primary-foreground: var(--canvas);
	--secondary: var(--surface);
	--secondary-foreground: var(--text-primary);
	--muted: var(--surface);
	--muted-foreground: var(--text-muted);
	--accent: var(--accent);
	--accent-foreground: var(--canvas);
	--destructive: var(--danger);
	--destructive-foreground: #ffffff;
	--border: var(--border);
	--input: var(--border);
	--ring: var(--primary);
	--radius: var(--radius);
}`;

const DAISYUI_BRIDGE_TEMPLATE = `/* DaisyUI <-> @k79/theme-studio Bridge */
:root {
	--b1: var(--canvas);
	--b2: var(--surface);
	--b3: var(--card);
	--bc: var(--text-primary);
	--p: var(--primary);
	--s: var(--secondary);
	--a: var(--accent);
	--er: var(--danger);
	--su: var(--success);
	--wa: var(--warning);
	--rounded-box: var(--radius-card);
	--rounded-btn: var(--radius);
}`;

const HEROUI_BRIDGE_TEMPLATE = `/* HeroUI / NextUI <-> @k79/theme-studio Bridge */
:root {
	--heroui-background: var(--canvas);
	--heroui-foreground: var(--text-primary);
	--heroui-primary: var(--primary);
	--heroui-secondary: var(--secondary);
	--heroui-success: var(--success);
	--heroui-warning: var(--warning);
	--heroui-danger: var(--danger);
	--heroui-radius: var(--radius);
}`;

function getPlaygroundTargetPath(
	framework: ReturnType<typeof detectFramework>,
): {
	targetPath: string;
	isRoute: boolean;
} {
	if (framework === "next-app") {
		const appDir = fs.existsSync(path.join(cwd, "src", "app"))
			? path.join(cwd, "src", "app")
			: path.join(cwd, "app");
		return {
			targetPath: path.join(appDir, "theme-studio-demo", "page.tsx"),
			isRoute: true,
		};
	}
	if (framework === "next-pages") {
		const pagesDir = fs.existsSync(path.join(cwd, "src", "pages"))
			? path.join(cwd, "src", "pages")
			: path.join(cwd, "pages");
		return {
			targetPath: path.join(pagesDir, "theme-studio-demo.tsx"),
			isRoute: true,
		};
	}
	return {
		targetPath: path.join(cwd, "src", "ThemeStudioDemo.tsx"),
		isRoute: false,
	};
}

export async function runPlayground() {
	p.intro(
		`${pc.bgCyan(pc.black(" Playground "))} Generate Component Test Page`,
	);
	const framework = detectFramework();
	const { targetPath, isRoute } = getPlaygroundTargetPath(framework);

	fs.mkdirSync(path.dirname(targetPath), { recursive: true });
	if (fs.existsSync(targetPath)) {
		backupFile(targetPath);
	}

	const demoCode = `"use client";

import { ThemePlayground } from "@k79/theme-studio";

export default function ThemeStudioDemoPage() {
	return <ThemePlayground title="Theme Studio Component Playground" />;
}
`;

	fs.writeFileSync(targetPath, demoCode, "utf8");
	p.log.success(
		`Created interactive component playground at ${pc.green(path.relative(cwd, targetPath))}`,
	);
	if (isRoute) {
		p.outro(
			`Start your dev server and visit ${pc.cyan("http://localhost:3000/theme-studio-demo")}`,
		);
	} else {
		p.outro(
			`Import ${pc.cyan("<ThemeStudioDemo />")} into your App to test all components!`,
		);
	}
}

export async function runInit() {
	p.intro(
		`${pc.bgCyan(pc.black(" @k79/theme-studio "))} ${pc.bold("Theme Engine Initializer")}`,
	);

	const rawDeps = getDependencies();
	const detectedFw = detectFramework();
	const detectedPm = detectPackageManager();
	const detectedCss = findCssFile();
	let twVersion = detectTailwindVersion();
	let nextVersion = detectNextVersion();
	let reactVersion = detectReactVersion();
	const hasNextThemes = detectNextThemes();
	const hasShadcn = detectShadcn();
	const hasDaisyUI = detectDaisyUI();
	const hasHeroUI = detectHeroUI();
	const isMonorepo = detectMonorepo();

	// 1. Framework & Version Confirmation Flow
	let framework = detectedFw;
	const fwLabels: Record<string, string> = {
		"next-app": "Next.js (App Router)",
		"next-pages": "Next.js (Pages Router)",
		vite: "Vite + React (SPA)",
		react: "Generic React",
	};

	const versionSummaryParts = [
		`${pc.cyan(fwLabels[detectedFw] || detectedFw)}`,
		rawDeps.next ? `Next.js ${pc.green(`v${nextVersion}`)}` : null,
		rawDeps.react ? `React ${pc.green(`v${reactVersion}`)}` : null,
		twVersion !== "none"
			? `Tailwind ${pc.green(twVersion.toUpperCase())}`
			: null,
	].filter(Boolean);

	const confirmDetection = await p.confirm({
		message: `Detected project: ${versionSummaryParts.join(", ")}. Confirm to continue?`,
		initialValue: true,
	});

	if (p.isCancel(confirmDetection)) {
		p.cancel("Operation cancelled.");
		process.exit(0);
	}

	if (!confirmDetection) {
		const chosenFw = await p.select({
			message: "Select your project framework:",
			initialValue: detectedFw,
			options: [
				{
					value: "next-app",
					label: "Next.js (App Router)",
					hint: "app/layout.tsx with zero-flash SSR cookie state",
				},
				{
					value: "next-pages",
					label: "Next.js (Pages Router)",
					hint: "pages/_document.tsx & pages/_app.tsx",
				},
				{
					value: "vite",
					label: "Vite + React (SPA)",
					hint: "Client-only with pre-paint script & localStorage",
				},
				{
					value: "react",
					label: "Generic React (CRA / Custom)",
					hint: "Standard React 16.8 to 19",
				},
			],
		});

		if (p.isCancel(chosenFw)) {
			p.cancel("Operation cancelled.");
			process.exit(0);
		}
		framework = chosenFw as "next-app" | "next-pages" | "vite" | "react";

		if (framework === "next-app" || framework === "next-pages") {
			const chosenNextVer = await p.select({
				message: "Select Next.js version:",
				initialValue: String(nextVersion),
				options: [
					{
						value: "15",
						label: "Next.js 15+ (React 19, async cookies())",
					},
					{
						value: "14",
						label: "Next.js 14 / 13 (React 18, sync cookies())",
					},
				],
			});
			if (p.isCancel(chosenNextVer)) {
				p.cancel("Operation cancelled.");
				process.exit(0);
			}
			nextVersion = Number.parseInt(String(chosenNextVer), 10);
		} else {
			const chosenReactVer = await p.select({
				message: "Select React version:",
				initialValue: String(reactVersion),
				options: [
					{ value: "19", label: "React 19" },
					{ value: "18", label: "React 18" },
				],
			});
			if (p.isCancel(chosenReactVer)) {
				p.cancel("Operation cancelled.");
				process.exit(0);
			}
			reactVersion = Number.parseInt(String(chosenReactVer), 10);
		}

		const chosenTw = await p.select({
			message: "Select Tailwind CSS version:",
			initialValue: twVersion,
			options: [
				{
					value: "v4",
					label: "Tailwind CSS v4 (@theme in CSS)",
				},
				{
					value: "v3",
					label: "Tailwind CSS v3 (tailwind.config.js)",
				},
				{
					value: "none",
					label: "None / Plain CSS",
				},
			],
		});
		if (p.isCancel(chosenTw)) {
			p.cancel("Operation cancelled.");
			process.exit(0);
		}
		twVersion = chosenTw as "v4" | "v3" | "none";
	}

	if (hasNextThemes) {
		p.log.warn(
			`${pc.yellow("Notice:")} Detected ${pc.bold("next-themes")} in your project. ${pc.bold("@k79/theme-studio")} is a complete superset with SSR cookie hydration, live sliders, and preset management. You can safely replace \`next-themes\` or remove its wrapper.`,
		);
	}

	let shouldBridgeShadcn = false;
	let shouldBridgeDaisyUI = false;
	let shouldBridgeHeroUI = false;

	if (hasShadcn) {
		const shadcnChoice = await p.select({
			message:
				"Detected shadcn/ui. How would you like to handle token compatibility?",
			options: [
				{
					value: "auto",
					label: "Auto-bridge in CSS (Recommended)",
					hint: "Automatically connects --background, --primary, etc. to Theme Studio",
				},
				{
					value: "manual",
					label: "Manual Resolution (Display snippet / Copy to clipboard)",
					hint: "View and copy the pure CSS variable bridge to paste yourself",
				},
				{
					value: "skip",
					label: "Skip",
					hint: "Keep existing shadcn styling unchanged",
				},
			],
		});

		if (p.isCancel(shadcnChoice)) {
			p.cancel("Operation cancelled.");
			process.exit(0);
		}

		if (shadcnChoice === "auto") {
			shouldBridgeShadcn = true;
		} else if (shadcnChoice === "manual") {
			printCleanCodeBlock("shadcn/ui CSS Bridge", SHADCN_BRIDGE_TEMPLATE);
			const didCopy = copyToClipboard(SHADCN_BRIDGE_TEMPLATE);
			if (didCopy) {
				p.log.success(pc.green("✔ Copied shadcn CSS bridge to clipboard!"));
			}
		}
	}

	if (hasDaisyUI) {
		const daisyChoice = await p.select({
			message: "Detected DaisyUI. Bridge DaisyUI tokens with Theme Studio?",
			options: [
				{ value: "auto", label: "Auto-bridge (Recommended)" },
				{ value: "manual", label: "Display manual snippet" },
				{ value: "skip", label: "Skip" },
			],
		});
		if (!p.isCancel(daisyChoice) && daisyChoice === "auto")
			shouldBridgeDaisyUI = true;
		else if (daisyChoice === "manual") {
			printCleanCodeBlock("DaisyUI CSS Bridge", DAISYUI_BRIDGE_TEMPLATE);
			copyToClipboard(DAISYUI_BRIDGE_TEMPLATE);
		}
	}

	if (hasHeroUI) {
		const heroChoice = await p.select({
			message:
				"Detected HeroUI / NextUI. Bridge HeroUI tokens with Theme Studio?",
			options: [
				{ value: "auto", label: "Auto-bridge (Recommended)" },
				{ value: "manual", label: "Display manual snippet" },
				{ value: "skip", label: "Skip" },
			],
		});
		if (!p.isCancel(heroChoice) && heroChoice === "auto")
			shouldBridgeHeroUI = true;
		else if (heroChoice === "manual") {
			printCleanCodeBlock("HeroUI CSS Bridge", HEROUI_BRIDGE_TEMPLATE);
			copyToClipboard(HEROUI_BRIDGE_TEMPLATE);
		}
	}

	const setupMode = await p.select({
		message: "How would you like to configure your project?",
		options: [
			{
				value: "auto",
				label: "Automated Setup (Recommended)",
				hint: "CLI updates stylesheet and installs packages automatically",
			},
			{
				value: "manual",
				label: "Guided Manual Setup",
				hint: "CLI displays step-by-step code snippets for manual setup",
			},
		],
	});

	if (p.isCancel(setupMode)) {
		p.cancel("Operation cancelled.");
		process.exit(0);
	}

	const pm = await p.select({
		message: "Select package manager:",
		initialValue: detectedPm,
		options: [
			{ value: "bun", label: "bun" },
			{ value: "pnpm", label: "pnpm" },
			{ value: "npm", label: "npm" },
			{ value: "yarn", label: "yarn" },
		],
	});

	if (p.isCancel(pm)) {
		p.cancel("Operation cancelled.");
		process.exit(0);
	}

	const presetModeResult = await p.select({
		message: "Theme presets configuration:",
		options: [
			{
				value: "all",
				label: "Proceed with all default presets (Recommended - 17 themes)",
				hint: "Includes all pre-built palettes & styles",
			},
			{
				value: "pick",
				label: "Pick specific presets manually",
				hint: "Select a custom subset of themes",
			},
		],
		initialValue: "all",
	});

	if (p.isCancel(presetModeResult)) {
		p.cancel("Operation cancelled.");
		process.exit(0);
	}

	let selectedPresetIds: string[] = defaultPresets.map((pr) => pr.id);

	if (presetModeResult === "pick") {
		const selectedPresetsResult = await p.multiselect({
			message:
				"Select theme presets to include (Space to toggle, Enter to confirm):",
			options: defaultPresets.map((pr) => ({
				value: pr.id,
				label: pr.name,
				hint: pr.description,
			})),
			initialValues: defaultPresets.map((pr) => pr.id),
			required: true,
		});

		if (p.isCancel(selectedPresetsResult)) {
			p.cancel("Operation cancelled.");
			process.exit(0);
		}

		selectedPresetIds = selectedPresetsResult as string[];
	}

	const defaultPresetOptions = defaultPresets
		.filter((pr) => selectedPresetIds.includes(pr.id))
		.map((pr) => ({
			value: pr.id,
			label: pr.name,
			hint: pr.description,
		}));

	const defaultPresetResult = await p.select({
		message: "Choose your default active theme:",
		options: defaultPresetOptions,
		initialValue: defaultPresetOptions[0]?.value,
	});

	if (p.isCancel(defaultPresetResult)) {
		p.cancel("Operation cancelled.");
		process.exit(0);
	}
	const defaultPreset = String(defaultPresetResult);

	let packageStatus: "already-installed" | "installed" | "failed" | "skipped" =
		"skipped";
	let cssStatus: "already-configured" | "injected" | "skipped" = "skipped";
	let layoutStatus: "written" | "clipboard" | "printed" | "skipped" = "skipped";

	const isPackageAlreadyInstalled = Boolean(rawDeps["@k79/theme-studio"]);

	if (isPackageAlreadyInstalled) {
		packageStatus = "already-installed";
		p.log.success(
			`Package ${pc.green("@k79/theme-studio")} is already installed (${pc.dim(rawDeps["@k79/theme-studio"])}).`,
		);
	} else if (setupMode === "auto") {
		const shouldInstall = await p.confirm({
			message: "Install @k79/theme-studio package now?",
			initialValue: true,
		});

		if (shouldInstall && !p.isCancel(shouldInstall)) {
			const s = p.spinner();
			s.start(`Installing @k79/theme-studio via ${pm}...`);
			const cmd =
				pm === "bun"
					? "bun add @k79/theme-studio"
					: pm === "pnpm"
						? "pnpm add @k79/theme-studio"
						: pm === "yarn"
							? "yarn add @k79/theme-studio"
							: "npm install @k79/theme-studio";
			try {
				execSync(cmd, { stdio: "pipe", cwd });
				s.stop(`Installed ${pc.green("@k79/theme-studio")}`);
				packageStatus = "installed";
			} catch (err: unknown) {
				const errMsg =
					err && typeof err === "object" && "stderr" in err
						? String((err as { stderr: unknown }).stderr || "")
						: "";
				const hint =
					errMsg.includes("404") || errMsg.includes("not found")
						? `Package not found on registry. If testing locally, run: ${pc.cyan(`${pm} link @k79/theme-studio`)}`
						: `Run command manually: ${pc.cyan(cmd)}`;
				s.stop(pc.yellow(`Package install skipped. ${hint}`));
				packageStatus = "failed";
			}
		} else {
			packageStatus = "skipped";
		}
	}

	if (setupMode === "auto") {
		const shouldUpdateCss = await p.confirm({
			message:
				"Inject tokens, tactile physics & selected UI bridges into stylesheet?",
			initialValue: true,
		});

		if (shouldUpdateCss && !p.isCancel(shouldUpdateCss)) {
			let targetCss = detectedCss;
			if (!targetCss) {
				const customPath = await p.text({
					message: "Enter path for global stylesheet:",
					defaultValue: "src/globals.css",
				});
				if (!p.isCancel(customPath)) {
					targetCss = path.join(cwd, customPath as string);
				}
			}

			if (targetCss) {
				const s = p.spinner();
				s.start("Configuring stylesheet...");
				fs.mkdirSync(path.dirname(targetCss), { recursive: true });
				if (fs.existsSync(targetCss)) backupFile(targetCss);
				const existing = fs.existsSync(targetCss)
					? fs.readFileSync(targetCss, "utf8")
					: "";

				if (existing.includes("--canvas")) {
					s.stop(
						`Stylesheet ${pc.yellow(path.relative(cwd, targetCss))} already configured.`,
					);
					cssStatus = "already-configured";
				} else {
					const blocks: string[] = [];
					let prefix = "";
					if (twVersion === "v4" && !existing.includes("@import")) {
						prefix = '@import "tailwindcss";\n\n';
					} else if (twVersion === "v3" && !existing.includes("@tailwind")) {
						prefix =
							"@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n";
					}
					blocks.push(BASE_VARIABLES_TEMPLATE);
					if (twVersion === "v4") {
						blocks.push(TAILWIND_V4_THEME_TEMPLATE);
					}
					blocks.push(TRANSITIONS_AND_TACTILE_TEMPLATE);

					if (shouldBridgeShadcn) blocks.push(SHADCN_BRIDGE_TEMPLATE);
					if (shouldBridgeDaisyUI) blocks.push(DAISYUI_BRIDGE_TEMPLATE);
					if (shouldBridgeHeroUI) blocks.push(HEROUI_BRIDGE_TEMPLATE);

					const finalContent = existing.trim()
						? `${existing.trim()}\n\n${blocks.join("\n\n")}\n`
						: `${prefix}${blocks.join("\n\n")}\n`;

					fs.writeFileSync(targetCss, finalContent, "utf8");
					s.stop(
						`Injected tokens & bridges into ${pc.green(path.relative(cwd, targetCss))}`,
					);
					cssStatus = "injected";
				}
			}
		} else {
			cssStatus = "skipped";
		}

		if (twVersion === "v3") {
			const v3Snippet = `// tailwind.config.js / tailwind.config.ts (Tailwind CSS v3)
const { themeStudioTailwindV3Extension } = require("@k79/theme-studio/tailwind");

module.exports = {
  darkMode: ["class"],
  theme: {
    extend: themeStudioTailwindV3Extension,
  },
};`;
			printCleanCodeBlock("Tailwind CSS v3 Configuration", v3Snippet);
		}
	}

	const nextCookiesCall =
		nextVersion >= 15
			? "  const cookieStore = await cookies();"
			: "  const cookieStore = cookies();";

	const isAllPresets = selectedPresetIds.length === defaultPresets.length;
	const themesFilterSnippet = isAllPresets
		? "const themes = defaultPresets;"
		: `const selectedThemeIds = new Set(${JSON.stringify(selectedPresetIds)});\nconst themes = defaultPresets.filter((pr) => selectedThemeIds.has(pr.id));`;

	const projectPkgJsonPath = path.join(cwd, "package.json");
	let projectKey = "k79_theme_state";
	if (fs.existsSync(projectPkgJsonPath)) {
		try {
			const pkg = JSON.parse(fs.readFileSync(projectPkgJsonPath, "utf8"));
			if (pkg.name) {
				projectKey = `k79_theme_${String(pkg.name).replace(/[^a-zA-Z0-9_]/g, "_")}`;
			}
		} catch (_e) {}
	}

	const nextCode = `// app/layout.tsx
import { ThemeProvider, ThemeScript } from "@k79/theme-studio";
import { defaultPresets, getSsrThemeState, parseThemeCookie, ZenithThemeStyle } from "@k79/theme-studio/server";
import { cookies, headers } from "next/headers";
import "./globals.css";

${themesFilterSnippet}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
${nextCookiesCall}
  const rawCookie = cookieStore.get("${projectKey}")?.value;
  const ssrState = getSsrThemeState(parseThemeCookie(rawCookie), themes, "${defaultPreset}");
  // Optional CSP Nonce: const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" className={ssrState.resolvedMode} data-tactile={ssrState.activeTokens.tactile === "true" ? "true" : undefined} suppressHydrationWarning>
      <head>
        <ZenithThemeStyle themeState={ssrState} />
        <ThemeScript storageKey="${projectKey}" defaultThemeId="${defaultPreset}" defaultMode="system" />
      </head>
      <body><ThemeProvider themes={themes} defaultTheme="${defaultPreset}" storageKey="${projectKey}" studio={{ enabled: true }} initialState={ssrState}>{children}</ThemeProvider></body>
    </html>
  );
}`;

	const reactDomImport =
		reactVersion <= 17
			? 'import ReactDOM from "react-dom";'
			: 'import ReactDOM from "react-dom/client";';

	const reactMount =
		reactVersion <= 17
			? `ReactDOM.render(
  <React.StrictMode>
    <ThemeScript storageKey="${projectKey}" defaultThemeId="${defaultPreset}" defaultMode="dark" />
    <ThemeProvider themes={themes} defaultTheme="${defaultPreset}" defaultMode="dark" storageKey="${projectKey}" studio={{ enabled: true, position: "bottom-right", offset: { x: 24, y: 24 } }}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);`
			: `ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeScript storageKey="${projectKey}" defaultThemeId="${defaultPreset}" defaultMode="dark" />
    <ThemeProvider themes={themes} defaultTheme="${defaultPreset}" defaultMode="dark" storageKey="${projectKey}" studio={{ enabled: true, position: "bottom-right", offset: { x: 24, y: 24 } }}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);`;

	const viteCode = `// src/main.tsx
import React from "react";
${reactDomImport}
import { ThemeProvider, ThemeScript, defaultPresets } from "@k79/theme-studio";
import App from "./App";
import "./index.css";

${themesFilterSnippet}

${reactMount}`;

	const rootCode = framework === "next-app" ? nextCode : viteCode;
	const detectedLayoutPath = findLayoutFile(
		framework as "next-app" | "next-pages" | "vite" | "react",
	);

	const applyLayoutAction = await p.select({
		message: `How would you like to apply your root layout (${framework === "next-app" ? "app/layout.tsx" : "src/main.tsx"})?`,
		options: [
			{
				value: "write",
				label: "Write to file automatically (Recommended)",
				hint: detectedLayoutPath
					? `Updates ${path.relative(cwd, detectedLayoutPath)} (creates backup in .theme-studio/backup)`
					: "Creates root layout file",
			},
			{
				value: "clipboard",
				label: "Copy snippet directly to clipboard",
				hint: "Paste it manually into your layout file",
			},
			{
				value: "print",
				label: "Print clean code to terminal (Easy mouse copy)",
				hint: "Displays code without border pipes for easy highlight & copy",
			},
			{
				value: "skip",
				label: "Skip layout configuration",
				hint: "I will configure the root layout manually later",
			},
		],
	});

	if (!p.isCancel(applyLayoutAction) && applyLayoutAction !== "skip") {
		if (applyLayoutAction === "write" && detectedLayoutPath) {
			fs.mkdirSync(path.dirname(detectedLayoutPath), { recursive: true });
			if (fs.existsSync(detectedLayoutPath)) {
				backupFile(detectedLayoutPath);
			}
			fs.writeFileSync(detectedLayoutPath, rootCode, "utf8");
			p.log.success(
				`Updated root setup in ${pc.green(path.relative(cwd, detectedLayoutPath))}`,
			);
			layoutStatus = "written";
		} else if (applyLayoutAction === "clipboard") {
			const didCopy = copyToClipboard(rootCode);
			if (didCopy) {
				p.log.success(
					pc.green("✔ Root layout snippet copied to system clipboard!"),
				);
			} else {
				printCleanCodeBlock("Root Layout Snippet", rootCode);
			}
			layoutStatus = "clipboard";
		} else {
			printCleanCodeBlock("Root Layout Snippet", rootCode);
			layoutStatus = "printed";
		}
	} else {
		layoutStatus = "skipped";
	}

	const wantPlayground = await p.confirm({
		message:
			"Would you like to generate an interactive component test playground page?",
		initialValue: false,
	});

	if (!p.isCancel(wantPlayground) && wantPlayground) {
		const { targetPath, isRoute } = getPlaygroundTargetPath(framework);
		fs.mkdirSync(path.dirname(targetPath), { recursive: true });
		if (fs.existsSync(targetPath)) {
			backupFile(targetPath);
		}
		const demoCode = `"use client";

import { ThemePlayground } from "@k79/theme-studio";

export default function ThemeStudioDemoPage() {
	return <ThemePlayground title="Theme Studio Component Playground" />;
}
`;
		fs.writeFileSync(targetPath, demoCode, "utf8");
		p.log.success(
			`Created test playground at ${pc.green(path.relative(cwd, targetPath))}${isRoute ? ` (${pc.cyan("/theme-studio-demo")})` : ""}`,
		);
	}

	if (isMonorepo) {
		const monoSnippet = `// In next.config.js / next.config.mjs:
export default {
  transpilePackages: ["@k79/theme-studio"],
};`;
		printCleanCodeBlock("Monorepo Configuration", monoSnippet);
	}

	const skippedSteps: string[] = [];
	if (packageStatus === "failed" || packageStatus === "skipped") {
		skippedSteps.push(
			`Install package: ${pc.cyan(`${pm} add @k79/theme-studio`)} (or ${pc.cyan(`${pm} link @k79/theme-studio`)} if local)`,
		);
	}
	if (cssStatus === "skipped") {
		skippedSteps.push(
			"Configure stylesheet: Inject theme tokens & bridges into your CSS file",
		);
	}
	if (layoutStatus === "skipped") {
		skippedSteps.push(
			`Root layout: Wrap your app root with ${pc.cyan("<ThemeProvider themes={defaultPresets}>")}`,
		);
	}

	if (skippedSteps.length > 0) {
		p.note(
			skippedSteps.map((step) => `• ${step}`).join("\n"),
			"Remaining Setup Steps",
		);
		p.outro(
			`${pc.yellow("⚠ Partial setup completed.")} Please finish the remaining manual steps above.`,
		);
	} else {
		p.outro(
			`${pc.green("✔ Setup complete!")} Run your dev server and click the palette icon at bottom-right!`,
		);
	}
}

export async function runList() {
	p.intro(`${pc.bgCyan(pc.black(" Presets "))} Available Themes`);
	for (const preset of defaultPresets) {
		console.log(
			`  ${pc.cyan(pc.bold(preset.name))} ${pc.gray(`(${preset.id})`)}`,
		);
		console.log(`    ${pc.gray(preset.description || "")}`);
		console.log(
			`    ${pc.dim("Primary: ")}${preset.tokens.primary}  ${pc.dim("Secondary: ")}${preset.tokens.secondary}  ${pc.dim("Accent: ")}${preset.tokens.accent}\n`,
		);
	}
	p.outro(
		`Use ${pc.cyan("theme-studio add [id]")} to generate a custom theme file.`,
	);
}

export async function runAdd(presetId?: string) {
	if (!presetId) {
		const choice = await p.select({
			message: "Select a preset to export as a custom theme:",
			options: defaultPresets.map((pr) => ({
				value: pr.id,
				label: pr.name,
				hint: pr.description,
			})),
		});
		if (p.isCancel(choice)) return;
		presetId = choice as string;
	}

	const found = defaultPresets.find((pr) => pr.id === presetId);
	if (!found) {
		p.cancel(`Unknown preset: ${presetId}`);
		process.exit(1);
	}

	const fileName = `src/themes/${found.id}.ts`;
	const fullPath = path.join(cwd, fileName);
	fs.mkdirSync(path.dirname(fullPath), { recursive: true });

	const exportName = `${found.id.replace(/-([a-z])/g, (_, l) => l.toUpperCase())}Theme`;
	const themeCode = `import type { ThemeDefinition } from "@k79/theme-studio";\n\nexport const ${exportName}: ThemeDefinition = ${JSON.stringify(found, null, 2)};\n`;

	fs.writeFileSync(fullPath, themeCode, "utf8");
	p.outro(
		`Created custom theme file at: ${pc.green(path.relative(cwd, fullPath))}`,
	);
}

export async function runCli() {
	const args = process.argv.slice(2);
	const command = args[0] || "init";
	if (command === "list" || command === "ls") await runList();
	else if (command === "revert" || command === "uninstall") await runRevert();
	else if (command === "add") await runAdd(args[1]);
	else if (
		command === "demo" ||
		command === "playground" ||
		command === "test-page"
	)
		await runPlayground();
	else await runInit();
}

runCli().catch((err) => {
	console.error(err);
	process.exit(1);
});

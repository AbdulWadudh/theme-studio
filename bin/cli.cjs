#!/usr/bin/env node

/**
 * @k79/theme-studio Interactive CLI Wizard
 * Usage: npx @k79/theme-studio init
 */

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");
const { execSync } = require("node:child_process");

const cwd = process.cwd();

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function ask(question, defaultVal = "") {
	const prompt = defaultVal ? `${question} (${defaultVal}): ` : `${question}: `;
	return new Promise((resolve) => {
		rl.question(prompt, (answer) => {
			resolve(answer.trim() || defaultVal);
		});
	});
}

async function askChoice(title, choices, defaultIndex = 0) {
	console.log(`\n\x1b[1m${title}\x1b[0m`);
	choices.forEach((c, idx) => {
		const isDef = idx === defaultIndex ? " (default)" : "";
		console.log(`  [\x1b[36m${idx + 1}\x1b[0m] ${c.label}${isDef}`);
		if (c.desc) console.log(`      \x1b[90m${c.desc}\x1b[0m`);
	});
	while (true) {
		const raw = await ask(
			`Select option [1-${choices.length}]`,
			String(defaultIndex + 1),
		);
		const num = parseInt(raw, 10);
		if (!Number.isNaN(num) && num >= 1 && num <= choices.length) {
			return choices[num - 1].value;
		}
		console.log(
			`\x1b[31mPlease enter a valid choice between 1 and ${choices.length}.\x1b[0m`,
		);
	}
}

function detectPackageManager() {
	if (
		fs.existsSync(path.join(cwd, "bun.lockb")) ||
		fs.existsSync(path.join(cwd, "bun.lock"))
	)
		return "bun";
	if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
	if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
	return "npm";
}

function detectFramework() {
	const pkgPath = path.join(cwd, "package.json");
	if (!fs.existsSync(pkgPath)) return "unknown";
	try {
		const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
		const deps = { ...pkg.dependencies, ...pkg.devDependencies };
		if (deps.next) {
			if (
				fs.existsSync(path.join(cwd, "app")) ||
				fs.existsSync(path.join(cwd, "src", "app"))
			)
				return "next-app";
			return "next-pages";
		}
		if (deps.vite) return "vite";
		if (deps.react) return "react";
	} catch (_e) {}
	return "unknown";
}

function findCssFile() {
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

const CSS_TEMPLATE =
	'@import "tailwindcss";\n\n@custom-variant dark (&:where(.dark, .dark *));\n\n:root {\n\t--canvas: #0b0f17;\n\t--surface: #111827;\n\t--card: #162032;\n\t--border: #1e293b;\n\t--primary: #38bdf8;\n\t--secondary: #818cf8;\n\t--accent: #34d399;\n\t--success: #10b981;\n\t--danger: #ef4444;\n\t--warning: #f59e0b;\n\t--text-primary: #f8fafc;\n\t--text-muted: #94a3b8;\n\t--radius: 0.625rem;\n\t--radius-card: 0.625rem;\n\t--shadow:\n\t\t0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3);\n\t--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);\n\t--shadow-lg:\n\t\t0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);\n\t--font-heading: "Space Grotesk", system-ui, sans-serif;\n\t--font-body: "Inter", system-ui, sans-serif;\n}\n\n@theme {\n\t--color-canvas: var(--canvas);\n\t--color-surface: var(--surface);\n\t--color-card: var(--card);\n\t--color-border: var(--border);\n\t--color-primary: var(--primary);\n\t--color-secondary: var(--secondary);\n\t--color-accent: var(--accent);\n\t--color-success: var(--success);\n\t--color-danger: var(--danger);\n\t--color-warning: var(--warning);\n\t--color-text-primary: var(--text-primary);\n\t--color-text-muted: var(--text-muted);\n\n\t--shadow: var(--shadow);\n\t--shadow-sm: var(--shadow-sm);\n\t--shadow-lg: var(--shadow-lg);\n\n\t--radius: var(--radius);\n\t--radius-card: var(--radius-card);\n\t--radius-xs: calc(var(--radius) * 0.25);\n\t--radius-sm: calc(var(--radius) * 0.5);\n\t--radius-md: calc(var(--radius) * 0.75);\n\t--radius-lg: var(--radius);\n\t--radius-xl: calc(var(--radius) * 1.25);\n\t--radius-2xl: calc(var(--radius) * 1.5);\n\t--radius-3xl: calc(var(--radius) * 2);\n\n\t--font-heading: var(--font-heading);\n\t--font-body: var(--font-body);\n}\n\n/* Smooth global transitions across all theme components (disabled during initial load to prevent hydration flash) */\nhtml:not(.no-transitions) *,\nhtml:not(.no-transitions) *::before,\nhtml:not(.no-transitions) *::after {\n\ttransition-property:\n\t\tbackground-color, border-color, color, fill, stroke, box-shadow,\n\t\tborder-radius;\n\ttransition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);\n\ttransition-duration: 200ms;\n}\n\nhtml.no-transitions *,\nhtml.no-transitions [data-tactile="true"] button,\nhtml.no-transitions [data-tactile="true"] [role="button"],\nhtml.no-transitions [data-tactile="true"] .tactile-item {\n\ttransition: none !important;\n}\n\n/* Tactile Neobrutalism on-hover and active physics */\n[data-tactile="true"] button:not(:disabled),\n[data-tactile="true"] [role="button"],\n[data-tactile="true"] .tactile-item {\n\tbox-shadow: 4px 4px 0px 0px #000000 !important;\n\tborder-color: #000000 !important;\n\ttransition:\n\t\ttransform 120ms cubic-bezier(0.16, 1, 0.3, 1),\n\t\tbox-shadow 120ms cubic-bezier(0.16, 1, 0.3, 1) !important;\n}\n\n[data-tactile="true"] button:not(:disabled):hover,\n[data-tactile="true"] [role="button"]:hover,\n[data-tactile="true"] .tactile-item:hover {\n\ttransform: translate(2px, 2px);\n\tbox-shadow: 2px 2px 0px 0px #000000 !important;\n}\n\n[data-tactile="true"] button:not(:disabled):active,\n[data-tactile="true"] [role="button"]:active,\n[data-tactile="true"] .tactile-item:active {\n\ttransform: translate(4px, 4px) !important;\n\tbox-shadow: 0px 0px 0px 0px #000000 !important;\n}\n\nbody {\n\tbackground-color: var(--canvas);\n\tcolor: var(--text-primary);\n\tfont-family: var(--font-body, system-ui, -apple-system, sans-serif);\n\tmargin: 0;\n\tmin-height: 100vh;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n\tfont-family: var(--font-heading, var(--font-body, inherit));\n}\n';

async function main() {
	console.log(
		"\n\x1b[38;5;39m\x1b[1m┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃      ⚡ @k79/theme-studio Interactive Setup Wizard  ┃\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\x1b[0m\n",
	);

	const detectedPm = detectPackageManager();
	const detectedFw = detectFramework();
	const detectedCss = findCssFile();

	const frameworkChoices = [
		{
			label: "Next.js App Router (app/layout.tsx)",
			value: "next-app",
			desc: "Zero-flash SSR with cookie state hydration",
		},
		{
			label: "Next.js Pages Router (pages/_document.tsx)",
			value: "next-pages",
			desc: "SSR with pages router & req.headers.cookie",
		},
		{
			label: "Vite React SPA (src/main.tsx)",
			value: "vite",
			desc: "Client-only theme engine with synchronous localStorage",
		},
		{
			label: "Generic React (CRA / Custom)",
			value: "react",
			desc: "Pure React with ThemeProvider",
		},
	];
	const fwDefaultIndex = Math.max(
		0,
		frameworkChoices.findIndex((c) => c.value === detectedFw),
	);
	const framework = await askChoice(
		"1. Confirm your project framework:",
		frameworkChoices,
		fwDefaultIndex,
	);

	const modeChoices = [
		{
			label: "Automated Setup (Recommended)",
			value: "auto",
			desc: "The CLI automatically configures your stylesheet and installs dependencies.",
		},
		{
			label: "Guided Manual Setup",
			value: "manual",
			desc: "The CLI prints copy-paste code snippets and guides you through manual setup.",
		},
	];
	const setupMode = await askChoice(
		"2. How would you like the CLI to configure your project?",
		modeChoices,
		0,
	);

	const pmChoices = [
		{ label: "bun", value: "bun" },
		{ label: "pnpm", value: "pnpm" },
		{ label: "npm", value: "npm" },
		{ label: "yarn", value: "yarn" },
	];
	const pmDefaultIndex = Math.max(
		0,
		pmChoices.findIndex((c) => c.value === detectedPm),
	);
	const pm = await askChoice(
		"3. Which package manager do you want to use?",
		pmChoices,
		pmDefaultIndex,
	);

	console.log("\n\x1b[36m─── Configuration Summary ───\x1b[0m");
	console.log(`  Framework:        \x1b[32m${framework}\x1b[0m`);
	console.log(`  Package Manager:  \x1b[32m${pm}\x1b[0m`);
	console.log(`  Setup Mode:       \x1b[32m${setupMode}\x1b[0m`);
	if (detectedCss)
		console.log(
			`  Stylesheet:       \x1b[32m${path.relative(cwd, detectedCss)}\x1b[0m`,
		);
	console.log("\x1b[36m─────────────────────────────\x1b[0m\n");

	if (setupMode === "auto") {
		const shouldInstall = await ask(
			"Install @k79/theme-studio package now? (Y/n)",
			"y",
		);
		if (shouldInstall.toLowerCase().startsWith("y")) {
			const cmd =
				pm === "bun"
					? "bun add @k79/theme-studio"
					: pm === "pnpm"
						? "pnpm add @k79/theme-studio"
						: pm === "yarn"
							? "yarn add @k79/theme-studio"
							: "npm install @k79/theme-studio";
			console.log(`\n📦 Running: \x1b[33m${cmd}\x1b[0m`);
			try {
				execSync(cmd, { stdio: "inherit", cwd });
			} catch (_err) {
				console.warn(`⚠️ Package install warning. You can run ${cmd} manually.`);
			}
		}

		const shouldUpdateCss = await ask(
			"Configure Tailwind v4 custom properties and Tactile physics in stylesheet? (Y/n)",
			"y",
		);
		if (shouldUpdateCss.toLowerCase().startsWith("y")) {
			let targetCss = detectedCss;
			if (!targetCss) {
				const customPath = await ask(
					"Enter path for global stylesheet",
					"src/globals.css",
				);
				targetCss = path.join(cwd, customPath);
			}
			fs.mkdirSync(path.dirname(targetCss), { recursive: true });
			let existing = "";
			if (fs.existsSync(targetCss)) {
				existing = fs.readFileSync(targetCss, "utf8");
			}
			if (existing.includes("--canvas")) {
				console.log(
					`ℹ️ \x1b[33m${path.relative(cwd, targetCss)}\x1b[0m already has Theme Studio tokens. Skipping duplicate.`,
				);
			} else {
				fs.writeFileSync(
					targetCss,
					`${CSS_TEMPLATE.trim()}\n\n${existing}`,
					"utf8",
				);
				console.log(
					`\x1b[32m✓ Successfully configured ${path.relative(cwd, targetCss)}\x1b[0m`,
				);
			}
		}
	}

	console.log(
		"\n\x1b[32m\x1b[1m🎉 Setup Ready! Here is how to complete your integration:\x1b[0m\n",
	);

	if (framework === "next-app") {
		console.log("\x1b[1m1. In your Next.js layout (app/layout.tsx):\x1b[0m\n");
		console.log(
			'import { ThemeProvider, ThemeScript } from "@k79/theme-studio";',
		);
		console.log(
			'import { defaultPresets, getSsrThemeState, parseThemeCookie, ZenithThemeStyle } from "@k79/theme-studio/server";',
		);
		console.log('import { cookies } from "next/headers";\n');
		console.log(
			"export default async function RootLayout({ children }: { children: React.ReactNode }) {",
		);
		console.log("  const cookieStore = await cookies();");
		console.log(
			'  const rawCookie = cookieStore.get("k79_theme_state")?.value;',
		);
		console.log("  const cookiePayload = parseThemeCookie(rawCookie);");
		console.log(
			"  const ssrState = getSsrThemeState(cookiePayload, defaultPresets);\n",
		);
		console.log("  return (");
		console.log(
			'    <html lang="en" className={ssrState.resolvedMode} data-tactile={ssrState.activeTokens.tactile === "true" ? "true" : undefined} suppressHydrationWarning>',
		);
		console.log("      <head>");
		console.log("        <ZenithThemeStyle themeState={ssrState} />");
		console.log("        <ThemeScript />");
		console.log("      </head>");
		console.log("      <body>");
		console.log(
			"        <ThemeProvider themes={defaultPresets} studio={{ enabled: true }} initialState={{ themeId: ssrState.themeId, mode: ssrState.mode, resolvedMode: ssrState.resolvedMode, delta: ssrState.delta }}>",
		);
		console.log("          {children}");
		console.log("        </ThemeProvider>");
		console.log("      </body>");
		console.log("    </html>");
		console.log("  );");
		console.log("}\n");
	} else {
		console.log("\x1b[1m1. In your client entrypoint (src/main.tsx):\x1b[0m\n");
		console.log(
			'import { ThemeProvider, ThemeScript, defaultPresets } from "@k79/theme-studio";\n',
		);
		console.log(
			'ReactDOM.createRoot(document.getElementById("root")!).render(',
		);
		console.log("  <React.StrictMode>");
		console.log("    <ThemeScript />");
		console.log(
			'    <ThemeProvider themes={defaultPresets} defaultTheme="dark-slate" defaultMode="dark" studio={{ enabled: true, position: "bottom-right", offset: { x: 24, y: 24 } }}>',
		);
		console.log("      <App />");
		console.log("    </ThemeProvider>");
		console.log("  </React.StrictMode>");
		console.log(");\n");
	}

	console.log(
		"\x1b[1m2. In your components (consume tokens and studio triggers):\x1b[0m\n",
	);
	console.log('import { useTheme } from "@k79/theme-studio";\n');
	console.log("export function MyComponent() {");
	console.log(
		"  const { theme, mode, resolvedMode, tokens, openStudio, setMode, setCustomTokens } = useTheme();",
	);
	console.log("  return (");
	console.log(
		'    <button onClick={openStudio} className="px-4 py-2 bg-(--primary) text-(--canvas) rounded-(--radius)">',
	);
	console.log("      Customize Theme");
	console.log("    </button>");
	console.log("  );");
	console.log("}\n");

	console.log(
		"\x1b[36m📚 Detailed AI Agent / LLM rules:\x1b[0m Check \x1b[1mAGENTS.md\x1b[0m in your project root.\n",
	);
	rl.close();
}

main().catch((err) => {
	console.error(err);
	rl.close();
	process.exit(1);
});

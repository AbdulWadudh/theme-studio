import fs from "node:fs";
import path from "node:path";

const rootDir = "G:/PROJECTS/theme-studio";
const matrixDir = path.join(rootDir, "test-matrix");
const showcaseTemplatePath = path.join(rootDir, "scripts/ShowcaseTemplate.tsx");
const showcaseTemplate = fs.readFileSync(showcaseTemplatePath, "utf8");

console.log(
	"🧹 Resetting all 4 test-matrix environments to clean starter state with full component playgrounds...\n",
);

function ensureSymlink(projectDir) {
	const nm = path.join(projectDir, "node_modules/@k79");
	fs.mkdirSync(nm, { recursive: true });
	const link = path.join(nm, "theme-studio");
	if (fs.existsSync(link)) {
		try {
			const target = fs.readlinkSync(link);
			if (path.resolve(target) === path.resolve(rootDir)) return;
			fs.rmSync(link, { recursive: true, force: true });
		} catch {
			fs.rmSync(link, { recursive: true, force: true });
		}
	}
	try {
		fs.symlinkSync(rootDir, link, "junction");
	} catch (e) {
		console.warn("Could not create junction:", e.message);
	}
}

function removeIfExists(p) {
	if (fs.existsSync(p)) {
		fs.rmSync(p, { recursive: true, force: true });
	}
}

function getShowcase(title) {
	return showcaseTemplate.replace(/__TITLE__/g, title);
}

const tailwindV3Colors = {
	canvas: "var(--canvas)",
	surface: "var(--surface)",
	card: "var(--card)",
	border: "var(--border)",
	primary: "var(--primary)",
	secondary: "var(--secondary)",
	accent: "var(--accent)",
	success: "var(--success)",
	danger: "var(--danger)",
	warning: "var(--warning)",
	"text-primary": "var(--text-primary)",
	"text-muted": "var(--text-muted)",
};

const tailwindV3BorderRadius = {
	DEFAULT: "var(--radius)",
	card: "var(--radius-card)",
	xs: "calc(var(--radius) * 0.25)",
	sm: "calc(var(--radius) * 0.5)",
	md: "calc(var(--radius) * 0.75)",
	lg: "var(--radius)",
	xl: "calc(var(--radius) * 1.25)",
	"2xl": "calc(var(--radius) * 1.5)",
	"3xl": "calc(var(--radius) * 2)",
};

// =============================================================
// 1. Next.js 15 + Tailwind v4 + shadcn
// =============================================================
const next15Dir = path.join(matrixDir, "next-15-shadcn");
if (fs.existsSync(next15Dir)) {
	ensureSymlink(next15Dir);
	removeIfExists(path.join(next15Dir, ".theme-studio"));
	removeIfExists(path.join(next15Dir, "src/app/layout.tsx.bak"));
	removeIfExists(path.join(next15Dir, "src/app/globals.css.bak"));

	fs.writeFileSync(
		path.join(next15Dir, "src/app/globals.css"),
		`@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #09090b;
  --card: #ffffff;
  --card-foreground: #09090b;
  --popover: #ffffff;
  --popover-foreground: #09090b;
  --primary: #18181b;
  --primary-foreground: #fafafa;
  --secondary: #f4f4f5;
  --secondary-foreground: #18181b;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --accent: #f4f4f5;
  --accent-foreground: #18181b;
  --destructive: #ef4444;
  --destructive-foreground: #fafafa;
  --border: #e4e4e7;
  --input: #e4e4e7;
  --ring: #18181b;
  --radius: 0.5rem;
}
`,
		"utf8",
	);

	fs.writeFileSync(
		path.join(next15Dir, "src/app/layout.tsx"),
		`import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
`,
		"utf8",
	);

	fs.writeFileSync(
		path.join(next15Dir, "src/app/page.tsx"),
		getShowcase("Next.js 15 + Tailwind v4 + shadcn"),
		"utf8",
	);

	console.log("✔ Reset test-matrix/next-15-shadcn with full showcase");
}

// =============================================================
// 2. Next.js 14 + Tailwind v3
// =============================================================
const next14Dir = path.join(matrixDir, "next-14-tailwind-v3");
if (fs.existsSync(next14Dir)) {
	ensureSymlink(next14Dir);
	removeIfExists(path.join(next14Dir, ".theme-studio"));
	removeIfExists(path.join(next14Dir, "src/app/layout.tsx.bak"));
	removeIfExists(path.join(next14Dir, "src/app/globals.css.bak"));

	fs.writeFileSync(
		path.join(next14Dir, "tailwind.config.js"),
		`/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: ${JSON.stringify(tailwindV3Colors, null, 8)},
      borderRadius: ${JSON.stringify(tailwindV3BorderRadius, null, 8)},
    },
  },
  plugins: [],
};
`,
		"utf8",
	);

	fs.writeFileSync(
		path.join(next14Dir, "src/app/globals.css"),
		`@tailwind base;
@tailwind components;
@tailwind utilities;
`,
		"utf8",
	);

	fs.writeFileSync(
		path.join(next14Dir, "src/app/layout.tsx"),
		`import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
		"utf8",
	);

	fs.writeFileSync(
		path.join(next14Dir, "src/app/page.tsx"),
		getShowcase("Next.js 14 + Tailwind v3"),
		"utf8",
	);

	console.log("✔ Reset test-matrix/next-14-tailwind-v3 with full showcase");
}

// =============================================================
// 3. Vite + React 19 + Tailwind v4
// =============================================================
const viteDir = path.join(matrixDir, "vite-react-tw4");
if (fs.existsSync(viteDir)) {
	removeIfExists(path.join(viteDir, ".theme-studio"));
	removeIfExists(path.join(viteDir, "src/main.tsx.bak"));
	removeIfExists(path.join(viteDir, "src/index.css.bak"));

	fs.writeFileSync(
		path.join(viteDir, "src/index.css"),
		`@import "tailwindcss";
`,
		"utf8",
	);

	fs.writeFileSync(
		path.join(viteDir, "src/main.tsx"),
		`import React from "react";
import ReactDOM from "react-dom/client";
import Showcase from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Showcase />
  </React.StrictMode>,
);
`,
		"utf8",
	);

	fs.writeFileSync(
		path.join(viteDir, "src/App.tsx"),
		getShowcase("Vite + React 19 + Tailwind v4"),
		"utf8",
	);

	console.log("✔ Reset test-matrix/vite-react-tw4 with full showcase");
}

console.log("\n============================================================");
console.log(
	"✨ All 3 test-matrix environments successfully reset with full showcases!",
);
console.log("You can now test running CLI init in any of them:");
console.log(
	"  cd test-matrix/next-15-shadcn && bun run ../../bin/cli.cjs init",
);
console.log(
	"  cd test-matrix/next-14-tailwind-v3 && bun run ../../bin/cli.cjs init",
);
console.log(
	"  cd test-matrix/vite-react-tw4 && bun run ../../bin/cli.cjs init",
);
console.log(
);
console.log("============================================================\n");

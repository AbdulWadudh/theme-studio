import fs from "node:fs";
import path from "node:path";

const rootDir = "G:/PROJECTS/theme-studio";
const matrixDir = path.join(rootDir, "test-matrix");

fs.mkdirSync(matrixDir, { recursive: true });

console.log(
	"🚀 Scaffolding test matrix environments with dev server configs...\n",
);

// -------------------------------------------------------------
// 1. Next.js 15 App Router + Tailwind v4 + shadcn
// -------------------------------------------------------------
const next15Dir = path.join(matrixDir, "next-15-shadcn");
fs.mkdirSync(path.join(next15Dir, "src/app"), { recursive: true });
fs.mkdirSync(path.join(next15Dir, "src/components/ui"), { recursive: true });

fs.writeFileSync(
	path.join(next15Dir, "package.json"),
	JSON.stringify(
		{
			name: "test-next-15-shadcn",
			version: "0.1.0",
			private: true,
			scripts: {
				dev: "next dev --port 3001",
				build: "next build",
				start: "next start --port 3001",
			},
			dependencies: {
				"@k79/theme-studio": "link:@k79/theme-studio",
				next: "^15.1.0",
				react: "^19.0.0",
				"react-dom": "^19.0.0",
				"lucide-react": "^0.475.0",
				clsx: "^2.1.1",
				"tailwind-merge": "^3.0.0",
				tailwindcss: "^4.0.9",
				"@tailwindcss/postcss": "^4.0.9",
			},
			devDependencies: {
				"@types/node": "^22.0.0",
				"@types/react": "^19.0.0",
				"@types/react-dom": "^19.0.0",
				typescript: "^5.7.0",
			},
		},
		null,
		2,
	),
);

fs.writeFileSync(
	path.join(next15Dir, "next.config.mjs"),
	`/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@k79/theme-studio"],
};

export default nextConfig;
`,
);

fs.writeFileSync(
	path.join(next15Dir, "postcss.config.mjs"),
	`export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
`,
);

fs.writeFileSync(
	path.join(next15Dir, "components.json"),
	JSON.stringify(
		{
			$schema: "https://ui.shadcn.com/schema.json",
			style: "new-york",
			rsc: true,
			tsx: true,
			tailwind: {
				config: "",
				css: "src/app/globals.css",
				baseColor: "neutral",
				cssVariables: true,
			},
			aliases: {
				components: "@/components",
				utils: "@/lib/utils",
				ui: "@/components/ui",
			},
		},
		null,
		2,
	),
);

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
      <body>{children}</body>
    </html>
  );
}
`,
);

fs.writeFileSync(
	path.join(next15Dir, "src/app/page.tsx"),
	`export default function Page() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Next.js 15 + Tailwind v4 + shadcn</h1>
      <p className="text-muted-foreground">
        Ready for interactive theme studio testing!
      </p>
      <button
        type="button"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium shadow"
      >
        shadcn Styled Button
      </button>
    </main>
  );
}
`,
);

console.log("✔ Created test-matrix/next-15-shadcn");

// -------------------------------------------------------------
// 2. Next.js 14 + Tailwind v3
// -------------------------------------------------------------
const next14Dir = path.join(matrixDir, "next-14-tailwind-v3");
fs.mkdirSync(path.join(next14Dir, "src/app"), { recursive: true });

fs.writeFileSync(
	path.join(next14Dir, "package.json"),
	JSON.stringify(
		{
			name: "test-next-14-tw3",
			version: "0.1.0",
			private: true,
			scripts: {
				dev: "next dev --port 3002",
				build: "next build",
				start: "next start --port 3002",
			},
			dependencies: {
				"@k79/theme-studio": "link:@k79/theme-studio",
				next: "^14.2.15",
				react: "^18.3.1",
				"react-dom": "^18.3.1",
				tailwindcss: "^3.4.14",
				postcss: "^8.4.47",
				autoprefixer: "^10.4.20",
			},
			devDependencies: {
				"@types/node": "^20.0.0",
				"@types/react": "^18.3.0",
				"@types/react-dom": "^18.3.0",
				typescript: "^5.5.0",
			},
		},
		null,
		2,
	),
);

fs.writeFileSync(
	path.join(next14Dir, "next.config.mjs"),
	`/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@k79/theme-studio"],
};

export default nextConfig;
`,
);

fs.writeFileSync(
	path.join(next14Dir, "postcss.config.js"),
	`module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,
);

fs.writeFileSync(
	path.join(next14Dir, "tailwind.config.js"),
	`/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`,
);

fs.writeFileSync(
	path.join(next14Dir, "src/app/globals.css"),
	`@tailwind base;
@tailwind components;
@tailwind utilities;
`,
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
);

fs.writeFileSync(
	path.join(next14Dir, "src/app/page.tsx"),
	`export default function Page() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Next.js 14 + Tailwind v3</h1>
      <p>Testing Tailwind v3 config & Next 14 sync cookies()</p>
    </main>
  );
}
`,
);

console.log("✔ Created test-matrix/next-14-tailwind-v3");

// -------------------------------------------------------------
// 3. Vite + React 19 + Tailwind v4 SPA
// -------------------------------------------------------------
const viteDir = path.join(matrixDir, "vite-react-tw4");
fs.mkdirSync(path.join(viteDir, "src"), { recursive: true });

fs.writeFileSync(
	path.join(viteDir, "package.json"),
	JSON.stringify(
		{
			name: "test-vite-react-tw4",
			version: "0.1.0",
			private: true,
			type: "module",
			scripts: {
				dev: "vite --port 5174",
				build: "vite build",
				preview: "vite preview --port 5174",
			},
			dependencies: {
				"@k79/theme-studio": "link:@k79/theme-studio",
				react: "^19.0.0",
				"react-dom": "^19.0.0",
				tailwindcss: "^4.0.9",
				"@tailwindcss/vite": "^4.0.9",
			},
			devDependencies: {
				"@types/react": "^19.0.0",
				"@types/react-dom": "^19.0.0",
				"@vitejs/plugin-react": "^4.3.4",
				typescript: "^5.7.0",
				vite: "^6.1.0",
			},
		},
		null,
		2,
	),
);

fs.writeFileSync(
	path.join(viteDir, "vite.config.ts"),
	`import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`,
);

fs.writeFileSync(
	path.join(viteDir, "index.html"),
	`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Theme Studio - Vite + React 19</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
);

fs.writeFileSync(
	path.join(viteDir, "src/index.css"),
	`@import "tailwindcss";
`,
);

fs.writeFileSync(
	path.join(viteDir, "src/App.tsx"),
	`export function App() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Vite + React 19 + Tailwind v4</h1>
      <p>Testing client-side pre-paint script and live drawer</p>
    </div>
  );
}
`,
);

fs.writeFileSync(
	path.join(viteDir, "src/main.tsx"),
	`import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`,
);

console.log("✔ Created test-matrix/vite-react-tw4");

// -------------------------------------------------------------
// 4. Vite + React 17 + Tailwind v3 SPA
// -------------------------------------------------------------
const r17Dir = path.join(matrixDir, "react-17-tailwind-v3");
fs.mkdirSync(path.join(r17Dir, "src"), { recursive: true });

fs.writeFileSync(
	path.join(r17Dir, "package.json"),
	JSON.stringify(
		{
			name: "test-react-17-tailwind-v3",
			version: "0.1.0",
			private: true,
			type: "module",
			scripts: {
				dev: "vite --port 5175",
				build: "vite build",
				preview: "vite preview --port 5175",
			},
			dependencies: {
				"@k79/theme-studio": "link:@k79/theme-studio",
				react: "^17.0.2",
				"react-dom": "^17.0.2",
			},
			devDependencies: {
				"@types/react": "^17.0.83",
				"@types/react-dom": "^17.0.26",
				"@vitejs/plugin-react": "^4.3.4",
				autoprefixer: "^10.4.20",
				postcss: "^8.4.47",
				tailwindcss: "^3.4.17",
				typescript: "^5.7.0",
				vite: "^6.1.0",
			},
		},
		null,
		2,
	),
);

fs.writeFileSync(
	path.join(r17Dir, "vite.config.ts"),
	`import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@k79/theme-studio": path.resolve(__dirname, "../../dist/index.mjs"),
    },
  },
});
`,
);

fs.writeFileSync(
	path.join(r17Dir, "postcss.config.js"),
	`export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,
);

fs.writeFileSync(
	path.join(r17Dir, "tailwind.config.js"),
	`export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`,
);

fs.writeFileSync(
	path.join(r17Dir, "index.html"),
	`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Theme Studio - React 17 + Tailwind v3</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
);

fs.writeFileSync(
	path.join(r17Dir, "src/index.css"),
	`@tailwind base;
@tailwind components;
@tailwind utilities;
`,
);

fs.writeFileSync(
	path.join(r17Dir, "src/App.tsx"),
	`import React, { useState } from "react";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">React 17 + Tailwind v3</h1>
      <p className="text-gray-500">Ready for theme-studio init testing!</p>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 bg-blue-600 text-white rounded font-medium shadow hover:bg-blue-700"
      >
        Clicked {count} times
      </button>
    </div>
  );
}
`,
);

fs.writeFileSync(
	path.join(r17Dir, "src/main.tsx"),
	`import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);
`,
);

console.log("✔ Created test-matrix/react-17-tailwind-v3");

console.log("\n============================================================");
console.log("🎉 Test Matrix Ready with Dev Server Scripts!");
console.log("============================================================\n");
console.log("To run dev servers directly from root:");
console.log("  bun run dev:next15   -> http://localhost:3001");
console.log("  bun run dev:next14   -> http://localhost:3002");
console.log("  bun run dev:vite     -> http://localhost:5174");

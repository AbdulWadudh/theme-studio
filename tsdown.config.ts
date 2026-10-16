import { defineConfig } from "tsdown";

export default defineConfig([
	{
		entry: ["src/index.ts"],
		format: ["esm", "cjs"],
		dts: true,
		clean: true,
		target: "es2022",
		sourcemap: true,
		banner: {
			js: '"use client";',
		},
		deps: {
			neverBundle: ["react", "react-dom"],
		},
	},
	{
		entry: ["src/server.ts", "src/tailwind.ts"],
		format: ["esm", "cjs"],
		dts: true,
		clean: false,
		target: "es2022",
		sourcemap: true,
		deps: {
			neverBundle: ["react", "react-dom"],
		},
	},
	{
		entry: { cli: "src/cli/index.ts" },
		format: ["esm"],
		clean: false,
		target: "node18",
		banner: {
			js: "#!/usr/bin/env node",
		},
		outputExtension: {
			esm: ".mjs",
		},
	},
]);

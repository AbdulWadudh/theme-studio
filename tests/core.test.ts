import { describe, expect, test } from "bun:test";
import { defaultPresets } from "../src/core/presets";
import {
	safeJsonSerialize,
	safeMergeTokens,
	sanitizeCssValue,
} from "../src/core/sanitize";
import { computeTokenDelta, resolveActiveTokens } from "../src/core/tokens";
import { getSsrThemeState, parseThemeCookie } from "../src/server/cookie";
import { createMemoryStorage } from "../src/storage/memory";

describe("@k79/theme-studio security & sanitization", () => {
	test("blocks dangerous CSS injections with semicolons and braces", () => {
		const malicious = "#000; } body { display:none }";
		expect(sanitizeCssValue(malicious)).toBe("");
	});

	test("blocks javascript: and url() attacks in CSS properties", () => {
		expect(sanitizeCssValue("url('http://evil.com/leak')")).toBe("");
		expect(sanitizeCssValue("javascript:alert(1)")).toBe("");
	});

	test("permits valid colors, units, and box-shadow variables", () => {
		expect(sanitizeCssValue("#38BDF8")).toBe("#38BDF8");
		expect(sanitizeCssValue("rgba(255, 0, 0, 0.5)")).toBe(
			"rgba(255, 0, 0, 0.5)",
		);
		expect(sanitizeCssValue("0.625rem")).toBe("0.625rem");
		expect(sanitizeCssValue("var(--primary)")).toBe("var(--primary)");
		expect(sanitizeCssValue("0 10px 15px -3px rgba(0, 0, 0, 0.4)")).toBe(
			"0 10px 15px -3px rgba(0, 0, 0, 0.4)",
		);
	});

	test("permits quoted font stacks and unblurred neobrutalist shadows", () => {
		expect(sanitizeCssValue("'Space Grotesk', sans-serif")).toBe(
			"'Space Grotesk', sans-serif",
		);
		expect(sanitizeCssValue("'Plus Jakarta Sans', sans-serif")).toBe(
			"'Plus Jakarta Sans', sans-serif",
		);
		expect(sanitizeCssValue("4px 4px 0px 0px #000000")).toBe(
			"4px 4px 0px 0px #000000",
		);
	});

	test("escapes dangerous HTML script tags to prevent XSS", () => {
		const payload = { theme: "</script><script>alert('xss')</script>" };
		const serialized = safeJsonSerialize(payload);
		expect(serialized).not.toContain("</script>");
		expect(serialized).toContain("\\u003c/script\\u003e");
	});

	test("protects against prototype pollution in token merge", () => {
		const payload = JSON.parse(
			'{"__proto__":{"polluted":"yes"},"primary":"#123456"}',
		);
		const safe = safeMergeTokens({ primary: "#000000" }, payload);
		expect(({} as Record<string, unknown>).polluted).toBeUndefined();
		expect(safe.primary).toBe("#123456");
	});
});

describe("@k79/theme-studio token delta & SSR hydration", () => {
	const basePreset = defaultPresets[0];

	test("includes semantic success, danger, warning, and shadow tokens in presets", () => {
		expect(basePreset.tokens.success).toBe("#10B981");
		expect(basePreset.tokens.danger).toBe("#EF4444");
		expect(basePreset.tokens.warning).toBe("#F59E0B");
		expect(basePreset.tokens.shadow).toBeDefined();
		expect(basePreset.tokens.shadowSm).toBeDefined();
		expect(basePreset.tokens.shadowLg).toBeDefined();
	});

	test("computes minimal deltas for modified tokens", () => {
		const overrides = { primary: "#FF0077", danger: "#B91C1C" };
		const delta = computeTokenDelta(basePreset.tokens, overrides);
		expect(delta).toEqual({ primary: "#FF0077", danger: "#B91C1C" });
	});

	test("resolves active preset tokens with light/dark mode and delta overrides", () => {
		const resolved = resolveActiveTokens(basePreset, "light", {
			primary: "#00E5FF",
			success: "#00FF66",
		});
		expect(resolved.canvas).toBe("#F8FAFC");
		expect(resolved.primary).toBe("#00E5FF");
		expect(resolved.success).toBe("#00FF66");
		expect(resolved.danger).toBe("#DC2626");
	});

	test("parses SSR cookies and resolves SSR state without flash", () => {
		const cookiePayload = parseThemeCookie(
			JSON.stringify({ id: "nord", m: "dark", d: { primary: "#FFFFFF" } }),
		);
		const ssrState = getSsrThemeState(cookiePayload, defaultPresets);
		expect(ssrState.themeId).toBe("nord");
		expect(ssrState.resolvedMode).toBe("dark");
		expect(ssrState.activeTokens.primary).toBe("#FFFFFF");
		expect(ssrState.activeTokens.success).toBe("#A3BE8C");
	});

	test("stores and retrieves state using in-memory adapter", () => {
		const mem = createMemoryStorage();
		mem.setItem("k79_theme_state", "test_val");
		expect(mem.getItem("k79_theme_state")).toBe("test_val");
	});
});

describe("@k79/theme-studio font catalog and playground exports", () => {
	test("searches font catalog with substring and category filter", async () => {
		const { searchFontsourceFonts } = await import("../src/core/fonts");
		const results = await searchFontsourceFonts("ibm");
		expect(results.length).toBeGreaterThan(0);
		expect(results.some((f) => f.family.toLowerCase().includes("ibm"))).toBe(
			true,
		);

		const monospace = await searchFontsourceFonts("ibm", "monospace");
		expect(monospace.every((f) => f.category === "monospace")).toBe(true);
	});

	test("returns empty array for non-matching queries without errors", async () => {
		const { searchFontsourceFonts } = await import("../src/core/fonts");
		const results = await searchFontsourceFonts("xyznonexistent9999");
		expect(results).toEqual([]);
	});

	test("exports ThemePlayground and ThemeShowcase components", async () => {
		const mod = await import("../src/react/theme-playground");
		expect(typeof mod.ThemePlayground).toBe("function");
		expect(typeof mod.ThemeShowcase).toBe("function");
		expect(mod.ThemeShowcase).toBe(mod.ThemePlayground);
	});
});

import { isValidFontFamily } from "./sanitize";

const loadedFonts = new Set<string>();

export function extractFontFamily(fontValue?: string): string | null {
	if (!fontValue) return null;
	if (fontValue.startsWith("var(--font-")) return null;
	const match = fontValue.split(",")[0].trim().replace(/['"]/g, "");
	return isValidFontFamily(match) ? match : null;
}

export function toFontsourceSlug(family: string): string {
	return family
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/**
 * Loads a lightweight preview font without storing it in localStorage.
 * Used exclusively for previewing fonts in the Theme Studio drawer list.
 */
export function loadPreviewFont(fontFamily: string): void {
	if (typeof document === "undefined" || !fontFamily) return;

	const clean = extractFontFamily(fontFamily);
	if (!clean || loadedFonts.has(clean.toLowerCase())) return;

	const slug = toFontsourceSlug(clean);
	const selector = `[data-k79-font="${slug}"]`;
	if (document.querySelector(selector)) {
		loadedFonts.add(clean.toLowerCase());
		return;
	}

	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = `https://cdn.jsdelivr.net/fontsource/css/${slug}@latest/index.css`;
	link.setAttribute("data-k79-font", slug);
	link.onerror = () => {
		const fallbackLink = document.createElement("link");
		fallbackLink.rel = "stylesheet";
		fallbackLink.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(clean)}:wght@300;400;500;600;700&display=swap`;
		fallbackLink.setAttribute("data-k79-font", `${slug}-fallback`);
		document.head.appendChild(fallbackLink);
	};
	document.head.appendChild(link);
	loadedFonts.add(clean.toLowerCase());
}

/**
 * Synchronizes local cache to retain ONLY the user's actively selected fonts
 * (max 2: heading & body). Evicts any stale fonts so localStorage remains tiny (<3KB).
 */
export function syncActiveFontCache(
	activeHeading?: string,
	activeBody?: string,
): void {
	if (typeof window === "undefined") return;

	const keepSlugs = new Set<string>();
	const headingFam = extractFontFamily(activeHeading);
	if (headingFam) keepSlugs.add(toFontsourceSlug(headingFam));

	const bodyFam = extractFontFamily(activeBody);
	if (bodyFam) keepSlugs.add(toFontsourceSlug(bodyFam));

	try {
		// Clean up any font cache keys not actively selected
		for (let i = localStorage.length - 1; i >= 0; i--) {
			const key = localStorage.key(i);
			if (key?.startsWith("k79_font_css_")) {
				const slug = key.replace("k79_font_css_", "");
				if (!keepSlugs.has(slug)) {
					localStorage.removeItem(key);
				}
			}
		}

		// Ensure the active fonts are fetched and cached in localStorage
		for (const slug of keepSlugs) {
			const cacheKey = `k79_font_css_${slug}`;
			if (!localStorage.getItem(cacheKey)) {
				fetch(
					`https://cdn.jsdelivr.net/fontsource/css/${slug}@latest/index.css`,
				)
					.then((res) => (res.ok ? res.text() : ""))
					.then((cssText) => {
						if (cssText) localStorage.setItem(cacheKey, cssText);
					})
					.catch(() => {});
			}
		}
	} catch (_e) {
		// Ignore private browsing storage quota errors
	}
}

/**
 * Loads a font dynamically in the browser via Fontsource CDN (jsDelivr),
 * using localStorage cache for instant 0ms pre-hydration rendering when available.
 */
export function loadFontsourceFont(fontFamily: string): void {
	if (typeof document === "undefined" || !fontFamily) return;

	const clean = extractFontFamily(fontFamily);
	if (!clean || loadedFonts.has(clean.toLowerCase())) return;

	const slug = toFontsourceSlug(clean);
	const selector = `[data-k79-font="${slug}"]`;
	if (document.querySelector(selector)) {
		loadedFonts.add(clean.toLowerCase());
		return;
	}

	const cacheKey = `k79_font_css_${slug}`;

	// 1. Instant Synchronous Cache Check
	try {
		const cachedCss = localStorage.getItem(cacheKey);
		if (cachedCss) {
			const style = document.createElement("style");
			style.setAttribute("data-k79-font", slug);
			style.textContent = cachedCss;
			document.head.appendChild(style);
			loadedFonts.add(clean.toLowerCase());
			return;
		}
	} catch (_e) {}

	// 2. Fetch and apply
	const fontUrl = `https://cdn.jsdelivr.net/fontsource/css/${slug}@latest/index.css`;
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = fontUrl;
	link.setAttribute("data-k79-font", slug);
	link.onerror = () => {
		const fallbackLink = document.createElement("link");
		fallbackLink.rel = "stylesheet";
		fallbackLink.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(clean)}:wght@300;400;500;600;700&display=swap`;
		fallbackLink.setAttribute("data-k79-font", `${slug}-fallback`);
		document.head.appendChild(fallbackLink);
	};
	document.head.appendChild(link);
	loadedFonts.add(clean.toLowerCase());
}

// Backward-compatible alias
export const loadGoogleFont = loadFontsourceFont;

export interface FontsourceItem {
	id: string;
	family: string;
	category: string;
	weights: number[];
	variable?: boolean;
}

let cachedFontCatalog: FontsourceItem[] | null = null;
let catalogFetchPromise: Promise<FontsourceItem[]> | null = null;

/**
 * Fetches and caches the full Fontsource font catalog (2,000+ fonts) in memory
 * and sessionStorage for instant, sub-millisecond fuzzy search and category filtering.
 */
export async function getFontCatalog(): Promise<FontsourceItem[]> {
	if (cachedFontCatalog && cachedFontCatalog.length > 0) {
		return cachedFontCatalog;
	}
	if (catalogFetchPromise) {
		return catalogFetchPromise;
	}

	catalogFetchPromise = (async () => {
		try {
			const res = await fetch("https://api.fontsource.org/v1/fonts");
			if (res.ok) {
				const data = (await res.json()) as FontsourceItem[];
				// Slim objects to keep in-memory footprint negligible (~140KB) without touching browser storage quotas
				const slim: FontsourceItem[] = data.map((f) => ({
					id: f.id,
					family: f.family,
					category: f.category || "sans-serif",
					weights: f.weights || [400],
					variable: Boolean(f.variable),
				}));
				cachedFontCatalog = slim;
				return slim;
			}
		} catch (err) {
			console.warn("[k79-theme-studio] Font catalog fetch fallback:", err);
		}
		return POPULAR_FONTSOURCE_FONTS;
	})();

	return catalogFetchPromise;
}

/**
 * Searches fonts directly from Fontsource with instant substring/fuzzy search,
 * intelligent sorting (exact and prefix matches first), and category filtering.
 */
export async function searchFontsourceFonts(
	query = "",
	category?: string,
): Promise<FontsourceItem[]> {
	try {
		const catalog = await getFontCatalog();
		const cleanQuery = query.trim().toLowerCase();
		const cleanCat =
			category && category !== "all" ? category.toLowerCase() : null;

		const filtered = catalog.filter((f) => {
			if (cleanCat && f.category?.toLowerCase() !== cleanCat) return false;
			if (!cleanQuery) return true;
			const name = f.family.toLowerCase();
			const id = f.id.toLowerCase();
			return name.includes(cleanQuery) || id.includes(cleanQuery);
		});

		if (cleanQuery) {
			filtered.sort((a, b) => {
				const aExact = a.family.toLowerCase() === cleanQuery ? 1 : 0;
				const bExact = b.family.toLowerCase() === cleanQuery ? 1 : 0;
				if (aExact !== bExact) return bExact - aExact;

				const aStarts = a.family.toLowerCase().startsWith(cleanQuery) ? 1 : 0;
				const bStarts = b.family.toLowerCase().startsWith(cleanQuery) ? 1 : 0;
				if (aStarts !== bStarts) return bStarts - aStarts;

				return a.family.localeCompare(b.family);
			});
		}

		return filtered.slice(0, 40);
	} catch (err) {
		console.warn("[k79-theme-studio] Fontsource search error:", err);
		return POPULAR_FONTSOURCE_FONTS.filter((f) => {
			const matchesQuery =
				!query || f.family.toLowerCase().includes(query.toLowerCase());
			const matchesCat =
				!category || category === "all" || f.category === category;
			return matchesQuery && matchesCat;
		});
	}
}

export const POPULAR_FONTSOURCE_FONTS: FontsourceItem[] = [
	{
		id: "inter",
		family: "Inter",
		category: "sans-serif",
		weights: [400, 500, 600, 700],
		variable: true,
	},
	{
		id: "plus-jakarta-sans",
		family: "Plus Jakarta Sans",
		category: "sans-serif",
		weights: [400, 500, 600, 700],
		variable: true,
	},
	{
		id: "outfit",
		family: "Outfit",
		category: "sans-serif",
		weights: [400, 500, 600, 700],
		variable: true,
	},
	{
		id: "space-grotesk",
		family: "Space Grotesk",
		category: "sans-serif",
		weights: [400, 500, 600, 700],
		variable: true,
	},
	{
		id: "fira-code",
		family: "Fira Code",
		category: "monospace",
		weights: [400, 500, 600, 700],
		variable: true,
	},
	{
		id: "jetbrains-mono",
		family: "JetBrains Mono",
		category: "monospace",
		weights: [400, 500, 600, 700],
		variable: true,
	},
	{
		id: "playfair-display",
		family: "Playfair Display",
		category: "serif",
		weights: [400, 600, 700],
		variable: true,
	},
	{
		id: "syne",
		family: "Syne",
		category: "display",
		weights: [400, 600, 700, 800],
		variable: true,
	},
	{
		id: "cinzel",
		family: "Cinzel",
		category: "serif",
		weights: [400, 600, 700],
		variable: true,
	},
	{
		id: "raleway",
		family: "Raleway",
		category: "sans-serif",
		weights: [400, 500, 600, 700],
		variable: true,
	},
];

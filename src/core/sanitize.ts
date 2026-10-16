/**
 * Zenith Theme Security & Sanitization Layer
 * Mitigates CSS injection, XSS breakout, and prototype pollution.
 */

// Regex allowing safe CSS colors, dimensions, variables, box-shadows, and quoted font-family stacks
const CSS_SAFE_VALUE_REGEX = /^([a-zA-Z0-9.,%#\s()'"_-]+)$/;

export function sanitizeCssValue(value: string | undefined): string {
	if (!value || typeof value !== "string") return "";
	const trimmed = value.trim();

	// Explicitly disallow dangerous CSS functions and injection syntax
	if (
		/expression|javascript:|behavior|url\(/i.test(trimmed) ||
		/[;<>{}]/.test(trimmed)
	) {
		console.warn(
			`[k79-theme-studio:security] Disallowed potentially malicious CSS value: "${value}"`,
		);
		return "";
	}

	if (CSS_SAFE_VALUE_REGEX.test(trimmed)) {
		return trimmed;
	}

	return "";
}

/**
 * Escapes characters that can break out of an inline HTML <script> tag (XSS protection).
 */
export function safeJsonSerialize(data: unknown): string {
	return JSON.stringify(data)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026")
		.replace(/\u2028/g, "\\u2028")
		.replace(/\u2029/g, "\\u2029");
}

/**
 * Validates font family strings against directory injection or SSRF.
 */
export function isValidFontFamily(font: string): boolean {
	if (!font || typeof font !== "string") return false;
	return /^[a-zA-Z0-9\s\-_]+$/.test(font.trim());
}

/**
 * Merges token objects while safeguarding against Prototype Pollution.
 */
export function safeMergeTokens<T extends Record<string, unknown>>(
	target: T,
	source?: Partial<T>,
): T {
	if (!source) return { ...target };
	const out: Record<string, unknown> = { ...target };

	for (const key of Object.keys(source)) {
		if (key === "__proto__" || key === "constructor" || key === "prototype") {
			continue;
		}
		const val = source[key];
		if (typeof val === "string") {
			const sanitized = sanitizeCssValue(val);
			if (sanitized) {
				out[key] = sanitized;
			}
		}
	}

	return out as T;
}

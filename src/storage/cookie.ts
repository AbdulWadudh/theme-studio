import type { CookieStorageOptions, StorageAdapter } from "./types";

export function createCookieStorage(
	options: CookieStorageOptions = {},
): StorageAdapter {
	const {
		path = "/",
		maxAge = 31536000, // 1 year
		sameSite = "Lax",
		secure = false,
	} = options;

	return {
		name: "cookie",
		getItem(key: string): string | null {
			if (typeof document === "undefined") return null;
			const match = document.cookie.match(
				new RegExp(`(^|;\\s*)(${key})=([^;]*)`),
			);
			if (match) {
				return decodeURIComponent(match[3]);
			}
			try {
				return localStorage.getItem(key);
			} catch (_e) {
				return null;
			}
		},
		setItem(key: string, value: string): void {
			if (typeof document === "undefined") return;
			try {
				localStorage.setItem(key, value);
			} catch (_e) {}
			let cookieStr = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=${path}; max-age=${maxAge}; SameSite=${sameSite}`;
			if (
				secure ||
				(typeof window !== "undefined" && window.location.protocol === "https:")
			) {
				cookieStr += "; Secure";
			}
			document.cookie = cookieStr;
		},
		removeItem(key: string): void {
			if (typeof document === "undefined") return;
			try {
				localStorage.removeItem(key);
			} catch (_e) {}
			document.cookie = `${encodeURIComponent(key)}=; path=${path}; max-age=0`;
		},
	};
}

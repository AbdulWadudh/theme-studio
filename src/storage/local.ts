import type { StorageAdapter } from "./types";

export function createLocalStorage(): StorageAdapter {
	return {
		name: "localStorage",
		getItem(key: string): string | null {
			if (typeof window === "undefined" || !window.localStorage) return null;
			try {
				return window.localStorage.getItem(key);
			} catch {
				return null;
			}
		},
		setItem(key: string, value: string): void {
			if (typeof window === "undefined" || !window.localStorage) return;
			try {
				window.localStorage.setItem(key, value);
			} catch (err) {
				console.warn(
					"[zenith-theme] localStorage quota exceeded or access denied",
					err,
				);
			}
		},
		removeItem(key: string): void {
			if (typeof window === "undefined" || !window.localStorage) return;
			try {
				window.localStorage.removeItem(key);
			} catch {}
		},
	};
}

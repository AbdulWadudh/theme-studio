import { createCookieStorage } from "./cookie";
import { createLocalStorage } from "./local";
import type { StorageAdapter } from "./types";

export function createCompositeStorage(
	cookieAdapter: StorageAdapter = createCookieStorage(),
	localAdapter: StorageAdapter = createLocalStorage(),
): StorageAdapter {
	return {
		name: "composite",
		getItem(key: string) {
			if (typeof window === "undefined") return cookieAdapter.getItem(key);
			return localAdapter.getItem(key) ?? cookieAdapter.getItem(key);
		},
		setItem(key: string, value: string) {
			localAdapter.setItem(key, value);
			cookieAdapter.setItem(key, value);
		},
		removeItem(key: string) {
			localAdapter.removeItem(key);
			cookieAdapter.removeItem(key);
		},
	};
}

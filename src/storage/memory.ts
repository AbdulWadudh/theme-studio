import type { StorageAdapter } from "./types";

export function createMemoryStorage(): StorageAdapter {
	const map = new Map<string, string>();
	return {
		name: "memory",
		getItem: (key) => map.get(key) ?? null,
		setItem: (key, val) => {
			map.set(key, val);
		},
		removeItem: (key) => {
			map.delete(key);
		},
	};
}

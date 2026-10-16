export interface StorageAdapter {
	name: string;
	getItem(key: string): string | null | Promise<string | null>;
	setItem(key: string, value: string): void | Promise<void>;
	removeItem(key: string): void | Promise<void>;
}

export interface CookieStorageOptions {
	path?: string;
	maxAge?: number;
	domain?: string;
	sameSite?: "Lax" | "Strict" | "None";
	secure?: boolean;
}

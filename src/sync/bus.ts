import type { SyncBus, SyncMessage } from "./types";

export function createSyncBus<T = unknown>(
	channelName = "zenith-theme-sync",
): SyncBus<T> {
	if (typeof window === "undefined") {
		return {
			post: () => {},
			subscribe: () => () => {},
			close: () => {},
			destroy: () => {},
		};
	}

	// Modern browsers: BroadcastChannel API
	if (typeof BroadcastChannel !== "undefined") {
		const channel = new BroadcastChannel(channelName);
		return {
			post(type: string, payload: T) {
				channel.postMessage({ type, payload, timestamp: Date.now() });
			},
			subscribe(callback: (type: string, payload: T) => void) {
				const handler = (event: MessageEvent<SyncMessage<T>>) => {
					if (event.data?.type) {
						callback(event.data.type, event.data.payload);
					}
				};
				channel.addEventListener("message", handler);
				return () => channel.removeEventListener("message", handler);
			},
			close() {
				channel.close();
			},
			destroy() {
				channel.close();
			},
		};
	}

	// Fallback: window.addEventListener("storage")
	const storageSyncKey = `__zenith_sync_${channelName}__`;
	return {
		post(type: string, payload: T) {
			try {
				localStorage.setItem(
					storageSyncKey,
					JSON.stringify({ type, payload, timestamp: Date.now() }),
				);
			} catch {}
		},
		subscribe(callback: (type: string, payload: T) => void) {
			const handler = (event: StorageEvent) => {
				if (event.key === storageSyncKey && event.newValue) {
					try {
						const data: SyncMessage<T> = JSON.parse(event.newValue);
						callback(data.type, data.payload);
					} catch {}
				}
			};
			window.addEventListener("storage", handler);
			return () => window.removeEventListener("storage", handler);
		},
		close() {},
		destroy() {},
	};
}

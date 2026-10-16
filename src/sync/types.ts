export interface SyncMessage<T = unknown> {
	type: string;
	payload: T;
	timestamp: number;
}

export interface SyncBus<T = unknown> {
	post(type: string, payload: T): void;
	subscribe(callback: (type: string, payload: T) => void): () => void;
	close(): void;
	destroy?(): void;
}

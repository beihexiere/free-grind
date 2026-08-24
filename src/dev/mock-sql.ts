// Mock for @tauri-apps/plugin-sql — DEV-only
// Returns empty results for all queries; silently ignores writes.
class MockDatabase {
	async select<T = unknown[]>(_sql: string, ..._params: unknown[]): Promise<T> {
		return [] as unknown as T;
	}
	async execute(_sql: string, ..._params: unknown[]): Promise<void> {}
	async run(_sql: string, ..._params: unknown[]): Promise<void> {}
}
const sharedDb = new MockDatabase();

export default class Database {
	static async load(_path: string): Promise<MockDatabase> {
		return sharedDb;
	}
	static async loadDir(_path: string): Promise<MockDatabase> {
		return sharedDb;
	}
	static async close(): Promise<void> {}
}

export type { MockDatabase };

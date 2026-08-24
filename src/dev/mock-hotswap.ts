// Mock for tauri-plugin-hotswap-api — DEV-only
export async function applyUpdate(_url: string): Promise<void> {}
export async function checkUpdate(): Promise<{ hasUpdate: boolean; version?: string }> {
	return { hasUpdate: false };
}
export async function configure(_options: Record<string, unknown>): Promise<void> {}
export async function notifyReady(): Promise<void> {}

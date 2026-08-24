// Mock for tauri-plugin-android-fs-api — DEV-only
export const AndroidFs = {
	async readFile(_uri: string): Promise<Uint8Array> {
		return new Uint8Array(0);
	},
	async writeFile(_uri: string, _data: Uint8Array | string): Promise<void> {},
	async exists(_uri: string): Promise<boolean> {
		return false;
	},
	async mkdir(_uri: string): Promise<void> {},
	async listDir(_uri: string): Promise<string[]> {
		return [];
	},
	async stat(_uri: string): Promise<{ size: number; mtime: number }> {
		return { size: 0, mtime: 0 };
	},
};

export const AndroidPublicGeneralPurposeDir = "public-general-purpose";

export type AndroidFsUri = string;

// Mock for @tauri-apps/plugin-fs — DEV-only
export const BaseDirectory = {
	AppConfig: "app-config" as const,
	AppData: "app-data" as const,
	AppLocalData: "app-local-data" as const,
	AppCache: "app-cache" as const,
	AppLog: "app-log" as const,
	Home: "home" as const,
	Desktop: "desktop" as const,
	Document: "document" as const,
	Download: "download" as const,
	Music: "music" as const,
	Picture: "picture" as const,
	Public: "public" as const,
	Video: "video" as const,
	Resource: "resource" as const,
	Temp: "temp" as const,
	App: "app" as const,
} as const;

export async function exists(_path: string, _options?: { baseDir?: string }): Promise<boolean> {
	return false;
}
export async function createDir(_path: string, _options?: { baseDir?: string; recursive?: boolean }): Promise<void> {}
export async function copyFile(_source: string, _dest: string, _options?: { baseDir?: string }): Promise<void> {}
export async function remove(_path: string, _options?: { baseDir?: string; recursive?: boolean }): Promise<void> {}
export async function rename(_source: string, _dest: string, _options?: { baseDir?: string }): Promise<void> {}
export async function writeFile(_path: string, _data: string | Uint8Array, _options?: { baseDir?: string }): Promise<void> {}
export async function appendFile(_path: string, _data: string | Uint8Array, _options?: { baseDir?: string }): Promise<void> {}
export async function readFile(_path: string, _options?: { baseDir?: string; encoding?: string }): Promise<string | Uint8Array> {
	return "";
}
export async function readTextFile(_path: string, _options?: { baseDir?: string }): Promise<string> {
	return "";
}
export async function readDir(_path: string, _options?: { baseDir?: string; recursive?: boolean }): Promise<string[]> {
	return [];
}
export async function stat(_path: string, _options?: { baseDir?: string }): Promise<{ size: number; mtime: number; isFile: boolean; isDirectory: boolean }> {
	return { size: 0, mtime: 0, isFile: false, isDirectory: false };
}
export async function mkdir(_path: string, _options?: { baseDir?: string; recursive?: boolean }): Promise<void> {}
export async function open(_path: string, _options?: { baseDir?: string }): Promise<{ id: number }> {
	return { id: 0 };
}

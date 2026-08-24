// Mock for @tauri-apps/plugin-os — DEV-only
export function platform(): "windows" | "macos" | "linux" | "ios" | "android" {
	return "windows";
}
export function arch(): string {
	return "x64";
}
export function tempDir(): string {
	return "";
}
export function version(): string {
	return "10.0";
}
export function buildType(): string | null {
	return null;
}
export function info(): Record<string, string> {
	return {};
}

// Mock for @tauri-apps/plugin-notification — DEV-only
export async function isPermissionGranted(): Promise<boolean> {
	return false;
}
export async function requestPermission(): Promise<"granted" | "denied"> {
	return "denied";
}
export async function sendNotification(_options: { title?: string; body?: string }): Promise<void> {}
export type Permission = "granted" | "denied" | "default" | "prompt";
export const defaultPermission: Permission = "default";
export function onPermissionsChange(_handler: (p: Permission) => void): () => void {
	return () => {};
}
// active / removeActive: 追踪当前激活的通知（本地状态）
let _active: { title?: string; body?: string } | null = null;
export function active(): { title?: string; body?: string } | null {
	return _active;
}
export function removeActive(): void {
	_active = null;
}

// Mock for @tauri-apps/api/window — DEV-only
export interface Window {
	label: string;
	title: string;
	width: number;
	height: number;
	open(): Promise<void>;
	close(): Promise<void>;
	show(): Promise<void>;
	hide(): Promise<void>;
	setTitle(_title: string): Promise<void>;
	setSize(_size: { width: number; height: number }): Promise<void>;
	setPosition(_pos: { x: number; y: number }): Promise<void>;
}
export function getCurrentWindow(): Window {
	return {
		label: "main",
		title: "Free Grind (DEV)",
		width: 1000,
		height: 800,
		open: async () => {},
		close: async () => {},
		show: async () => {},
		hide: async () => {},
		setTitle: async () => {},
		setSize: async () => {},
		setPosition: async () => {},
	};
}
export function getAllWindows(): Window[] {
	return [getCurrentWindow()];
}
export function getWindowByLabel(_label: string): Window | null {
	return getCurrentWindow();
}

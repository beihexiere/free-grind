// Mock for @tauri-apps/plugin-geolocation — DEV-only
export async function checkPermissions(): Promise<"granted" | "denied" | "prompt"> {
	return "prompt";
}
export async function requestPermissions(): Promise<"granted" | "denied" | "prompt"> {
	return "prompt";
}
export async function getCurrentPosition(): Promise<{
	coords: { latitude: number; longitude: number; altitude: number | null; accuracy: number };
	timestamp: number;
}> {
	return {
		coords: { latitude: 0, longitude: 0, altitude: null, accuracy: 0 },
		timestamp: Date.now(),
	};
}
export async function watchPosition(
	_handler: (pos: unknown) => void,
	_options?: unknown,
): Promise<() => void> {
	return () => {};
}

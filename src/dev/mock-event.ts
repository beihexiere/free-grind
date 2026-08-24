// Mock for @tauri-apps/api/event — DEV-only
export type UnlistenFn = () => void;
export async function listen<T = unknown>(
	_event: string,
	_handler: (event: { payload: T }) => void,
): Promise<UnlistenFn> {
	return () => {};
}
export async function emit<T>(_event: string, _payload?: T): Promise<void> {}
export async function unlisten(_event: string): Promise<void> {}
export async function getEventListenners(): Promise<number> {
	return 0;
}

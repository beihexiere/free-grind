// Mock for @tauri-apps/api/core — DEV-only, never bundled in production
export function isTauri(): boolean {
	return false;
}
export function isTauriRuntime(): boolean {
	return false;
}
// invoke: NEVER throw. Return empty object so destructuring sites won't crash.
export async function invoke<T = unknown>(
	_cmd: string,
	_args?: Record<string, unknown>,
): Promise<T> {
	return {} as T;
}
export function transformInvokable<T>(fn: (...args: unknown[]) => Promise<T>): (...args: unknown[]) => Promise<T> {
	return fn;
}
export { invoke as invokeHandler };

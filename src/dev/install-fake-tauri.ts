// DEV-only: inject a fake Tauri runtime bridge so the real @tauri-apps/*
// npm packages can load in the browser without Tauri runtime.
// Runs BEFORE any @tauri-apps/* module is imported (must be first import).

if (import.meta.env.DEV && typeof window !== "undefined") {
	const w = window as unknown as { __TAURI_INTERNALS__?: unknown; isTauri?: boolean; __TAURI__?: unknown };

	if (!w.__TAURI_INTERNALS__) {
		const callbackStore = new Map<number, (payload: unknown) => void>();
		let nextCallbackId = 1;

		// Plugin command → expected return shape (see each plugin's index.js)
		const fakeInvoke = async (cmd: string, _args?: Record<string, unknown>, _options?: unknown) => {
			// plugin-sql
			if (cmd === "plugin:sql|load") return "sqlite:dev.db";
			if (cmd === "plugin:sql|execute") return [0, null]; // [rowsAffected, lastInsertId]
			if (cmd === "plugin:sql|select") return [];          // rows array
			if (cmd === "plugin:sql|close") return true;

			// plugin-notification
			if (cmd === "plugin:notification|active") return [];
			if (cmd === "plugin:notification|remove_active") return null;

			// plugin-geolocation, plugin-opener, plugin-http, plugin-fs, plugin-os
			// all Tauri-native cmds → safe defaults
			return null;
		};

		w.__TAURI_INTERNALS__ = {
			invoke: fakeInvoke,
			transformCallback: (callback: (payload: unknown) => void, _once?: boolean) => {
				const id = nextCallbackId++;
				callbackStore.set(id, callback);
				return id;
			},
			unregisterCallback: (id: number) => callbackStore.delete(id),
			convertFileSrc: (filePath: string, _protocol?: string) => filePath,
		};

		w.isTauri = false;
		w.__TAURI__ = {};
	}
}

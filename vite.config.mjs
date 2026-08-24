import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;
const packageJsonPath = fileURLToPath(new URL("./package.json", import.meta.url));
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const appVersion = packageJson.version ?? "0.0.0";

// https://vite.dev/config/
export default defineConfig(async ({ command, mode }) => {
	// DEV-only: 浏览器 dev server 下把所有 @tauri-apps/* 模块重定向到 mock，
	// 避免浏览器中 Tauri invoke() 不可用导致的崩溃。生产构建不受影响。
	// command 可能是 "serve" (dev) 或 "build" (生产)
	const isDevServe = command === "serve" || mode === "development";
	if (isDevServe) {
		console.log("[free-grind-dev] DEV mode detected, enabling Tauri mock aliases (command=" + command + ", mode=" + mode + ")");
	}
	const resolve = isDevServe
		? {
				alias: [
					{ find: "@tauri-apps/api/core", replacement: fileURLToPath(new URL("./src/dev/mock-core.ts", import.meta.url)) },
					{ find: "@tauri-apps/api/event", replacement: fileURLToPath(new URL("./src/dev/mock-event.ts", import.meta.url)) },
					{ find: "@tauri-apps/api/path", replacement: fileURLToPath(new URL("./src/dev/mock-path.ts", import.meta.url)) },
					{ find: "@tauri-apps/api/window", replacement: fileURLToPath(new URL("./src/dev/mock-window.ts", import.meta.url)) },
					{ find: "@tauri-apps/plugin-sql", replacement: fileURLToPath(new URL("./src/dev/mock-sql.ts", import.meta.url)) },
					{ find: "@tauri-apps/plugin-fs", replacement: fileURLToPath(new URL("./src/dev/mock-fs.ts", import.meta.url)) },
					{ find: "@tauri-apps/plugin-os", replacement: fileURLToPath(new URL("./src/dev/mock-os.ts", import.meta.url)) },
					{ find: "@tauri-apps/plugin-http", replacement: fileURLToPath(new URL("./src/dev/mock-http.ts", import.meta.url)) },
					{ find: "@tauri-apps/plugin-notification", replacement: fileURLToPath(new URL("./src/dev/mock-notification.ts", import.meta.url)) },
					{ find: "@tauri-apps/plugin-geolocation", replacement: fileURLToPath(new URL("./src/dev/mock-geolocation.ts", import.meta.url)) },
					{ find: "@tauri-apps/plugin-opener", replacement: fileURLToPath(new URL("./src/dev/mock-opener.ts", import.meta.url)) },
					{ find: "@gbyte/tauri-plugin-ios-photos", replacement: fileURLToPath(new URL("./src/dev/mock-ios-photos.ts", import.meta.url)) },
					{ find: "tauri-plugin-android-fs-api", replacement: fileURLToPath(new URL("./src/dev/mock-android-fs.ts", import.meta.url)) },
					{ find: "tauri-plugin-hotswap-api", replacement: fileURLToPath(new URL("./src/dev/mock-hotswap.ts", import.meta.url)) },
				],
			}
		: undefined;

	return {
		plugins: [react(), tailwindcss()],
		define: {
			"import.meta.env.VITE_APP_VERSION": JSON.stringify(appVersion),
		},
		build: {
			outDir: "dist",
			emptyOutDir: true,
			target: "chrome69",
			cssTarget: "chrome69",
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (
							id.includes("/node_modules/react/") ||
							id.includes("/node_modules/react-dom/") ||
							id.includes("/node_modules/scheduler/")
						) {
							return "vendor-react";
						}
						if (
							id.includes("/node_modules/react-router") ||
							id.includes("/node_modules/@remix-run/")
						) {
							return "vendor-router";
						}
						if (
							id.includes("/node_modules/leaflet/") ||
							id.includes("/node_modules/react-leaflet/")
						) {
							return "vendor-map";
						}
						if (id.includes("/node_modules/@tauri-apps/")) {
							return "vendor-tauri";
						}
						if (
							id.includes("/node_modules/zod/") ||
							id.includes("/node_modules/@msgpack/")
						) {
							return "vendor-data";
						}
					},
				},
			},
		},
		resolve,

		// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
		//
		// 1. prevent Vite from obscuring rust errors
		clearScreen: false,
		// 2. tauri expects a fixed port, fail if that port is not available
		server: {
			port: 1420,
			strictPort: true,
			host: host || false,
			hmr: host
				? {
						protocol: "ws",
						host,
						port: 1420,
					}
				: undefined,
			watch: {
				// 3. tell Vite to ignore watching `src-tauri`
				ignored: ["**/src-tauri/**"],
			},
		},
	};
});

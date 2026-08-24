// Mock for @tauri-apps/plugin-http — DEV-only
export async function fetch(_input: string | Request, _init?: RequestInit): Promise<Response> {
	// Return a minimal Response object so code that reads it won't crash
	const body = JSON.stringify({});
	return new Response(body, {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

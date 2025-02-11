import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GO_BACKEND_URL } from '$env/static/private';

let session: string = "";

// Extract session from cookie
const getSession = (cookieHeader: string) => {
	const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
		const [key, value] = cookie.trim().split('=');
		acc[key] = value;
		return acc;
	}, {} as Record<string, string>);

	return cookies.session;
};

/**
 * 1) POST /chat — Send a new message to your Go server
 *    Return a conversation ID (or any response you like).
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { query } = body;

		if (!query) {
			throw error(400, 'No query provided');
		}

		const cookie = request.headers.get('cookie');
		if (cookie) { session = getSession(cookie); }

		// Forward this request to your Go server's POST /query
		const goRes = await fetch(`${GO_BACKEND_URL}/api/query`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${session}`
			},
			body: JSON.stringify({
				query
			})
		});
		
		if (!goRes.ok) {
			const msg = await goRes.text();
			throw error(goRes.status, msg);
		}

		const data = await goRes.json();
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err: any) {
		throw error(500, err.message);
	}
};

/**
 * 2) GET /chat — Start SSE to stream responses
 *    
 */
export const GET: RequestHandler = async ({ url }) => {
	try {
		const conversationId = url.searchParams.get('conversationId');
		if (!conversationId) {
			throw error(400, 'No conversationId provided');
		}

		// Open a connection to the Go server’s SSE endpoint
		const goSseUrl = `${GO_BACKEND_URL}/api/query?conversationId=${conversationId}`;
		const goResponse = await fetch(goSseUrl, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${session}`,
				Accept: 'text/event-stream'
			}
		});

		if (!goResponse.ok || !goResponse.body) {
			const msg = await goResponse.text();
			throw error(goResponse.status, msg || 'Go SSE response error');
		}

		return new Response(goResponse.body, {
			status: 200,
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive'
			}
		});

	} catch (err: any) {
		throw error(500, err.message);
	}
};
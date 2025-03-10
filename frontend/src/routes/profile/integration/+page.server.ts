import type { PageServerLoad } from './$types';
import { GO_BACKEND_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
// import { error as SvelteError } from '@sveltejs/kit';
// import {
// 	GOOGLE_CLIENT_ID,
// 	GOOGLE_AUTH_URL,
// 	GOOGLE_SCOPES,
// 	GOOGLE_REDIRECT_URI,
// 	MICROSOFT_CLIENT_ID,
// 	MICROSOFT_AUTH_URL,
// 	MICROSOFT_SCOPES,
// 	MICROSOFT_REDIRECT_URI,
// 	NOTION_CLIENT_ID,
// 	NOTION_AUTH_URL
// } from '$env/static/private';

// const OAUTH_CONFIG = {
// 	GOOGLE: {
// 		clientId: GOOGLE_CLIENT_ID,
// 		authUrl: GOOGLE_AUTH_URL,
// 		scopes: GOOGLE_SCOPES?.split(' '),
// 		redirectUri: GOOGLE_REDIRECT_URI
// 	},
// 	MICROSOFT: {
// 		clientId: MICROSOFT_CLIENT_ID,
// 		authUrl: MICROSOFT_AUTH_URL,
// 		scopes: MICROSOFT_SCOPES?.split(' '),
// 		redirectUri: MICROSOFT_REDIRECT_URI
// 	},
// 	NOTION: {
// 		clientId: NOTION_CLIENT_ID,
// 		authUrl: NOTION_AUTH_URL
// 	}
// } as const;

// function buildAuthUrl(provider: 'GOOGLE' | 'MICROSOFT' | 'NOTION'): string {
// 	const config = OAUTH_CONFIG[provider];
// 	if (!config) {
// 		throw new Error(`Invalid provider: ${provider}`);
// 	}

// 	const state = `${provider}-${Math.random().toString(36).substring(7)}`;
// 	const authUrl = new URL(config.authUrl);

// 	// Build authorization URL based on provider
// 	authUrl.searchParams.append('state', state);

// 	if (provider === 'NOTION') {
// 		return authUrl.toString();
// 	}

// 	const { scopes, redirectUri } = config as { scopes: string[]; redirectUri: string };

// 	if (!scopes || !redirectUri) {
// 		throw new Error(`Invalid configuration for provider: ${provider}`);
// 	}

// 	authUrl.searchParams.append('response_type', 'code');
// 	authUrl.searchParams.append('redirect_uri', redirectUri);
// 	authUrl.searchParams.append('scope', scopes.join(' '));
// 	authUrl.searchParams.append('client_id', config.clientId);

// 	if (provider === 'GOOGLE') {
// 		authUrl.searchParams.append('access_type', 'offline');
// 		authUrl.searchParams.append('prompt', 'consent');
// 	} else if (provider === 'MICROSOFT') {
// 		authUrl.searchParams.append('response_mode', 'query');
// 	}
	
// 	return authUrl.toString();
// }

// export const load: PageServerLoad = async ({ url, cookies }) => {
//   const code = url.searchParams.get('code');
//   const provider = url.searchParams.get('state')?.split('-')[0] as keyof typeof OAUTH_CONFIG;

//   // Handle OAuth callback
//   if (code && provider) {
//     const authData = { Provider: provider, AuthCode: code };
//     const token = cookies.get('jwt');
//     if (!token) {
//       console.error('No JWT token found, user is not authenticated');
//       return { success: false, error: 'Authentication failed' };
//     }
//     try {
//       const response = await fetch(`${GO_BACKEND_URL}/api/connect`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(authData)
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Auth failed:', errorText);
//         return { success: false, error: 'Authentication failed' };
//       }

//       const data = await response.json();
//       if (data.error) {
//         return { success: false, error: data.error };
//       }

//       return {
//         success: true,
//         isAuthenticated: true,
//         provider: provider
//       };
//     } catch (error) {
//       console.error('Integration error:', error);
//       return { success: false, error: 'Failed Integration' };
//     }
//   }

//   const requestedProvider = url.searchParams.get('provider')?.toUpperCase() as 'GOOGLE' | 'MICROSOFT';
//   if (requestedProvider && OAUTH_CONFIG[requestedProvider]) {
//     const authUrl = buildAuthUrl(requestedProvider);
//     return { success: false, redirectTo: authUrl };
//   }

//   return {
//     success: false,
//     isAuthenticated: false,
//     provider: undefined
//   };
// };

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('jwt');
	if (!token) {
		throw redirect(302, '/login');
	}

	let connectedProviders: string[] = [];
	try {
		const response = await fetch(`${GO_BACKEND_URL}/api/integrations`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		});
		if (!response.ok) {	
			throw error(500, 'Failed to fetch integrations');
		}
		const data = await response.json();
		connectedProviders = data.providers ?? [];
	} catch (err) {
		throw error(500, 'Failed to fetch integrations');
	}

	return {
		connectedProviders
	}
}
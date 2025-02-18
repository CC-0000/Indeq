import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { GO_BACKEND_URL } from '$env/static/private';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_AUTH_URL,
  GOOGLE_SCOPES,
  GOOGLE_REDIRECT_URI,
  MICROSOFT_CLIENT_ID,
  MICROSOFT_AUTH_URL,
  MICROSOFT_SCOPES,
  MICROSOFT_REDIRECT_URI
} from '$env/static/private';

const OAUTH_CONFIG = {
  GOOGLE: {
    clientId: GOOGLE_CLIENT_ID,
    authUrl: GOOGLE_AUTH_URL,
    scopes: GOOGLE_SCOPES?.split(' '),
    redirectUri: GOOGLE_REDIRECT_URI
  },
  MICROSOFT: {
    clientId: MICROSOFT_CLIENT_ID,
    authUrl: MICROSOFT_AUTH_URL,
    scopes: MICROSOFT_SCOPES?.split(' '),
    redirectUri: MICROSOFT_REDIRECT_URI
  }
};

function validateConfig(provider: keyof typeof OAUTH_CONFIG) {
  const config = OAUTH_CONFIG[provider];
  if (!config.clientId || !config.authUrl || !config.scopes) {
    throw new Error(`Invalid configuration for provider: ${provider}`);
  }
  return config;
}

function buildAuthUrl(provider: 'GOOGLE' | 'MICROSOFT', origin: string): string {
  const config = validateConfig(provider);
  const state = `${provider}-${Math.random().toString(36).substring(7)}`;
  const authUrl = new URL(config.authUrl);

  // Build authorization URL based on provider
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('client_id', config.clientId);
  authUrl.searchParams.append('redirect_uri', `${origin}/profile/integration`);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', config.scopes.join(' '));

  // Add provider-specific parameters
  if (provider === 'GOOGLE') {
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');
  } else if (provider === 'MICROSOFT') {
    authUrl.searchParams.append('response_mode', 'query');
  }

  return authUrl.toString();
}

export const load: PageServerLoad = async ({ url, cookies }) => {
  try {
    const code = url.searchParams.get('code');
    const provider = url.searchParams.get('state')?.split('-')[0] as keyof typeof OAUTH_CONFIG;

    // Handle OAuth callback
    if (code && provider) {
      const authData = { Provider: provider, AuthCode: code };
      const token = cookies.get('session');

      if (!token) {
        console.error('No JWT token found, user is not authenticated');
        return { success: false, error: 'Authentication failed' };
      }

      try {
        const response = await fetch(`${GO_BACKEND_URL}/api/connect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(authData)
        });
        console.log(response)
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Auth failed:', errorText);
          return { success: false, error: 'Authentication failed' };
        }

        const data = await response.json();
        if (data.error) {
          return { success: false, error: data.error };
        }

        return {
          success: true,
          isAuthenticated: true,
          provider: provider
        };
      } catch (error) {
        console.error('Integration error:', error);
        return { success: false, error: 'Failed Integration' };
      }
    }

    const requestedProvider = url.searchParams.get('provider')?.toUpperCase() as 'GOOGLE' | 'MICROSOFT';
    if (requestedProvider && OAUTH_CONFIG[requestedProvider]) {
      const authUrl = buildAuthUrl(requestedProvider, url.origin);
      return { success: false, redirectTo: authUrl };
    }

    // Check session
    // const session = cookies.get('session');
    // if (!session) {
    //   return { success: false, redirectTo: '/login' };
    // }

    return {
      success: false,
      isAuthenticated: false,
      provider: undefined
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};
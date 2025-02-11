import type { PageServerLoad } from './$types';
import { fail,redirect } from '@sveltejs/kit';
import { GO_BACKEND_URL } from '$env/static/private';
import {GOOGLE_CLIENT_ID,GOOGLE_AUTH_URL, GOOGLE_SCOPES, GOOGLE_REDIRECT_URI, MICROSOFT_CLIENT_ID, MICROSOFT_AUTH_URL, MICROSOFT_SCOPES, MICROSOFT_REDIRECT_URI} from '$env/static/private';

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

// Validate the OAuth config
function validateConfig(provider: keyof typeof OAUTH_CONFIG) {
  const config = OAUTH_CONFIG[provider];
  if (!config.clientId || !config.authUrl || !config.scopes) {
    throw new Error(`Invalid configuration for provider: ${provider}`);
  }
  return config;
}

export const load: PageServerLoad = async ({ url, cookies }) => {


  const code = url.searchParams.get('code');
  const provider = url.searchParams.get('state')?.split('-')[0] as keyof typeof OAUTH_CONFIG;
  console.log(code, provider)
  if (code && provider) {
    // Send to backend with provider info
    const authData = {
      code,
      provider,
    };
    console.log(authData)
    // deciding on what to return
    // try {
    //     const response = await fetch(`${GO_BACKEND_URL}/api/auth/temppost`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify(authData)
    //     });
    //     if (!response.ok) {
    //       const errorText = await response.text();
    //       console.error('Auth failed:', errorText);
    //       return { error: 'Authentication failed' };
    //     }
    //     const data = await response.json();
      
    //     if (data.error) {
    //       return { error: data.error };
    //     }
    //     return {
    //       success: true,
    //       isAuthenticated: true,
    //       provider: provider,
    //     };
  
    //   }
    //   catch (error) {
    //     console.error('Integration error:', error);
    //     return fail(400, { error: 'Failed Integration' });
    //   } 
  };

  // Get provider from query param for initial auth request
  const requestedProvider = url.searchParams.get('provider')?.toUpperCase() as 'GOOGLE' | 'MICROSOFT';
  const state = `${requestedProvider}-${Math.random().toString(36).substring(7)}`; // Unique state

  if (requestedProvider && OAUTH_CONFIG[requestedProvider]) {
    const config = validateConfig(requestedProvider);
    const authUrl = new URL(config.authUrl);

    // Build authorization URL based on provider
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('client_id', config.clientId);
    authUrl.searchParams.append('redirect_uri', `${url.origin}/profile`);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', config.scopes.join(' '));
    // Add provider-specific parameters
    if (requestedProvider === 'GOOGLE') {
      authUrl.searchParams.append('access_type', 'offline');
      authUrl.searchParams.append('prompt', 'consent');
    } else if (requestedProvider === 'MICROSOFT') {
      authUrl.searchParams.append('response_mode', 'query');
    }

    throw redirect(302, authUrl.toString());
  }

  const session = cookies.get('session');
  if (!session) {
    throw redirect(302, '/login');
  }

  return { 
    success: false,
    isAuthenticated: false,
    provider: undefined
  };
};

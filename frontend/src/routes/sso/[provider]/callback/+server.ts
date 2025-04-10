import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { GO_BACKEND_URL } from '$env/static/private';
import { verifyToken } from '$lib/server/auth';

export const GET = async ({ params, url, cookies }: RequestEvent) => {
  const provider = params.provider;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  // if valid, exchange code for token
  if (code && state && provider) {
    const authData = { provider: provider, auth_code: code, state: state };

    try {
      const response = await fetch(`${GO_BACKEND_URL}/api/ssologin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData)
      });

      const data = await response.json();
      if (data.error || !response.ok) {
        throw redirect(
          302,
          '/login'
        );
      }

      if (data.token) {
        cookies.set('jwt', data.token, {
          httpOnly: true,
          secure: true,
          path: '/',
          maxAge: 60 * 60 * 24, // 1 day
          sameSite: 'lax'
        });

        // Redirect to chat page on success with user_created status
        cookies.set('user_created', data.user_created ? 'true' : 'false', {
          httpOnly: true,
          secure: true,
          path: '/',
          maxAge: 60 * 60 * 24,
          sameSite: 'lax'
        });
        return new Response(null, {
          status: 302,
          headers: { 
            Location: `/chat`
          }
        });
      }

    } catch (error) {
      if (!(error instanceof redirect)) {
        throw redirect(
          302,
          '/login'
        );
      }
      throw error;
    }
  }
};

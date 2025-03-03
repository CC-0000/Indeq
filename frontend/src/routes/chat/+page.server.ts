import type { PageServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { GO_BACKEND_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  const session = cookies.get('jwt');
  if (!session) {
    // No user, redirect to login
    throw redirect(302, '/login');
  }

  const integrations = await fetch(`${GO_BACKEND_URL}/api/integrations`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session}`
    }
  });

  let data: {providers?: string[] };
  try {
    data = await integrations.json();
  } catch (err) {
    throw error(500, 'Failed to fetch integrations');
  }

  const providers = data.providers ?? [];

  return {
    integrations: providers
  }
};

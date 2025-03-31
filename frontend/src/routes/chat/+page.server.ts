import type { PageServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { GO_BACKEND_URL } from '$env/static/private';
import type { DesktopIntegration } from '$lib/types/desktopIntegration';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  const session = cookies.get('jwt');
  if (!session) {
    // No user, redirect to login
    throw redirect(302, '/login');
  }

  const integrations = await fetch(`${GO_BACKEND_URL}/api/integrations`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session}`
    }
  });

  const desktopIntegration = await fetch(`${GO_BACKEND_URL}/api/desktop_stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session}`
    }
  });

  const data: { providers?: string[], desktopInfo: any } = {
    providers: [],
    desktopInfo: await desktopIntegration.json()
  };

  try {
    data.providers = await integrations.json();
    console.log(data)
  } catch (err) {
    throw error(500, ' to fetch integrations');
  }

  const providers = data.providers ?? [];

  return {
    providers,
    desktopInfo: data.desktopInfo
  };
};

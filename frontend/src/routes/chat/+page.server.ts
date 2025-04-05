import type { PageServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { GO_BACKEND_URL } from '$env/static/private';
import type { DesktopIntegration } from '$lib/types/desktopIntegration';
import type { Conversation } from '$lib/types/conversation';

export const load: PageServerLoad = async ({ cookies, fetch, url }) => {
  const session = cookies.get('jwt');
  if (!session) {
    // No user, redirect to login
    throw redirect(302, '/login');
  }

  const conversationId = url.searchParams.get('id');
  let conversation: Conversation | null = null;

  // Fetch the specific conversation if ID is provided
  if (conversationId) {
    try {
      const conversationRes = await fetch(`${GO_BACKEND_URL}/api/conversations/${conversationId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session}`
        }
      });

      if (conversationRes.ok) {
        const data = await conversationRes.json();
        conversation = data.conversation;
      }
    } catch (err) {
      console.error('Error fetching conversation:', err);
    }
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

  let integrationData: { providers?: string[] };
  let desktopIntegrationData: DesktopIntegration;

  try {
    integrationData = await integrations.json();
    desktopIntegrationData = await desktopIntegration.json();
  } catch (err) {
    throw error(500, 'Failed to fetch integrations');
  }

  const providers = integrationData.providers ?? [];

  return {
    integrations: providers,
    desktopInfo: desktopIntegrationData,
    conversation
  };
};

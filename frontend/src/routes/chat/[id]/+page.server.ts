import { GO_BACKEND_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies, fetch }) => {
    const id = params.id;
    const session = cookies.get('jwt');
    if (!session) {
      // No user, redirect to login
      throw redirect(302, '/login');
    }
    
    const conversation = await fetch(`/api/chat/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const integrations = await global.fetch(`${GO_BACKEND_URL}/api/integrations`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session}`
      }
    });
    const conversationData = await conversation.json();
    const integrationsData = await integrations.json();
    const providers = integrationsData.providers ?? [];
    return {
      id,
      conversation: conversationData.conversation,
      integrations: providers
    };
}
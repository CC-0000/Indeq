import { GO_BACKEND_URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { parseConversation } from '$lib/utils/chat';
import type { ChatMessage } from '$lib/types/chat';

export const load: PageServerLoad = async ({ params, cookies, fetch, url }) => {
    const id = params.id;
    const requestId = url.searchParams.get('requestId');
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

    const title = conversationData.conversation.title;
    let parsedConversation: ChatMessage[] = [];

    if (!requestId) {
      parsedConversation = parseConversation(conversationData.conversation);
    }
    
    return {
      id,
      title,
      conversation: parsedConversation,
      integrations: providers,
      requestId
    };
}
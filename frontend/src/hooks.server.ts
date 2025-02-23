// hooks server: handles session and authentication cookies
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const session = event.cookies.get('session');
    if (
        (event.url.pathname.startsWith('/chat') || event.url.pathname.startsWith('/profile')) &&
        !session
    ) {
        return redirect(302, '/login');
    }
    return resolve(event);
}
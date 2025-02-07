import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
  const session = cookies.get('session');
  if (!session) {
    // No user, redirect to login
    throw redirect(302, '/login');
  }
  // Else proceed, maybe fetch chat data
  return {};
};

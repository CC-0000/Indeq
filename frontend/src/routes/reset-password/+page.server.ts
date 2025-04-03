import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { GO_BACKEND_URL } from "$env/static/private";

export const load: PageServerLoad = async ({ cookies }) => {
  const pendingReset = cookies.get('pendingReset');

  if (!pendingReset) {
    throw redirect(303, '/forgot-password');
  }

  return { context: 'reset' };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const password = data.get('password');
    const email = cookies.get('pendingReset');

    if (!email) {
      return fail(400, { error: 'Reset session expired. Please start again.' });
    }

    // Call backend to update password
    const res = await fetch(`${GO_BACKEND_URL}/api/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const msg = await res.text();
      return fail(res.status, { error: msg });
    }

    const response = await res.json();

    if (!response.success) {
      return fail(400, { error: response.error || 'Failed to reset password' });
    }

    // Optionally, log them in right after
    if (response.token) {
      cookies.set('jwt', response.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });
    }

    // Clear the reset session
    cookies.delete('pendingReset', { path: '/' });

    return { success: true };
  }
};

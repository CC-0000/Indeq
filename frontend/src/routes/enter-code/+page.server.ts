import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { GO_BACKEND_URL } from "$env/static/private";

export const load: PageServerLoad = async ({ url, cookies }) => {
  const type = url.searchParams.get('type');

  if (!type || !['register', 'forgot'].includes(type)) {
    throw redirect(303, '/register');
  }

  const pendingRegister = cookies.get('pendingRegister');
  const pendingReset = cookies.get('pendingReset');

  if (type === 'register' && !pendingRegister) {
    throw redirect(303, '/register');
  }

  if (type === 'forgot' && !pendingReset) {
    throw redirect(303, '/forgot-password');
  }

  return { context: type };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const type = data.get('type');
    const code = data.get('code');
    const resend = data.get('resend');

    if (!type || typeof type !== 'string') {
      return fail(400, { error: 'Missing or invalid type' });
    }

    const email = type === 'register' ? cookies.get('pendingRegister') : cookies.get('pendingReset');

    if (!email) {
      return fail(400, { error: 'Missing or invalid email' });
    }

    if (resend === 'true') {
      const resendRes = await fetch(`${GO_BACKEND_URL}/api/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, email })
      });

      if (!resendRes.ok) {
        const msg = await resendRes.text();
        return fail(resendRes.status, { error: msg });
      }

      return { success: true };
    }

    const verifyRes = await fetch(`${GO_BACKEND_URL}/api/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, type, email })
    });

    if (!verifyRes.ok) {
      const msg = await verifyRes.text();
      return fail(verifyRes.status, { error: msg });
    }

    const response = await verifyRes.json();

    if (!response.success) {
      return fail(400, { error: response.error });
    }

    if (type === 'register') {
      // Set the JWT
      if (response.token) {
        cookies.set('jwt', response.token, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 // 1 day
        });
      }

      cookies.delete('pendingRegister', { path: '/' });
    }

    return {
      success: true,
      verifiedType: type
    };
  }
};

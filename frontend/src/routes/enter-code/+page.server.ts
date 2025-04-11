import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import { GO_BACKEND_URL } from "$env/static/private";

export const load: PageServerLoad = async ({ url, cookies }) => {
  const type = url.searchParams.get('type');
  if (!type || (type !== 'register' && type !== 'forgot')) {
    throw redirect(303, '/register');
  }
  if (type === 'register') {
    const pendingToken = cookies.get('pendingRegisterToken');
    const jwt = cookies.get('jwt');
    if (!pendingToken && !jwt) {
      throw redirect(303, '/register');
    }
    return { context: type };
  } else if (type === 'forgot') {
    const pendingToken = cookies.get('pendingForgotToken');
    if (!pendingToken) {
      throw redirect(303, '/forgot-password');
    }
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
      return fail(400, { error: 'Invalid type' });
    }

    const token = cookies.get('pendingRegisterToken') || cookies.get('pendingForgotToken');

    if (!token) {
      return fail(400, { error: 'Something went wrong. Please try again.' });
    }

    if (resend === 'true') {
      const resendRes = await fetch(`${GO_BACKEND_URL}/api/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, token })
      });

      if (!resendRes.ok) {
        const msg = await resendRes.text();
        return fail(resendRes.status, { error: msg });
      }

      const response = await resendRes.json();
      if (!response.success) {
        return fail(400, { error: response.message });
      }

      return { success: true, message: 'A new verification code has been sent to your email.'};
    }
    else {
      const verifyRes = await fetch(`${GO_BACKEND_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, code, token })
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
      cookies.set('jwt', response.token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 1 day
      });
      cookies.delete('pendingRegisterToken', { path: '/' });
    }

    return { success: true, verifiedType: type };
    }
  }
} satisfies Actions;
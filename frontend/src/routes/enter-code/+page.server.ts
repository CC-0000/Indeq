import { fail, type Actions } from "@sveltejs/kit";
import { GO_BACKEND_URL } from "$env/static/private";

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const type = data.get('type');
    const code = data.get('code');
    const resend = data.get('resend');

    if (!type || typeof type !== 'string') {
      return fail(400, { error: 'Missing or invalid type' });
    }

    if (resend === 'true') {
      const resendRes = await fetch(`${GO_BACKEND_URL}/api/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
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
      body: JSON.stringify({ code, type })
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

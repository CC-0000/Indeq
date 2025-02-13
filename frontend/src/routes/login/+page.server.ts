import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { GO_BACKEND_URL } from '$env/static/private';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        // Basic validation
        if (!email || !password) {
            return fail(400, {
                error: 'Email and password are required',
                email: email?.toString()
            });
        }

        try {
            const res = await fetch(`${GO_BACKEND_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "email": email, "password": password }),
            });

            if (!res.ok) {
                const msg = await res.text();
                
                // Return an error to the page to display
                return fail(res.status, { errorMessage: msg });
            }

            const response = await res.json();
            cookies.set('session', response.token, { path: '/', maxAge: 60 * 60 * 24 * 30 });

            if (response.error === '') {
                return { success: true };
            } else {
                return fail(400, { errorMessage: response.error });
            }

        } catch (error) {
            return fail(400, {
                error: 'Invalid credentials',
                email: email?.toString()
            });
        }
    }
} satisfies Actions;

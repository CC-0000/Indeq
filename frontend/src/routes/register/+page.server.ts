import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { GO_BACKEND_URL } from '$env/static/private';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');
        const name = data.get('name');

        // Basic validation
        if (!email || !password || !name) {
            return fail(400, {
                error: 'Email, password and name are required',
                email: email?.toString(),
                name: name?.toString()
            });
        }
        
        const res = await fetch(`${GO_BACKEND_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "email": email, "name": name, "password": password }),
        });

        if (!res.ok) {
            const msg = await res.text();

            // Return an error to the page to display
            return fail(res.status, { errorMessage: msg });
        }

        const response = await res.json();

        if (response.success) {
            return { success: true };
        } else {
            return fail(400, { errorMessage: response.error });
        }
        
    }
} satisfies Actions;

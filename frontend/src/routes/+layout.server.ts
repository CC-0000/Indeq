import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { APP_ENV } from '$env/static/private';

// restrict production access to the app until backend is hosted
export const load: LayoutServerLoad = async ({ url }) => {

	if (url.pathname !== '/' && APP_ENV === 'PRODUCTION') {
		throw redirect(302, '/');
	}

	return {};
};
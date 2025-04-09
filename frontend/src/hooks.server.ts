// hooks server: handles session and authentication cookies
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/server/auth';
import { APP_ENV } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
  const jwt = event.cookies.get('jwt');
  const isAuthenticated = jwt && (await verifyToken(jwt));

  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/terms',
    '/privacy',
    '/api/waitlist',
    '/sitemap.xml',
    '/sso/GOOGLE',
    '/sso/GOOGLE/callback'
  ];
  const productionRoutes = ['/', '/terms', '/privacy', '/api/waitlist', '/sitemap.xml'];

  if (APP_ENV === 'PRODUCTION' && !productionRoutes.includes(event.url.pathname)) {
    return redirect(302, '/');
  }

  // Redirect authenticated users away from login and register pages
  if (isAuthenticated && (event.url.pathname === '/login' || event.url.pathname === '/register')) {
    const redirectFrom = event.url.pathname === '/login' ? 'login' : 'register';
    return redirect(302, `/chat?redirected=true&from=${redirectFrom}`);
  }

  if (!publicRoutes.includes(event.url.pathname)) {
    const isValid = jwt && (await verifyToken(jwt));

    if (!isValid) {
      return redirect(302, '/login');
    }
  }

  return resolve(event);
};

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

  const authRoutes = ['/login', '/register'];

  const productionRoutes = ['/', '/terms', '/privacy', '/api/waitlist', '/sitemap.xml'];

  if (APP_ENV === 'PRODUCTION' && !productionRoutes.includes(event.url.pathname)) {
    return redirect(302, '/');
  }

  // Redirect authenticated users away from login and register pages
  if (isAuthenticated && authRoutes.includes(event.url.pathname) && event.request.method === 'GET') {
    const redirectFrom = event.url.pathname === '/login' ? 'login' : 'register';
    event.cookies.set("redirected_from", redirectFrom, {
      httpOnly: true, // Prevent client-side access
      secure: true, // Only send over HTTPS
      path: '/', // Accessible across the entire app
      maxAge: 5, // 5 seconds
      sameSite: 'lax'
    });
    
    return redirect(302, `/chat`);
  }

  if (!publicRoutes.includes(event.url.pathname)) {
    const isValid = jwt && (await verifyToken(jwt));

    if (!isValid) {
      return redirect(302, '/login');
    }
  }

  return resolve(event);
};

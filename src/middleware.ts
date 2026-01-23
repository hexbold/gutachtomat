import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/gutachten-erstellen(.*)',
  '/account(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Only enforce auth in production
  if (process.env.NODE_ENV === 'production' && isProtectedRoute(req)) {
    await auth.protect();
  }
  // In development, allow all access for easier offline testing
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

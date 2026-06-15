import { clerkMiddleware } from "@clerk/nextjs/server";

/* ----------------------------------------------------------------------------
   Next.js 16 renamed Middleware to "Proxy" (same functionality, new filename).
   Clerk's `clerkMiddleware` attaches auth context to every matched request so
   that `auth()` works inside Server Actions, Route Handlers, and Components.
---------------------------------------------------------------------------- */

export default clerkMiddleware();

export const config = {
  matcher: [
    // Run on everything except Next internals and static files (unless in search params)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run on API routes
    "/(api|trpc)(.*)",
  ],
};

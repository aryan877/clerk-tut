import { authMiddleware } from "@clerk/nextjs";

/**
 * Configure authMiddleware for Clerk authentication in a Next.js application.
 * This setup defines which routes are public and which ones require authentication.
 *
 * @publicRoutes: An array of paths that are accessible without authentication.
 *
 * More information on configuring the middleware can be found at:
 * https://clerk.com/docs/references/nextjs/auth-middleware
 */
export default authMiddleware({
  // Define public routes that do not require user authentication
  publicRoutes: [
    "/sign-in", // Sign-in page
    "/sign-up", // Sign-up page
    "/api/webhook", // Webhook API
  ],
  // Note: API routes, will require authentication
  apiRoutes: [
    "/api/posts", // Publicly accessible posts API
  ],
});

/**
 * The Next.js custom configuration object.
 * The 'matcher' property is used to apply middleware logic to specific paths.
 * Regex patterns are used to include or exclude certain paths.
 */
export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Apply middleware to all paths excluding static files and _next directory
    "/", // Apply middleware to the root path
    "/(api|trpc)(.*)", // Apply middleware to all API and TRPC routes
  ],
};

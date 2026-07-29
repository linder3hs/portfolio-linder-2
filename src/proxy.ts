import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(en|es)/:path*",
    /*
     * Everything except API routes, Next internals, files with an extension,
     * and the generated metadata routes.
     *
     * `icon` and `apple-icon` need naming explicitly: they have no file
     * extension, so the `.*\..*` clause does not cover them, and without this
     * the locale redirect sends /icon to /en/icon — which does not exist. The
     * favicon 404s and the tab renders blank.
     */
    "/((?!api|_next|_vercel|icon|apple-icon|.*\\..*).*)",
  ],
};

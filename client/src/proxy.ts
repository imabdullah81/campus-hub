import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Route Configuration ──────────────────────────────────────────────────────

/** Pages accessible without authentication */
const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/",          // landing page
];

/** Pages only accessible to admins */
const ADMIN_PATHS = ["/admin"];

// ─── Middleware ───────────────────────────────────────────────────────────────

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("campus_hub_token")?.value;

  const isPublicPath = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  // 1. Not authenticated → redirect to login (except public paths)
  if (!token && !isPublicPath) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated → redirect away from auth pages to dashboard
  if (token && isPublicPath && pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Admin route protection — decode role from JWT payload
  if (token && ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    try {
      // JWT payload is the middle Base64 segment (no crypto needed in Edge)
      const [, payloadB64] = token.split(".");
      const payload = JSON.parse(
        Buffer.from(payloadB64, "base64url").toString("utf-8")
      );

      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      // Malformed token → clear it and redirect to login
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("campus_hub_token");
      return res;
    }
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────
// Run on all routes except Next.js internals, API, and static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.svg (example)
     * Also exclude common image extensions served from /public
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Protects /admin/* — everything except /admin/login requires a valid
 * session cookie. Verification runs at the edge with jose (no DB call here;
 * the layouts re-check against the database server-side).
 */
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("kb_admin")?.value;
  const secret = process.env.AUTH_SECRET;

  let valid = false;
  if (token && secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      valid = true;
    } catch {
      valid = false;
    }
  }

  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (!valid && !isLoginPage) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  if (valid && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

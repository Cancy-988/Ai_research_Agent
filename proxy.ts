import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

function isProtectedPath(pathname: string): boolean {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/") || pathname === "/profile";
}

function isAuthPath(pathname: string): boolean {
  return pathname === "/login" || pathname === "/signup";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthed = request.cookies.get(AUTH_COOKIE)?.value === "1";

  if (isProtectedPath(pathname) && !isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPath(pathname) && isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile", "/login", "/signup"],
};

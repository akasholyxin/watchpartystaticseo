import { NextResponse, type NextRequest } from "next/server";

// One URL per page: any path with uppercase letters 301s to its lowercase form (duplicate-content guard).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }
}

export const config = {
  // Skip Next internals and files with extensions (icons, sitemap, images).
  matcher: ["/((?!_next/|.*\\.[a-zA-Z0-9]+$).*)"],
};

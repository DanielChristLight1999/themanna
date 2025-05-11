import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/auth/login", "/auth/signup"];
export default async function middleware(req: NextRequest) {

    const hostname = req.headers.get('host')!;
    const subdomain = hostname.match(/^([^.]+)\./)?.[1];
    const pathname = req.nextUrl.pathname

    const issubdomain = subdomain?.startsWith('app');

    if (!issubdomain) {
        return NextResponse.next();
    }

    const isPublicPath = PUBLIC_PATHS.some((publicpath) => pathname.startsWith(publicpath));

    if (isPublicPath) {
        return NextResponse.rewrite(new URL(`/app${req.nextUrl.pathname}`, req.url));
    }

    const isLoggedin = false;
    if (isLoggedin) {
        return NextResponse.rewrite(new URL(`/app${req.nextUrl.pathname}`, req.url));
    }else {
        return NextResponse.rewrite(new URL(`/app/auth/login${req.nextUrl.pathname}`, req.url));
    }

}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next (Next.js internals)
     * - static (static files)
     * - favicon.ico, robots.txt, etc.
     */
    "/((?!_next|images|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
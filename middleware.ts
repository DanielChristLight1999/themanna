import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { stripAppSubdomain } from "./lib/utils";

const PUBLIC_PATHS = ["/auth/login", "/auth/signup"];
export default auth(async (req) => {

    const hostname = req.headers.get('host')!;
    const subdomain = hostname.match(/^([^.]+)\./)?.[1];
    const pathname = req.nextUrl.pathname;
    const searchParams = req.nextUrl.searchParams;
    // const issubdomain = subdomain?.startsWith('app');
    console.log("hostname", hostname)

    const host = stripAppSubdomain(req.headers.get('host')?.toString() as string);



    if (!subdomain) {
        const isPublicPath = PUBLIC_PATHS.some((publicpath) => pathname.startsWith(publicpath));
        if (isPublicPath) {
            return NextResponse.redirect(new URL(`http://app.${host}${pathname}?${searchParams}`, req.url));
        }
        console.log("redirecting to app");

        return NextResponse.next();
    }


    switch (subdomain) {
        case "app":
            {
                const url = req.nextUrl.clone();


                const PROTECTED_PATHS = ["/", "/profile", "/settings", "/checkout", "/orders"]; // Add all your exact protected paths here
                const isProtectedPath = PROTECTED_PATHS.includes(pathname);
                const isLoggedin = req.auth

                const referralCode = req.nextUrl.searchParams.get("ref")
                const response = NextResponse.next()
                if (referralCode) {
                    response.cookies.set("referral", referralCode, {
                        maxAge: 60 * 60 * 24 * 30, // 30 days
                        path: "/",
                    })
                }

                if (!isLoggedin && isProtectedPath) {
                    return NextResponse.redirect(new URL(`/auth/login`, req.url));
                }
                url.pathname = `/app${req.nextUrl.pathname}`;
                return NextResponse.rewrite(url);

            }
        case "admin":
            {
                const PROTECTED_PATHS = ["/", "/profile", "/settings", "/checkout", "/orders"]; // Add all your exact protected paths here
                const isProtectedPath = PROTECTED_PATHS.includes(pathname);
                const isLoggedin = req.auth
                if (!isLoggedin && isProtectedPath) {
                    return NextResponse.redirect(new URL(`/auth/login`, req.url));
                }
                const url = req.nextUrl.clone();
                url.pathname = `/admin${req.nextUrl.pathname}`;
                return NextResponse.rewrite(url);
            }
        case "pos":
            {
                const PROTECTED_PATHS = ["/", "/active-orders", "/new-order", "/past-orders", "end-session"]; // Add all your exact protected paths here
                const isProtectedPath = PROTECTED_PATHS.includes(pathname);
                const isLoggedin = req.auth
                if (!isLoggedin && isProtectedPath) {
                    return NextResponse.redirect(new URL(`/auth/login`, req.url));
                }
                const role = isLoggedin?.user.role as string
                if (isProtectedPath && !["ADMIN", "MANAGER", "CASHIER"].includes(role)) {
                    return NextResponse.redirect(new URL("/unauthorized", req.url))
                }
                const url = req.nextUrl.clone();
                url.pathname = `/pos${req.nextUrl.pathname}`;
                return NextResponse.rewrite(url);
            }
        case "affiliate":
            {
                const PROTECTED_PATHS = ["/", "/active-orders", "/new-order", "/past-orders", "end-session"]; // Add all your exact protected paths here
                const isProtectedPath = PROTECTED_PATHS.includes(pathname);
                const isLoggedin = req.auth
                if (!isLoggedin && isProtectedPath) {
                    return NextResponse.redirect(new URL(`/auth/login`, req.url));
                }
                const url = req.nextUrl.clone();
                url.pathname = `/affiliate${req.nextUrl.pathname}`;
                return NextResponse.rewrite(url);
            }
        default:
            return NextResponse.next();
    }
    // return NextResponse.rewrite(new URL(`/app${req.nextUrl.pathname}`, req.url));
    // // return NextResponse.next();

})


export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next (Next.js internals)
         * - static (static files)
         * - favicon.ico, robots.txt, etc.
         */
        // "/((?!_next|images|favicon.ico|robots.txt|sitemap.xml).*)",
        "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+$|.*\\.[^/]+$).*)",
        // "/((?!_next/|favicon.ico|robots.txt|manifest.json|static/|.*\\..*).*)",

    ],
};
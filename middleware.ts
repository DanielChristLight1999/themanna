import { NextRequest, NextResponse } from "next/server";


export default async function middleware(req: NextRequest) {

    const hostname = req.headers.get('host')!;
    const subdomain = hostname.match(/^([^.]+)\./)?.[1];

    switch (true) {
        case subdomain?.startsWith('app'):
            return NextResponse.rewrite(new URL(`/app${req.nextUrl.pathname}`, req.url));
        default:
        // Handle the main domain
            return NextResponse.next();
    }

}
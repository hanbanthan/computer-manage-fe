import { NextRequest } from "next/server";
import { auth } from "../auth";

function isPublicPath(req: NextRequest) {
    const publicPaths = [
        'POST:/api/account/login',
        'POST:/api/account/logout',
        'POST:/api/account/register',
    ];
    return publicPaths.includes(`${req.method}:${req.nextUrl.pathname}`);
}

export default async function jwtMiddleware(req: NextRequest) {
    if (isPublicPath(req)) {
        return;
    }

    const id = auth.verifyToken();
    req.headers.set('userId', id);
}

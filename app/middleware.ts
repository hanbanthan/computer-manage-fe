import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authorization")?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/account/login', req.url));
  }

  try {
    interface JwtPayload {
      role: string;
      [key: string]: unknown;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const role = decoded.role;
    if (!["admin", "superadmin"].includes(role)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/account/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/users/:path*'],
};

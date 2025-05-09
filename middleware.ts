import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isLoggedIn = false;
export function middleware(request: NextRequest) {
  if (!isLoggedIn) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/user",
};

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifyUserSession } from "@/lib/authSession";

export async function middleware(request: NextRequest) {
  const isPublicRead =
    request.method === "GET" &&
    ["/api/products", "/api/categories", "/api/brands"].some((path) =>
      request.nextUrl.pathname.startsWith(path),
    );

  if (isPublicRead) {
    return NextResponse.next();
  }

  const session = await verifyUserSession(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (session) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const loginUrl = new URL("/", request.url);
  loginUrl.searchParams.set("auth", "required");
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/api/products/:path*",
    "/api/blogs/:path*",
    "/api/categories/:path*",
    "/api/brands/:path*",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get authentication token from cookies
  const token = request.cookies.get("token")?.value;

  // Auth pages (always public)
  const authPages = ["/login", "/register", "/admin-login"];
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));

  // Protected routes that require authentication (excluding auth pages)
  // We now handle admin protection client-side with sessionStorage
  const protectedRoutes = ["/user"]; 
  const adminRoutes = ["/admin"];

  // Check if current path is protected (but not an auth page)
  const isProtectedRoute =
    !isAuthPage && protectedRoutes.some((route) => pathname.startsWith(route));
  // Admin routes are now protected client-side only (token in sessionStorage)
  const isAdminRoute =
    !isAuthPage && adminRoutes.some((route) => pathname.startsWith(route));

  // If trying to access protected route without token, redirect to appropriate login
  if (isProtectedRoute && !token) {
    // Redirect admin routes to admin-login, others to regular login
    const loginPath = isAdminRoute ? "/admin-login" : "/login";
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated user tries to access auth pages, redirect to appropriate dashboard
  if (token && isAuthPage) {
    // For now, just allow access to auth pages even with token
    // Let client-side AuthProvider handle the proper redirects based on user role
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};

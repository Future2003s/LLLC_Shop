import { NextResponse, NextRequest } from "next/server";
import { locales, defaultLocale, isValidLocale } from "@/i18n/config";
import { API_CONFIG } from "@/lib/api-config";

// Helper to get auth info from cookies
async function getAuthInfo(request: NextRequest) {
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!sessionToken && !refreshToken) {
    return { authenticated: false, user: null };
  }

  try {
    // Call backend API directly using the new API configuration
    const backendUrl = `${API_CONFIG.API_BASE_URL}${API_CONFIG.AUTH.ME}`;
    const response = await fetch(backendUrl, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const user = data?.data || data;
      return { authenticated: true, user };
    }
  } catch (error) {
    console.error("Middleware auth check failed:", error);
  }

  return { authenticated: false, user: null };
}

// Check if user has admin privileges
function hasAdminAccess(user: any): boolean {
  if (!user) return false;
  const role = (user.role || "").toUpperCase();
  return role === "ADMIN" || role === "STAFF";
}

const privatePath: string[] = ["/me"];
const publicPath: string[] = ["/login", "/register"];

// Old admin routes that should redirect to new structure
const adminRouteRedirects: Record<string, string> = {
  "/dashboard": "/admin/dashboard",
  "/orders": "/admin/orders",
  "/admin-products": "/admin/products",
  "/accounts": "/admin/accounts",
  "/analytics": "/admin/analytics",
  "/settings": "/admin/settings",
};

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const url = request.nextUrl.clone();

  // Check if pathname starts with a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathName.startsWith(`/${locale}/`) && pathName !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Check if it's a root path or needs locale prefix
    if (pathName === "/" || !pathName.startsWith("/api")) {
      return NextResponse.redirect(
        new URL(
          `/${defaultLocale}${pathName === "/" ? "" : pathName}`,
          request.url
        )
      );
    }
  }

  // Extract locale from pathname
  const segments = pathName.split("/");
  const locale = segments[1];
  const pathWithoutLocale = "/" + (segments.slice(2).join("/") || "");

  // Redirect old scattered admin routes to new consolidated structure
  if (adminRouteRedirects[pathWithoutLocale]) {
    url.pathname = `/${locale}${adminRouteRedirects[pathWithoutLocale]}`;
    return NextResponse.redirect(url);
  }

  // Handle admin routes with enhanced security
  if (pathWithoutLocale.startsWith("/admin")) {
    const { authenticated, user } = await getAuthInfo(request);

    // Redirect to login if not authenticated
    if (!authenticated) {
      url.pathname = `/${locale}/login`;
      url.searchParams.set("reason", "login_required");
      url.searchParams.set("redirect", pathName);
      return NextResponse.redirect(url);
    }

    // Check admin privileges
    if (!hasAdminAccess(user)) {
      url.pathname = `/${locale}/me`;
      url.searchParams.set("unauthorized", "1");
      return NextResponse.redirect(url);
    }

    // Allow access to admin route
    return NextResponse.next();
  }

  // Handle other private paths (like /me)
  const sessionId = request.cookies.get("sessionToken")?.value;
  if (
    privatePath.some((path) => pathWithoutLocale.startsWith(path)) &&
    !sessionId
  ) {
    url.pathname = `/${locale}/login`;
    url.searchParams.set("reason", "login_required");
    url.searchParams.set("redirect", pathName);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from public pages
  if (
    publicPath.some((path) => pathWithoutLocale.startsWith(path)) &&
    sessionId
  ) {
    // Redirect to profile without adding noisy query params
    url.pathname = `/${locale}/me`;
    url.searchParams.delete("from");
    url.searchParams.delete("reason");
    url.searchParams.delete("redirect");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};

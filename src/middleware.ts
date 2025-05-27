import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuditService } from "./lib/services/auditService";
import { AnalyticsService } from "./lib/services/analyticsService";

// Combine Clerk's auth middleware with our custom tracking middleware
const customMiddleware = async (request: NextRequest) => {
  const response = NextResponse.next();

  // Skip tracking for static assets and API routes
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/static")
  ) {
    return response;
  }

  try {
    const session = request.cookies.get("session")?.value;
    const userId = session ? JSON.parse(session).userId : undefined;

    // Track page view
    const analyticsService = AnalyticsService.getInstance();
    await analyticsService.trackPageView({
      userId,
      pageUrl: request.nextUrl.pathname,
      pageType: getPageType(request.nextUrl.pathname),
      referrer: request.headers.get("referer") || undefined,
    });

    // Log activity for authenticated users
    if (userId) {
      const auditService = AuditService.getInstance();
      await auditService.logActivity({
        userId,
        action: "page_view",
        entityType: "page",
        entityId: request.nextUrl.pathname,
      });
    }
  } catch (error) {
    console.error("Error in tracking middleware:", error);
    // Don't block the request if tracking fails
  }

  return response;
};

function getPageType(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/products")) return "product";
  if (pathname.startsWith("/categories")) return "category";
  if (pathname.startsWith("/cart")) return "cart";
  if (pathname.startsWith("/checkout")) return "checkout";
  if (pathname.startsWith("/account")) return "account";
  return "other";
}

// Export the combined middleware
export default clerkMiddleware();

// Configure which paths the middleware will run on
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

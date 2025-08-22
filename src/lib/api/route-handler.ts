/**
 * Enterprise API Route Handler
 * Centralized route handling with security, validation, and error handling
 */

import { NextRequest, NextResponse } from "next/server";
import { securityMiddleware } from "@/lib/security/security-middleware";
import { handleError } from "@/lib/errors/error-handler";
import { validator } from "@/lib/validation/validator";
import { authService } from "@/lib/auth/auth-service";
import {
  BaseError,
  ErrorCode,
  ErrorSeverity,
  ValidationError,
} from "@/lib/errors/types";
import { z } from "zod";

export interface RouteConfig {
  requireAuth?: boolean;
  requiredRoles?: string[];
  validateInput?: z.ZodSchema | ((data: any) => Promise<any>);
  rateLimit?: {
    windowMs: number;
    max: number;
  };
  cache?: {
    ttl: number;
    key?: string;
  };
  audit?: boolean;
}

export interface RouteContext {
  user?: any;
  requestId: string;
  startTime: number;
  ip: string;
  userAgent: string;
}

export interface RouteHandler {
  (
    request: NextRequest,
    context: RouteContext,
    params?: any
  ): Promise<NextResponse>;
}

class ApiRouteHandler {
  /**
   * Create a protected API route with enterprise features
   */
  createRoute(handler: RouteHandler, config: RouteConfig = {}) {
    return async (
      request: NextRequest,
      params?: any
    ): Promise<NextResponse> => {
      const startTime = Date.now();
      const requestId = this.generateRequestId();

      try {
        // Security middleware
        const securityResponse = await securityMiddleware.handle(request);
        if (securityResponse) {
          return securityResponse;
        }

        // Create route context
        const context: RouteContext = {
          requestId,
          startTime,
          ip: this.getClientIp(request),
          userAgent: request.headers.get("user-agent") || "unknown",
        };

        // Authentication check
        if (config.requireAuth) {
          const authResult = await this.authenticateRequest(request);
          if (!authResult.success) {
            return this.createErrorResponse(
              new BaseError({
                code: ErrorCode.UNAUTHORIZED,
                message: "Authentication required",
                severity: ErrorSeverity.MEDIUM,
              }),
              401
            );
          }
          context.user = authResult.user;
        }

        // Role-based authorization
        if (config.requiredRoles && config.requiredRoles.length > 0) {
          if (
            !context.user ||
            !this.hasRequiredRole(context.user, config.requiredRoles)
          ) {
            return this.createErrorResponse(
              new BaseError({
                code: ErrorCode.FORBIDDEN,
                message: "Insufficient permissions",
                severity: ErrorSeverity.MEDIUM,
              }),
              403
            );
          }
        }

        // Input validation
        if (
          config.validateInput &&
          ["POST", "PUT", "PATCH"].includes(request.method)
        ) {
          const validationResult = await this.validateInput(
            request,
            config.validateInput
          );
          if (!validationResult.success) {
            return this.createErrorResponse(validationResult.error!, 400);
          }
        }

        // Execute handler
        const response = await handler(request, context, params);

        // Add response headers
        this.addResponseHeaders(response, context);

        // Audit logging
        if (config.audit) {
          await this.logAuditEvent(request, context, response);
        }

        return response;
      } catch (error) {
        const processedError = handleError(error as Error, {
          requestId,
          url: request.url,
          method: request.method,
          ip: this.getClientIp(request),
          userAgent: request.headers.get("user-agent") || undefined,
          additionalData: {
            duration: Date.now() - startTime,
            config,
          },
        });

        return this.createErrorResponse(
          processedError,
          this.getStatusFromError(processedError)
        );
      }
    };
  }

  /**
   * Create standardized success response
   */
  createSuccessResponse<T>(
    data: T,
    status: number = 200,
    meta?: any
  ): NextResponse {
    const response = {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };

    return NextResponse.json(response, { status });
  }

  /**
   * Create standardized error response
   */
  createErrorResponse(error: BaseError, status: number = 500): NextResponse {
    const response = {
      success: false,
      error: error.message,
      code: error.code,
      userMessage: error.userMessage,
      suggestions: error.suggestions,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: error.context?.requestId,
      },
    };

    // Don't expose sensitive error details in production
    if (process.env.NODE_ENV === "development") {
      (response as any).meta = {
        ...(response as any).meta,
        stack: (error as any).stack,
        context: (error as any).context,
      };
    }

    return NextResponse.json(response, { status });
  }

  /**
   * Authenticate request
   */
  private async authenticateRequest(request: NextRequest): Promise<{
    success: boolean;
    user?: any;
    error?: BaseError;
  }> {
    try {
      const authHeader = request.headers.get("authorization");
      const token = authHeader?.replace("Bearer ", "");

      if (!token) {
        return {
          success: false,
          error: new BaseError({
            code: ErrorCode.UNAUTHORIZED,
            message: "No authentication token provided",
            severity: ErrorSeverity.MEDIUM,
          }),
        };
      }

      // Validate token and get user
      const user = await authService.getCurrentUser();

      if (!user) {
        return {
          success: false,
          error: new BaseError({
            code: ErrorCode.UNAUTHORIZED,
            message: "Invalid or expired token",
            severity: ErrorSeverity.MEDIUM,
          }),
        };
      }

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: new BaseError({
          code: ErrorCode.UNAUTHORIZED,
          message: "Authentication failed",
          severity: ErrorSeverity.MEDIUM,
        }),
      };
    }
  }

  /**
   * Check if user has required role
   */
  private hasRequiredRole(user: any, requiredRoles: string[]): boolean {
    if (!user.role) return false;
    return requiredRoles.includes(user.role);
  }

  /**
   * Validate input data
   */
  private async validateInput(
    request: NextRequest,
    schema: z.ZodSchema | ((data: any) => Promise<any>)
  ): Promise<{ success: boolean; error?: BaseError }> {
    try {
      const body = await request.json();

      if (typeof schema === "function") {
        await schema(body);
      } else {
        const result = validator.validateWithSchema(body, schema);
        if (!result.isValid) {
          return {
            success: false,
            error: new ValidationError(
              "Input validation failed",
              undefined,
              result.errors.map((e) => e.message)
            ),
          };
        }
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: new ValidationError("Invalid request body"),
      };
    }
  }

  /**
   * Add standard response headers
   */
  private addResponseHeaders(
    response: NextResponse,
    context: RouteContext
  ): void {
    response.headers.set("X-Request-ID", context.requestId);
    response.headers.set(
      "X-Response-Time",
      `${Date.now() - context.startTime}ms`
    );
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
  }

  /**
   * Log audit event
   */
  private async logAuditEvent(
    request: NextRequest,
    context: RouteContext,
    response: NextResponse
  ): Promise<void> {
    try {
      const auditData = {
        requestId: context.requestId,
        userId: context.user?._id,
        method: request.method,
        url: request.url,
        ip: context.ip,
        userAgent: context.userAgent,
        statusCode: response.status,
        duration: Date.now() - context.startTime,
        timestamp: new Date().toISOString(),
      };

      // Send to audit service (implement based on your audit requirements)
      // For now, just log to console in development
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 Audit Log:", auditData);
      }
    } catch (error) {
      console.warn("Audit logging failed:", error);
    }
  }

  /**
   * Get HTTP status code from error
   */
  private getStatusFromError(error: BaseError): number {
    switch (error.code) {
      case ErrorCode.UNAUTHORIZED:
        return 401;
      case ErrorCode.FORBIDDEN:
        return 403;
      case ErrorCode.NOT_FOUND:
        return 404;
      case ErrorCode.VALIDATION_ERROR:
      case ErrorCode.INVALID_INPUT:
        return 400;
      case ErrorCode.RATE_LIMIT_EXCEEDED:
        return 429;
      case ErrorCode.SERVER_ERROR:
      case ErrorCode.SERVICE_UNAVAILABLE:
        return 500;
      default:
        return 500;
    }
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get client IP address
   */
  private getClientIp(request: NextRequest): string {
    return (
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown"
    );
  }
}

// Export singleton instance
export const apiRouteHandler = new ApiRouteHandler();

// Convenience functions for common route patterns
export const createAuthenticatedRoute = (
  handler: RouteHandler,
  config: Omit<RouteConfig, "requireAuth"> = {}
) => apiRouteHandler.createRoute(handler, { ...config, requireAuth: true });

export const createAdminRoute = (
  handler: RouteHandler,
  config: Omit<RouteConfig, "requireAuth" | "requiredRoles"> = {}
) =>
  apiRouteHandler.createRoute(handler, {
    ...config,
    requireAuth: true,
    requiredRoles: ["admin"],
  });

export const createPublicRoute = (
  handler: RouteHandler,
  config: RouteConfig = {}
) => apiRouteHandler.createRoute(handler, config);

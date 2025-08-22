/**
 * Enterprise Security Middleware
 * Comprehensive security layer with CSRF protection, rate limiting, and input sanitization
 */

import { NextRequest, NextResponse } from "next/server";
import { validator } from "@/lib/validation/validator";
import { BaseError, ErrorCode, ErrorSeverity } from "@/lib/errors/types";
import { handleError } from "@/lib/errors/error-handler";

export interface SecurityConfig {
  enableCsrf: boolean;
  enableRateLimit: boolean;
  enableInputSanitization: boolean;
  enableSqlInjectionProtection: boolean;
  enableXssProtection: boolean;
  rateLimitWindow: number; // in milliseconds
  rateLimitMax: number; // max requests per window
  trustedOrigins: string[];
  allowedMethods: string[];
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class SecurityMiddleware {
  private config: SecurityConfig;
  private rateLimitStore = new Map<string, RateLimitEntry>();
  private csrfTokens = new Set<string>();

  constructor(config: SecurityConfig) {
    this.config = config;

    // Clean up rate limit store periodically
    setInterval(() => this.cleanupRateLimit(), 60000); // Every minute
  }

  /**
   * Main security middleware handler
   */
  async handle(request: NextRequest): Promise<NextResponse | null> {
    try {
      // CORS check
      const corsResponse = this.handleCors(request);
      if (corsResponse) return corsResponse;

      // Rate limiting
      if (this.config.enableRateLimit) {
        const rateLimitResponse = this.handleRateLimit(request);
        if (rateLimitResponse) return rateLimitResponse;
      }

      // CSRF protection
      if (this.config.enableCsrf) {
        const csrfResponse = await this.handleCsrf(request);
        if (csrfResponse) return csrfResponse;
      }

      // Input sanitization and security checks
      if (this.config.enableInputSanitization) {
        const sanitizationResponse = await this.handleInputSanitization(
          request
        );
        if (sanitizationResponse) return sanitizationResponse;
      }

      return null; // Continue to next middleware/handler
    } catch (error) {
      const processedError = handleError(error as Error, {
        url: request.url,
        method: request.method,
        ip: this.getClientIp(request),
        userAgent: request.headers.get("user-agent") || undefined,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Security check failed",
          message: processedError.userMessage,
        },
        { status: 403 }
      );
    }
  }

  /**
   * Handle CORS
   */
  private handleCors(request: NextRequest): NextResponse | null {
    const origin = request.headers.get("origin");
    const method = request.method;

    // Check if method is allowed
    if (!this.config.allowedMethods.includes(method)) {
      return NextResponse.json(
        { success: false, error: "Method not allowed" },
        { status: 405 }
      );
    }

    // Handle preflight requests
    if (method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": this.getAllowedOrigin(origin),
          "Access-Control-Allow-Methods": this.config.allowedMethods.join(", "),
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, X-CSRF-Token",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Check origin for non-GET requests
    if (method !== "GET" && origin && !this.isOriginAllowed(origin)) {
      return NextResponse.json(
        { success: false, error: "Origin not allowed" },
        { status: 403 }
      );
    }

    return null;
  }

  /**
   * Handle rate limiting
   */
  private handleRateLimit(request: NextRequest): NextResponse | null {
    const clientId = this.getClientIdentifier(request);
    const now = Date.now();
    const windowStart = now - this.config.rateLimitWindow;

    let entry = this.rateLimitStore.get(clientId);

    if (!entry || entry.resetTime <= now) {
      // Create new entry or reset expired entry
      entry = {
        count: 1,
        resetTime: now + this.config.rateLimitWindow,
      };
      this.rateLimitStore.set(clientId, entry);
      return null;
    }

    if (entry.count >= this.config.rateLimitMax) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": this.config.rateLimitMax.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": entry.resetTime.toString(),
          },
        }
      );
    }

    // Increment counter
    entry.count++;
    this.rateLimitStore.set(clientId, entry);

    return null;
  }

  /**
   * Handle CSRF protection
   */
  private async handleCsrf(request: NextRequest): Promise<NextResponse | null> {
    const method = request.method;

    // CSRF protection only for state-changing methods
    if (["GET", "HEAD", "OPTIONS"].includes(method)) {
      return null;
    }

    const csrfToken =
      request.headers.get("X-CSRF-Token") ||
      request.headers.get("X-Requested-With");

    if (!csrfToken) {
      return NextResponse.json(
        { success: false, error: "CSRF token missing" },
        { status: 403 }
      );
    }

    // Validate CSRF token (simplified - in production, use proper CSRF token validation)
    if (!this.validateCsrfToken(csrfToken)) {
      return NextResponse.json(
        { success: false, error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    return null;
  }

  /**
   * Handle input sanitization and security checks
   */
  private async handleInputSanitization(
    request: NextRequest
  ): Promise<NextResponse | null> {
    try {
      // Check URL for suspicious patterns
      if (this.hasSuspiciousUrl(request.url)) {
        return NextResponse.json(
          { success: false, error: "Suspicious request detected" },
          { status: 400 }
        );
      }

      // Check request body for security issues
      if (request.body && ["POST", "PUT", "PATCH"].includes(request.method)) {
        const body = await this.getRequestBody(request);

        if (body) {
          const securityIssues = this.checkBodySecurity(body);
          if (securityIssues.length > 0) {
            return NextResponse.json(
              {
                success: false,
                error: "Security violation detected",
                details: securityIssues,
              },
              { status: 400 }
            );
          }
        }
      }

      return null;
    } catch (error) {
      // If we can't parse the body, it might be malformed
      return NextResponse.json(
        { success: false, error: "Malformed request" },
        { status: 400 }
      );
    }
  }

  /**
   * Generate CSRF token
   */
  generateCsrfToken(): string {
    const token = this.generateRandomToken();
    this.csrfTokens.add(token);

    // Clean up old tokens (keep only last 1000)
    if (this.csrfTokens.size > 1000) {
      const tokensArray = Array.from(this.csrfTokens);
      this.csrfTokens.clear();
      tokensArray.slice(-500).forEach((t) => this.csrfTokens.add(t));
    }

    return token;
  }

  /**
   * Validate CSRF token
   */
  private validateCsrfToken(token: string): boolean {
    return this.csrfTokens.has(token);
  }

  /**
   * Check if origin is allowed
   */
  private isOriginAllowed(origin: string): boolean {
    return this.config.trustedOrigins.some((trusted) => {
      if (trusted === "*") return true;
      if (trusted.startsWith("*.")) {
        const domain = trusted.slice(2);
        return origin.endsWith(domain);
      }
      return origin === trusted;
    });
  }

  /**
   * Get allowed origin for CORS header
   */
  private getAllowedOrigin(origin: string | null): string {
    if (!origin) return this.config.trustedOrigins[0] || "*";
    return this.isOriginAllowed(origin)
      ? origin
      : this.config.trustedOrigins[0] || "*";
  }

  /**
   * Get client identifier for rate limiting
   */
  private getClientIdentifier(request: NextRequest): string {
    // Use IP + User-Agent for identification
    const ip = this.getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "unknown";
    return `${ip}:${userAgent.slice(0, 50)}`;
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

  /**
   * Check for suspicious URL patterns
   */
  private hasSuspiciousUrl(url: string): boolean {
    const suspiciousPatterns = [
      /\.\./, // Path traversal
      /%2e%2e/i, // Encoded path traversal
      /%00/, // Null byte
      /script:/i, // Script protocol
      /javascript:/i, // JavaScript protocol
      /data:/i, // Data protocol
      /vbscript:/i, // VBScript protocol
    ];

    return suspiciousPatterns.some((pattern) => pattern.test(url));
  }

  /**
   * Get request body safely
   */
  private async getRequestBody(request: NextRequest): Promise<any> {
    try {
      const contentType = request.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        return await request.json();
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await request.formData();
        return Object.fromEntries(formData.entries());
      }

      return null;
    } catch (error) {
      throw new Error("Invalid request body");
    }
  }

  /**
   * Check body for security issues
   */
  private checkBodySecurity(body: any): string[] {
    const issues: string[] = [];

    const checkValue = (value: any, path: string = ""): void => {
      if (typeof value === "string") {
        if (
          this.config.enableSqlInjectionProtection &&
          validator.hasSqlInjection(value)
        ) {
          issues.push(`SQL injection detected in ${path || "request"}`);
        }

        if (this.config.enableXssProtection && validator.hasXss(value)) {
          issues.push(`XSS attempt detected in ${path || "request"}`);
        }
      } else if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([key, val]) => {
          checkValue(val, path ? `${path}.${key}` : key);
        });
      }
    };

    checkValue(body);
    return issues;
  }

  /**
   * Generate random token
   */
  private generateRandomToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /**
   * Clean up expired rate limit entries
   */
  private cleanupRateLimit(): void {
    const now = Date.now();
    for (const [key, entry] of this.rateLimitStore.entries()) {
      if (entry.resetTime <= now) {
        this.rateLimitStore.delete(key);
      }
    }
  }
}

// Default security configuration
const defaultSecurityConfig: SecurityConfig = {
  enableCsrf: true,
  enableRateLimit: true,
  enableInputSanitization: true,
  enableSqlInjectionProtection: true,
  enableXssProtection: true,
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // 100 requests per window
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  allowedMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

// Export singleton instance
export const securityMiddleware = new SecurityMiddleware(defaultSecurityConfig);

// Export for custom configurations
export { SecurityMiddleware };

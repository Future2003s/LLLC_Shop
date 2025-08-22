/**
 * Centralized Error Handler
 * Handles error logging, reporting, and user notification
 */

import { toast } from "sonner";
import {
  BaseError,
  ErrorCode,
  ErrorSeverity,
  ErrorContext,
  AuthenticationError,
  ValidationError,
  NetworkError,
  ServerError,
  BusinessLogicError,
} from "./types";

export interface ErrorHandlerConfig {
  enableLogging: boolean;
  enableReporting: boolean;
  enableUserNotification: boolean;
  logLevel: ErrorSeverity;
  reportingEndpoint?: string;
}

class ErrorHandler {
  private config: ErrorHandlerConfig;
  private errorQueue: BaseError[] = [];
  private isReporting = false;

  constructor(config: ErrorHandlerConfig) {
    this.config = config;
  }

  /**
   * Main error handling method
   */
  handle(error: Error | BaseError, context?: Partial<ErrorContext>): BaseError {
    const processedError = this.processError(error, context);

    if (this.config.enableLogging) {
      this.logError(processedError);
    }

    if (this.config.enableReporting && this.shouldReport(processedError)) {
      this.reportError(processedError);
    }

    if (this.config.enableUserNotification) {
      this.notifyUser(processedError);
    }

    return processedError;
  }

  /**
   * Process and normalize errors
   */
  private processError(
    error: Error | BaseError,
    context?: Partial<ErrorContext>
  ): BaseError {
    if (error instanceof BaseError) {
      // Merge additional context without mutating readonly properties
      if (context) {
        const mergedContext: ErrorContext = {
          ...(error.context || {}),
          ...(context || {}),
          timestamp:
            error.context?.timestamp ||
            context?.timestamp ||
            new Date().toISOString(),
        };

        return new BaseError({
          code: error.code,
          message: error.message,
          severity: error.severity,
          context: mergedContext,
          retryable: error.retryable,
          userMessage: error.userMessage,
          suggestions: error.suggestions,
          cause: error,
        });
      }
      return error;
    }

    // Convert regular Error to BaseError
    return this.convertToBaseError(error, context);
  }

  /**
   * Convert regular Error to BaseError
   */
  private convertToBaseError(
    error: Error,
    context?: Partial<ErrorContext>
  ): BaseError {
    const errorContext: ErrorContext = {
      timestamp: new Date().toISOString(),
      ...context,
    };

    // Try to categorize the error based on message or type
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return new NetworkError(error.message, errorContext);
    }

    if (
      error.message.includes("401") ||
      error.message.includes("unauthorized")
    ) {
      return new AuthenticationError(error.message, errorContext);
    }

    if (
      error.message.includes("validation") ||
      error.message.includes("invalid")
    ) {
      return new ValidationError(error.message, errorContext);
    }

    // Default to server error
    return new ServerError(error.message, errorContext);
  }

  /**
   * Log error to console and external services
   */
  private logError(error: BaseError): void {
    const logData = {
      ...error.toJSON(),
      environment: process.env.NODE_ENV,
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : undefined,
    };

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        console.error("🚨 CRITICAL ERROR:", logData);
        break;
      case ErrorSeverity.HIGH:
        console.error("❌ HIGH SEVERITY ERROR:", logData);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn("⚠️ MEDIUM SEVERITY ERROR:", logData);
        break;
      case ErrorSeverity.LOW:
        console.info("ℹ️ LOW SEVERITY ERROR:", logData);
        break;
    }
  }

  /**
   * Report error to external monitoring service
   */
  private async reportError(error: BaseError): Promise<void> {
    if (this.isReporting) return;

    try {
      this.errorQueue.push(error);

      if (!this.isReporting) {
        this.isReporting = true;
        await this.flushErrorQueue();
        this.isReporting = false;
      }
    } catch (reportingError) {
      console.error("Failed to report error:", reportingError);
    }
  }

  /**
   * Flush error queue to reporting service
   */
  private async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    if (this.config.reportingEndpoint) {
      try {
        await fetch(this.config.reportingEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ errors: errors.map((e) => e.toJSON()) }),
        });
      } catch (error) {
        // Re-queue errors if reporting fails
        this.errorQueue.unshift(...errors);
        console.error("Failed to flush error queue:", error);
      }
    }
  }

  /**
   * Determine if error should be reported
   */
  private shouldReport(error: BaseError): boolean {
    return (
      error.severity === ErrorSeverity.HIGH ||
      error.severity === ErrorSeverity.CRITICAL
    );
  }

  /**
   * Notify user about the error
   */
  private notifyUser(error: BaseError): void {
    // Don't show notifications for low severity errors
    if (error.severity === ErrorSeverity.LOW) return;

    const message = error.userMessage;
    const suggestions =
      error.suggestions.length > 0
        ? `\n\nGợi ý: ${error.suggestions.join(", ")}`
        : "";

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        toast.error(message + suggestions, {
          duration: 8000,
          action: error.retryable
            ? {
                label: "Thử lại",
                onClick: () => window.location.reload(),
              }
            : undefined,
        });
        break;
      case ErrorSeverity.MEDIUM:
        toast.warning(message + suggestions, {
          duration: 5000,
        });
        break;
    }
  }

  /**
   * Create error from HTTP response
   */
  createFromResponse(
    response: Response,
    context?: Partial<ErrorContext>
  ): BaseError {
    const errorContext: ErrorContext = {
      timestamp: new Date().toISOString(),
      url: response.url,
      ...context,
    };

    switch (response.status) {
      case 400:
        return new ValidationError(
          `Bad Request: ${response.statusText}`,
          errorContext
        );
      case 401:
        return new AuthenticationError(
          `Unauthorized: ${response.statusText}`,
          errorContext
        );
      case 403:
        return new BaseError({
          code: ErrorCode.FORBIDDEN,
          message: `Forbidden: ${response.statusText}`,
          severity: ErrorSeverity.MEDIUM,
          context: errorContext,
        });
      case 404:
        return new BaseError({
          code: ErrorCode.NOT_FOUND,
          message: `Not Found: ${response.statusText}`,
          severity: ErrorSeverity.LOW,
          context: errorContext,
        });
      case 429:
        return new BaseError({
          code: ErrorCode.RATE_LIMIT_EXCEEDED,
          message: "Too Many Requests",
          severity: ErrorSeverity.MEDIUM,
          context: errorContext,
          retryable: true,
        });
      case 500:
      case 502:
      case 503:
      case 504:
        return new ServerError(
          `Server Error: ${response.statusText}`,
          errorContext
        );
      default:
        return new ServerError(
          `HTTP Error ${response.status}: ${response.statusText}`,
          errorContext
        );
    }
  }
}

// Default configuration
const defaultConfig: ErrorHandlerConfig = {
  enableLogging: true,
  enableReporting: process.env.NODE_ENV === "production",
  enableUserNotification: true,
  logLevel: ErrorSeverity.LOW,
  reportingEndpoint: process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT,
};

// Global error handler instance
export const errorHandler = new ErrorHandler(defaultConfig);

// Convenience functions
export const handleError = (
  error: Error | BaseError,
  context?: Partial<ErrorContext>
) => errorHandler.handle(error, context);

export const createErrorFromResponse = (
  response: Response,
  context?: Partial<ErrorContext>
) => errorHandler.createFromResponse(response, context);

/**
 * Enterprise Error Handling System
 * Comprehensive error types and categorization for the e-commerce platform
 */

export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',

  // Business Logic
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  CART_EMPTY = 'CART_EMPTY',

  // Network & Infrastructure
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Data
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  DATA_CORRUPTION = 'DATA_CORRUPTION',

  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  userAgent?: string;
  ip?: string;
  url?: string;
  method?: string;
  timestamp: string;
  additionalData?: Record<string, any>;
}

export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  severity: ErrorSeverity;
  context?: ErrorContext;
  cause?: Error;
  stack?: string;
  retryable?: boolean;
  userMessage?: string;
  suggestions?: string[];
}

export class BaseError extends Error {
  public readonly code: ErrorCode;
  public readonly severity: ErrorSeverity;
  public readonly context?: ErrorContext;
  public readonly retryable: boolean;
  public readonly userMessage: string;
  public readonly suggestions: string[];
  public readonly timestamp: string;

  constructor(details: ErrorDetails) {
    super(details.message);
    this.name = this.constructor.name;
    this.code = details.code;
    this.severity = details.severity;
    this.context = details.context;
    this.retryable = details.retryable ?? false;
    this.userMessage = details.userMessage ?? this.getDefaultUserMessage();
    this.suggestions = details.suggestions ?? [];
    this.timestamp = new Date().toISOString();

    if (details.cause) {
      this.cause = details.cause;
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  private getDefaultUserMessage(): string {
    switch (this.code) {
      case ErrorCode.UNAUTHORIZED:
        return 'Bạn cần đăng nhập để thực hiện hành động này.';
      case ErrorCode.FORBIDDEN:
        return 'Bạn không có quyền thực hiện hành động này.';
      case ErrorCode.VALIDATION_ERROR:
        return 'Dữ liệu nhập vào không hợp lệ.';
      case ErrorCode.NETWORK_ERROR:
        return 'Lỗi kết nối mạng. Vui lòng thử lại.';
      case ErrorCode.SERVER_ERROR:
        return 'Lỗi hệ thống. Vui lòng thử lại sau.';
      case ErrorCode.NOT_FOUND:
        return 'Không tìm thấy dữ liệu yêu cầu.';
      default:
        return 'Đã xảy ra lỗi. Vui lòng thử lại.';
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      severity: this.severity,
      retryable: this.retryable,
      suggestions: this.suggestions,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack,
    };
  }
}

// Specific Error Classes
export class AuthenticationError extends BaseError {
  constructor(message: string, context?: ErrorContext) {
    super({
      code: ErrorCode.UNAUTHORIZED,
      message,
      severity: ErrorSeverity.MEDIUM,
      context,
      userMessage: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    });
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, context?: ErrorContext, suggestions?: string[]) {
    super({
      code: ErrorCode.VALIDATION_ERROR,
      message,
      severity: ErrorSeverity.LOW,
      context,
      suggestions,
      userMessage: 'Dữ liệu nhập vào không hợp lệ.',
    });
  }
}

export class NetworkError extends BaseError {
  constructor(message: string, context?: ErrorContext) {
    super({
      code: ErrorCode.NETWORK_ERROR,
      message,
      severity: ErrorSeverity.MEDIUM,
      context,
      retryable: true,
      userMessage: 'Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.',
    });
  }
}

export class BusinessLogicError extends BaseError {
  constructor(code: ErrorCode, message: string, context?: ErrorContext) {
    super({
      code,
      message,
      severity: ErrorSeverity.MEDIUM,
      context,
    });
  }
}

export class ServerError extends BaseError {
  constructor(message: string, context?: ErrorContext) {
    super({
      code: ErrorCode.SERVER_ERROR,
      message,
      severity: ErrorSeverity.HIGH,
      context,
      retryable: true,
      userMessage: 'Lỗi hệ thống. Chúng tôi đang khắc phục sự cố.',
    });
  }
}

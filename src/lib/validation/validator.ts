/**
 * Enterprise Validation System
 * Comprehensive input validation with sanitization and security checks
 */

import { z } from "zod";
import { ValidationError } from "@/lib/api/types";
import { ErrorCode } from "@/lib/errors/types";

export interface ValidationRule {
  field: string;
  rules: ValidationRuleDefinition[];
  optional?: boolean;
  sanitize?: boolean;
}

export interface ValidationRuleDefinition {
  type:
    | "required"
    | "email"
    | "phone"
    | "url"
    | "min"
    | "max"
    | "pattern"
    | "custom";
  value?: any;
  message?: string;
  validator?: (value: any) => boolean | Promise<boolean>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData?: any;
}

export interface SanitizationOptions {
  trim?: boolean;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
  removeHtml?: boolean;
  removeScripts?: boolean;
  maxLength?: number;
}

class Validator {
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  private readonly urlRegex =
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  private readonly htmlTagRegex = /<[^>]*>/g;
  private readonly scriptRegex =
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

  /**
   * Validate data against rules
   */
  async validate(
    data: any,
    rules: ValidationRule[]
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const sanitizedData: any = {};

    for (const rule of rules) {
      const value = data[rule.field];

      // Check if field is required
      if (
        !rule.optional &&
        (value === undefined || value === null || value === "")
      ) {
        errors.push({
          field: rule.field,
          message: `${rule.field} is required`,
          code: ErrorCode.MISSING_REQUIRED_FIELD,
          value,
        });
        continue;
      }

      // Skip validation if field is optional and empty
      if (
        rule.optional &&
        (value === undefined || value === null || value === "")
      ) {
        continue;
      }

      // Sanitize value if requested
      let sanitizedValue = value;
      if (rule.sanitize) {
        sanitizedValue = this.sanitizeValue(value);
      }

      // Apply validation rules
      for (const ruleDefinition of rule.rules) {
        const ruleError = await this.applyRule(
          rule.field,
          sanitizedValue,
          ruleDefinition
        );
        if (ruleError) {
          errors.push(ruleError);
        }
      }

      sanitizedData[rule.field] = sanitizedValue;
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData,
    };
  }

  /**
   * Validate using Zod schema
   */
  validateWithSchema<T>(data: any, schema: z.ZodSchema<T>): ValidationResult {
    try {
      const result = schema.parse(data);
      return {
        isValid: true,
        errors: [],
        sanitizedData: result,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationError[] = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
          value: undefined,
        }));

        return {
          isValid: false,
          errors,
        };
      }

      return {
        isValid: false,
        errors: [
          {
            field: "unknown",
            message: "Validation failed",
            code: "UNKNOWN_ERROR",
          },
        ],
      };
    }
  }

  /**
   * Sanitize input value
   */
  sanitizeValue(value: any, options: SanitizationOptions = {}): any {
    if (typeof value !== "string") {
      return value;
    }

    let sanitized = value;

    // Trim whitespace
    if (options.trim !== false) {
      sanitized = sanitized.trim();
    }

    // Case conversion
    if (options.toLowerCase) {
      sanitized = sanitized.toLowerCase();
    } else if (options.toUpperCase) {
      sanitized = sanitized.toUpperCase();
    }

    // Remove HTML tags
    if (options.removeHtml) {
      sanitized = sanitized.replace(this.htmlTagRegex, "");
    }

    // Remove script tags
    if (options.removeScripts !== false) {
      sanitized = sanitized.replace(this.scriptRegex, "");
    }

    // Limit length
    if (options.maxLength && sanitized.length > options.maxLength) {
      sanitized = sanitized.substring(0, options.maxLength);
    }

    return sanitized;
  }

  /**
   * Check for SQL injection patterns
   */
  hasSqlInjection(value: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(--|\/\*|\*\/)/,
      /(\b(CHAR|NCHAR|VARCHAR|NVARCHAR)\s*\()/i,
      /(\b(WAITFOR|DELAY)\b)/i,
    ];

    return sqlPatterns.some((pattern) => pattern.test(value));
  }

  /**
   * Check for XSS patterns
   */
  hasXss(value: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe\b[^>]*>/i,
      /<object\b[^>]*>/i,
      /<embed\b[^>]*>/i,
      /<link\b[^>]*>/i,
      /<meta\b[^>]*>/i,
    ];

    return xssPatterns.some((pattern) => pattern.test(value));
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): {
    isStrong: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("Password should be at least 8 characters long");
    }

    if (password.length >= 12) {
      score += 1;
    }

    // Character variety checks
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Password should contain lowercase letters");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Password should contain uppercase letters");
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push("Password should contain numbers");
    }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Password should contain special characters");
    }

    // Common password check
    if (this.isCommonPassword(password)) {
      score -= 2;
      feedback.push("Password is too common");
    }

    // Sequential characters check
    if (this.hasSequentialChars(password)) {
      score -= 1;
      feedback.push("Avoid sequential characters");
    }

    return {
      isStrong: score >= 4,
      score: Math.max(0, score),
      feedback,
    };
  }

  /**
   * Apply individual validation rule
   */
  private async applyRule(
    field: string,
    value: any,
    rule: ValidationRuleDefinition
  ): Promise<ValidationError | null> {
    switch (rule.type) {
      case "required":
        if (value === undefined || value === null || value === "") {
          return {
            field,
            message: rule.message || `${field} is required`,
            code: ErrorCode.MISSING_REQUIRED_FIELD,
            value,
          };
        }
        break;

      case "email":
        if (typeof value === "string" && !this.emailRegex.test(value)) {
          return {
            field,
            message: rule.message || `${field} must be a valid email`,
            code: "INVALID_EMAIL",
            value,
          };
        }
        break;

      case "phone":
        if (typeof value === "string" && !this.phoneRegex.test(value)) {
          return {
            field,
            message: rule.message || `${field} must be a valid phone number`,
            code: "INVALID_PHONE",
            value,
          };
        }
        break;

      case "url":
        if (typeof value === "string" && !this.urlRegex.test(value)) {
          return {
            field,
            message: rule.message || `${field} must be a valid URL`,
            code: "INVALID_URL",
            value,
          };
        }
        break;

      case "min":
        if (typeof value === "string" && value.length < rule.value) {
          return {
            field,
            message:
              rule.message ||
              `${field} must be at least ${rule.value} characters`,
            code: "MIN_LENGTH",
            value,
          };
        }
        if (typeof value === "number" && value < rule.value) {
          return {
            field,
            message: rule.message || `${field} must be at least ${rule.value}`,
            code: "MIN_VALUE",
            value,
          };
        }
        break;

      case "max":
        if (typeof value === "string" && value.length > rule.value) {
          return {
            field,
            message:
              rule.message ||
              `${field} must be at most ${rule.value} characters`,
            code: "MAX_LENGTH",
            value,
          };
        }
        if (typeof value === "number" && value > rule.value) {
          return {
            field,
            message: rule.message || `${field} must be at most ${rule.value}`,
            code: "MAX_VALUE",
            value,
          };
        }
        break;

      case "pattern":
        if (typeof value === "string" && !rule.value.test(value)) {
          return {
            field,
            message: rule.message || `${field} format is invalid`,
            code: "INVALID_FORMAT",
            value,
          };
        }
        break;

      case "custom":
        if (rule.validator) {
          const isValid = await rule.validator(value);
          if (!isValid) {
            return {
              field,
              message: rule.message || `${field} is invalid`,
              code: "CUSTOM_VALIDATION",
              value,
            };
          }
        }
        break;
    }

    return null;
  }

  /**
   * Check if password is commonly used
   */
  private isCommonPassword(password: string): boolean {
    const commonPasswords = [
      "password",
      "123456",
      "123456789",
      "qwerty",
      "abc123",
      "password123",
      "admin",
      "letmein",
      "welcome",
      "monkey",
      "dragon",
      "master",
      "shadow",
      "superman",
      "michael",
    ];

    return commonPasswords.includes(password.toLowerCase());
  }

  /**
   * Check for sequential characters
   */
  private hasSequentialChars(password: string): boolean {
    const sequences = [
      "123",
      "234",
      "345",
      "456",
      "567",
      "678",
      "789",
      "abc",
      "bcd",
      "cde",
    ];
    return sequences.some((seq) => password.toLowerCase().includes(seq));
  }
}

// Export singleton instance
export const validator = new Validator();

// Common validation schemas
export const commonSchemas = {
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number"),
  url: z.string().url("Invalid URL format"),
  positiveNumber: z.number().positive("Must be a positive number"),
  nonEmptyString: z.string().min(1, "Field cannot be empty"),
};

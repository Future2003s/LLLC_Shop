import { z } from "zod";

// Configuration schema for validation
const configSchema = z.object({
  app: z.object({
    name: z.string().default("LALA-LYCHEEE"),
    version: z.string().default("1.0.0"),
    environment: z
      .enum(["development", "staging", "production"])
      .default("development"),
    debug: z.boolean().default(false),
    url: z.string().url(),
  }),
  api: z.object({
    baseUrl: z.string().url(),
    timeout: z.number().positive().default(30000),
    retries: z.number().min(0).max(5).default(3),
    rateLimit: z.object({
      windowMs: z.number().positive().default(900000), // 15 minutes
      max: z.number().positive().default(100),
    }),
  }),
  auth: z.object({
    sessionTimeout: z.number().positive().default(3600000), // 1 hour
    refreshTokenTimeout: z.number().positive().default(604800000), // 7 days
    maxLoginAttempts: z.number().positive().default(5),
    lockoutDuration: z.number().positive().default(900000), // 15 minutes
  }),
  cache: z.object({
    defaultTtl: z.number().positive().default(300), // 5 minutes
    maxMemorySize: z.number().positive().default(1000),
    enableLocalStorage: z.boolean().default(true),
    enableRedis: z.boolean().default(false),
  }),
  security: z.object({
    enableCsrf: z.boolean().default(true),
    enableRateLimit: z.boolean().default(true),
    enableInputSanitization: z.boolean().default(true),
    trustedOrigins: z.array(z.string()).default(["http://localhost:3000"]),
    allowedMethods: z
      .array(z.string())
      .default(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]),
  }),
  logging: z.object({
    level: z.enum(["error", "warn", "info", "debug"]).default("info"),
    enableConsole: z.boolean().default(true),
    enableFile: z.boolean().default(false),
    enableRemote: z.boolean().default(false),
    remoteEndpoint: z.string().url().optional(),
  }),
  features: z.object({
    enableWishlist: z.boolean().default(true),
    enableReviews: z.boolean().default(true),
    enableRecommendations: z.boolean().default(true),
    enableLoyaltyProgram: z.boolean().default(false),
    enableMultiCurrency: z.boolean().default(false),
    enableMultiLanguage: z.boolean().default(false),
  }),
  payment: z.object({
    enableStripe: z.boolean().default(false),
    enablePayPal: z.boolean().default(false),
    enableCOD: z.boolean().default(true),
    currency: z.string().length(3).default("USD"),
    taxRate: z.number().min(0).max(1).default(0.1), // 10%
  }),
  email: z.object({
    provider: z.enum(["smtp", "sendgrid", "mailgun"]).default("smtp"),
    from: z.string().email(),
    replyTo: z.string().email().optional(),
    enableTemplates: z.boolean().default(true),
  }),
  storage: z.object({
    provider: z.enum(["local", "s3", "cloudinary"]).default("local"),
    maxFileSize: z.number().positive().default(5242880), // 5MB
    allowedTypes: z
      .array(z.string())
      .default(["image/jpeg", "image/png", "image/webp"]),
  }),
  analytics: z.object({
    enableGoogleAnalytics: z.boolean().default(false),
    googleAnalyticsId: z.string().optional(),
    enableHotjar: z.boolean().default(false),
    hotjarId: z.string().optional(),
    enableCustomEvents: z.boolean().default(true),
  }),
});

export type AppConfig = z.infer<typeof configSchema>;

class ConfigManager {
  private config: AppConfig;
  private initialized = false;

  constructor() {
    this.config = this.loadConfig();
    this.initialized = true;
  }

  /**
   * Load configuration from environment variables
   */
  private loadConfig(): AppConfig {
    const rawConfig = {
      app: {
        name: process.env.NEXT_PUBLIC_APP_NAME,
        version: process.env.NEXT_PUBLIC_APP_VERSION,
        environment: process.env.NODE_ENV,
        debug: process.env.NODE_ENV === "development",
        url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
      api: {
        baseUrl:
          process.env.NEXT_PUBLIC_API_END_POINT ||
          "http://localhost:8081/api/v1",
        timeout: parseInt(process.env.API_TIMEOUT || "30000"),
        retries: parseInt(process.env.API_RETRIES || "3"),
        rateLimit: {
          windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
          max: parseInt(process.env.RATE_LIMIT_MAX || "100"),
        },
      },
      auth: {
        sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || "3600000"),
        refreshTokenTimeout: parseInt(
          process.env.REFRESH_TOKEN_TIMEOUT || "604800000"
        ),
        maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5"),
        lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || "900000"),
      },
      cache: {
        defaultTtl: parseInt(process.env.CACHE_DEFAULT_TTL || "300"),
        maxMemorySize: parseInt(process.env.CACHE_MAX_MEMORY_SIZE || "1000"),
        enableLocalStorage: process.env.CACHE_ENABLE_LOCAL_STORAGE !== "false",
        enableRedis: process.env.CACHE_ENABLE_REDIS === "true",
        keyPrefix: process.env.CACHE_KEY_PREFIX || "ecommerce",
      },
      security: {
        enableCsrf: process.env.SECURITY_ENABLE_CSRF !== "false",
        enableRateLimit: process.env.SECURITY_ENABLE_RATE_LIMIT !== "false",
        enableInputSanitization:
          process.env.SECURITY_ENABLE_INPUT_SANITIZATION !== "false",
        trustedOrigins: process.env.TRUSTED_ORIGINS?.split(",") || [
          "http://localhost:3000",
        ],
        allowedMethods: process.env.ALLOWED_METHODS?.split(",") || [
          "GET",
          "POST",
          "PUT",
          "PATCH",
          "DELETE",
          "OPTIONS",
        ],
      },
      logging: {
        level: process.env.LOG_LEVEL || "info",
        enableConsole: process.env.LOG_ENABLE_CONSOLE !== "false",
        enableFile: process.env.LOG_ENABLE_FILE === "true",
        enableRemote: process.env.LOG_ENABLE_REMOTE === "true",
        remoteEndpoint: process.env.LOG_REMOTE_ENDPOINT,
      },
      features: {
        enableWishlist: process.env.FEATURE_ENABLE_WISHLIST !== "false",
        enableReviews: process.env.FEATURE_ENABLE_REVIEWS !== "false",
        enableRecommendations:
          process.env.FEATURE_ENABLE_RECOMMENDATIONS !== "false",
        enableLoyaltyProgram:
          process.env.FEATURE_ENABLE_LOYALTY_PROGRAM === "true",
        enableMultiCurrency:
          process.env.FEATURE_ENABLE_MULTI_CURRENCY === "true",
        enableMultiLanguage:
          process.env.FEATURE_ENABLE_MULTI_LANGUAGE === "true",
      },
      payment: {
        enableStripe: process.env.PAYMENT_ENABLE_STRIPE === "true",
        enablePayPal: process.env.PAYMENT_ENABLE_PAYPAL === "true",
        enableCOD: process.env.PAYMENT_ENABLE_COD !== "false",
        currency: process.env.PAYMENT_CURRENCY || "USD",
        taxRate: parseFloat(process.env.PAYMENT_TAX_RATE || "0.1"),
      },
      email: {
        provider: process.env.EMAIL_PROVIDER || "smtp",
        from: process.env.EMAIL_FROM || "noreply@example.com",
        replyTo: process.env.EMAIL_REPLY_TO,
        enableTemplates: process.env.EMAIL_ENABLE_TEMPLATES !== "false",
      },
      storage: {
        provider: process.env.STORAGE_PROVIDER || "local",
        maxFileSize: parseInt(process.env.STORAGE_MAX_FILE_SIZE || "5242880"),
        allowedTypes: process.env.STORAGE_ALLOWED_TYPES?.split(",") || [
          "image/jpeg",
          "image/png",
          "image/webp",
        ],
      },
      analytics: {
        enableGoogleAnalytics: process.env.ANALYTICS_ENABLE_GA === "true",
        googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
        enableHotjar: process.env.ANALYTICS_ENABLE_HOTJAR === "true",
        hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
        enableCustomEvents:
          process.env.ANALYTICS_ENABLE_CUSTOM_EVENTS !== "false",
      },
    };

    // Validate and parse configuration
    const result = configSchema.safeParse(rawConfig);

    if (!result.success) {
      console.error("Configuration validation failed:", result.error.errors);
      throw new Error("Invalid configuration");
    }

    return result.data;
  }

  /**
   * Get configuration value by path
   */
  get<T = any>(path: string): T {
    if (!this.initialized) {
      throw new Error("Configuration not initialized");
    }

    const keys = path.split(".");
    let value: any = this.config;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return undefined as T;
      }
    }

    return value as T;
  }

  /**
   * Get entire configuration
   */
  getAll(): AppConfig {
    return { ...this.config };
  }

  /**
   * Check if feature is enabled
   */
  isFeatureEnabled(feature: keyof AppConfig["features"]): boolean {
    return this.get(`features.${feature}`) === true;
  }

  /**
   * Get environment
   */
  getEnvironment(): "development" | "staging" | "production" {
    return this.get("app.environment");
  }

  /**
   * Check if in development mode
   */
  isDevelopment(): boolean {
    return this.getEnvironment() === "development";
  }

  /**
   * Check if in production mode
   */
  isProduction(): boolean {
    return this.getEnvironment() === "production";
  }

  /**
   * Validate configuration
   */
  validate(): { valid: boolean; errors?: string[] } {
    try {
      configSchema.parse(this.config);
      return { valid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
        };
      }
      return { valid: false, errors: ["Unknown validation error"] };
    }
  }
}

// Export singleton instance
export const appConfig = new ConfigManager();

// Export schema
export { configSchema };

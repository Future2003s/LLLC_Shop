import { z } from "zod";

// Centralized public environment configuration
// Selects API endpoint based on NEXT_PUBLIC_IS_PRODUCTION flag
const configSchema = z.object({
  NEXT_PUBLIC_URL: z.string().default("http://localhost:3001"),
  NEXT_PUBLIC_URL_LOGO: z.string().default("https://placehold.co/200x80"),

  // Backward-compat values still used elsewhere
  NEXT_PUBLIC_BACKEND_URL: z.string().default("http://localhost:8081"),
  NEXT_PUBLIC_API_VERSION: z.string().default("v1"),

  // New switching strategy
  NEXT_PUBLIC_IS_PRODUCTION: z.coerce.boolean().default(false),
  NEXT_PUBLIC_API_END_POINT_PRODUCTION: z
    .string()
    .default("http://lalalycheee.vn/api/v1"),
  NEXT_PUBLIC_API_END_POINT_DEV: z
    .string()
    .default("http://localhost:8081/api/v1"),

  // Derived, kept for compatibility across the codebase
  NEXT_PUBLIC_API_END_POINT: z.string().default("http://localhost:8081/api/v1"),
});

const config = configSchema.safeParse({
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || "http://localhost:3001",
  NEXT_PUBLIC_URL_LOGO:
    process.env.NEXT_PUBLIC_URL_LOGO || "https://placehold.co/200x80",

  NEXT_PUBLIC_BACKEND_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081",
  NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || "v1",

  NEXT_PUBLIC_IS_PRODUCTION: process.env.NEXT_PUBLIC_IS_PRODUCTION ?? "false",
  NEXT_PUBLIC_API_END_POINT_PRODUCTION:
    process.env.NEXT_PUBLIC_API_END_POINT_PRODUCTION ||
    "http://lalalycheee.vn/api/v1",
  NEXT_PUBLIC_API_END_POINT_DEV:
    process.env.NEXT_PUBLIC_API_END_POINT_DEV || "http://localhost:8081/api/v1",

  // Will be overridden by derived value below; keep a safe default
  NEXT_PUBLIC_API_END_POINT:
    process.env.NEXT_PUBLIC_API_END_POINT || "http://localhost:8081/api/v1",
});

let envConfig: z.infer<typeof configSchema>;

if (!config.success) {
  console.log("Config validation errors:", config.error.errors);
  // Use default values instead of throwing error
  envConfig = {
    NEXT_PUBLIC_URL: "http://localhost:3001",
    NEXT_PUBLIC_URL_LOGO: "https://placehold.co/200x80",
    NEXT_PUBLIC_BACKEND_URL: "http://localhost:8081",
    NEXT_PUBLIC_API_VERSION: "v1",
    NEXT_PUBLIC_IS_PRODUCTION: false,
    NEXT_PUBLIC_API_END_POINT_PRODUCTION: "http://lalalycheee.vn/api/v1",
    NEXT_PUBLIC_API_END_POINT_DEV: "http://localhost:8081/api/v1",
    NEXT_PUBLIC_API_END_POINT: "http://localhost:8081/api/v1",
  };
  console.log("Using default config:", envConfig);
} else {
  envConfig = config.data;
}

// Derive the active API endpoint based on the production flag
const selectedEndpoint = envConfig.NEXT_PUBLIC_IS_PRODUCTION
  ? envConfig.NEXT_PUBLIC_API_END_POINT_PRODUCTION
  : envConfig.NEXT_PUBLIC_API_END_POINT_DEV;

// Export with derived endpoint preserved under the legacy key for compatibility
envConfig = {
  ...envConfig,
  NEXT_PUBLIC_API_END_POINT: selectedEndpoint,
} as typeof envConfig;

export { envConfig };

import { z } from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_URL: z.string().default("http://localhost:3001"),
  NEXT_PUBLIC_API_END_POINT: z.string().default("http://localhost:8081"),
  NEXT_PUBLIC_URL_LOGO: z.string().default("https://placehold.co/200x80"),
  NEXT_PUBLIC_BACKEND_URL: z.string().default("http://localhost:8081"),
  NEXT_PUBLIC_API_VERSION: z.string().default("v1"),
  // Production flag - set to true when deploying
  NEXT_PUBLIC_IS_PRODUCTION: z.string().default("false"),
});

// Auto-detect production environment
const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

// Set URLs based on environment
const backendUrl = isProduction
  ? "https://api.lalalycheee.vn"
  : "http://localhost:8081";

const config = configSchema.safeParse({
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || "http://localhost:3001",
  NEXT_PUBLIC_API_END_POINT:
    process.env.NEXT_PUBLIC_API_END_POINT || backendUrl,
  NEXT_PUBLIC_URL_LOGO:
    process.env.NEXT_PUBLIC_URL_LOGO || "https://placehold.co/200x80",
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || backendUrl,
  NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || "v1",
  NEXT_PUBLIC_IS_PRODUCTION:
    process.env.NEXT_PUBLIC_IS_PRODUCTION || isProduction.toString(),
});

let envConfig: z.infer<typeof configSchema>;

if (!config.success) {
  console.log("Config validation errors:", config.error.errors);
  // Use default values instead of throwing error
  envConfig = {
    NEXT_PUBLIC_URL: "http://localhost:3001",
    NEXT_PUBLIC_API_END_POINT: "http://localhost:8081",
    NEXT_PUBLIC_URL_LOGO: "https://placehold.co/200x80",
    NEXT_PUBLIC_BACKEND_URL: "http://localhost:8081",
    NEXT_PUBLIC_API_VERSION: "v1",
    NEXT_PUBLIC_IS_PRODUCTION: "false",
  };
  console.log("Using default config:", envConfig);
} else {
  envConfig = config.data;
}

export { envConfig };

import { z } from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_API_END_POINT: z.string(),
  NEXT_PUBLIC_URL_LOGO: z.string(),
  NEXT_PUBLIC_BACKEND_URL: z.string(),
  NEXT_PUBLIC_API_VERSION: z.string(),
  NEXT_PUBLIC_IS_PRODUCTION: z.string(),
});

// Get environment configuration
const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

// Dynamic configuration based on environment
const getConfig = () => {
  if (isProduction) {
    // Production environment
    return {
      NEXT_PUBLIC_URL:
        process.env.NEXT_PUBLIC_URL_PRODUCTION || "https://lalalycheee.vn",
      NEXT_PUBLIC_API_END_POINT:
        process.env.NEXT_PUBLIC_API_END_POINT_PRODUCTION ||
        "https://api.lalalycheee.vn/api/v1",
      NEXT_PUBLIC_URL_LOGO:
        process.env.NEXT_PUBLIC_URL_LOGO_PRODUCTION ||
        "https://placehold.co/200x80",
      NEXT_PUBLIC_BACKEND_URL:
        process.env.NEXT_PUBLIC_BACKEND_URL_PRODUCTION ||
        "https://api.lalalycheee.vn",
      NEXT_PUBLIC_API_VERSION:
        process.env.NEXT_PUBLIC_API_VERSION_PRODUCTION || "v1",
      NEXT_PUBLIC_IS_PRODUCTION: "true",
    };
  } else {
    // Development environment
    return {
      NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
      NEXT_PUBLIC_API_END_POINT:
        process.env.NEXT_PUBLIC_API_END_POINT || "http://localhost:8081/api/v1",
      NEXT_PUBLIC_URL_LOGO:
        process.env.NEXT_PUBLIC_URL_LOGO || "https://placehold.co/200x80",
      NEXT_PUBLIC_BACKEND_URL:
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081",
      NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || "v1",
      NEXT_PUBLIC_IS_PRODUCTION: "false",
    };
  }
};

// Validate configuration
const config = configSchema.safeParse(getConfig());

let envConfig: z.infer<typeof configSchema>;

if (!config.success) {
  console.error("❌ Config validation errors:", config.error.errors);
  // Fallback to production config if validation fails
  envConfig = {
    NEXT_PUBLIC_URL: "https://lalalycheee.vn",
    NEXT_PUBLIC_API_END_POINT: "https://api.lalalycheee.vn/api/v1",
    NEXT_PUBLIC_URL_LOGO: "https://placehold.co/200x80",
    NEXT_PUBLIC_BACKEND_URL: "https://api.lalalycheee.vn",
    NEXT_PUBLIC_API_VERSION: "v1",
    NEXT_PUBLIC_IS_PRODUCTION: "true",
  };
  console.log("⚠️ Using fallback production config:", envConfig);
} else {
  envConfig = config.data;
  console.log(
    `✅ Using ${isProduction ? "production" : "development"} config:`,
    {
      URL: envConfig.NEXT_PUBLIC_URL,
      API_ENDPOINT: envConfig.NEXT_PUBLIC_API_END_POINT,
      BACKEND_URL: envConfig.NEXT_PUBLIC_BACKEND_URL,
      IS_PRODUCTION: envConfig.NEXT_PUBLIC_IS_PRODUCTION,
    }
  );
}

export { envConfig };

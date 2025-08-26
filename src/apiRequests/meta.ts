import { http } from "@/lib/http";

export const metaApi = {
  // Use frontend API routes for public meta to avoid CORS/auth issues in browser
  categories: () => http.get("/api/meta/categories", { baseUrl: "" }),
  categoryTree: () => http.get("/api/meta/categories/tree", { baseUrl: "" }),
  brands: () => http.get("/api/meta/brands", { baseUrl: "" }),
  popularBrands: () => http.get("/api/meta/brands/popular", { baseUrl: "" }),
  // Keep admin create endpoints going to backend with explicit Authorization header
  createCategory: (data: any, token: string) =>
    http.post("/categories", data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  createBrand: (data: any, token: string) =>
    http.post("/brands", data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

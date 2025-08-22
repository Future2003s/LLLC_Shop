import { http } from "@/lib/http";

export const metaApi = {
  categories: () => http.get("/categories"),
  categoryTree: () => http.get("/categories/tree"),
  brands: () => http.get("/brands"),
  popularBrands: () => http.get("/brands/popular"),
  createCategory: (data: any, token: string) =>
    http.post("/categories", data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  createBrand: (data: any, token: string) =>
    http.post("/brands", data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

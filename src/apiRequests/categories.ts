import { http } from "@/lib/http";
import { API_CONFIG } from "@/lib/api-config";

// Category types based on backend model
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | Category;
  level: number;
  path: string;
  isActive: boolean;
  order: number;
  productCount?: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  success: boolean;
  message?: string;
  data: Category[];
}

export interface CategoryResponse {
  success: boolean;
  message?: string;
  data: Category;
}

export interface CategoryTreeResponse {
  success: boolean;
  message?: string;
  data: Category[];
}

export interface CategoryQueryParams {
  parent?: string;
  level?: number;
  isActive?: boolean;
  withProductCount?: boolean;
  sort?: "name" | "order" | "createdAt";
  order?: "asc" | "desc";
}

// Category API requests
export const categoryApiRequest = {
  // Get all categories
  getCategories: (
    params?: CategoryQueryParams
  ): Promise<CategoriesResponse> => {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return http.get(
      `${API_CONFIG.CATEGORIES.ALL}${queryString ? `?${queryString}` : ""}`
    );
  },

  // Get single category by ID
  getCategory: (id: string): Promise<CategoryResponse> => {
    return http.get(API_CONFIG.CATEGORIES.BY_ID.replace(":id", id));
  },

  // Get category by slug
  getCategoryBySlug: (slug: string): Promise<CategoryResponse> => {
    return http.get(API_CONFIG.CATEGORIES.BY_SLUG.replace(":slug", slug));
  },

  // Get category tree (hierarchical structure)
  getCategoryTree: (): Promise<CategoryTreeResponse> => {
    return http.get(API_CONFIG.CATEGORIES.TREE);
  },

  // Get main categories (top-level)
  getMainCategories: (): Promise<CategoriesResponse> => {
    return http.get(API_CONFIG.CATEGORIES.ALL);
  },

  // Get sub-categories of a parent
  getSubCategories: (parentId: string): Promise<CategoriesResponse> => {
    return http.get(`${API_CONFIG.CATEGORIES.ALL}?parent=${parentId}`);
  },

  // Get active categories only
  getActiveCategories: (): Promise<CategoriesResponse> => {
    return http.get(API_CONFIG.CATEGORIES.ALL);
  },

  // Get categories with product count
  getCategoriesWithProductCount: (): Promise<CategoriesResponse> => {
    return http.get(API_CONFIG.CATEGORIES.ALL);
  },

  // Admin: Create category
  createCategory: (
    token: string,
    categoryData: Partial<Category>
  ): Promise<CategoryResponse> => {
    return http.post("/categories", categoryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Admin: Update category
  updateCategory: (
    token: string,
    id: string,
    categoryData: Partial<Category>
  ): Promise<CategoryResponse> => {
    return http.put(`/categories/${id}`, categoryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Admin: Delete category
  deleteCategory: (
    token: string,
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    return http.delete(`/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Admin: Reorder categories
  reorderCategories: (
    token: string,
    categories: Array<{ id: string; order: number }>
  ): Promise<{ success: boolean; message: string }> => {
    return http.put(
      "/categories/reorder",
      { categories },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },
};

// Helper function to build category breadcrumb
export function buildCategoryBreadcrumb(category: Category): Array<{
  id: string;
  name: string;
  slug: string;
}> {
  const breadcrumb = [];
  const pathIds = category.path.split("/").filter(Boolean);

  // This would need the full category data to build properly
  // For now, return a simple breadcrumb with the current category
  breadcrumb.push({
    id: category._id,
    name: category.name,
    slug: category.slug,
  });

  return breadcrumb;
}

// Helper function to get category image URL
export function getCategoryImageUrl(image?: string): string {
  if (!image) {
    return "/images/default-category.png";
  }
  if (image.startsWith("http")) {
    return image;
  }
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${image}`;
}

// Helper function to build category tree from flat array
export function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<string, Category>();
  const tree: Category[] = [];

  // First pass: create a map of all categories
  categories.forEach((category) => {
    categoryMap.set(category._id, { ...category, children: [] });
  });

  // Second pass: build the tree structure
  categories.forEach((category) => {
    const current = categoryMap.get(category._id);
    if (!current) return;

    if (category.parent) {
      const parentId =
        typeof category.parent === "string"
          ? category.parent
          : category.parent._id;
      const parent = categoryMap.get(parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(current);
      }
    } else {
      tree.push(current);
    }
  });

  return tree;
}

// Helper function to flatten category tree
export function flattenCategoryTree(categories: Category[]): Category[] {
  const flat: Category[] = [];

  function traverse(cats: Category[]) {
    cats.forEach((category) => {
      flat.push(category);
      if (category.children && category.children.length > 0) {
        traverse(category.children);
      }
    });
  }

  traverse(categories);
  return flat;
}

// Helper function to find category by ID in tree
export function findCategoryInTree(
  categories: Category[],
  id: string
): Category | undefined {
  for (const category of categories) {
    if (category._id === id) {
      return category;
    }
    if (category.children && category.children.length > 0) {
      const found = findCategoryInTree(category.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

// Helper function to get category level label
export function getCategoryLevelLabel(level: number): string {
  const labels = ["Danh mục chính", "Danh mục con", "Danh mục phụ"];
  return labels[level] || `Cấp ${level + 1}`;
}

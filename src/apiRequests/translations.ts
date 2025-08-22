import {
  API_CONFIG,
  buildApiUrl,
  getAuthHeaders,
  getCommonHeaders,
} from "../lib/api-config";

// Types
export interface TranslationData {
  key: string;
  category:
    | "product"
    | "category"
    | "brand"
    | "ui"
    | "error"
    | "success"
    | "validation"
    | "email"
    | "notification";
  translations: {
    vi: string;
    en: string;
    ja: string;
  };
  description?: string;
  isActive?: boolean;
}

export interface TranslationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface TranslationStats {
  byCategory: Array<{
    _id: string;
    count: number;
    active: number;
    inactive: number;
  }>;
  total: {
    total: number;
    active: number;
    inactive: number;
  };
  supportedLanguages: string[];
  categories: string[];
}

export interface PaginatedTranslations {
  data: TranslationData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Functions
export const translationApi = {
  // Get translation by key
  async getByKey(key: string, language?: string): Promise<TranslationResponse> {
    const url = buildApiUrl(API_CONFIG.TRANSLATIONS.BY_KEY, { key });
    const queryParams = language ? `?lang=${language}` : "";

    const response = await fetch(`${url}${queryParams}`, {
      method: "GET",
      headers: getCommonHeaders(),
    });

    return response.json();
  },

  // Get multiple translations by keys
  async getByKeys(
    keys: string[],
    language?: string
  ): Promise<TranslationResponse> {
    const url = buildApiUrl(API_CONFIG.TRANSLATIONS.BY_KEYS);
    const queryParams = language ? `?lang=${language}` : "";

    const response = await fetch(`${url}${queryParams}`, {
      method: "POST",
      headers: getCommonHeaders(),
      body: JSON.stringify({ keys }),
    });

    return response.json();
  },

  // Get translations by category
  async getByCategory(
    category: string,
    language?: string
  ): Promise<TranslationResponse> {
    const url = buildApiUrl(API_CONFIG.TRANSLATIONS.BY_CATEGORY, { category });
    const queryParams = language ? `?lang=${language}` : "";

    const response = await fetch(`${url}${queryParams}`, {
      method: "GET",
      headers: getCommonHeaders(),
    });

    return response.json();
  },

  // Get all translations
  async getAll(language?: string): Promise<TranslationResponse> {
    const url = buildApiUrl(API_CONFIG.TRANSLATIONS.ALL);
    const queryParams = language ? `?lang=${language}` : "";

    const response = await fetch(`${url}${queryParams}`, {
      method: "GET",
      headers: getCommonHeaders(),
    });

    return response.json();
  },

  // Search translations
  async search(
    query: string,
    language?: string,
    category?: string
  ): Promise<TranslationResponse> {
    const url = buildApiUrl(API_CONFIG.TRANSLATIONS.SEARCH);
    const params = new URLSearchParams({ query });
    if (language) params.append("language", language);
    if (category) params.append("category", category);

    const response = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: getCommonHeaders(),
    });

    return response.json();
  },

  // Get translation statistics
  async getStats(): Promise<TranslationResponse> {
    const url = buildApiUrl(API_CONFIG.TRANSLATIONS.STATS);

    const response = await fetch(url, {
      method: "GET",
      headers: getCommonHeaders(),
    });

    return response.json();
  },

  // Export translations
  async export(
    category?: string,
    language?: string
  ): Promise<TranslationResponse> {
    const url = buildApiUrl(API_CONFIG.TRANSLATIONS.EXPORT);
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (language) params.append("language", language);

    const response = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: getCommonHeaders(),
    });

    return response.json();
  },

  // Admin functions
  // Get paginated translations (Admin)
  async getPaginated(
    token: string,
    page: number = 1,
    limit: number = 20,
    category?: string,
    search?: string,
    isActive?: boolean
  ): Promise<TranslationResponse> {
    const url = buildApiUrl(API_CONFIG.ADMIN.TRANSLATIONS);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    if (isActive !== undefined) params.append("isActive", isActive.toString());

    const response = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    return response.json();
  },

  // Create translation (Admin)
  async create(
    data: TranslationData,
    token: string
  ): Promise<TranslationResponse> {
    const url = buildApiUrl(API_CONFIG.ADMIN.TRANSLATIONS);

    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    return response.json();
  },

  // Update translation (Admin)
  async update(
    key: string,
    data: Partial<TranslationData>,
    token: string
  ): Promise<TranslationResponse> {
    const url = buildApiUrl(API_CONFIG.ADMIN.TRANSLATION_BY_KEY, { key });

    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    return response.json();
  },

  // Delete translation (Admin)
  async delete(key: string, token: string): Promise<TranslationResponse> {
    const url = buildApiUrl(API_CONFIG.ADMIN.TRANSLATION_BY_KEY, { key });

    const response = await fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });

    return response.json();
  },

  // Bulk import translations (Admin)
  async bulkImport(
    translations: TranslationData[],
    token: string
  ): Promise<TranslationResponse> {
    const url = buildApiUrl(API_CONFIG.TRANSLATIONS.IMPORT);

    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ translations }),
    });

    return response.json();
  },
};

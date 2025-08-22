import { http } from "@/lib/http";
import { API_CONFIG } from "@/lib/api-config";

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  data: Review[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: Review;
}

// Review API requests to Node.js backend
export const reviewsApiRequest = {
  // Get product reviews
  getProductReviews: (
    productId: string,
    page = 1,
    limit = 20
  ): Promise<ReviewsResponse> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const url = `${API_CONFIG.REVIEWS.PRODUCT_REVIEWS.replace(
      ":productId",
      productId
    )}?${queryParams.toString()}`;
    return http.get(url);
  },

  // Get user's reviews
  getUserReviews: (
    token: string,
    page = 1,
    limit = 20
  ): Promise<ReviewsResponse> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const url = `${API_CONFIG.REVIEWS.USER_REVIEWS}?${queryParams.toString()}`;
    return http.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Create new review
  createReview: (
    token: string,
    body: CreateReviewRequest
  ): Promise<ReviewResponse> => {
    return http.post(API_CONFIG.REVIEWS.CREATE, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Update existing review
  updateReview: (
    token: string,
    reviewId: string,
    body: UpdateReviewRequest
  ): Promise<ReviewResponse> => {
    return http.put(API_CONFIG.REVIEWS.UPDATE.replace(":id", reviewId), body, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Delete review
  deleteReview: (
    token: string,
    reviewId: string
  ): Promise<{ success: boolean; message: string }> => {
    return http.delete(API_CONFIG.REVIEWS.DELETE.replace(":id", reviewId), {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Mark review as helpful
  markHelpful: (
    token: string,
    reviewId: string
  ): Promise<{ success: boolean; message: string }> => {
    return http.post(
      API_CONFIG.REVIEWS.MARK_HELPFUL.replace(":id", reviewId),
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // Get product review statistics
  getProductReviewStats: (
    productId: string
  ): Promise<{ success: boolean; data: any }> => {
    return http.get(API_CONFIG.REVIEWS.STATS.replace(":productId", productId));
  },

  // Get all reviews (admin only)
  getAllReviews: (
    token: string,
    filters?: {
      status?: string;
      page?: number;
      limit?: number;
      productId?: string;
      userId?: string;
    }
  ): Promise<ReviewsResponse> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_CONFIG.REVIEWS.ALL}?${queryString}`
      : API_CONFIG.REVIEWS.ALL;
    return http.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Verify review (admin only)
  verifyReview: (
    token: string,
    reviewId: string,
    verified: boolean
  ): Promise<{ success: boolean; message: string }> => {
    return http.put(
      API_CONFIG.REVIEWS.VERIFY.replace(":id", reviewId),
      { verified },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },
};

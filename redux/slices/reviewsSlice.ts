import { apiRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  adminResponse?: string;
  helpfulVotes: number;
  verifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReviewsState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
  };
}

const initialState: ReviewsState = {
  reviews: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
  },
};

// Create review
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewData: {
    productId: string;
    rating: number;
    comment: string;
  }) => {
    const response = await apiRequest("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
    return response.data;
  }
);

// Get all reviews
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (
    params: {
      productId?: string;
      status?: string;
      page?: number;
      limit?: number;
    } = {}
  ) => {
    const queryParams = new URLSearchParams();

    if (params.productId) queryParams.append("productId", params.productId);
    if (params.status) queryParams.append("status", params.status);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const response = await apiRequest(`/reviews?${queryParams}`);
    return response.data;
  }
);

// Update review status (Admin)
export const updateReviewStatus = createAsyncThunk(
  "reviews/updateReviewStatus",
  async ({
    reviewId,
    status,
    adminResponse,
  }: {
    reviewId: string;
    status: "approved" | "rejected";
    adminResponse?: string;
  }) => {
    const response = await apiRequest(`/reviews/${reviewId}`, {
      method: "PATCH",
      body: JSON.stringify({ status, adminResponse }),
    });
    return response.data;
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload.review);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create review";
      })
      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.pagination = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalReviews: action.payload.totalReviews || 0,
        };
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch reviews";
      })
      // Update review status
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (r) => r._id === action.payload.review._id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload.review;
        }
      });
  },
});

export const { clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer;

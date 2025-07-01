import { apiRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  product: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  adminResponse?: string;
  helpfulVotes?: number;
  verifiedPurchase?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReviewsState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  totalReviews: number;
  currentPage: number;
  totalPages: number;
}

const initialState: ReviewsState = {
  reviews: [],
  loading: false,
  error: null,
  totalReviews: 0,
  currentPage: 1,
  totalPages: 1,
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
    return response;
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

    const response = await apiRequest(`/reviews?${queryParams.toString()}`);
    return response;
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
    status: string;
    adminResponse?: string;
  }) => {
    const response = await apiRequest(`/reviews/${reviewId}`, {
      method: "PATCH",
      body: JSON.stringify({ status, adminResponse }),
    });
    return response;
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
        state.reviews.unshift(action.payload.data?.review);
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
        state.reviews = action.payload.data || [];
        state.totalReviews = action.payload.pagination?.total || 0;
        state.currentPage = action.payload.pagination?.page || 1;
        state.totalPages = action.payload.pagination?.totalPage || 1;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch reviews";
      })
      // Update review status
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (review) => review._id === action.payload.data?._id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload?.data;
        }
      })
      .addCase(updateReviewStatus.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update review";
      });
  },
});

export const { clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer;

import { apiRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  topProducts: Array<{
    _id: string;
    title: string;
    totalSold: number;
    revenue: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
  customersByMonth: Array<{
    month: string;
    customers: number;
  }>;
  topCategories: Array<{
    _id: string;
    name: string;
    totalSales: number;
    revenue: number;
  }>;
}

interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null,
};

// Get analytics dashboard
export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAnalytics",
  async (period: number = 30) => {
    const response = await apiRequest(`/analytics?period=${period}`);
    return response;
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data?.analytics;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch analytics";
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;

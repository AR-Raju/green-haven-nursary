import { apiRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  conversionRate: number;
  salesData: Array<{
    month: string;
    sales: number;
    orders: number;
    customers: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  trafficData: Array<{
    source: string;
    visitors: number;
    percentage: number;
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
  async (period = 30) => {
    const response = await apiRequest(`/analytics?period=${period}`);
    return response.data;
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
        state.data = action.payload.analytics;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch analytics";
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;

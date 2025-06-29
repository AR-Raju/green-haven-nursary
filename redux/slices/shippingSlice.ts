import { apiRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface ShippingZone {
  _id: string;
  name: string;
  regions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ShippingMethod {
  _id: string;
  zoneId: string;
  name: string;
  description: string;
  cost: number;
  estimatedDays: string;
  freeShippingThreshold?: number;
  createdAt: string;
  updatedAt: string;
}

interface ShippingState {
  zones: ShippingZone[];
  methods: ShippingMethod[];
  loading: boolean;
  error: string | null;
}

const initialState: ShippingState = {
  zones: [],
  methods: [],
  loading: false,
  error: null,
};

// Create shipping zone
export const createShippingZone = createAsyncThunk(
  "shipping/createShippingZone",
  async (zoneData: { name: string; regions: string[] }) => {
    const response = await apiRequest("/shipping/zones", {
      method: "POST",
      body: JSON.stringify(zoneData),
    });
    return response.data;
  }
);

// Get shipping zones
export const fetchShippingZones = createAsyncThunk(
  "shipping/fetchShippingZones",
  async () => {
    const response = await apiRequest("/shipping/zones");
    return response.data;
  }
);

// Create shipping method
export const createShippingMethod = createAsyncThunk(
  "shipping/createShippingMethod",
  async (methodData: {
    zoneId: string;
    name: string;
    description: string;
    cost: number;
    estimatedDays: string;
    freeShippingThreshold?: number;
  }) => {
    const response = await apiRequest("/shipping/methods", {
      method: "POST",
      body: JSON.stringify(methodData),
    });
    return response.data;
  }
);

// Get shipping methods
export const fetchShippingMethods = createAsyncThunk(
  "shipping/fetchShippingMethods",
  async (zoneId?: string) => {
    const queryParams = zoneId ? `?zoneId=${zoneId}` : "";
    const response = await apiRequest(`/shipping/methods${queryParams}`);
    return response.data;
  }
);

const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create shipping zone
      .addCase(createShippingZone.fulfilled, (state, action) => {
        state.zones.push(action.payload.zone);
      })
      // Fetch shipping zones
      .addCase(fetchShippingZones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippingZones.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = action.payload.zones;
      })
      .addCase(fetchShippingZones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch shipping zones";
      })
      // Create shipping method
      .addCase(createShippingMethod.fulfilled, (state, action) => {
        state.methods.push(action.payload.method);
      })
      // Fetch shipping methods
      .addCase(fetchShippingMethods.fulfilled, (state, action) => {
        state.methods = action.payload.methods;
      });
  },
});

export const { clearError } = shippingSlice.actions;
export default shippingSlice.reducer;

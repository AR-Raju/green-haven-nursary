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
    return response;
  }
);

// Get shipping zones
export const fetchShippingZones = createAsyncThunk(
  "shipping/fetchShippingZones",
  async () => {
    const response = await apiRequest("/shipping/zones");
    return response;
  }
);

// Update shipping zone
export const updateShippingZone = createAsyncThunk(
  "shipping/updateShippingZone",
  async ({ zoneId, zoneData }: { zoneId: string; zoneData: any }) => {
    const response = await apiRequest(`/shipping/zones/${zoneId}`, {
      method: "PUT",
      body: JSON.stringify(zoneData),
    });
    return response;
  }
);

// Delete shipping zone
export const deleteShippingZone = createAsyncThunk(
  "shipping/deleteShippingZone",
  async (zoneId: string) => {
    await apiRequest(`/shipping/zones/${zoneId}`, {
      method: "DELETE",
    });
    return zoneId;
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
    return response;
  }
);

// Get shipping methods
export const fetchShippingMethods = createAsyncThunk(
  "shipping/fetchShippingMethods",
  async (zoneId?: string) => {
    const queryParams = zoneId ? `?zoneId=${zoneId}` : "";
    const response = await apiRequest(`/shipping/methods${queryParams}`);
    return response;
  }
);

// Update shipping method
export const updateShippingMethod = createAsyncThunk(
  "shipping/updateShippingMethod",
  async ({ methodId, methodData }: { methodId: string; methodData: any }) => {
    const response = await apiRequest(`/shipping/methods/${methodId}`, {
      method: "PUT",
      body: JSON.stringify(methodData),
    });
    return response;
  }
);

// Delete shipping method
export const deleteShippingMethod = createAsyncThunk(
  "shipping/deleteShippingMethod",
  async (methodId: string) => {
    await apiRequest(`/shipping/methods/${methodId}`, {
      method: "DELETE",
    });
    return methodId;
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
        state.zones.push(action.payload.data?.zone);
      })
      .addCase(createShippingZone.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create shipping zone";
      })
      // Fetch shipping zones
      .addCase(fetchShippingZones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippingZones.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = action.payload.data?.zones || [];
      })
      .addCase(fetchShippingZones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch shipping zones";
      })
      // Update shipping zone
      .addCase(updateShippingZone.fulfilled, (state, action) => {
        const index = state.zones.findIndex(
          (zone) => zone._id === action.payload.data?.zone._id
        );
        if (index !== -1) {
          state.zones[index] = action.payload.data?.zone;
        }
      })
      // Delete shipping zone
      .addCase(deleteShippingZone.fulfilled, (state, action) => {
        state.zones = state.zones.filter((zone) => zone._id !== action.payload);
      })
      // Create shipping method
      .addCase(createShippingMethod.fulfilled, (state, action) => {
        state.methods.push(action.payload.data?.method);
      })
      .addCase(createShippingMethod.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to create shipping method";
      })
      // Fetch shipping methods
      .addCase(fetchShippingMethods.fulfilled, (state, action) => {
        state.methods = action.payload.data?.methods || [];
      })
      .addCase(fetchShippingMethods.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to fetch shipping methods";
      })
      // Update shipping method
      .addCase(updateShippingMethod.fulfilled, (state, action) => {
        const index = state.methods.findIndex(
          (method) => method._id === action.payload.data?.method._id
        );
        if (index !== -1) {
          state.methods[index] = action.payload.data?.method;
        }
      })
      // Delete shipping method
      .addCase(deleteShippingMethod.fulfilled, (state, action) => {
        state.methods = state.methods.filter(
          (method) => method._id !== action.payload
        );
      });
  },
});

export const { clearError } = shippingSlice.actions;
export default shippingSlice.reducer;

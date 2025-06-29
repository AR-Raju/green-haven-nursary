import { apiRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface OrderItem {
  product: string;
  quantity: number;
  price?: number;
}

export interface Order {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "COD" | "STRIPE";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
  };
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  },
};

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData: {
    customerName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    items: OrderItem[];
    paymentMethod: "COD" | "STRIPE";
  }) => {
    const response = await apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    return response.data;
  }
);

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (
    params: {
      page?: number;
      limit?: number;
      orderStatus?: string;
    } = {}
  ) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.orderStatus)
      queryParams.append("orderStatus", params.orderStatus);

    const response = await apiRequest(`/orders?${queryParams}`);
    return response.data;
  }
);

export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
  async (orderId: string) => {
    const response = await apiRequest(`/orders/${orderId}`);
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({
    orderId,
    orderStatus,
    paymentStatus,
  }: {
    orderId: string;
    orderStatus?: string;
    paymentStatus?: string;
  }) => {
    const response = await apiRequest(`/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ orderStatus, paymentStatus }),
    });
    return response.data;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
        state.orders.unshift(action.payload.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create order";
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalOrders: action.payload.totalOrders || 0,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o._id === action.payload.order._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
        if (state.currentOrder?._id === action.payload.order._id) {
          state.currentOrder = action.payload.order;
        }
      });
  },
});

export const { clearCurrentOrder, clearError } = ordersSlice.actions;
export default ordersSlice.reducer;

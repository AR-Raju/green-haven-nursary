import { apiRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface OrderItem {
  product: {
    _id: string;
    title: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
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
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  paymentMethod: "COD" | "CARD";
  createdAt: string;
  updatedAt: string;
}

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  totalOrders: number;
  currentPage: number;
  totalPages: number;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  totalOrders: 0,
  currentPage: 1,
  totalPages: 1,
};

// Create order
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
    items: Array<{
      product: string;
      quantity: number;
    }>;
    paymentMethod: string;
  }) => {
    const response = await apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
    return response.data;
  }
);

// Get all orders
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

    const response = await apiRequest(`/orders?${queryParams.toString()}`);
    return response.data;
  }
);

// Get single order
export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
  async (orderId: string) => {
    const response = await apiRequest(`/orders/${orderId}`);
    return response.data;
  }
);

// Update order status
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
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create order";
      })
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      })
      // Fetch single order
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order;
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order._id === action.payload.order._id
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

export const { clearError, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

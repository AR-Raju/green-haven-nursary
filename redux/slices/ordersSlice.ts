import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export interface OrderItem {
  product: string
  quantity: number
  price: number
}

export interface Order {
  _id: string
  customerName: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  items: OrderItem[]
  totalAmount: number
  paymentMethod: "COD" | "STRIPE"
  paymentStatus: "PENDING" | "PAID" | "FAILED"
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  createdAt: string
  updatedAt: string
}

interface OrdersState {
  orders: Order[]
  loading: boolean
  error: string | null
  currentOrder: Order | null
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
  currentOrder: null,
}

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData: Omit<Order, "_id" | "createdAt" | "updatedAt" | "paymentStatus" | "orderStatus">) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
    if (!response.ok) {
      throw new Error("Failed to create order")
    }
    return response.json()
  },
)

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const response = await fetch("/api/orders")
  if (!response.ok) {
    throw new Error("Failed to fetch orders")
  }
  return response.json()
})

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload.order
        state.orders.unshift(action.payload.order)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create order"
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders
      })
  },
})

export const { clearCurrentOrder } = ordersSlice.actions
export default ordersSlice.reducer

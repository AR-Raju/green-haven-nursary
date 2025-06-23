import { configureStore } from "@reduxjs/toolkit"
import productsReducer from "./slices/productsSlice"
import categoriesReducer from "./slices/categoriesSlice"
import cartReducer from "./slices/cartSlice"
import ordersReducer from "./slices/ordersSlice"

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

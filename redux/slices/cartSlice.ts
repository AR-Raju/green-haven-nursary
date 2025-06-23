import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "./productsSlice"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
}

// Load cart from localStorage
const loadCartFromStorage = (): CartState => {
  if (typeof window !== "undefined") {
    try {
      const savedCart = localStorage.getItem("nursery-cart")
      if (savedCart) {
        return JSON.parse(savedCart)
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
    }
  }
  return initialState
}

// Save cart to localStorage
const saveCartToStorage = (state: CartState) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("nursery-cart", JSON.stringify(state))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }
}

// Calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  return { totalItems, totalAmount }
}

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload

      // Check if product is in stock
      if (!product.inStock || product.quantity < quantity) {
        return
      }

      const existingItem = state.items.find((item) => item.product._id === product._id)

      if (existingItem) {
        // Check if adding quantity exceeds stock
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity <= product.quantity) {
          existingItem.quantity = newQuantity
        }
      } else {
        state.items.push({ product, quantity })
      }

      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalAmount = totals.totalAmount

      saveCartToStorage(state)
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product._id !== action.payload)

      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalAmount = totals.totalAmount

      saveCartToStorage(state)
    },

    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload
      const item = state.items.find((item) => item.product._id === productId)

      if (item && quantity > 0 && quantity <= item.product.quantity) {
        item.quantity = quantity
      }

      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalAmount = totals.totalAmount

      saveCartToStorage(state)
    },

    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalAmount = 0

      saveCartToStorage(state)
    },

    initializeCart: (state) => {
      const savedCart = loadCartFromStorage()
      state.items = savedCart.items
      state.totalItems = savedCart.totalItems
      state.totalAmount = savedCart.totalAmount
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, initializeCart } = cartSlice.actions
export default cartSlice.reducer

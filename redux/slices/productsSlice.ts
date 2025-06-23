import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Product {
  _id: string
  title: string
  description: string
  price: number
  quantity: number
  rating: number
  image: string
  category: {
    _id: string
    name: string
  }
  inStock: boolean
  createdAt: string
  updatedAt: string
}

interface ProductsState {
  products: Product[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalProducts: number
  filters: {
    category: string
    search: string
    sortBy: string
    sortOrder: "asc" | "desc"
  }
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  filters: {
    category: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
}

// Async thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    params: {
      page?: number
      limit?: number
      category?: string
      search?: string
      sortBy?: string
      sortOrder?: "asc" | "desc"
    } = {},
  ) => {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())
    if (params.category) queryParams.append("category", params.category)
    if (params.search) queryParams.append("search", params.search)
    if (params.sortBy) queryParams.append("sortBy", params.sortBy)
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder)

    const response = await fetch(`/api/products?${queryParams}`)
    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }
    return response.json()
  },
)

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData: Omit<Product, "_id" | "createdAt" | "updatedAt" | "inStock">) => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
    if (!response.ok) {
      throw new Error("Failed to create product")
    }
    return response.json()
  },
)

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, ...productData }: Partial<Product> & { id: string }) => {
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
    if (!response.ok) {
      throw new Error("Failed to update product")
    }
    return response.json()
  },
)

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id: string) => {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete product")
  }
  return { id }
})

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductsState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.currentPage = action.payload.currentPage
        state.totalPages = action.payload.totalPages
        state.totalProducts = action.payload.totalProducts
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch products"
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products.unshift(action.payload.product)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create product"
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p._id === action.payload.product._id)
        if (index !== -1) {
          state.products[index] = action.payload.product
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload.id)
      })
  },
})

export const { setFilters, clearFilters, setCurrentPage } = productsSlice.actions
export default productsSlice.reducer

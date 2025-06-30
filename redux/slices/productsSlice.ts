import { apiRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  images?: string[];
  category:
    | {
        _id: string;
        name: string;
      }
    | string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  filters: {
    search: string;
    category: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    minPrice: number;
    maxPrice: number;
  };
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  totalProducts: 0,
  currentPage: 1,
  totalPages: 1,
  filters: {
    search: "",
    category: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    minPrice: 0,
    maxPrice: 1000,
  },
};

// Create product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (
    productData: {
      title: string;
      description: string;
      price: number;
      quantity: number;
      image: string;
      category: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create product");
    }
  }
);

// Get all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    params: {
      page?: number;
      limit?: number;
      searchTerm?: string;
      sort?: string;
      category?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.searchTerm)
        queryParams.append("searchTerm", params.searchTerm);
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.category) queryParams.append("category", params.category);

      const response = await apiRequest(`/products?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

// Get single product
export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/products/${productId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch product");
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (
    {
      id,
      ...productData
    }: {
      id: string & Partial<Product>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest(`/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(productData),
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update product");
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/products/${productId}`, {
        method: "DELETE",
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete product");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.product) {
          state.products.unshift(action.payload.product);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create product";
      })
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.products = Array.isArray(action.payload) ? action.payload : [];
          state.totalProducts = action.payload.totalProducts || 0;
          state.currentPage = action.payload.currentPage || 1;
          state.totalPages = action.payload.totalPages || 1;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch products";
        state.products = [];
      })
      // Fetch single product
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload?.product || null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch product";
        state.currentProduct = null;
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        if (action.payload?.product) {
          const index = state.products.findIndex(
            (product) => product._id === action.payload.product._id
          );
          if (index !== -1) {
            state.products[index] = action.payload.product;
          }
          if (state.currentProduct?._id === action.payload.product._id) {
            state.currentProduct = action.payload.product;
          }
        }
      });
  },
});

export const { clearError, clearFilters, setFilters, clearCurrentProduct } =
  productsSlice.actions;
export default productsSlice.reducer;

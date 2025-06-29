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
  category: {
    _id: string;
    name: string;
  };
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
    searchTerm: string;
    category: string;
    sort: string;
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
    searchTerm: "",
    category: "",
    sort: "-createdAt",
    minPrice: 0,
    maxPrice: 1000,
  },
};

// Create product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData: {
    title: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
  }) => {
    const response = await apiRequest("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
    return response.data;
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
    } = {}
  ) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.category) queryParams.append("category", params.category);

    const response = await apiRequest(`/products?${queryParams.toString()}`);
    return response.data;
  }
);

// Get single product
export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (productId: string) => {
    const response = await apiRequest(`/products/${productId}`);
    return response.data;
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({
    productId,
    productData,
  }: {
    productId: string;
    productData: Partial<Product>;
  }) => {
    const response = await apiRequest(`/products/${productId}`, {
      method: "PATCH",
      body: JSON.stringify(productData),
    });
    return response.data;
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
        state.products.unshift(action.payload.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create product";
      })
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      // Fetch single product
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.currentProduct = action.payload.product;
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload.product._id
        );
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
        if (state.currentProduct?._id === action.payload.product._id) {
          state.currentProduct = action.payload.product;
        }
      });
  },
});

export const { clearError, setFilters, clearCurrentProduct } =
  productsSlice.actions;
export default productsSlice.reducer;

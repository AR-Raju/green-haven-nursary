import { apiRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesState {
  categories: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
  totalCategories: number;
  currentPage: number;
  totalPages: number;
}

const initialState: CategoriesState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
  totalCategories: 0,
  currentPage: 1,
  totalPages: 1,
};

// Create category
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData: {
    name: string;
    description: string;
    image: string;
  }) => {
    const response = await apiRequest("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
    return response.data;
  }
);

// Get all categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (params: { page?: number; limit?: number } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const response = await apiRequest(`/categories?${queryParams.toString()}`);
    return response.data;
  }
);

// Get single category
export const fetchCategory = createAsyncThunk(
  "categories/fetchCategory",
  async (categoryId: string) => {
    const response = await apiRequest(`/categories/${categoryId}`);
    return response.data;
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({
    categoryId,
    categoryData,
  }: {
    categoryId: string;
    categoryData: Partial<Category>;
  }) => {
    const response = await apiRequest(`/categories/${categoryId}`, {
      method: "PATCH",
      body: JSON.stringify(categoryData),
    });
    return response.data;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.unshift(action.payload.category);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create category";
      })
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.totalCategories = action.payload.totalCategories;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      // Fetch single category
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.currentCategory = action.payload.category;
      })
      // Update category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category._id === action.payload.category._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload.category;
        }
        if (state.currentCategory?._id === action.payload.category._id) {
          state.currentCategory = action.payload.category;
        }
      });
  },
});

export const { clearError, clearCurrentCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;

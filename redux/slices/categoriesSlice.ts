import { apiRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesState {
  categories: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCategories: number;
  };
}

const initialState: CategoriesState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCategories: 0,
  },
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (params: { page?: number; limit?: number } = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const response = await apiRequest(`/categories?${queryParams}`);
    return response.data;
  }
);

export const fetchCategory = createAsyncThunk(
  "categories/fetchCategory",
  async (categoryId: string) => {
    const response = await apiRequest(`/categories/${categoryId}`);
    return response.data;
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData: {
    name: string;
    description?: string;
    image: string;
  }) => {
    const response = await apiRequest("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
    return response.data;
  }
);

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

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId: string) => {
    await apiRequest(`/categories/${categoryId}`, {
      method: "DELETE",
    });
    return categoryId;
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
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.pagination = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalCategories: action.payload.totalCategories || 0,
        };
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.currentCategory = action.payload.category;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload.category);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c._id === action.payload.category._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload.category;
        }
        if (state.currentCategory?._id === action.payload.category._id) {
          state.currentCategory = action.payload.category;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c._id !== action.payload
        );
        if (state.currentCategory?._id === action.payload) {
          state.currentCategory = null;
        }
      });
  },
});

export const { clearError, clearCurrentCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;

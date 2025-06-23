import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export interface Category {
  _id: string
  name: string
  description?: string
  image: string
  createdAt: string
  updatedAt: string
}

interface CategoriesState {
  categories: Category[]
  loading: boolean
  error: string | null
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
}

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  const response = await fetch("/api/categories")
  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }
  return response.json()
})

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData: Omit<Category, "_id" | "createdAt" | "updatedAt">) => {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    })
    if (!response.ok) {
      throw new Error("Failed to create category")
    }
    return response.json()
  },
)

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, ...categoryData }: Partial<Category> & { id: string }) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    })
    if (!response.ok) {
      throw new Error("Failed to update category")
    }
    return response.json()
  },
)

export const deleteCategory = createAsyncThunk("categories/deleteCategory", async (id: string) => {
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete category")
  }
  return { id }
})

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload.categories
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch categories"
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload.category)
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((c) => c._id === action.payload.category._id)
        if (index !== -1) {
          state.categories[index] = action.payload.category
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c._id !== action.payload.id)
      })
  },
})

export default categoriesSlice.reducer

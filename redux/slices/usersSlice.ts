import { apiRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "vendor";
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  totalUsers: number;
  currentPage: number;
  totalPages: number;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  totalUsers: 0,
  currentPage: 1,
  totalPages: 1,
};

// Get all users (Admin only)
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    params: {
      page?: number;
      limit?: number;
      searchTerm?: string;
    } = {}
  ) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);

    const response = await apiRequest(`/users?${queryParams.toString()}`);
    return response.data;
  }
);

// Get single user
export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (userId: string) => {
    const response = await apiRequest(`/users/${userId}`);
    return response.data;
  }
);

// Update user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData }: { userId: string; userData: Partial<User> }) => {
    const response = await apiRequest(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
    return response.data;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      // Fetch single user
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user._id === action.payload.user._id
        );
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
        if (state.currentUser?._id === action.payload.user._id) {
          state.currentUser = action.payload.user;
        }
      });
  },
});

export const { clearError, setCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;

import { apiRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Product } from "./productsSlice";

interface WishlistItem {
  _id: string;
  userId: string;
  productId: Product;
  createdAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Get wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async () => {
    const response = await apiRequest("/wishlist");
    return response.data;
  }
);

// Add to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId: string) => {
    const response = await apiRequest("/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
    return response.data;
  }
);

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId: string) => {
    await apiRequest(`/wishlist/${productId}`, {
      method: "DELETE",
    });
    return productId;
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.wishlist;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch wishlist";
      })
      // Add to wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload.wishlistItem);
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.productId._id !== action.payload
        );
      });
  },
});

export const { clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;

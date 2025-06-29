import { apiRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  category: string;
  tags: string[];
  featuredImage: string;
  author: {
    _id: string;
    name: string;
  };
  status: "draft" | "published";
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  loading: boolean;
  error: string | null;
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  totalPosts: 0,
  currentPage: 1,
  totalPages: 1,
};

// Create blog post
export const createBlogPost = createAsyncThunk(
  "blog/createBlogPost",
  async (postData: {
    title: string;
    content: string;
    excerpt: string;
    category: string;
    tags: string[];
    featuredImage: string;
    status: string;
  }) => {
    const response = await apiRequest("/blog", {
      method: "POST",
      body: JSON.stringify(postData),
    });
    return response.data;
  }
);

// Get all blog posts
export const fetchBlogPosts = createAsyncThunk(
  "blog/fetchBlogPosts",
  async (
    params: {
      status?: string;
      category?: string;
      page?: number;
      limit?: number;
    } = {}
  ) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.category) queryParams.append("category", params.category);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const response = await apiRequest(`/blog?${queryParams.toString()}`);
    return response.data;
  }
);

// Get single blog post
export const fetchBlogPost = createAsyncThunk(
  "blog/fetchBlogPost",
  async (slug: string) => {
    const response = await apiRequest(`/blog/${slug}`);
    return response.data;
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create blog post
      .addCase(createBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload.post);
      })
      .addCase(createBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create blog post";
      })
      // Fetch blog posts
      .addCase(fetchBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.totalPosts = action.payload.totalPosts;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blog posts";
      })
      // Fetch single blog post
      .addCase(fetchBlogPost.fulfilled, (state, action) => {
        state.currentPost = action.payload.post;
      });
  },
});

export const { clearError, clearCurrentPost } = blogSlice.actions;
export default blogSlice.reducer;

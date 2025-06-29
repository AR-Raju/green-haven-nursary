import { apiRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featuredImage: string;
  authorId: string;
  authorName: string;
  status: "draft" | "published" | "archived";
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
  };
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
  },
};

// Create blog post
export const createBlogPost = createAsyncThunk(
  "blog/createBlogPost",
  async (
    postData: Omit<
      BlogPost,
      "_id" | "slug" | "views" | "createdAt" | "updatedAt" | "publishedAt"
    >
  ) => {
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

    const response = await apiRequest(`/blog?${queryParams}`);
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

// Update blog post
export const updateBlogPost = createAsyncThunk(
  "blog/updateBlogPost",
  async ({ slug, postData }: { slug: string; postData: Partial<BlogPost> }) => {
    const response = await apiRequest(`/blog/${slug}`, {
      method: "PATCH",
      body: JSON.stringify(postData),
    });
    return response.data;
  }
);

// Delete blog post
export const deleteBlogPost = createAsyncThunk(
  "blog/deleteBlogPost",
  async (slug: string) => {
    await apiRequest(`/blog/${slug}`, {
      method: "DELETE",
    });
    return slug;
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
        state.pagination = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalPosts: action.payload.totalPosts || 0,
        };
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blog posts";
      })
      // Fetch single blog post
      .addCase(fetchBlogPost.fulfilled, (state, action) => {
        state.currentPost = action.payload.post;
      })
      // Update blog post
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload.post._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload.post;
        }
        if (state.currentPost?._id === action.payload.post._id) {
          state.currentPost = action.payload.post;
        }
      })
      // Delete blog post
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.slug !== action.payload);
        if (state.currentPost?.slug === action.payload) {
          state.currentPost = null;
        }
      });
  },
});

export const { clearError, clearCurrentPost } = blogSlice.actions;
export default blogSlice.reducer;

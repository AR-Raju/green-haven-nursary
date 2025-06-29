import { uploadRequest } from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UploadState {
  uploading: boolean;
  error: string | null;
  uploadedUrls: string[];
}

const initialState: UploadState = {
  uploading: false,
  error: null,
  uploadedUrls: [],
};

// Upload image
export const uploadImage = createAsyncThunk(
  "upload/uploadImage",
  async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await uploadRequest("/upload", formData);
    return response.data;
  }
);

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUploadedUrls: (state) => {
      state.uploadedUrls = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadedUrls.push(action.payload.url);
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.error.message || "Upload failed";
      });
  },
});

export const { clearError, clearUploadedUrls } = uploadSlice.actions;
export default uploadSlice.reducer;

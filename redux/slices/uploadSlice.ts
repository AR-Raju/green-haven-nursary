import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UploadState {
  uploading: boolean;
  error: string | null;
  uploadedFiles: string[];
}

const initialState: UploadState = {
  uploading: false,
  error: null,
  uploadedFiles: [],
};

// Upload image
export const uploadImage = createAsyncThunk(
  "upload/uploadImage",
  async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Upload failed");
    }

    return data.data;
  }
);

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUploadedFiles: (state) => {
      state.uploadedFiles = [];
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
        state.uploadedFiles.push(action.payload.url);
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.error.message || "Upload failed";
      });
  },
});

export const { clearError, clearUploadedFiles } = uploadSlice.actions;
export default uploadSlice.reducer;

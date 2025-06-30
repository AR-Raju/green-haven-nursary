// API configuration and utilities
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://green-haven-server.vercel.app/api";

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

// API request helper
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// API upload image
export const uploadAPI = {
  uploadImage: async (file: File) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("image", file);

    try {
      console.log("Uploading image to:", API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Upload failed: ${response.statusText}`
        );
      }

      return data;
    } catch (error: any) {
      console.error("Upload error:", error);
      throw new Error(error.message || "Upload failed");
    }
  },

  uploadMultipleImages: async (files: File[]) => {
    const uploadPromises = files.map((file) => uploadAPI.uploadImage(file));
    return Promise.allSettled(uploadPromises);
  },
};

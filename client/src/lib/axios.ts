import axios from "axios";

/**
 * Pre-configured Axios instance for all API calls.
 * - Base URL from env
 * - withCredentials: true  → sends/receives the HttpOnly cookie automatically
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Response interceptor ─────────────────────────────────────────────────────
// Normalise error shape across the app
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default api;

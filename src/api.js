import axios from "axios";

/**
 * Base URL priority:
 * 1. REACT_APP_API_URL (Docker / Production)
 * 2. localhost fallback (Local dev)
 */
const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 🔐 Attach JWT token automatically
 */
API.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error) => Promise.reject(error)
);

/**
 * ❗ Centralized error logging
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API ERROR:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error("NETWORK ERROR:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;

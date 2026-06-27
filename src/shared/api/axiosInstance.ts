import axios from "axios";
import { clearToken, getToken } from "../auth/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || "/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    let url = "";

    if (error.config?.url) {
      url = error.config.url;
    }

    const isAuthRequest = url.includes("/login") || url.includes("/register");

    if (status === 401 && !isAuthRequest) {
      clearToken();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

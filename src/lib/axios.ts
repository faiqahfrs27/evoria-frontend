import axios from "axios";
import { useAuth } from "../stores/useAuth";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

export const refreshInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Token Expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await refreshInstance.post("/auth/refresh");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        useAuth.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
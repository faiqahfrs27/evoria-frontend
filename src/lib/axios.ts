import axios from "axios";
import { useAuth } from "../stores/useAuth";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const refreshInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
      originalRequest._retry = true; // ← tambah ini biar tidak infinite loop
      try {
        await refreshInstance.post("/auth/refresh"); // ← fix typo
        return axiosInstance(originalRequest);
      } catch (err) {
        useAuth.getState().logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error); // ← tambah ini biar error lain tetap ter-reject
  },
);

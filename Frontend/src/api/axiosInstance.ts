// Create a custom type for your modified axios instance
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Create a custom type for your modified axios instance
// This extends the base AxiosInstance type with our custom behavior
interface CustomAxiosInstance extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  // Add other methods as needed
}

// Define a custom axios instance type
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
}) as CustomAxiosInstance;

// Override the return type of get, post, etc.
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { status, data } = error.response || {};
    return Promise.reject({ status, ...data });
  }
);
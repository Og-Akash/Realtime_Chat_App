import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response.data, // Ensure only response data is returned
  (error) => {
    const { status, data } = error.response;
    return Promise.reject({ status, ...data });
  }
);
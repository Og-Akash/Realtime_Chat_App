import axios from "axios";

export const axiosIntance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosIntance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status, data } = error.response;
    return Promise.reject({ status, ...data });
  }
);

import axios from "axios";

// Vite uses import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api` 
  : "http://localhost:5001/api";

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createOrderAPI = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Create order error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create order",
      error: error.response?.data?.error
    };
  }
};

export const getOrdersAPI = async () => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error) {
    console.error("Get orders error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch orders",
      error: error.response?.data?.error
    };
  }
};

export const getUserOrdersAPI = async () => {
  try {
    const response = await api.get("/orders/my-orders");
    return response.data;
  } catch (error) {
    console.error("Get user orders error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch user orders",
      error: error.response?.data?.error
    };
  }
};

export const getOrderByIdAPI = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Get order by id error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch order",
      error: error.response?.data?.error
    };
  }
};

export const getQuoteAPI = async (items) => {
  try {
    const response = await api.post("/orders/quote", { items });
    return response.data;
  } catch (error) {
    console.error("Get quote error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to get quote",
      error: error.response?.data?.error
    };
  }
};
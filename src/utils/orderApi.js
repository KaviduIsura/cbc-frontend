// src/utils/orderApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create new order
export const createOrderAPI = async (orderData) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        message: "Please login to place an order",
        requiresLogin: true
      };
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/orders`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      message: response.data.message,
      order: response.data.order
    };
  } catch (error) {
    console.error('Error creating order:', error);
    
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Error placing order',
        error: error.response.data.error
      };
    } else if (error.request) {
      return {
        success: false,
        message: 'Network error. Please check your connection.'
      };
    } else {
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }
};

// Get user orders
export const getOrdersAPI = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        orders: null,
        message: 'User not logged in'
      };
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return {
      success: true,
      orders: response.data.orders,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false,
      orders: null,
      message: error.response?.data?.message || 'Error fetching orders'
    };
  }
};

// Get single order by ID
export const getOrderByIdAPI = async (orderId) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        order: null,
        message: 'User not logged in'
      };
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return {
      success: true,
      order: response.data.order,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false,
      order: null,
      message: error.response?.data?.message || 'Error fetching order'
    };
  }
};

// Cancel order
export const cancelOrderAPI = async (orderId) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        message: 'Please login to cancel order'
      };
    }

    const response = await axios.delete(
      `${API_BASE_URL}/api/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error canceling order:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error canceling order'
    };
  }
};
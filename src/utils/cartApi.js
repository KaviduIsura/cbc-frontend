// src/utils/cartApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Function to trigger cart update event
export const triggerCartUpdate = () => {
  // Dispatch custom event for cart updates
  window.dispatchEvent(new Event('cartUpdated'));
  
  // Also update localStorage for cross-tab communication
  const cartUpdateCount = parseInt(localStorage.getItem('cartUpdateCount') || '0') + 1;
  localStorage.setItem('cartUpdateCount', cartUpdateCount.toString());
  localStorage.setItem('lastCartUpdate', new Date().toISOString());
};

// Add item to cart via API
export const addToCartAPI = async (productId, quantity = 1) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        message: 'Please login to add items to cart',
        requiresLogin: true
      };
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/cart/add`,
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Trigger cart update on success
    triggerCartUpdate();

    return {
      success: true,
      message: response.data.message,
      cart: response.data.cart
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message || 'Error adding item to cart',
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

// Update cart item quantity
export const updateCartItemAPI = async (itemId, quantity) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        message: 'Please login to update cart'
      };
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/cart/${itemId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Trigger cart update on success
    triggerCartUpdate();

    return {
      success: true,
      message: response.data.message,
      cart: response.data.cart
    };
  } catch (error) {
    console.error('Error updating cart:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error updating cart'
    };
  }
};

// Remove item from cart
export const removeCartItemAPI = async (itemId) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        message: 'Please login to remove items from cart'
      };
    }

    const response = await axios.delete(
      `${API_BASE_URL}/api/cart/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Trigger cart update on success
    triggerCartUpdate();

    return {
      success: true,
      message: response.data.message,
      cart: response.data.cart
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error removing item from cart'
    };
  }
};

// Get cart items
export const getCartAPI = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        cart: null,
        message: 'User not logged in'
      };
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/cart`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return {
      success: true,
      cart: response.data.cart,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return {
      success: false,
      cart: null,
      message: error.response?.data?.message || 'Error fetching cart'
    };
  }
};

// Get cart count
export const getCartCountAPI = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return { count: 0 };
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/cart/count`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return {
      count: response.data.count || 0
    };
  } catch (error) {
    console.error('Error getting cart count:', error);
    return { count: 0 };
  }
};

// Clear cart
export const clearCartAPI = async () => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        success: false,
        message: 'Please login to clear cart'
      };
    }

    const response = await axios.delete(
      `${API_BASE_URL}/api/cart`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Trigger cart update on success
    triggerCartUpdate();

    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error clearing cart'
    };
  }
};
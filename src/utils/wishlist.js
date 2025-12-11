// src/utils/wishlistApi.js
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`|| 'http://localhost:5001/api';

// Check if product is in wishlist
export const checkInWishlist = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { isInWishlist: false };
    }

    const response = await axios.get(
      `${API_URL}/wishlist/check/${productId}`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return { isInWishlist: false };
  }
};

// Get wishlist count
export const getWishlistCount = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return 0;
    }

    const response = await axios.get(
      `${API_URL}/wishlist/count`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.count || 0;
  } catch (error) {
    console.error('Error getting wishlist count:', error);
    return 0;
  }
};

// Get wishlist items
export const getWishlistItems = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, message: 'Please login to view wishlist' };
    }

    const response = await axios.get(
      `${API_URL}/wishlist`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error getting wishlist items:', error);
    
    if (error.response?.status === 401) {
      return { success: false, message: 'Please login to view wishlist' };
    } else {
      return { 
        success: false, 
        message: 'Failed to load wishlist',
        error: error.message 
      };
    }
  }
};

export const updateWishlistCountGlobally = () => {
  // Dispatch custom event for wishlist updates
  window.dispatchEvent(new Event('wishlistUpdated'));
  
  // Also update localStorage for cross-tab communication
  const wishlistUpdateCount = parseInt(localStorage.getItem('wishlistUpdateCount') || '0') + 1;
  localStorage.setItem('wishlistUpdateCount', wishlistUpdateCount.toString());
  localStorage.setItem('lastWishlistUpdate', new Date().toISOString());
};

// Update the addToWishlist function
export const addToWishlist = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to add items to wishlist');
    }

    const response = await axios.post(
      `${API_URL}/wishlist`,
      { productId },
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    if (response.data.success) {
      // Trigger global update
      updateWishlistCountGlobally();
      return true;
    } else {
      throw new Error(response.data.message || 'Failed to add to wishlist');
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Please login to add items to wishlist');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data.message || 'Product already in wishlist');
    } else if (error.response?.status === 404) {
      throw new Error('Product not found');
    } else {
      throw new Error('Failed to add to wishlist. Please try again.');
    }
  }
};

// Update the removeFromWishlistAPI function
export const removeFromWishlistAPI = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to modify wishlist');
    }

    const response = await axios.delete(
      `${API_URL}/wishlist/item/${productId}`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      // Trigger global update
      updateWishlistCountGlobally();
      return true;
    } else {
      throw new Error(response.data.message || 'Failed to remove from wishlist');
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Please login to modify wishlist');
    } else {
      throw new Error('Failed to remove from wishlist. Please try again.');
    }
  }
};

// Clear wishlist function (add this if not exists)
export const clearWishlistAPI = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to modify wishlist');
    }

    const response = await axios.delete(
      `${API_URL}/wishlist/clear`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      // Trigger global update
      updateWishlistCountGlobally();
      return true;
    } else {
      throw new Error(response.data.message || 'Failed to clear wishlist');
    }
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw new Error('Failed to clear wishlist. Please try again.');
  }
};
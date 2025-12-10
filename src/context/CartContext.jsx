// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCartCountAPI, getCartAPI } from '../utils/cartApi';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Function to fetch cart count
  const fetchCartCount = async () => {
    try {
      const result = await getCartCountAPI();
      setCartCount(result.count || 0);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  // Function to fetch full cart
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const result = await getCartAPI();
      if (result.success && result.cart) {
        setCartItems(result.cart.items || []);
        setCartCount(result.cart.items.reduce((total, item) => total + item.quantity, 0));
      } else {
        setCartItems([]);
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  };

  // Function to add item to cart and update count
  const addToCart = async (productId, quantity = 1) => {
    try {
      // You'll need to import your addToCartAPI function here
      // This is just to update the count
      await fetchCartCount();
      toast.success('Item added to cart');
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  // Function to remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      // You'll need to import your removeCartItemAPI function here
      // This is just to update the count
      await fetchCartCount();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  // Function to clear cart
  const clearCart = async () => {
    try {
      // You'll need to import your clearCartAPI function here
      setCartCount(0);
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Function to update cart manually (call this after cart operations)
  const updateCart = () => {
    fetchCartCount();
  };

  // Check auth status and fetch cart on mount
  useEffect(() => {
    const checkAuthAndFetchCart = () => {
      const token = localStorage.getItem('token');
      if (token) {
        fetchCartCount();
        // Optionally fetch full cart
        // fetchCart();
      } else {
        setCartCount(0);
        setCartItems([]);
      }
    };

    checkAuthAndFetchCart();

    // Set up interval to refresh cart count (every 30 seconds)
    const intervalId = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        fetchCartCount();
      }
    }, 30000);

    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      checkAuthAndFetchCart();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Listen for custom events from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const value = {
    cartCount,
    cartItems,
    isLoading,
    lastUpdated,
    fetchCartCount,
    fetchCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
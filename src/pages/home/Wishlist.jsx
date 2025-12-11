import { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingBag, X, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { addToCartAPI } from '../../utils/cartApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Use import.meta.env for Vite projects
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api` || 'http://localhost:5001/api';

// Move the addToWishlist function outside the component
export const addToWishlist = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add items to wishlist');
      return false;
    }

    const response = await axios.post(`${API_URL}/wishlist`, 
      { productId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      toast.success('Product added to wishlist');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    if (error.response?.status === 400) {
      toast.error('Product already in wishlist');
    } else if (error.response?.status === 401) {
      toast.error('Please login to add items to wishlist');
    } else {
      toast.error('Failed to add to wishlist');
    }
    return false;
  }
};

// Remove from wishlist function
export const removeFromWishlistAPI = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to modify wishlist');
      return false;
    }

    const response = await axios.delete(`${API_URL}/wishlist/item/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.success) {
      toast.success('Product removed from wishlist');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    toast.error('Failed to remove item from wishlist');
    return false;
  }
};

// Check if product is in wishlist
export const checkInWishlist = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { isInWishlist: false };
    }

    const response = await axios.get(`${API_URL}/wishlist/check/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

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

    const response = await axios.get(`${API_URL}/wishlist/count`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data.count || 0;
  } catch (error) {
    console.error('Error getting wishlist count:', error);
    return 0;
  }
};

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [addingAllToCart, setAddingAllToCart] = useState(false);
  const navigate = useNavigate();

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/wishlist`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Transform backend data to match frontend format
        const items = response.data.wishlist?.items?.map(item => ({
          id: item.product?.productId || item.product?._id,
          _id: item.product?._id, // MongoDB _id
          productId: item.product?.productId, // Custom product ID
          name: item.product?.productName || item.product?.name,
          category: item.product?.category,
          price: `$${item.product?.lastPrice || item.product?.price || 0}`,
          originalPrice: item.product?.originalPrice ? `$${item.product.originalPrice}` : null,
          rating: item.product?.rating || 4.5,
          image: item.product?.images?.[0] || 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop',
          inStock: (item.product?.stock || 0) > 0,
          productData: item.product
        })) || [];
        setWishlistItems(items);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status === 401) {
        setWishlistItems([]);
        setError('Please login to view your wishlist');
      } else if (error.response?.status === 404) {
        setError('Wishlist endpoint not found. Please check backend server.');
      } else {
        setError('Failed to load wishlist');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove item from wishlist - FIXED VERSION
  const removeFromWishlist = async (productId, productName, useProductId = false) => {
    try {
      // Determine which ID to use for API call
      const idToUse = useProductId ? productId : productId;
      
      const success = await removeFromWishlistAPI(idToUse);
      if (success) {
        // Find the item to get its MongoDB _id for proper comparison
        const itemToRemove = wishlistItems.find(item => 
          item.id === productId || item._id === productId || item.productId === productId
        );
        
        // Update local state using the found item's ID
        if (itemToRemove) {
          setWishlistItems(prev => prev.filter(item => 
            item._id !== itemToRemove._id && 
            item.productId !== itemToRemove.productId && 
            item.id !== itemToRemove.id
          ));
        } else {
          // Fallback: remove by any matching ID
          setWishlistItems(prev => prev.filter(item => 
            item.id !== productId && 
            item._id !== productId && 
            item.productId !== productId
          ));
        }
        
        // Update navbar wishlist count if function exists
        if (window.updateWishlistCount) {
          window.updateWishlistCount();
        }
        
        // Show success message
        if (productName) {
          toast.success(`${productName} removed from wishlist`);
        }
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Add single item to cart - FIXED VERSION
  const moveToCart = async (item) => {
    if (!item) return;
    
    const { id, _id, productId, name } = item;
    
    // Determine which ID to use for cart API
    const cartProductId = _id || productId || id;
    
    if (!cartProductId) {
      toast.error('Product ID not found');
      return;
    }
    
    setAddingToCart(prev => ({ ...prev, [cartProductId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        return;
      }

      const result = await addToCartAPI(cartProductId, 1);
      
      if (result.success) {
        toast.success(`${name} added to cart`);
        
        // Remove from wishlist after adding to cart
        // Try multiple ID formats to ensure removal
        try {
          await removeFromWishlistAPI(_id || cartProductId);
          
          // Update local state immediately
          setWishlistItems(prev => prev.filter(wishlistItem => 
            wishlistItem._id !== _id && 
            wishlistItem.productId !== productId && 
            wishlistItem.id !== id
          ));
          
          // Force refresh the wishlist data to ensure sync
          setTimeout(() => {
            fetchWishlist();
          }, 100);
          
        } catch (wishlistError) {
          console.error('Error removing from wishlist:', wishlistError);
          // Still remove from local state even if API call fails
          setWishlistItems(prev => prev.filter(wishlistItem => 
            wishlistItem._id !== _id && 
            wishlistItem.productId !== productId && 
            wishlistItem.id !== id
          ));
        }
        
        // Update navbar wishlist count
        if (window.updateWishlistCount) {
          window.updateWishlistCount();
        }
        
      } else {
        if (result.requiresLogin) {
          toast.error('Please login to add items to cart');
        } else {
          toast.error(result.message || 'Failed to add item to cart');
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [cartProductId]: false }));
    }
  };

  // Add all items to cart - FIXED VERSION
  const addAllToCart = async () => {
    if (wishlistItems.length === 0) return;
    
    setAddingAllToCart(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        setAddingAllToCart(false);
        return;
      }

      const inStockItems = wishlistItems.filter(item => item.inStock);
      
      if (inStockItems.length === 0) {
        toast.error('No items in stock to add to cart');
        setAddingAllToCart(false);
        return;
      }

      let successCount = 0;
      let failedCount = 0;
      const itemsToRemove = [];
      
      // Add each item to cart
      for (const item of inStockItems) {
        try {
          const cartProductId = item._id || item.productId || item.id;
          const result = await addToCartAPI(cartProductId, 1);
          
          if (result.success) {
            successCount++;
            itemsToRemove.push(item);
            
            // Remove from wishlist backend
            try {
              await removeFromWishlistAPI(item._id || cartProductId);
            } catch (wishlistError) {
              console.error(`Error removing ${item.name} from wishlist:`, wishlistError);
            }
          } else {
            failedCount++;
          }
        } catch (error) {
          failedCount++;
          console.error(`Error adding ${item.name} to cart:`, error);
        }
      }

      // Update local state by removing successfully added items
      if (itemsToRemove.length > 0) {
        const itemsToRemoveIds = itemsToRemove.map(item => item._id);
        setWishlistItems(prev => prev.filter(item => 
          !itemsToRemoveIds.includes(item._id)
        ));
      }

      // Show success message
      if (successCount > 0) {
        toast.success(`${successCount} item${successCount > 1 ? 's' : ''} added to cart`);
      }
      
      if (failedCount > 0) {
        toast.error(`${failedCount} item${failedCount > 1 ? 's' : ''} failed to add to cart`);
      }
      
      // Update navbar wishlist count
      if (window.updateWishlistCount) {
        window.updateWishlistCount();
      }
      
      // Refresh wishlist data
      setTimeout(() => {
        fetchWishlist();
      }, 100);
      
    } catch (error) {
      console.error('Error adding all to cart:', error);
      toast.error('Failed to add items to cart');
    } finally {
      setAddingAllToCart(false);
    }
  };

  // Clear all items
  const clearWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.delete(`${API_URL}/wishlist/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWishlistItems([]);
      toast.success('Wishlist cleared successfully');
      
      // Update navbar wishlist count
      if (window.updateWishlistCount) {
        window.updateWishlistCount();
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  // View cart
  const viewCart = () => {
    setIsWishlistOpen(false);
    navigate('/cart');
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  // Calculate total price
  const calculateTotal = () => {
    return wishlistItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', '')) || 0;
      return total + price;
    }, 0);
  };

  // Format price for display
  const formatPrice = (priceString) => {
    if (!priceString) return '$0.00';
    const price = parseFloat(priceString.replace('$', '')) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container px-6 py-12 mx-auto">
          <div className="py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-gray-200 rounded-full border-t-black animate-spin"></div>
            <p className="text-gray-500">Loading wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Wishlist Button in Navbar */}
      <button 
        className="relative"
        onClick={async () => {
          if (isLoggedIn()) {
            setIsWishlistOpen(true);
            // Refresh wishlist data when opening
            fetchWishlist();
          } else {
            toast.error('Please login to view your wishlist');
          }
        }}
      >
        <Heart className="w-5 h-5" />
        {wishlistItems.length > 0 && (
          <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-black rounded-full -top-2 -right-2">
            {wishlistItems.length}
          </span>
        )}
      </button>

      {/* Wishlist Side Panel */}
      <AnimatePresence>
        {isWishlistOpen && isLoggedIn() && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsWishlistOpen(false)}
            />

            {/* Wishlist Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 z-50 w-full h-full bg-white shadow-xl md:w-96"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-light">Wishlist</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="p-2 transition-colors rounded-full hover:bg-gray-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {wishlistItems.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={clearWishlist}
                      className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear all
                    </button>
                    {wishlistItems.some(item => item.inStock) && (
                      <button
                        onClick={addAllToCart}
                        disabled={addingAllToCart}
                        className="flex items-center ml-auto text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        {addingAllToCart ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Add all to cart
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist Items */}
              <div className="h-[calc(100vh-200px)] overflow-y-auto p-6">
                <AnimatePresence>
                  {error ? (
                    <div className="py-12 text-center">
                      <p className="mb-4 text-red-500">{error}</p>
                      <button
                        onClick={fetchWishlist}
                        className="px-6 py-3 mt-4 font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800"
                      >
                        Retry
                      </button>
                    </div>
                  ) : wishlistItems.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-12 text-center"
                    >
                      <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="mb-2 text-lg font-light">Your wishlist is empty</h3>
                      <p className="mb-6 text-sm text-gray-500">
                        Save your favorite items for later
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsWishlistOpen(false)}
                        className="px-6 py-3 font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800"
                      >
                        Continue Shopping
                      </motion.button>
                    </motion.div>
                  ) : (
                    wishlistItems.map((item, index) => (
                      <motion.div
                        key={item._id || item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 py-6 border-b border-gray-100 last:border-b-0"
                      >
                        {/* Product Image */}
                        <div className="relative flex-shrink-0 w-24 h-24">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-full h-full rounded-lg"
                          />
                          {!item.inStock && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80">
                              <span className="px-2 py-1 text-xs font-light bg-white rounded">Out of Stock</span>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="mb-1 text-sm font-light">{item.name}</h4>
                              <p className="mb-2 text-xs text-gray-500">{item.category}</p>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="font-light">{formatPrice(item.price)}</span>
                                {item.originalPrice && (
                                  <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(item.originalPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromWishlist(item._id, item.name)}
                              className="text-gray-400 hover:text-gray-600 h-fit"
                              disabled={addingToCart[item._id]}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            {item.inStock ? (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => moveToCart(item)}
                                  disabled={addingToCart[item._id]}
                                  className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-xs font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800 disabled:opacity-50"
                                >
                                  {addingToCart[item._id] ? (
                                    <>
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                      Adding...
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingBag className="w-3 h-3" />
                                      Add to Cart
                                    </>
                                  )}
                                </motion.button>
                              </>
                            ) : (
                              <button className="w-full px-4 py-2 text-xs font-light text-gray-400 border border-gray-200 cursor-not-allowed">
                                Notify When Available
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              {wishlistItems.length > 0 && (
                <div className="p-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm">Estimated total</span>
                    <span className="font-light">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addAllToCart}
                    disabled={addingAllToCart || !wishlistItems.some(item => item.inStock)}
                    className="flex items-center justify-center w-full gap-2 px-6 py-3 font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800 disabled:opacity-50"
                  >
                    {addingAllToCart ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding All...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Add All to Cart (${calculateTotal().toFixed(2)})
                      </>
                    )}
                  </motion.button>
                  <button
                    onClick={viewCart}
                    className="w-full px-6 py-3 mt-3 font-light tracking-wider transition-colors border border-black hover:bg-black hover:text-white"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="w-full px-6 py-3 mt-2 font-light tracking-wider transition-colors border border-gray-200 hover:border-gray-400"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Wishlist Page Component */}
      <div className="min-h-screen pt-20">
        <div className="container px-6 py-12 mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="mb-4 text-3xl font-light">My Wishlist</h1>
            <p className="text-gray-500">
              Save items you love for later and get notified when they're back in stock
            </p>
          </div>

          {!isLoggedIn() ? (
            <div className="py-20 text-center">
              <Heart className="w-16 h-16 mx-auto mb-6 text-gray-300" />
              <h3 className="mb-4 text-xl font-light">Please login to view your wishlist</h3>
              <p className="max-w-md mx-auto mb-8 text-gray-500">
                Sign in to access your saved items
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="inline-flex items-center px-8 py-3 font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800"
              >
                Sign In
                <ChevronRight className="w-4 h-4 ml-2" />
              </motion.button>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="mb-4 text-red-500">{error}</p>
              <button
                onClick={fetchWishlist}
                className="px-6 py-3 font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800"
              >
                Retry Loading Wishlist
              </button>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="py-20 text-center">
              <Heart className="w-16 h-16 mx-auto mb-6 text-gray-300" />
              <h3 className="mb-4 text-xl font-light">No items saved yet</h3>
              <p className="max-w-md mx-auto mb-8 text-gray-500">
                Start building your collection by saving your favorite products
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/shop')}
                className="inline-flex items-center px-8 py-3 font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800"
              >
                Browse Collections
                <ChevronRight className="w-4 h-4 ml-2" />
              </motion.button>
            </div>
          ) : (
            <>
              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-8 rounded-lg bg-gray-50">
                <div>
                  <span className="text-sm text-gray-500">{wishlistItems.length} items</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm font-light">Total: ${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={clearWishlist}
                    className="flex items-center text-sm font-light text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addAllToCart}
                    disabled={addingAllToCart || !wishlistItems.some(item => item.inStock)}
                    className="flex items-center px-6 py-2 font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800 disabled:opacity-50"
                  >
                    {addingAllToCart ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding All to Cart...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add All to Cart
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 lg:grid-cols-3">
                {wishlistItems.map((item) => (
                  <div key={item._id || item.id} className="group">
                    <div className="relative mb-4 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-64 transition-transform duration-500 rounded-lg group-hover:scale-105"
                      />
                      <button
                        onClick={() => removeFromWishlist(item._id, item.name)}
                        className="absolute p-2 transition-colors rounded-full top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                      {!item.inStock && (
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 text-xs font-light bg-white rounded">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-light">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-light">{formatPrice(item.price)}</span>
                        {item.inStock ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => moveToCart(item)}
                            disabled={addingToCart[item._id]}
                            className="flex items-center gap-1 text-sm font-light hover:text-gray-600 disabled:opacity-50"
                          >
                            {addingToCart[item._id] ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              <>
                                Add to Cart
                                <ChevronRight className="w-3 h-3" />
                              </>
                            )}
                          </motion.button>
                        ) : (
                          <button className="text-sm font-light text-gray-400 cursor-not-allowed">
                            Notify Me
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
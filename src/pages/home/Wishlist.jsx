import { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingBag, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Sacred Oud Eau de Parfum',
      category: 'Perfumes',
      price: '$189',
      originalPrice: '$220',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop',
      inStock: true,
    },
    {
      id: 2,
      name: 'Golden Saffron Elixir Serum',
      category: 'Skincare',
      price: '$145',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop',
      inStock: true,
    },
    {
      id: 3,
      name: 'Maroccan Argan Night Cream',
      category: 'Skincare',
      price: '$98',
      originalPrice: '$120',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1140&auto=format&fit=crop',
      inStock: false,
    },
    {
      id: 4,
      name: 'Rose Otto Face Oil',
      category: 'Skincare',
      price: '$165',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1140&auto=format&fit=crop',
      inStock: true,
    },
  ]);

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Remove item from wishlist
  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  // Move to cart
  const moveToCart = (id) => {
    // In a real app, you would add to cart here
    alert(`Added item ${id} to cart`);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(id);
  };

  // Clear all items
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <>
      {/* Wishlist Button in Navbar - Add this to your existing navbar */}
      <button 
        className="relative"
        onClick={() => setIsWishlistOpen(true)}
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
        {isWishlistOpen && (
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
                  <button
                    onClick={clearWishlist}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear all items
                  </button>
                )}
              </div>

              {/* Wishlist Items */}
              <div className="h-[calc(100vh-200px)] overflow-y-auto p-6">
                <AnimatePresence>
                  {wishlistItems.length === 0 ? (
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
                        key={item.id}
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
                            className="object-cover w-full h-full"
                          />
                          {!item.inStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                              <span className="px-2 py-1 text-xs font-light bg-white">Out of Stock</span>
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
                                <span className="font-light">{item.price}</span>
                                {item.originalPrice && (
                                  <span className="text-sm text-gray-400 line-through">
                                    {item.originalPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className="text-gray-400 hover:text-gray-600 h-fit"
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
                                  onClick={() => moveToCart(item.id)}
                                  className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-xs font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800"
                                >
                                  <ShoppingBag className="w-3 h-3" />
                                  Add to Cart
                                </motion.button>
                                <button className="px-3 py-2 transition-colors border border-gray-200 hover:border-gray-400">
                                  <Heart className="w-4 h-4 fill-current" />
                                </button>
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
                      ${wishlistItems.reduce((sum, item) => {
                        const price = parseInt(item.price.replace('$', ''));
                        return sum + price;
                      }, 0)}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Add all items to cart
                      wishlistItems.forEach(item => moveToCart(item.id));
                    }}
                    className="flex items-center justify-center w-full gap-2 px-6 py-3 font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add All to Cart
                  </motion.button>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="w-full px-6 py-3 mt-3 font-light tracking-wider transition-colors border border-gray-200 hover:border-gray-400"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Or if you want a separate Wishlist page component: */}
      <div className="min-h-screen pt-20">
        <div className="container px-6 py-12 mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="mb-4 text-3xl font-light">My Wishlist</h1>
            <p className="text-gray-500">
              Save items you love for later and get notified when they're back in stock
            </p>
          </div>

          {/* Wishlist Grid */}
          {wishlistItems.length === 0 ? (
            <div className="py-20 text-center">
              <Heart className="w-16 h-16 mx-auto mb-6 text-gray-300" />
              <h3 className="mb-4 text-xl font-light">No items saved yet</h3>
              <p className="max-w-md mx-auto mb-8 text-gray-500">
                Start building your collection by saving your favorite products
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-8 py-3 font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800"
              >
                Browse Collections
                <ChevronRight className="w-4 h-4 ml-2" />
              </motion.button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 lg:grid-cols-3">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="group">
                    <div className="relative mb-4 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute p-2 transition-colors rounded-full top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                      {!item.inStock && (
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 text-xs font-light bg-white">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-light">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-light">{item.price}</span>
                        {item.inStock ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => moveToCart(item.id)}
                            className="flex items-center gap-1 text-sm font-light hover:text-gray-600"
                          >
                            Add to Cart
                            <ChevronRight className="w-3 h-3" />
                          </motion.button>
                        ) : (
                          <button className="text-sm font-light text-gray-400">
                            Notify Me
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bulk Actions */}
              <div className="flex flex-wrap justify-between gap-4 pt-8 border-t border-gray-100">
                <button
                  onClick={clearWishlist}
                  className="flex items-center text-sm font-light text-gray-500 hover:text-gray-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Items
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    wishlistItems.forEach(item => moveToCart(item.id));
                  }}
                  className="flex items-center px-8 py-3 font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add All to Cart
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
// src/components/CartCard.jsx
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, Heart, Star, Check } from "lucide-react";
import { useState } from "react";

const CartCard = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  onMoveToWishlist,
  index = 0 
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);

  // Calculate item total
  const itemTotal = (item.price * item.quantity).toFixed(2);
  
  // Calculate savings if original price exists
  const savings = item.originalPrice 
    ? ((item.originalPrice - item.price) * item.quantity).toFixed(2)
    : 0;
  
  // Calculate percentage savings
  const savingsPercentage = item.originalPrice 
    ? (((item.originalPrice - item.price) / item.originalPrice) * 100).toFixed(0)
    : 0;

  // Handle quantity increase
  const handleIncreaseQuantity = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.id, item.quantity + 1);
    } catch (error) {
      console.error("Error increasing quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = async () => {
    if (item.quantity <= 1 || isUpdating) return;
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.id, item.quantity - 1);
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle remove item
  const handleRemove = async () => {
    if (isRemoving) return;
    if (window.confirm(`Remove ${item.name} from cart?`)) {
      setIsRemoving(true);
      try {
        await onRemove(item.id);
      } catch (error) {
        console.error("Error removing item:", error);
      } finally {
        setIsRemoving(false);
      }
    }
  };

  // Handle move to wishlist
  const handleMoveToWishlist = async () => {
    if (isWishlisting) return;
    setIsWishlisting(true);
    try {
      await onMoveToWishlist(item.id);
    } catch (error) {
      console.error("Error moving to wishlist:", error);
    } finally {
      setIsWishlisting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 transition-all duration-300 border border-gray-100 rounded-lg group hover:shadow-sm hover:border-gray-200"
    >
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Product Image */}
        <div className="relative flex-shrink-0">
          <div className="relative w-32 h-32 overflow-hidden rounded-lg bg-gray-50">
            <img
              src={item.image || "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop"}
              alt={item.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop";
              }}
            />
            
            {/* Badges */}
            <div className="absolute flex flex-col gap-1 top-2 left-2">
              {item.isNew && (
                <span className="px-2 py-1 text-xs font-light text-white bg-black rounded">
                  NEW
                </span>
              )}
              {item.isBestSeller && (
                <span className="flex items-center gap-1 px-2 py-1 text-xs font-light text-black border rounded bg-amber-50 border-amber-200">
                  <Star className="w-3 h-3 fill-current" />
                  Best Seller
                </span>
              )}
              {!item.inStock && (
                <span className="px-2 py-1 text-xs font-light text-gray-600 rounded bg-white/90 backdrop-blur-sm">
                  Out of Stock
                </span>
              )}
              {item.originalPrice && savings > 0 && (
                <span className="px-2 py-1 text-xs font-light text-white bg-red-500 rounded">
                  Save {savingsPercentage}%
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          {item.inStock && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Check className="w-3 h-3 text-green-500" />
              <span>In Stock</span>
            </div>
          )}
          
          {!item.inStock && (
            <div className="flex items-center gap-1 mt-2 text-xs text-red-500">
              <span>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex flex-col justify-between h-full">
            {/* Top Row */}
            <div className="flex-1">
              <div className="mb-1 text-xs font-light tracking-wider text-gray-500 uppercase">
                {item.category || 'Uncategorized'}
              </div>
              
              <h3 className="mb-2 text-lg font-light leading-tight text-gray-900">
                {item.name}
              </h3>
              
              {/* Rating */}
              {item.rating && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(item.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">{item.rating.toFixed(1)}</span>
                  {item.reviewCount && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {item.reviewCount} review{item.reviewCount !== 1 ? 's' : ''}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-light text-gray-900">
                    ${item.price.toFixed(2)}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                      <span className="px-1.5 py-0.5 text-xs font-light text-red-600 bg-red-50 rounded">
                        Save ${(item.originalPrice - item.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
                {item.originalPrice && item.originalPrice > item.price && (
                  <div className="mt-1 text-xs text-gray-500">
                    You save {savingsPercentage}% ({savings > 0 ? `$${savings}` : ''})
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row - Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Quantity Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={handleDecreaseQuantity}
                    disabled={item.quantity <= 1 || isUpdating || !item.inStock}
                    className={`p-2 transition-colors ${
                      item.quantity <= 1 || isUpdating || !item.inStock 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'hover:bg-gray-50'
                    }`}
                    aria-label="Decrease quantity"
                  >
                    {isUpdating ? (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-gray-600 animate-spin"></div>
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                  </button>
                  <span className={`px-4 py-2 text-sm font-light min-w-[3rem] text-center ${
                    !item.inStock ? 'text-gray-400' : 'text-gray-900'
                  }`}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={handleIncreaseQuantity}
                    disabled={isUpdating || !item.inStock}
                    className={`p-2 transition-colors ${
                      isUpdating || !item.inStock 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'hover:bg-gray-50'
                    }`}
                    aria-label="Increase quantity"
                  >
                    {isUpdating ? (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-gray-600 animate-spin"></div>
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-sm text-gray-600">
                  <span className="font-light">
                    ${itemTotal}
                  </span>
                  <div className="text-xs text-gray-400">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMoveToWishlist}
                  disabled={isWishlisting || !item.inStock}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-light transition-all border rounded-lg ${
                    isWishlisting
                      ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                      : item.inStock
                      ? 'text-gray-600 border-gray-200 hover:border-gray-300 hover:text-black'
                      : 'text-gray-400 border-gray-200 cursor-not-allowed'
                  } group/btn`}
                  title={item.inStock ? "Save for later" : "Out of stock"}
                >
                  {isWishlisting ? (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-gray-600 animate-spin"></div>
                  ) : (
                    <Heart className="w-4 h-4 group-hover/btn:fill-red-50" />
                  )}
                  <span className="hidden sm:inline">Save</span>
                </button>
                
                <button
                  onClick={handleRemove}
                  disabled={isRemoving}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-light transition-all border rounded-lg ${
                    isRemoving
                      ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'text-gray-600 border-gray-200 hover:border-red-200 hover:text-red-600'
                  }`}
                  title="Remove item"
                >
                  {isRemoving ? (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-gray-600 animate-spin"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      {item.freeShipping && item.quantity >= 2 && (
        <div className="flex items-center gap-2 p-3 mt-4 text-sm text-green-600 rounded-lg bg-green-50">
          <Check className="w-4 h-4" />
          <span>Free shipping unlocked with 2+ items!</span>
        </div>
      )}

      {/* Stock Warning */}
      {item.inStock && item.stock && item.stock < 5 && (
        <div className="flex items-center gap-2 p-3 mt-4 text-sm rounded-lg text-amber-600 bg-amber-50">
          <span>Low stock! Only {item.stock} left</span>
        </div>
      )}

      {/* Out of Stock Message */}
      {!item.inStock && (
        <div className="flex items-center gap-2 p-3 mt-4 text-sm text-red-600 rounded-lg bg-red-50">
          <span>This item is out of stock. Remove it to continue.</span>
        </div>
      )}
    </motion.div>
  );
};

export default CartCard;
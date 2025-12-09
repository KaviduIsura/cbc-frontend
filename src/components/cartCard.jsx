import { motion } from "framer-motion";
import { Trash2, Plus, Minus, Heart, Star, Check } from "lucide-react";

const CartCard = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  onMoveToWishlist,
  index = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 transition-shadow duration-300 border border-gray-100 rounded-lg group hover:shadow-sm"
    >
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Product Image */}
        <div className="relative flex-shrink-0">
          <div className="relative w-32 h-32 overflow-hidden rounded-lg bg-gray-50">
            <img
              src={item.image}
              alt={item.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
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
              {item.inStock === false && (
                <span className="px-2 py-1 text-xs font-light text-gray-600 rounded bg-white/90 backdrop-blur-sm">
                  Out of Stock
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
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex flex-col justify-between h-full">
            {/* Top Row */}
            <div className="flex-1">
              <div className="mb-1 text-xs font-light tracking-wider text-gray-500">
                {item.category}
              </div>
              
              <h3 className="mb-2 text-lg font-light leading-tight">
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
                  <span className="text-xs text-gray-500">{item.rating}</span>
                </div>
              )}

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-light">
                    ${item.price.toFixed(2)}
                  </span>
                  {item.originalPrice && (
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
                {item.originalPrice && (
                  <div className="mt-1 text-xs text-gray-500">
                    You save {(((item.originalPrice - item.price) / item.originalPrice) * 100).toFixed(0)}%
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
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-2 transition-colors hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-light min-w-[3rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-2 transition-colors hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-sm text-gray-600">
                  <span className="font-light">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <div className="text-xs text-gray-400">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onMoveToWishlist(item.id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-light text-gray-600 transition-all border border-gray-200 rounded-lg hover:border-gray-300 hover:text-black group/btn"
                  title="Save for later"
                >
                  <Heart className="w-4 h-4 group-hover/btn:fill-red-50" />
                  <span className="hidden sm:inline">Save</span>
                </button>
                
                <button
                  onClick={() => onRemove(item.id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-light text-gray-600 transition-all border border-gray-200 rounded-lg hover:border-red-200 hover:text-red-600"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
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
    </motion.div>
  );
};

export default CartCard;
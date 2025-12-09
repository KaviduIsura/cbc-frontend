import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, index }) => {
  const [isLiked, setIsLiked] = useState(false);

  // Format price
  const formatPrice = (price) => {
    if (!price) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Handle wishlist click
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add cart logic here
    console.log('Add to cart:', product);
  };

  return (
    <Link to={`/product/${product._id || product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: (index % 12) * 0.1 }}
        className="relative block group"
      >
        {/* Badges */}
        <div className="absolute z-10 flex gap-2 top-4 left-4">
          {product.isNew && (
            <span className="px-3 py-1 text-xs font-light tracking-wide bg-white rounded-full shadow-sm">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-3 py-1 text-xs font-light text-white bg-black rounded-full">
              BESTSELLER
            </span>
          )}
        </div>

        <button 
          onClick={handleWishlistClick}
          className="absolute z-10 transition-opacity opacity-0 top-4 right-4 group-hover:opacity-100"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Image */}
        <div className="mb-4 overflow-hidden rounded-lg aspect-square bg-gray-50">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop'}
            alt={product.name || product.productName}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <p className="text-xs font-light tracking-wide text-gray-500">
            {product.category || 'Skincare'}
          </p>
          <h3 className="text-lg font-light transition-colors hover:text-gray-600">
            {product.name || product.productName || 'Product Name'}
          </h3>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating || 4.5)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-gray-600">
                {product.rating?.toFixed(1) || '4.5'}
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-sm font-light text-gray-500">
              {product.reviewCount || Math.floor(Math.random() * 100)} reviews
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-light">
              {formatPrice(product.lastPrice || product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}

          <button 
            onClick={handleAddToCart}
            className="w-full py-3 mt-4 font-light tracking-wider text-black transition-all border border-black rounded-lg hover:bg-black hover:text-white"
          >
            Add to Ritual
          </button>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
// src/components/ProductCard.jsx
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addToCartAPI } from '../utils/cartApi';

const ProductCard = ({ product, index }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageErrorCount, setImageErrorCount] = useState(0);
  const [currentImage, setCurrentImage] = useState('');
  const imgRef = useRef(null);
  const navigate = useNavigate();

  // Determine the product ID for routing and cart
  const productId = product._id || product.productId || product.id;

  // Initial image source
  const initialImage = product.image || product.images?.[0] || 'https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png';

  // Placeholder image
  const placeholderImage = 'https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png';

  // Initialize current image
  useEffect(() => {
    setCurrentImage(initialImage);
  }, [initialImage]);

  // Handle image error with retry logic
  const handleImageError = (e) => {
    console.log(`Image error count: ${imageErrorCount + 1} for product: ${productId}`);
    
    if (imageErrorCount < 2) {
      // Try reloading the image
      setImageErrorCount(prev => prev + 1);
      
      // Create a new image object to force reload
      const img = new Image();
      img.onload = () => {
        // If the image loads successfully on retry, update the source
        if (imgRef.current) {
          imgRef.current.src = currentImage;
        }
      };
      img.onerror = () => {
        // If retry fails, fall back to placeholder
        if (imageErrorCount >= 1) { // After 2 attempts
          console.log(`Failed to load image after ${imageErrorCount + 1} attempts, using placeholder`);
          setCurrentImage(placeholderImage);
        }
      };
      img.src = currentImage + (currentImage.includes('?') ? '&' : '?') + `t=${Date.now()}`;
    } else {
      // After 3 failed attempts, use placeholder
      console.log('Max retry attempts reached, using placeholder image');
      setCurrentImage(placeholderImage);
    }
  };

  // Format price
  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0.00';
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(numPrice);
  };

  // Handle wishlist toggle
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    
    // Save to localStorage for now
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!isLiked) {
      wishlist.push({
        id: productId,
        name: product.name || product.productName,
        price: product.lastPrice || product.price,
        image: currentImage, // Use current image
        category: product.category
      });
      toast.success('Added to wishlist');
    } else {
      const updatedWishlist = wishlist.filter(item => item.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      toast.success('Removed from wishlist');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  // Handle add to cart with API
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!productId) {
      toast.error('Product ID not found');
      return;
    }
    
    setIsAddingToCart(true);
    
    try {
      const result = await addToCartAPI(productId, 1);
      
      if (result.success) {
        toast.success(result.message || 'Item added to cart successfully');
        // Optionally update global cart state here
      } else {
        if (result.requiresLogin) {
          toast.error('Please login to add items to cart');
          // You can redirect to login or show login modal
          // navigate('/login');
        } else {
          toast.error(result.message || 'Failed to add item to cart');
        }
      }
    } catch (error) {
      toast.error('An error occurred while adding to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Reset image error count when product changes
  useEffect(() => {
    setImageErrorCount(0);
    setCurrentImage(initialImage);
  }, [product._id, initialImage]);

  // If no product ID, render non-clickable card
  if (!productId) {
    return (
      <div className="relative block group">
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

        {/* Image */}
        <div className="mb-4 overflow-hidden rounded-lg aspect-square bg-gray-50">
          <img
            ref={imgRef}
            src={currentImage}
            alt={product.name || product.productName}
            className="object-cover w-full h-full"
            onError={handleImageError}
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <p className="text-xs font-light tracking-wide text-gray-500">
            {product.category || 'Skincare'}
          </p>
          <h3 className="text-lg font-light">
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
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-light">
              {formatPrice(product.lastPrice || product.price)}
            </span>
            {product.originalPrice && product.originalPrice > (product.lastPrice || product.price) && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`w-full py-3 mt-4 font-light tracking-wider text-black transition-all border border-black rounded-lg hover:bg-black hover:text-white ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAddingToCart ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : (
              'Add to Ritual'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Normal clickable card
  return (
    <Link to={`/product/${productId}`}>
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

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlistClick}
          className="absolute z-10 transition-opacity opacity-0 top-4 right-4 group-hover:opacity-100"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Image */}
        <div className="mb-4 overflow-hidden rounded-lg aspect-square bg-gray-50">
          <motion.img
            ref={imgRef}
            src={currentImage}
            alt={product.name || product.productName}
            className="object-cover w-full h-full"
            onError={handleImageError}
            loading="lazy"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <p className="text-xs font-light tracking-wide text-gray-500 uppercase">
            {product.category || 'Skincare'}
          </p>
          <h3 className="text-lg font-light transition-colors group-hover:text-gray-600">
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
              {product.reviewCount || 87} reviews
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-light">
              {formatPrice(product.lastPrice || product.price)}
            </span>
            {product.originalPrice && product.originalPrice > (product.lastPrice || product.price) && (
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
            disabled={isAddingToCart}
            className={`w-full py-3 mt-4 font-light tracking-wider text-black transition-all border border-black rounded-lg hover:bg-black hover:text-white ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAddingToCart ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : (
              'Add to Ritual'
            )}
          </button>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
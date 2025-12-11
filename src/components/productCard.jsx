// src/components/ProductCard.jsx
import { motion } from 'framer-motion';
import { Heart, Star, MessageSquare, User, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addToCartAPI } from '../utils/cartApi';
import { 
  addToWishlist, 
  removeFromWishlistAPI, 
  checkInWishlist 
} from '../utils/wishlist'; // Create this utility file
import axios from 'axios';

const ProductCard = ({ product, index, refreshWishlist }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageErrorCount, setImageErrorCount] = useState(0);
  const [currentImage, setCurrentImage] = useState('');
  const [showReviews, setShowReviews] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [averageRating, setAverageRating] = useState(product.rating || 0);
  const [reviewCount, setReviewCount] = useState(product.reviewCount || 0);
  const [ratingDistribution, setRatingDistribution] = useState({});
  
  const imgRef = useRef(null);
  const navigate = useNavigate();

  // Determine the product ID for routing and cart
  const productId = product._id || product.productId || product.id;

  // Initial image source
  const initialImage = product.image || product.images?.[0] || 'https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png';

  // Placeholder image
  const placeholderImage = 'https://nftcalendar.io/storage/uploads/2022/02/21/image-not-found_0221202211372462137974b6c1a.png';

  // Initialize current image and check wishlist status
  useEffect(() => {
    setCurrentImage(initialImage);
    setAverageRating(product.rating || 0);
    setReviewCount(product.reviewCount || 0);
    
    // Check if product is in wishlist on component mount
    if (productId) {
      checkWishlistStatus();
    }
  }, [initialImage, product.rating, product.reviewCount, productId]);

  // Check if product is in wishlist
  const checkWishlistStatus = async () => {
    if (!productId) return;
    
    try {
      const result = await checkInWishlist(productId);
      setIsLiked(result.isInWishlist || false);
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  // Fetch reviews when showReviews is true
  useEffect(() => {
    if (showReviews && productId && productReviews.length === 0) {
      fetchProductReviews();
    }
  }, [showReviews, productId]);

  // Fetch product reviews
  const fetchProductReviews = async () => {
    if (!productId) return;
    
    setLoadingReviews(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/product/${productId}`,
        { params: { limit: 3 } } // Get only 3 latest reviews for card
      );
      
      if (response.data.success) {
        setProductReviews(response.data.reviews);
        setRatingDistribution(response.data.ratingDistribution);
        setAverageRating(parseFloat(response.data.averageRating));
        setReviewCount(response.data.totalReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Calculate rating percentage
  const calculateRatingPercentage = (rating) => {
    if (reviewCount === 0) return 0;
    const count = ratingDistribution[rating] || 0;
    return Math.round((count / reviewCount) * 100);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!productId) {
      toast.error('Product not found');
      return;
    }
    
    setIsWishlistLoading(true);
    
    try {
      if (isLiked) {
        // Remove from wishlist
        const success = await removeFromWishlistAPI(productId);
        if (success) {
          setIsLiked(false);
          toast.success('Removed from wishlist');
          
          // Call refresh callback if provided
          if (refreshWishlist) {
            refreshWishlist();
          }
        } else {
          toast.error('Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist
        const success = await addToWishlist(productId);
        if (success) {
          setIsLiked(true);
          toast.success('Added to wishlist');
          
          // Call refresh callback if provided
          if (refreshWishlist) {
            refreshWishlist();
          }
        }
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error(error.message || 'Failed to update wishlist');
    } finally {
      setIsWishlistLoading(false);
    }
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

  // Toggle reviews display
  const toggleReviews = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowReviews(!showReviews);
  };

  // Reset image error count when product changes
  useEffect(() => {
    setImageErrorCount(0);
    setCurrentImage(initialImage);
  }, [product._id, initialImage]);

  // Create a new file: src/utils/wishlistApi.js
  // Add this utility functions file

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

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : averageRating > i && averageRating < i + 1
                      ? "fill-yellow-400 text-yellow-400 opacity-50"
                      : "text-gray-200"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-gray-600">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <button
              onClick={toggleReviews}
              className="text-sm font-light text-gray-500 transition-colors hover:text-black"
            >
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </button>
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
    <div className="relative group">
      <Link to={`/product/${productId}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (index % 12) * 0.1 }}
          className="relative block"
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
            disabled={isWishlistLoading}
            className="absolute z-10 transition-opacity opacity-0 top-4 right-4 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isWishlistLoading ? (
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <Heart className={`w-5 h-5 transition-colors ${
                isLiked 
                  ? 'fill-red-500 text-red-500 hover:fill-red-600 hover:text-red-600' 
                  : 'text-gray-600 hover:text-red-500'
              }`} />
            )}
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

            {/* Rating Section */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : averageRating > i && averageRating < i + 1
                        ? "fill-yellow-400 text-yellow-400 opacity-50"
                        : "text-gray-200"
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm text-gray-600">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-300">•</span>
              <button
                onClick={toggleReviews}
                className="flex items-center gap-1 text-sm font-light text-gray-500 transition-colors hover:text-black"
              >
                <MessageSquare className="w-3 h-3" />
                {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
              </button>
            </div>

            {/* Price */}
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

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`w-full py-3 mt-4 font-light tracking-wider text-black transition-all border border-black rounded-lg hover:bg-black hover:text-white ${
                isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isAddingToCart ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </span>
              ) : (
                'Add to Ritual'
              )}
            </button>
          </div>
        </motion.div>
      </Link>

      {/* Reviews Popup */}
      {showReviews && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl top-full">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
              </div>
              <button
                onClick={toggleReviews}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Rating Distribution */}
            {reviewCount > 0 && (
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium">Rating Breakdown</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="flex items-center w-8 gap-1">
                        <span className="text-xs">{rating}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1 h-2 overflow-hidden bg-gray-100 rounded-full">
                        <div 
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${calculateRatingPercentage(rating)}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-xs text-right text-gray-500">
                        {calculateRatingPercentage(rating)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div>
              <h4 className="mb-2 text-sm font-medium">Latest Reviews</h4>
              {loadingReviews ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full border-t-black animate-spin"></div>
                </div>
              ) : productReviews.length === 0 ? (
                <div className="py-4 text-center">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">No reviews yet</p>
                  <p className="mt-1 text-xs text-gray-400">Be the first to review this product!</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-60">
                  {productReviews.map((review) => (
                    <div key={review._id} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 text-xs text-white bg-gray-800 rounded-full">
                            <User className="w-3 h-3" />
                          </div>
                          <span className="text-sm font-medium">{review.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{review.review}</p>
                      <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* View All Reviews Link */}
            {reviewCount > 0 && (
              <div className="pt-3 mt-4 border-t border-gray-100">
                <Link
                  to={`/product/${productId}`}
                  className="block w-full py-2 text-sm font-medium text-center text-black transition-colors border border-black rounded-lg hover:bg-black hover:text-white"
                  onClick={() => setShowReviews(false)}
                >
                  View All Reviews
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
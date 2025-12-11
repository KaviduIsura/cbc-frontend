// src/home/productOverview.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Check, 
  Truck, 
  Shield, 
  RefreshCw,
  ChevronRight,
  Package,
  Sparkles,
  Minus,
  Plus,
  BookOpen,
  Users,
  Leaf,
  Loader,
  MessageSquare,
  User,
  Calendar,
  Edit,
  X,
  Send,
  ChevronLeft,
  ChevronDown,
  Clock,
  AlertCircle,
  Loader2
} from "lucide-react";
import { addToCartAPI } from "../../utils/cartApi";
import { 
  addToWishlist, 
  removeFromWishlistAPI, 
  checkInWishlist,
  getWishlistCount 
} from "../../utils/wishlist";

export default function ProductOverview() {
  const params = useParams();
  const productId = params.id;
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewPage, setReviewPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    review: "",
    userName: ""
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReviewStatus, setUserReviewStatus] = useState(null); // Track user's review status

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch wishlist count on component mount
  useEffect(() => {
    fetchWishlistCount();
  }, []);

  // Fetch wishlist count
  const fetchWishlistCount = async () => {
    try {
      const count = await getWishlistCount();
      setWishlistCount(count);
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  };

  // Transform backend product data
  const transformProductData = (backendProduct) => {
    if (backendProduct.variants && backendProduct.variants.length > 0) {
      return backendProduct;
    }
    
    const variants = [
      { 
        id: 1, 
        name: "Standard", 
        price: backendProduct.lastPrice || backendProduct.price,
        sku: backendProduct.productId || backendProduct._id 
      }
    ];
    
    return {
      ...backendProduct,
      variants,
      productName: backendProduct.productName || backendProduct.name,
      description: backendProduct.description || "",
      longDescription: backendProduct.detailedDescription || backendProduct.description || "",
      benefits: backendProduct.benefits || [],
      features: backendProduct.features || [],
      ingredients: backendProduct.ingredients || [],
      howToUse: backendProduct.howToUse || [
        "Apply as directed on packaging",
        "Use consistently for best results",
        "Store in a cool, dry place"
      ],
      shippingInfo: "Free shipping on orders over $75. Ships within 1-2 business days.",
      returnPolicy: "30-day return policy. Full refund if not satisfied.",
      inStock: backendProduct.stock > 0,
      images: backendProduct.images && backendProduct.images.length > 0 
        ? backendProduct.images 
        : ["https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop"]
    };
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setStatus("loading");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`
        );
        
        if (response.data.product) {
          const transformedProduct = transformProductData(response.data.product);
          setProduct(transformedProduct);
          setSelectedVariant(transformedProduct.variants[0]);
          setStatus("found");
          
          // Fetch reviews for this product
          fetchProductReviews(transformedProduct._id);
          
          // Check if user has already reviewed this product
          checkUserReviewStatus(transformedProduct._id);
          
          // Check if product is in wishlist
          checkWishlistStatus(transformedProduct._id);
        } else {
          setStatus("notFound");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product. Please try again.");
        setStatus("notFound");
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Check if product is in wishlist
  const checkWishlistStatus = async (productId) => {
    if (!productId) return;
    
    try {
      const result = await checkInWishlist(productId);
      setIsLiked(result.isInWishlist || false);
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  // Check user's review status for this product
  const checkUserReviewStatus = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // We need to check if user has already reviewed this product
      // We'll make a separate endpoint or modify existing one
      const userResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (userResponse.data.success) {
        const userEmail = userResponse.data.user.email;
        
        // Check if user has any review for this product
        const reviewCheck = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/reviews/user-check`,
          {
            params: { productId, email: userEmail },
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (reviewCheck.data.success) {
          setUserReviewStatus(reviewCheck.data.status); // 'none', 'pending', 'approved', 'rejected'
        }
      }
    } catch (error) {
      // Silent fail - user might not be logged in or endpoint might not exist
      console.log("User review check failed (might not be logged in):", error.message);
    }
  };

  // Fetch product reviews (only approved ones)
  const fetchProductReviews = async (productId, page = 1) => {
    setLoadingReviews(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews/product/${productId}`,
        { params: { page, limit: 5 } }
      );
      
      if (response.data.success) {
        setReviews(response.data.reviews);
        setRatingDistribution(response.data.ratingDistribution);
        setAverageRating(parseFloat(response.data.averageRating));
        setTotalReviews(response.data.totalReviews);
        setTotalReviewPages(response.data.pagination.totalPages);
        setReviewPage(page);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoadingReviews(false);
    }
  };

  // Handle review form changes
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle star rating selection
  const handleRatingSelect = (rating) => {
    setReviewForm(prev => ({
      ...prev,
      rating
    }));
  };

  // Submit review
  const submitReview = async () => {
    if (!product) return;
    
    if (!reviewForm.rating) {
      toast.error("Please select a rating");
      return;
    }
    
    if (!reviewForm.review.trim()) {
      toast.error("Please write a review");
      return;
    }
    
    if (!reviewForm.userName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login to submit a review");
        setShowReviewModal(false);
        // Optional: redirect to login
        // navigate('/login');
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/reviews`,
        {
          productId: product._id,
          rating: reviewForm.rating,
          review: reviewForm.review,
          userName: reviewForm.userName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Show pending approval message
        toast.success("Review submitted! It will appear after admin approval.");
        
        setReviewForm({
          rating: 0,
          review: "",
          userName: ""
        });
        setShowReviewModal(false);
        
        // Update user review status
        setUserReviewStatus('pending');
        
        // DO NOT refresh reviews or update ratings immediately
        // Reviews need admin approval first
        
        // Show a message to the user about pending status
        toast("Your review is pending admin approval", {
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.response?.status === 400) {
        const errorMsg = error.response.data.message;
        if (errorMsg.includes("already reviewed")) {
          toast.error("You have already reviewed this product");
          setUserReviewStatus('existing');
        } else {
          toast.error(errorMsg || "Failed to submit review");
        }
      } else if (error.response?.status === 403) {
        toast.error("Please login as customer to add reviews");
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product || !product._id) {
      toast.error('Product not found');
      return;
    }
    
    setIsWishlistLoading(true);
    
    try {
      if (isLiked) {
        // Remove from wishlist
        const success = await removeFromWishlistAPI(product._id);
        if (success) {
          setIsLiked(false);
          setWishlistCount(prev => Math.max(0, prev - 1));
          toast.success(`${product.productName} removed from wishlist`);
          
          // Update navbar wishlist count if function exists
          if (window.updateWishlistCount) {
            window.updateWishlistCount();
          }
        } else {
          toast.error('Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist
        const success = await addToWishlist(product._id);
        if (success) {
          setIsLiked(true);
          setWishlistCount(prev => prev + 1);
          toast.success(`${product.productName} added to wishlist`);
          
          // Update navbar wishlist count if function exists
          if (window.updateWishlistCount) {
            window.updateWishlistCount();
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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate rating percentage
  const calculateRatingPercentage = (rating) => {
    if (totalReviews === 0) return 0;
    const count = ratingDistribution[rating] || 0;
    return Math.round((count / totalReviews) * 100);
  };

  // Add to cart using API
  const addToCart = async () => {
    if (!product || !selectedVariant) return;
    
    setIsAddingToCart(true);
    
    try {
      // Use the product's MongoDB _id as productId
      const productId = product._id;
      
      const result = await addToCartAPI(productId, quantity);
      
      if (result.success) {
        toast.success(`${quantity} × ${product.productName} added to cart`);
        // Navigate to cart page
        navigate('/cart');
      } else {
        if (result.requiresLogin) {
          toast.error('Please login to add items to cart');
          // Optionally redirect to login
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

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Handle write review button click
  const handleWriteReviewClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to write a review");
      // Optional: redirect to login
      // navigate('/login');
      return;
    }

    // Check if user already has a pending or approved review
    if (userReviewStatus === 'pending') {
      toast.error("You already have a review pending approval");
      return;
    }
    
    if (userReviewStatus === 'approved') {
      toast.error("You have already reviewed this product");
      return;
    }
    
    if (userReviewStatus === 'rejected') {
      toast.error("Your previous review was rejected. Contact admin for more info.");
      return;
    }

    setShowReviewModal(true);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20 bg-white">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-300 rounded-full border-t-black animate-spin"></div>
          <p className="text-sm font-light text-gray-500">Loading formulation...</p>
        </div>
      </div>
    );
  }

  if (status === "notFound" || !product) {
    return (
      <div className="min-h-screen pt-20 bg-white">
        <div className="container px-6 py-20 mx-auto">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gray-50">
                <Sparkles className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-light">Product Not Found</h1>
            <p className="mb-8 text-gray-600">
              The product you're looking for doesn't exist or has been moved.
            </p>
            <Link
              to="/shop/all"
              className="inline-flex items-center px-6 py-3 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container px-6 py-4 mx-auto">
          <div className="flex items-center text-sm font-light text-gray-500">
            <Link to="/" className="transition-colors hover:text-gray-700">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/shop" className="transition-colors hover:text-gray-700">Shop</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to={`/shop/${product.category?.toLowerCase()}`} className="transition-colors hover:text-gray-700">
              {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Products'}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="max-w-xs text-gray-900 truncate">{product.productName}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative overflow-hidden aspect-square bg-gray-50 rounded-xl">
              <img
                src={product.images[selectedImage]}
                alt={product.productName}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop";
                }}
              />
              
              {/* Badges */}
              <div className="absolute flex flex-col gap-2 top-4 left-4">
                {product.isNew && (
                  <span className="px-3 py-1 text-xs font-light text-white bg-black rounded-full">
                    NEW
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="px-3 py-1 text-xs font-light border rounded-full bg-amber-50 text-amber-800 border-amber-200">
                    BESTSELLER
                  </span>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <span className="px-3 py-1 text-xs font-light text-white bg-red-500 rounded-full">
                    LOW STOCK
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="px-3 py-1 text-xs font-light text-white bg-gray-500 rounded-full">
                    OUT OF STOCK
                  </span>
                )}
              </div>
              
              {/* Like Button */}
              <button
                onClick={handleWishlistToggle}
                disabled={!product.inStock || isWishlistLoading}
                className="absolute p-2 transition-colors rounded-full top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
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
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden w-20 h-20 rounded-lg border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-black' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.productName} view ${index + 1}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Category and Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-light tracking-wider text-gray-500 uppercase">
                  {product.category || 'Product'}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                {product.inStock ? (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <Check className="w-4 h-4" />
                    <span>In Stock ({product.stock || 0} available)</span>
                  </div>
                ) : (
                  <span className="text-sm text-red-500">Out of Stock</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(averageRating) 
                          ? "fill-amber-400 text-amber-400" 
                          : i < averageRating
                          ? "fill-amber-400 text-amber-400 opacity-50"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {averageRating.toFixed(1)} ({totalReviews} reviews)
                </span>
              </div>
            </div>

            {/* Product Name */}
            <div>
              <h1 className="text-4xl font-light leading-tight text-gray-900">
                {product.productName}
              </h1>
              {product.altNames && product.altNames.length > 0 && (
                <p className="mt-2 text-lg font-light text-gray-500">
                  Also known as: {product.altNames.join(", ")}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-light">
                  ${selectedVariant.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > selectedVariant.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 text-sm font-light text-red-600 rounded bg-red-50">
                      Save ${(product.originalPrice - selectedVariant.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Short Description */}
            <div className="py-4 border-gray-100 border-y">
              <p className="leading-relaxed text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            <div>
              <h3 className="mb-3 text-sm font-light text-gray-500">Select Option</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={!product.inStock}
                    className={`px-4 py-3 border rounded-lg transition-all flex flex-col items-center justify-center min-w-[100px] ${
                      selectedVariant?.id === variant.id
                        ? "border-black bg-black text-white"
                        : product.inStock
                        ? "border-gray-200 hover:border-gray-400"
                        : "border-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-sm font-light">{variant.name}</div>
                    <div className="text-sm">${variant.price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-light text-gray-500">Quantity</h3>
                <div className="flex items-center border border-gray-200 rounded-lg w-fit">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1 || !product.inStock}
                    className={`p-3 transition-colors ${
                      quantity <= 1 || !product.inStock ? 'text-gray-300' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className={`px-6 py-3 text-lg font-light ${!product.inStock ? 'text-gray-400' : ''}`}>
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={!product.inStock}
                    className={`p-3 transition-colors ${!product.inStock ? 'text-gray-300' : 'hover:bg-gray-50'}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={product.inStock && !isAddingToCart ? { scale: 1.02 } : {}}
                  whileTap={product.inStock && !isAddingToCart ? { scale: 0.98 } : {}}
                  onClick={addToCart}
                  disabled={!product.inStock || isAddingToCart}
                  className={`flex items-center justify-center flex-1 gap-2 py-4 text-sm font-light tracking-wider text-white rounded-lg transition-colors ${
                    product.inStock && !isAddingToCart
                      ? 'bg-black hover:bg-gray-800' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isAddingToCart ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding...
                    </span>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      {product.inStock 
                        ? `Add to Ritual - $${(selectedVariant.price * quantity).toFixed(2)}`
                        : 'Out of Stock'
                      }
                    </>
                  )}
                </motion.button>
                
                <button
                  onClick={handleWishlistToggle}
                  disabled={!product.inStock || isWishlistLoading}
                  className={`p-4 border rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLiked 
                      ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' 
                      : product.inStock
                      ? 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                      : 'border-gray-100 text-gray-400'
                  }`}
                  title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isWishlistLoading ? (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  ) : (
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  )}
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 p-6 border border-gray-100 rounded-lg">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-light">Free Shipping</p>
                  <p className="text-xs text-gray-500">Over $75</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-light">Secure Checkout</p>
                  <p className="text-xs text-gray-500">Protected by SSL</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-light">30-Day Returns</p>
                  <p className="text-xs text-gray-500">Free & Easy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-light">Free Samples</p>
                  <p className="text-xs text-gray-500">With Every Order</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light">Customer Reviews</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating) 
                          ? "fill-amber-400 text-amber-400" 
                          : i < averageRating
                          ? "fill-amber-400 text-amber-400 opacity-50"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-lg font-light">{averageRating.toFixed(1)} out of 5</span>
                <span className="text-gray-500">({totalReviews} approved reviews)</span>
              </div>
              
              {/* Show user review status if logged in */}
              {userReviewStatus && userReviewStatus !== 'none' && (
                <div className="mt-3">
                  {userReviewStatus === 'pending' && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-sm text-yellow-700 bg-yellow-100 rounded-full">
                      <Clock className="w-3 h-3" />
                      Your review is pending approval
                    </div>
                  )}
                  {userReviewStatus === 'approved' && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                      <Check className="w-3 h-3" />
                      Your review has been approved
                    </div>
                  )}
                  {userReviewStatus === 'rejected' && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-sm text-red-700 bg-red-100 rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      Your review was not approved
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button
              onClick={handleWriteReviewClick}
              disabled={userReviewStatus === 'pending' || userReviewStatus === 'approved'}
              className={`px-6 py-3 text-sm font-light rounded-lg transition-colors flex items-center gap-2 ${
                userReviewStatus === 'pending' || userReviewStatus === 'approved'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              <Edit className="w-4 h-4" />
              {userReviewStatus === 'pending' ? 'Review Pending' :
               userReviewStatus === 'approved' ? 'Already Reviewed' :
               'Write a Review'}
            </button>
          </div>

          {/* Rating Distribution */}
          <div className="p-6 mb-8 border border-gray-100 rounded-lg">
            <h3 className="mb-4 text-sm font-light text-gray-500">Rating Breakdown (Approved Reviews Only)</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-14">
                    <span className="text-sm">{rating}</span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2 overflow-hidden bg-gray-100 rounded-full">
                    <div 
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${calculateRatingPercentage(rating)}%` }}
                    ></div>
                  </div>
                  <span className="w-10 text-sm text-right text-gray-500">
                    {calculateRatingPercentage(rating)}%
                  </span>
                  <span className="w-8 text-xs text-right text-gray-400">
                    ({ratingDistribution[rating] || 0})
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>Note: Only approved reviews are counted in the rating. Reviews are moderated to ensure quality.</p>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            <h3 className="text-lg font-light">Latest Approved Reviews</h3>
            
            {loadingReviews ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-12 text-center border border-gray-100 rounded-lg">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h4 className="mb-2 text-lg font-light">No Approved Reviews Yet</h4>
                <p className="text-gray-500">Be the first to share your thoughts about this product!</p>
                <p className="mt-2 text-sm text-gray-400">(Reviews require admin approval before appearing)</p>
                <button
                  onClick={handleWriteReviewClick}
                  className="px-6 py-3 mt-4 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
                >
                  Write the First Review
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="p-6 border border-gray-100 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 text-white bg-gray-800 rounded-full">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-light">{review.userName}</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating 
                                        ? "fill-amber-400 text-amber-400" 
                                        : "text-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatDate(review.createdAt)}
                              </span>
                              <span className="px-2 py-0.5 text-xs text-green-700 bg-green-100 rounded-full">
                                Approved
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.review}</p>
                    </div>
                  ))}
                </div>

                {/* Review Pagination */}
                {totalReviewPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => fetchProductReviews(product._id, reviewPage - 1)}
                      disabled={reviewPage === 1}
                      className={`p-2 rounded-lg transition-colors ${
                        reviewPage === 1 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalReviewPages) }, (_, i) => {
                        let pageNum;
                        if (totalReviewPages <= 5) {
                          pageNum = i + 1;
                        } else if (reviewPage <= 3) {
                          pageNum = i + 1;
                        } else if (reviewPage >= totalReviewPages - 2) {
                          pageNum = totalReviewPages - 4 + i;
                        } else {
                          pageNum = reviewPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => fetchProductReviews(product._id, pageNum)}
                            className={`w-10 h-10 flex items-center justify-center text-sm rounded-lg ${
                              reviewPage === pageNum
                                ? 'font-medium text-white bg-black'
                                : 'font-light text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => fetchProductReviews(product._id, reviewPage + 1)}
                      disabled={reviewPage === totalReviewPages}
                      className={`p-2 rounded-lg transition-colors ${
                        reviewPage === totalReviewPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 gap-12 mt-16 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8">
            {/* How to Use */}
            <div>
              <h2 className="flex items-center gap-2 mb-4 text-xl font-light">
                <BookOpen className="w-5 h-5" />
                How to Use
              </h2>
              <div className="p-6 border border-gray-100 rounded-lg">
                <ul className="space-y-3">
                  {product.howToUse.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 text-xs font-light bg-gray-100 rounded-full">
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 mb-4 text-xl font-light">
                  <Leaf className="w-5 h-5" />
                  Key Ingredients
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-2 text-sm font-light transition-colors border border-gray-200 rounded-lg cursor-default hover:border-gray-400"
                      title={ingredient}
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-light">Benefits</h2>
                <div className="space-y-3">
                  {product.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">
                        {benefit.charAt(0).toUpperCase() + benefit.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 mb-4 text-xl font-light">
                  <Users className="w-5 h-5" />
                  Our Promise
                </h2>
                <div className="space-y-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <span className="text-sm font-light text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping & Returns */}
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-light text-gray-500">Shipping</h3>
                <p className="text-sm text-gray-600">{product.shippingInfo}</p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-light text-gray-500">Returns</h3>
                <p className="text-sm text-gray-600">{product.returnPolicy}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-md bg-white shadow-xl rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-light">Write a Review</h3>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="p-2 transition-colors rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Product Info */}
                  <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                    <div className="w-16 h-16 overflow-hidden rounded-lg">
                      <img
                        src={product.images[0]}
                        alt={product.productName}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-light">{product.productName}</h4>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>

                  {/* Admin Approval Note */}
                  <div className="p-3 text-sm text-yellow-700 rounded-lg bg-yellow-50">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Note: Review requires admin approval</p>
                        <p className="mt-1 text-yellow-600">Your review will be visible on the product page only after it has been approved by our moderation team.</p>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block mb-3 text-sm font-light text-gray-500">
                      Your Rating *
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRatingSelect(rating)}
                          className="p-2 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              rating <= reviewForm.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block mb-2 text-sm font-light text-gray-500">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="userName"
                      value={reviewForm.userName}
                      onChange={handleReviewChange}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Review */}
                  <div>
                    <label className="block mb-2 text-sm font-light text-gray-500">
                      Your Review *
                    </label>
                    <textarea
                      name="review"
                      value={reviewForm.review}
                      onChange={handleReviewChange}
                      placeholder="Share your experience with this product..."
                      rows="4"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={submitReview}
                    disabled={submittingReview || !reviewForm.rating || !reviewForm.review.trim() || !reviewForm.userName.trim()}
                    className={`w-full py-4 text-sm font-light text-white rounded-lg transition-colors ${
                      submittingReview || !reviewForm.rating || !reviewForm.review.trim() || !reviewForm.userName.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-black hover:bg-gray-800'
                    }`}
                  >
                    {submittingReview ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      'Submit for Approval'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
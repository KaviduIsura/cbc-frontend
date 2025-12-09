import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
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
  Leaf
} from "lucide-react";

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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Dummy data for testing
  const dummyProduct = {
    id: productId || "1",
    _id: productId || "1",
    productId: "SKI002",
    productName: "Golden Saffron Elixir Serum",
    name: "Golden Saffron Elixir Serum",
    altNames: ["Saffron Glow Serum", "Luminous Elixir"],
    category: "Skincare",
    price: 220,
    lastPrice: 145,
    rating: 4.8,
    reviewCount: 89,
    description: "A luminous serum infused with precious saffron threads for radiant, glowing skin. This potent elixir combines ancient Ayurvedic wisdom with modern dermatological science to deliver transformative results. Formulated with 24K gold particles and hyaluronic acid for maximum hydration and luminosity.",
    longDescription: "The Golden Saffron Elixir Serum is a testament to our commitment to merging traditional beauty rituals with cutting-edge science. Each bottle contains over 10,000 hand-picked saffron stigmas, carefully extracted to preserve their antioxidant properties. This serum is clinically proven to increase skin hydration by 200% in just 30 days, while reducing the appearance of fine lines and hyperpigmentation.",
    ingredients: ["Pure Saffron Extract", "24K Gold Particles", "Hyaluronic Acid", "Vitamin C", "Niacinamide", "Rosehip Oil"],
    benefits: ["Brightening", "Anti-Aging", "Hydrating", "Soothing", "Even Skin Tone"],
    features: ["Vegan", "Cruelty-Free", "Sustainable Packaging", "Clean Formula"],
    images: [
      "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1140&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1140&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop"
    ],
    isNew: true,
    isBestSeller: true,
    inStock: true,
    variants: [
      { id: 1, name: "30ml", price: 145, sku: "SERUM-30" },
      { id: 2, name: "50ml", price: 220, sku: "SERUM-50" },
      { id: 3, name: "100ml", price: 380, sku: "SERUM-100" }
    ],
    shippingInfo: "Free shipping on orders over $75. Ships within 1-2 business days.",
    returnPolicy: "30-day return policy. Full refund if not satisfied.",
    howToUse: [
      "Apply 2-3 drops to cleansed face and neck",
      "Gently massage in upward motions",
      "Use morning and night for best results",
      "Follow with moisturizer"
    ]
  };

  useEffect(() => {
    // Simulate API call
    setStatus("loading");
    setTimeout(() => {
      // In a real app, you would fetch from API based on productId
      // For now, use dummy data
      setProduct(dummyProduct);
      setSelectedVariant(dummyProduct.variants[0]);
      setStatus("found");
    }, 500);
  }, [productId]);

  const addToCart = () => {
    const item = {
      id: product.id,
      name: product.productName,
      price: selectedVariant.price,
      variant: selectedVariant.name,
      quantity: quantity,
      image: product.images[0]
    };
    
    // Add to local storage or state management
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    toast.success(`${quantity} × ${product.productName} (${selectedVariant.name}) added to cart`);
    navigate('/cart');
  };

  const addToWishlist = () => {
    setIsLiked(!isLiked);
    toast.success(
      !isLiked 
        ? `${product.productName} added to wishlist` 
        : `${product.productName} removed from wishlist`
    );
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
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

  if (!product) {
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
            <Link to={`/shop/${product.category.toLowerCase()}`} className="transition-colors hover:text-gray-700">
              {product.category}
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
              </div>
              
              {/* Like Button */}
              <button
                onClick={addToWishlist}
                className="absolute p-2 transition-colors rounded-full top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
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
                  {product.category}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                {product.inStock ? (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <Check className="w-4 h-4" />
                    <span>In Stock</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Out of Stock</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.rating} ({product.reviewCount} reviews)
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
                {product.price > selectedVariant.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 text-sm font-light text-red-600 rounded bg-red-50">
                      Save ${(product.price - selectedVariant.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              {product.price > selectedVariant.price && (
                <p className="text-sm text-gray-500">
                  You save {(((product.price - selectedVariant.price) / product.price) * 100).toFixed(0)}%
                </p>
              )}
            </div>

            {/* Short Description */}
            <div className="py-4 border-gray-100 border-y">
              <p className="leading-relaxed text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            <div>
              <h3 className="mb-3 text-sm font-light text-gray-500">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-3 border rounded-lg transition-all flex flex-col items-center justify-center min-w-[100px] ${
                      selectedVariant?.id === variant.id
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-400"
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
                    disabled={quantity <= 1}
                    className={`p-3 transition-colors ${
                      quantity <= 1 ? 'text-gray-300' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 text-lg font-light">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="p-3 transition-colors hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addToCart}
                  className="flex items-center justify-center flex-1 gap-2 py-4 text-sm font-light tracking-wider text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Ritual - ${(selectedVariant.price * quantity).toFixed(2)}
                </motion.button>
                
                <button
                  onClick={addToWishlist}
                  className={`p-4 border rounded-lg transition-colors flex items-center justify-center ${
                    isLiked 
                      ? 'border-red-200 bg-red-50 text-red-600' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
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
            <div>
              <h2 className="flex items-center gap-2 mb-4 text-xl font-light">
                <Leaf className="w-5 h-5" />
                Key Ingredients
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient) => (
                  <span 
                    key={ingredient} 
                    className="px-3 py-2 text-sm font-light transition-colors border border-gray-200 rounded-lg cursor-default hover:border-gray-400"
                    title={ingredient}
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Benefits */}
            <div>
              <h2 className="mb-4 text-xl font-light">Benefits</h2>
              <div className="space-y-3">
                {product.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="flex items-center gap-2 mb-4 text-xl font-light">
                <Users className="w-5 h-5" />
                Our Promise
              </h2>
              <div className="space-y-3">
                {product.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <span className="text-sm font-light text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

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
    </div>
  );
}
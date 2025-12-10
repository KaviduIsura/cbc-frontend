// src/home/cart.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Shield,
  RefreshCw,
  ChevronRight,
  Heart,
  ArrowLeft,
  AlertTriangle,
  Package
} from "lucide-react";
import { Link } from "react-router-dom";
import CartCard from "../../components/cartCard";
import Modal from "../../components/Modal";
import { getCartAPI, updateCartItemAPI, removeCartItemAPI, clearCartAPI } from "../../utils/cartApi";
import toast from "react-hot-toast";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const result = await getCartAPI();
      
      if (result.success && result.cart) {
        setCart(result.cart);
        calculateTotals(result.cart);
      } else {
        // If user is not logged in or cart is empty
        setCart({ items: [], total: 0 });
        calculateTotals({ items: [], total: 0 });
      }
    } catch (error) {
      toast.error("Failed to load cart");
      setCart({ items: [], total: 0 });
      calculateTotals({ items: [], total: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = (cartData) => {
    const subtotal = cartData.total || 0;
    const shipping = subtotal > 75 ? 0 : 8.95;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    setSubtotal(subtotal);
    setShipping(shipping);
    setTax(tax);
    setTotal(total);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const result = await updateCartItemAPI(itemId, newQuantity);
      
      if (result.success) {
        setCart(result.cart);
        calculateTotals(result.cart);
        toast.success("Cart updated");
      } else {
        toast.error(result.message || "Failed to update cart");
      }
    } catch (error) {
      toast.error("Error updating cart");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const result = await removeCartItemAPI(itemId);
      
      if (result.success) {
        setCart(result.cart);
        calculateTotals(result.cart);
        toast.success("Item removed from cart");
      } else {
        toast.error(result.message || "Failed to remove item");
      }
    } catch (error) {
      toast.error("Error removing item");
    }
  };

  const moveToWishlist = (itemId) => {
    const item = cart.items.find(item => item._id === itemId);
    if (item) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      wishlist.push({
        id: item.productId?._id || item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category
      });
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      toast.success(`Moved ${item.name} to wishlist`);
      removeItem(itemId);
    }
  };

  const handleClearCartClick = () => {
    if (cart && cart.items.length > 0) {
      setShowClearCartModal(true);
    }
  };

  const handleClearCartConfirm = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setIsClearing(true);
      try {
        const result = await clearCartAPI();
        
        if (result.success) {
          setCart({ items: [], total: 0 });
          calculateTotals({ items: [], total: 0 });
          setShowClearCartModal(false);
          toast.success("Cart cleared");
        } else {
          toast.error(result.message || "Failed to clear cart");
        }
      } catch (error) {
        toast.error("Error clearing cart");
      } finally {
        setIsClearing(false);
      }
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    // Navigate to checkout or process payment
    // navigate('/checkout');
    toast.success("Proceeding to checkout...");
  };

  // Calculate cart summary
  const getCartSummary = () => {
    if (!cart || !cart.items) return null;
    
    const itemCount = cart.items.length;
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = subtotal;
    
    return { itemCount, totalItems, totalValue };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] pt-20">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-300 rounded-full border-t-black animate-spin"></div>
          <p className="text-sm font-light text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-white">
        <div className="container px-6 py-20 mx-auto">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gray-50">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-light">Your Cart is Empty</h1>
            <p className="mb-8 text-gray-600">
              Add some beautiful products to begin your ritual journey
            </p>
            <Link
              to="/shop/all"
              className="inline-flex items-center px-6 py-3 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cartSummary = getCartSummary();

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero */}
      <div className="py-12 bg-gray-50">
        <div className="container px-6 mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-light">Your Cart</h1>
              <p className="text-gray-600">
                {cartSummary.itemCount} item{cartSummary.itemCount !== 1 ? 's' : ''} • {cartSummary.totalItems} total items
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/shop/all"
                className="text-sm font-light text-gray-500 hover:text-black"
              >
                Continue Shopping →
              </Link>
              {cart.items.length > 0 && (
                <button
                  onClick={handleClearCartClick}
                  className="flex items-center gap-2 text-sm font-light text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cart.items.map((item, index) => (
                <CartCard
                  key={item._id}
                  item={{
                    id: item._id,
                    productId: item.productId?._id || item.productId,
                    name: item.name,
                    category: item.category,
                    price: item.price,
                    originalPrice: item.originalPrice,
                    lastPrice: item.lastPrice,
                    image: item.image,
                    quantity: item.quantity,
                    inStock: true,
                    rating: 4.5,
                    reviewCount: 87,
                    isNew: true,
                    isBestSeller: false
                  }}
                  index={index}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  onMoveToWishlist={moveToWishlist}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-36">
              <div className="p-6 border border-gray-100 rounded-lg">
                <h2 className="mb-6 text-xl font-light">Order Summary</h2>
                
                {/* Summary Items */}
                <div className="mb-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-light">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-light">
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-light">${tax.toFixed(2)}</span>
                  </div>
                  
                  {subtotal < 75 && (
                    <div className="p-3 text-sm text-center text-gray-600 rounded-lg bg-gray-50">
                      Add ${(75 - subtotal).toFixed(2)} more for free shipping
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="py-4 border-t border-b border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-lg">Total</span>
                    <div className="text-right">
                      <div className="text-2xl font-light">${total.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">USD</div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="py-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Free shipping over $75</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">30-day returns</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="flex items-center justify-center w-full px-6 py-3 text-sm font-light tracking-wider text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
                >
                  Proceed to Checkout
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>

                {/* Payment Methods */}
                <div className="mt-6">
                  <p className="mb-3 text-xs text-center text-gray-500">We accept</p>
                  <div className="flex justify-center gap-2">
                    {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'].map((method) => (
                      <div key={method} className="px-2 py-1 text-xs font-light text-gray-400 border border-gray-200 rounded">
                        {method}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-6 mt-6 border border-gray-100 rounded-lg">
                <h3 className="mb-4 text-lg font-light">Complete Your Ritual</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 transition-colors border border-gray-100 rounded-lg hover:border-gray-200">
                    <div className="w-12 h-12 bg-gray-100 rounded"></div>
                    <div className="flex-1">
                      <div className="text-sm font-light">Gua Sha Tool</div>
                      <div className="text-xs text-gray-500">$45.00</div>
                    </div>
                    <button className="px-3 py-1 text-xs font-light text-black border border-gray-300 rounded hover:border-black">
                      Add
                    </button>
                  </div>
                  <div className="flex items-center gap-3 p-3 transition-colors border border-gray-100 rounded-lg hover:border-gray-200">
                    <div className="w-12 h-12 bg-gray-100 rounded"></div>
                    <div className="flex-1">
                      <div className="text-sm font-light">Rose Water Mist</div>
                      <div className="text-xs text-gray-500">$32.00</div>
                    </div>
                    <button className="px-3 py-1 text-xs font-light text-black border border-gray-300 rounded hover:border-black">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <Modal
        isOpen={showClearCartModal}
        onClose={() => setShowClearCartModal(false)}
        onConfirm={handleClearCartConfirm}
        title="Clear Shopping Cart"
        confirmText="Clear All Items"
        cancelText="Keep Items"
        confirmColor="red"
        isLoading={isClearing}
        size="md"
      >
        <div className="space-y-6">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-red-50">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          {/* Cart Summary */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Items in cart:</span>
              <span className="font-medium">{cartSummary.itemCount}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total quantity:</span>
              <span className="font-medium">{cartSummary.totalItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Cart value:</span>
              <span className="font-medium">${cartSummary.totalValue.toFixed(2)}</span>
            </div>
          </div>

          {/* Warning Message */}
          <div className="p-4 text-sm text-gray-600 rounded-lg bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">This action cannot be undone</p>
                <p className="mt-1">All items will be permanently removed from your cart. You'll need to add items again if you change your mind.</p>
              </div>
            </div>
          </div>

          {/* Cart Preview */}
{/* Cart Preview */}
<div>
  <h4 className="mb-3 text-sm font-medium text-gray-700">Items that will be removed:</h4>
  <div className="space-y-2 overflow-y-auto max-h-48">
    {cart.items.slice(0, 5).map((item) => {
      // Simple inline image component with retry logic
      const CartPreviewImage = ({ src, alt }) => {
        const [errorCount, setErrorCount] = useState(0);
        const [imgSrc, setImgSrc] = useState(src);
        const placeholder = 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop';

        const handleError = () => {
          if (errorCount < 2) {
            setErrorCount(prev => prev + 1);
            // Try reloading with cache bust
            setImgSrc(src + (src.includes('?') ? '&' : '?') + `t=${Date.now()}`);
          } else {
            // Use placeholder after 3 attempts
            setImgSrc(placeholder);
          }
        };

        return (
          <img
            src={imgSrc || placeholder}
            alt={alt}
            className="w-10 h-10 rounded"
            onError={handleError}
            loading="lazy"
          />
        );
      };

      return (
        <div key={item._id} className="flex items-center gap-3 p-2 border border-gray-100 rounded">
          <CartPreviewImage src={item.image} alt={item.name} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <p className="text-xs text-gray-500">{item.quantity} × ${item.price.toFixed(2)}</p>
          </div>
        </div>
      );
    })}
    {cart.items.length > 5 && (
      <div className="text-sm text-center text-gray-500">
        ...and {cart.items.length - 5} more items
      </div>
    )}
  </div>
</div>

          {/* Alternative Options */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="mb-2 text-sm font-medium text-gray-700">Consider these alternatives:</p>
            <div className="space-y-2 text-sm">
              <button 
                onClick={() => {
                  // Save all to wishlist
                  cart.items.forEach(item => {
                    moveToWishlist(item._id);
                  });
                  setShowClearCartModal(false);
                }}
                className="flex items-center gap-2 text-left text-green-600 hover:text-green-700"
              >
                <Heart className="w-4 h-4" />
                <span>Save all items to wishlist instead</span>
              </button>
              <button 
                onClick={() => setShowClearCartModal(false)}
                className="flex items-center gap-2 text-left text-blue-600 hover:text-blue-700"
              >
                <Package className="w-4 h-4" />
                <span>Keep items in cart</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
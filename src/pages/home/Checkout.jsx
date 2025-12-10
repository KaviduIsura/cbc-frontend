// src/home/Checkout.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Lock, 
  Truck, 
  Shield, 
  RefreshCw,
  CreditCard,
  Wallet,
  DollarSign,
  Check,
  ChevronRight,
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Calendar,
  Gift,
  Sparkles
} from "lucide-react";
import Modal from "../../components/Modal";
import { getCartAPI, clearCartAPI } from "../../utils/cartApi";
import { createOrderAPI } from "../../utils/orderApi";
import toast from "react-hot-toast";

export default function Checkout() {
  const navigate = useNavigate();
  
  // States
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    saveInfo: true
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false
  });
  
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [giftMessage, setGiftMessage] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  
  // Order summary
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [codFee, setCodFee] = useState(0);
  
  // Delivery methods
  const deliveryMethods = [
    {
      id: "standard",
      name: "Standard Delivery",
      price: 8.95,
      time: "5-7 business days",
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: "express",
      name: "Express Delivery",
      price: 19.95,
      time: "2-3 business days",
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: "overnight",
      name: "Overnight Delivery",
      price: 29.95,
      time: "Next business day",
      icon: <Calendar className="w-5 h-5" />
    },
    {
      id: "free",
      name: "Free Shipping",
      price: 0,
      time: "7-10 business days",
      icon: <Gift className="w-5 h-5" />
    }
  ];
  
  // Payment methods
  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <Wallet className="w-5 h-5" />
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: <DollarSign className="w-5 h-5" />
    }
  ];

  // COD configuration
  const COD_FEE = 5.99;
  const COD_MIN_AMOUNT = 10;
  const COD_MAX_AMOUNT = 500;

  // Fetch cart data
  useEffect(() => {
    fetchCart();
    
    const savedShippingInfo = localStorage.getItem('shippingInfo');
    if (savedShippingInfo) {
      try {
        setShippingInfo(JSON.parse(savedShippingInfo));
      } catch (error) {
        console.error('Error loading saved shipping info:', error);
      }
    }
  }, []);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const result = await getCartAPI();
      
      if (result.success && result.cart) {
        setCart(result.cart);
        calculateTotals(result.cart);
      } else {
        toast.error("Your cart is empty");
        navigate('/cart');
      }
    } catch (error) {
      toast.error("Failed to load cart");
      navigate('/cart');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = (cartData) => {
    const cartSubtotal = cartData.total || 0;
    
    const selectedDelivery = deliveryMethods.find(d => d.id === deliveryMethod);
    let shippingCost = cartSubtotal > 75 ? 0 : (selectedDelivery?.price || 8.95);
    
    let codFeeAmount = 0;
    if (paymentMethod === 'cod') {
      codFeeAmount = COD_FEE;
      setCodFee(codFeeAmount);
    } else {
      setCodFee(0);
    }
    
    const taxAmount = cartSubtotal * 0.08;
    
    let discountAmount = 0;
    if (cartSubtotal > 100) {
      discountAmount = cartSubtotal * 0.10;
    }
    
    const totalAmount = cartSubtotal + shippingCost + taxAmount + codFeeAmount - discountAmount;
    
    setSubtotal(cartSubtotal);
    setShipping(shippingCost);
    setTax(taxAmount);
    setTotal(totalAmount);
    setDiscount(discountAmount);
  };

  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDeliveryChange = (methodId) => {
    setDeliveryMethod(methodId);
  };

  const handlePaymentMethodChange = (methodId) => {
    if (methodId === 'cod') {
      if (subtotal < COD_MIN_AMOUNT) {
        toast.error(`COD is only available for orders above $${COD_MIN_AMOUNT}`);
        return;
      }
      if (subtotal > COD_MAX_AMOUNT) {
        toast.error(`COD is not available for orders above $${COD_MAX_AMOUNT}`);
        return;
      }
    }
    
    setPaymentMethod(methodId);
    
    if (cart) {
      calculateTotals(cart);
    }
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    
    for (const field of requiredFields) {
      if (!shippingInfo[field]?.trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(shippingInfo.phone.replace(/[\s\-\(\)]/g, ''))) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    
    if (paymentMethod === 'card') {
      if (!paymentInfo.cardNumber || paymentInfo.cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Please enter a valid 16-digit card number');
        return false;
      }
      
      if (!paymentInfo.cardName.trim()) {
        toast.error('Please enter the name on card');
        return false;
      }
      
      if (!paymentInfo.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      
      if (!paymentInfo.cvv || paymentInfo.cvv.length !== 3) {
        toast.error('Please enter a valid 3-digit CVV');
        return false;
      }
    }
    
    if (paymentMethod === 'cod') {
      if (subtotal < COD_MIN_AMOUNT) {
        toast.error(`Cash on Delivery requires minimum order of $${COD_MIN_AMOUNT}`);
        return false;
      }
      if (subtotal > COD_MAX_AMOUNT) {
        toast.error(`COD not available for orders above $${COD_MAX_AMOUNT}`);
        return false;
      }
      
      if (!shippingInfo.phone.trim()) {
        toast.error('Phone number is required for Cash on Delivery');
        return false;
      }
    }
    
    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return false;
    }
    
    return true;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setIsPlacingOrder(true);
    
    try {
      if (shippingInfo.saveInfo) {
        localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
      }
      
      const orderData = {
        shippingInfo,
        paymentMethod,
        deliveryMethod,
        giftMessage,
        orderNotes,
        items: cart.items.map(item => ({
          productId: item.productId?._id || item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal,
        shipping,
        tax,
        discount,
        codFee: paymentMethod === 'cod' ? COD_FEE : 0,
        total,
        status: paymentMethod === 'cod' ? 'pending_payment' : 'pending'
      };
      
      if (paymentMethod !== 'cod') {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      const result = await createOrderAPI(orderData);
      
      if (result.success) {
        await clearCartAPI();
        setShowOrderSuccessModal(true);
        window.dispatchEvent(new Event('cartUpdated'));
        toast.success('Order placed successfully!');
      } else {
        toast.error(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('An error occurred while placing your order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    setShowOrderSuccessModal(false);
    navigate('/shop/all');
  };

  const handleViewOrder = () => {
    setShowOrderSuccessModal(false);
    navigate('/orders');
  };

  useEffect(() => {
    if (cart) {
      calculateTotals(cart);
    }
  }, [deliveryMethod, paymentMethod]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20 bg-white">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-300 rounded-full border-t-black animate-spin"></div>
          <p className="text-sm font-light text-gray-500">Preparing your checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-white">
        <div className="container px-6 py-20 mx-auto">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gray-50">
                <Package className="w-12 h-12 text-gray-400" />
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
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Progress Bar */}
      <div className="border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="container px-6 py-4 mx-auto">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 text-sm font-light text-white bg-black rounded-full">1</div>
                <span className="text-sm font-light">Cart</span>
              </div>
              <div className="w-12 h-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 text-sm font-light text-white bg-black rounded-full">2</div>
                <span className="text-sm font-light text-gray-900">Information</span>
              </div>
              <div className="w-12 h-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 text-sm font-light border border-gray-300 rounded-full">3</div>
                <span className="text-sm font-light text-gray-400">Payment</span>
              </div>
            </div>
            
            <button
              onClick={handleBackToCart}
              className="flex items-center gap-2 text-sm font-light text-gray-500 hover:text-black"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="container px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column - Forms */}
          <div className="space-y-12">
            {/* Shipping Information */}
            <div>
              <h2 className="flex items-center gap-3 mb-6 text-2xl font-light">
                <MapPin className="w-6 h-6" />
                Shipping Information
              </h2>
              
              <div className="p-6 border border-gray-100 rounded-lg">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-light text-gray-600">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-light text-gray-600">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-light text-gray-600">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        className="w-full py-3 pl-12 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-light text-gray-600">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        className="w-full py-3 pl-12 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-light text-gray-600">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-light text-gray-600">
                      Apartment, Suite, etc. (Optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={shippingInfo.apartment}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-light text-gray-600">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-light text-gray-600">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-light text-gray-600">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-light text-gray-600">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={shippingInfo.saveInfo}
                      onChange={handleShippingChange}
                      className="w-4 h-4 text-black border-gray-300 rounded"
                    />
                    <span className="text-sm font-light text-gray-600">
                      Save this information for next time
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div>
              <h2 className="flex items-center gap-3 mb-6 text-2xl font-light">
                <Truck className="w-6 h-6" />
                Delivery Method
              </h2>
              
              <div className="space-y-4">
                {deliveryMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => handleDeliveryChange(method.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      deliveryMethod === method.id
                        ? 'border-black bg-black/5'
                        : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          deliveryMethod === method.id ? 'bg-black' : 'bg-gray-100'
                        }`}>
                          {method.icon}
                        </div>
                        <div>
                          <h3 className="font-light">{method.name}</h3>
                          <p className="text-sm text-gray-500">{method.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-light">
                          {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                        </p>
                        {method.id === "free" && subtotal < 75 && (
                          <p className="text-xs text-amber-600">
                            Available for orders over $75
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h2 className="flex items-center gap-3 mb-6 text-2xl font-light">
                <CreditCard className="w-6 h-6" />
                Payment Information
              </h2>
              
              {/* Payment Method Selection - THESE ARE THE ACTUAL SELECTION CONTROLS */}
              <div className="flex gap-4 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentMethodChange(method.id)}
                    className={`flex-1 py-3 border rounded-lg flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === method.id
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={method.id === 'cod' && (subtotal < COD_MIN_AMOUNT || subtotal > COD_MAX_AMOUNT)}
                  >
                    {method.icon}
                    <span className="text-sm font-light">{method.name}</span>
                  </button>
                ))}
              </div>
              
              {/* COD Warning */}
              {paymentMethod === 'cod' && (
                <div className="p-4 mb-6 border rounded-lg border-amber-200 bg-amber-50">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-amber-800">Cash on Delivery Information</p>
                      <ul className="space-y-1 text-xs text-amber-700">
                        <li>• Additional fee: ${COD_FEE.toFixed(2)}</li>
                        <li>• Available for orders: ${COD_MIN_AMOUNT} - ${COD_MAX_AMOUNT}</li>
                        <li>• Pay with cash upon delivery</li>
                        <li>• Please have exact change ready</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="p-6 border border-gray-100 rounded-lg">
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-2 text-sm font-light text-gray-600">
                        Card Number *
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            handlePaymentChange({ 
                              target: { 
                                name: 'cardNumber', 
                                value: formatted,
                                type: 'text'
                              }
                            });
                          }}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className="w-full py-3 pl-12 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-light text-gray-600">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 text-sm font-light text-gray-600">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value);
                            handlePaymentChange({ 
                              target: { 
                                name: 'expiryDate', 
                                value: formatted,
                                type: 'text'
                              }
                            });
                          }}
                          placeholder="MM/YY"
                          maxLength="5"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 text-sm font-light text-gray-600">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                            handlePaymentChange({ 
                              target: { 
                                name: 'cvv', 
                                value: value,
                                type: 'text'
                              }
                            });
                          }}
                          placeholder="123"
                          maxLength="3"
                          className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="saveCard"
                          checked={paymentInfo.saveCard}
                          onChange={handlePaymentChange}
                          className="w-4 h-4 text-black border-gray-300 rounded"
                        />
                        <span className="text-sm font-light text-gray-600">
                          Save card for future purchases
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* PayPal Message */}
              {paymentMethod === 'paypal' && (
                <div className="p-6 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Wallet className="w-5 h-5" />
                    <p>You will be redirected to PayPal to complete your payment securely.</p>
                  </div>
                </div>
              )}
              
              {/* COD Message */}
              {paymentMethod === 'cod' && (
                <div className="p-6 border border-gray-100 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <DollarSign className="w-5 h-5" />
                      <p>Pay with cash when your order arrives. Additional ${COD_FEE.toFixed(2)} COD fee applies.</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-gray-50">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Amount:</span>
                          <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">COD Fee:</span>
                          <span className="font-medium text-amber-600">+${COD_FEE.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="font-medium">Amount to Pay:</span>
                          <span className="font-bold">${(subtotal + COD_FEE).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <p className="mb-2">Important:</p>
                      <ul className="space-y-1">
                        <li>• Please have exact change ready</li>
                        <li>• Delivery personnel cannot provide change</li>
                        <li>• You'll receive a call before delivery</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div>
              <h2 className="flex items-center gap-3 mb-6 text-2xl font-light">
                <Gift className="w-6 h-6" />
                Additional Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-light text-gray-600">
                    Gift Message (Optional)
                  </label>
                  <textarea
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Add a personal message for your gift..."
                    rows="3"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-black"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-light text-gray-600">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Add any special instructions for your order..."
                    rows="3"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="sticky top-36">
              <div className="p-6 border border-gray-100 rounded-lg">
                <h2 className="mb-6 text-2xl font-light">Order Summary</h2>
                
                {/* Items List */}
                <div className="mb-6 space-y-4">
                  <h3 className="text-sm font-light text-gray-600">
                    {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in cart
                  </h3>
                  
                  <div className="space-y-3 overflow-y-auto max-h-64">
                    {cart.items.map((item) => (
                      <div key={item._id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop"}
                          alt={item.name}
                          className="w-16 h-16 rounded"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{item.name}</h4>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-light">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-6 space-y-3">
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
                  
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between text-amber-600">
                      <span>COD Fee</span>
                      <span className="font-light">+${COD_FEE.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10% off)</span>
                      <span className="font-light">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {subtotal < 75 && deliveryMethod === 'free' && (
                    <div className="p-3 text-sm text-center rounded-lg text-amber-600 bg-amber-50">
                      <AlertCircle className="inline-block w-4 h-4 mr-2" />
                      Free shipping available for orders over $75
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="py-4 border-t border-b border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-lg">Total</span>
                    <div className="text-right">
                      <div className="text-2xl font-light">${total.toFixed(2)}</div>
                      {paymentMethod === 'cod' && (
                        <div className="text-sm text-amber-600">
                          (Includes ${COD_FEE.toFixed(2)} COD fee)
                        </div>
                      )}
                      <div className="text-sm text-gray-500">USD</div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="py-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Secure encrypted payment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Protected by SSL</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">30-day returns</span>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-amber-500" />
                      <span className="text-sm text-amber-600">Pay on delivery available</span>
                    </div>
                  )}
                </div>

                {/* Terms & Newsletter */}
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="w-4 h-4 mt-1 text-black border-gray-300 rounded"
                        required
                      />
                      <span className="text-sm font-light text-gray-600">
                        I agree to the{" "}
                        <Link to="/terms" className="text-black hover:underline">
                          Terms of Service
                        </Link>
                        {" "}and{" "}
                        <Link to="/privacy" className="text-black hover:underline">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={newsletter}
                        onChange={(e) => setNewsletter(e.target.checked)}
                        className="w-4 h-4 mt-1 text-black border-gray-300 rounded"
                      />
                      <span className="text-sm font-light text-gray-600">
                        I want to receive updates about new products and exclusive offers
                      </span>
                    </label>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || !acceptTerms || (paymentMethod === 'cod' && (subtotal < COD_MIN_AMOUNT || subtotal > COD_MAX_AMOUNT))}
                  className={`w-full py-4 text-sm font-light tracking-wider text-white transition-colors rounded-lg flex items-center justify-center gap-2 ${
                    isPlacingOrder || !acceptTerms || (paymentMethod === 'cod' && (subtotal < COD_MIN_AMOUNT || subtotal > COD_MAX_AMOUNT))
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      Processing...
                    </>
                  ) : paymentMethod === 'cod' ? (
                    <>
                      <DollarSign className="w-5 h-5" />
                      Place COD Order
                      <span className="ml-auto">${total.toFixed(2)}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Place Order
                      <span className="ml-auto">${total.toFixed(2)}</span>
                    </>
                  )}
                </button>

                {/* Accepted Payment Methods - DISPLAY ONLY */}
                <div className="mt-6">
                  <p className="mb-3 text-xs text-center text-gray-500">We Accept</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {/* Card Types */}
                    {['Visa', 'Mastercard', 'Amex'].map((cardType) => (
                      <div 
                        key={cardType} 
                        className="px-2 py-1 text-xs font-light text-gray-400 border border-gray-200 rounded"
                      >
                        {cardType}
                      </div>
                    ))}
                    {/* Payment Methods */}
                    {['PayPal', 'COD'].map((method) => (
                      <div 
                        key={method} 
                        className={`px-2 py-1 text-xs font-light border rounded ${
                          method === 'COD' 
                            ? 'text-amber-600 bg-amber-50 border-amber-200' 
                            : 'text-gray-400 border-gray-200'
                        }`}
                      >
                        {method}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Need Help Section */}
              <div className="p-6 mt-6 border border-gray-100 rounded-lg">
                <h3 className="mb-4 text-lg font-light">Need Help?</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>Email us at <a href="mailto:support@elevé.com" className="text-black hover:underline">support@elevé.com</a></p>
                  <p>Call us at <a href="tel:+18885551234" className="text-black hover:underline">1-888-555-1234</a></p>
                  <p>Live chat available 24/7</p>
                  {paymentMethod === 'cod' && (
                    <div className="pt-3 mt-3 border-t border-gray-200">
                      <p className="font-medium text-gray-700">COD Support:</p>
                      <p className="mt-1">For COD inquiries: <a href="tel:+1888555CODD" className="text-black hover:underline">1-888-555-CODD</a></p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      <Modal
        isOpen={showOrderSuccessModal}
        onClose={() => setShowOrderSuccessModal(false)}
        onConfirm={handleContinueShopping}
        title="Order Confirmed!"
        confirmText="Continue Shopping"
        cancelText="View Order"
        onCancel={handleViewOrder}
        confirmColor="black"
        size="md"
        hideFooter={true}
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-green-50">
              <Check className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="text-center">
            <h3 className="mb-2 text-xl font-light">Thank You for Your Order!</h3>
            <p className="text-gray-600">
              {paymentMethod === 'cod' 
                ? 'Your order has been placed successfully. You will pay when your order arrives.' 
                : `We've sent a confirmation email to ${shippingInfo.email}`}
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">
                {paymentMethod === 'cod' ? 'Cash on Delivery' : 
                 paymentMethod === 'card' ? 'Credit/Debit Card' : 'PayPal'}
              </span>
            </div>
            {paymentMethod === 'cod' && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Amount Due:</span>
                <span className="font-medium text-amber-600">${total.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Estimated Delivery:</span>
              <span className="font-medium">
                {deliveryMethod === 'overnight' ? 'Tomorrow' : 
                 deliveryMethod === 'express' ? '2-3 business days' : 
                 '5-7 business days'}
              </span>
            </div>
          </div>

          {paymentMethod === 'cod' && (
            <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
              <h4 className="mb-3 text-sm font-medium text-amber-800">Cash on Delivery Instructions</h4>
              <div className="space-y-2 text-sm text-amber-700">
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Please have exact change of <strong>${total.toFixed(2)}</strong> ready</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Delivery team will call 30 minutes before arrival</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Delivery personnel cannot provide change</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-lg bg-gray-50">
            <h4 className="mb-3 text-sm font-medium text-gray-700">What's Next?</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Order confirmation sent to your email</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-500" />
                <span>We'll notify you when your order ships</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>Track your order in your account</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={handleViewOrder}
              className="w-full px-6 py-3 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
            >
              View Order Details
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full px-6 py-3 text-sm font-light text-black transition-colors border border-gray-300 rounded-lg hover:border-black"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
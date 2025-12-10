// src/home/MyOrders.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw,
  DollarSign,
  CreditCard,
  Wallet,
  Search,
  Filter,
  ChevronRight,
  Home,
  AlertCircle,
  ExternalLink,
  MapPin,
  Calendar,
  ShoppingBag
} from "lucide-react";
import { getUserOrdersAPI } from "../../utils/orderApi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Order status configuration
  const statusConfig = {
    pending: {
      label: "Pending",
      icon: <Clock className="w-4 h-4" />,
      color: "text-amber-600 bg-amber-50",
      borderColor: "border-amber-200",
      bgColor: "bg-amber-100",
      description: "Your order is being processed"
    },
    pending_payment: {
      label: "Awaiting Payment",
      icon: <DollarSign className="w-4 h-4" />,
      color: "text-amber-700 bg-amber-50",
      borderColor: "border-amber-300",
      bgColor: "bg-amber-100",
      description: "Payment pending (COD orders)"
    },
    preparing: {
      label: "Preparing",
      icon: <Package className="w-4 h-4" />,
      color: "text-blue-600 bg-blue-50",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-100",
      description: "Your items are being prepared"
    },
    shipped: {
      label: "Shipped",
      icon: <Truck className="w-4 h-4" />,
      color: "text-indigo-600 bg-indigo-50",
      borderColor: "border-indigo-200",
      bgColor: "bg-indigo-100",
      description: "Your order is on the way"
    },
    delivered: {
      label: "Delivered",
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-green-600 bg-green-50",
      borderColor: "border-green-200",
      bgColor: "bg-green-100",
      description: "Order successfully delivered"
    },
    cancelled: {
      label: "Cancelled",
      icon: <XCircle className="w-4 h-4" />,
      color: "text-red-600 bg-red-50",
      borderColor: "border-red-200",
      bgColor: "bg-red-100",
      description: "Order was cancelled"
    },
    refunded: {
      label: "Refunded",
      icon: <RefreshCw className="w-4 h-4" />,
      color: "text-purple-600 bg-purple-50",
      borderColor: "border-purple-200",
      bgColor: "bg-purple-100",
      description: "Order has been refunded"
    }
  };

  // Payment method icons
  const paymentMethodIcons = {
    card: <CreditCard className="w-4 h-4" />,
    paypal: <Wallet className="w-4 h-4" />,
    cod: <DollarSign className="w-4 h-4" />
  };

  // Delivery method names
  const deliveryMethodNames = {
    standard: "Standard Delivery",
    express: "Express Delivery",
    overnight: "Overnight Delivery",
    free: "Free Shipping"
  };

  // Fetch user orders
  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    setIsLoading(true);
    try {
      const result = await getUserOrdersAPI();
      
      if (result.success) {
        setOrders(result.orders || []);
      } else {
        toast.error(result.message || "Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("An error occurred while loading your orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter orders based on status and search term
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderedItems?.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return matchesStatus && matchesSearch;
  });

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate estimated delivery date
  const getEstimatedDelivery = (orderDate, deliveryMethod) => {
    const date = new Date(orderDate);
    let daysToAdd = 7; // Default standard delivery
    
    switch(deliveryMethod) {
      case 'express':
        daysToAdd = 3;
        break;
      case 'overnight':
        daysToAdd = 1;
        break;
      case 'free':
        daysToAdd = 10;
        break;
      default:
        daysToAdd = 7;
    }
    
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle reorder
  const handleReorder = async (order) => {
    toast.loading("Adding items to cart...");
    
    // In a real app, you would add items to cart
    // For now, we'll simulate with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.dismiss();
    toast.success("Items added to cart!");
    navigate('/cart');
  };

  // Handle view order details
  const handleViewOrderDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-white">
        <div className="container px-6 py-20 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 border-4 border-gray-300 rounded-full border-t-black animate-spin"></div>
              <h2 className="mb-2 text-xl font-light text-gray-900">Loading your orders</h2>
              <p className="text-sm text-gray-500">Fetching your order history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container px-6 py-8 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Link 
                    to="/" 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-black"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-black">My Orders</span>
                </div>
                
                <h1 className="text-3xl font-light md:text-4xl">My Orders</h1>
                <p className="mt-2 text-gray-600">
                  Track and manage all your orders in one place
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{orders.length}</span> order{orders.length !== 1 ? 's' : ''} total
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-6 py-12 mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Filters and Search */}
          <div className="p-6 mb-8 border border-gray-100 rounded-lg">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <div className="flex-1">
                <div className="relative max-w-md">
                  <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                  <input
                    type="text"
                    placeholder="Search orders by ID, name, or items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-3 pl-12 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      filterStatus === "all"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All Orders
                  </button>
                  {Object.keys(statusConfig).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                        filterStatus === status
                          ? `${statusConfig[status].color} ${statusConfig[status].borderColor} border`
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {statusConfig[status].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center border border-gray-100 rounded-lg">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-gray-50">
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              
              {orders.length === 0 ? (
                <>
                  <h3 className="mb-4 text-xl font-light">No Orders Yet</h3>
                  <p className="max-w-md mx-auto mb-8 text-gray-600">
                    You haven't placed any orders yet. Start shopping to see your orders here.
                  </p>
                  <Link
                    to="/shop/all"
                    className="inline-flex items-center px-6 py-3 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
                  >
                    Start Shopping
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="mb-4 text-xl font-light">No Orders Found</h3>
                  <p className="max-w-md mx-auto mb-8 text-gray-600">
                    No orders match your current filters. Try changing your search or filter criteria.
                  </p>
                  <button
                    onClick={() => {
                      setFilterStatus("all");
                      setSearchTerm("");
                    }}
                    className="inline-flex items-center px-6 py-3 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
                  >
                    Clear Filters
                    <RefreshCw className="w-4 h-4 ml-2" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const isExpanded = expandedOrder === order._id;
                
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden border border-gray-100 rounded-lg"
                  >
                    {/* Order Header */}
                    <div className="p-6">
                      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-medium">Order #{order.orderId}</h3>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.color} ${status.borderColor} border flex items-center gap-1.5`}>
                                {status.icon}
                                {status.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Placed on {formatDate(order.createdAt)}
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="p-1 bg-gray-100 rounded">
                                {paymentMethodIcons[order.paymentMethod] || <CreditCard className="w-4 h-4" />}
                              </div>
                              <span>
                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                                 order.paymentMethod === 'paypal' ? 'PayPal' : 'Credit/Debit Card'}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="p-1 bg-gray-100 rounded">
                                <Truck className="w-4 h-4" />
                              </div>
                              <span>{deliveryMethodNames[order.deliveryMethod] || 'Standard Delivery'}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="p-1 bg-gray-100 rounded">
                                <Calendar className="w-4 h-4" />
                              </div>
                              <span>
                                Est. delivery: {getEstimatedDelivery(order.createdAt, order.deliveryMethod)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="mb-3">
                            <div className="text-2xl font-light">${order.total?.toFixed(2)}</div>
                            {order.paymentMethod === 'cod' && !order.isPaid && (
                              <div className="text-sm text-amber-600">Payment Pending</div>
                            )}
                          </div>
                          
                          <div className="flex gap-3">
                            <button
                              onClick={() => toggleOrderDetails(order._id)}
                              className="px-4 py-2 text-sm font-light text-black transition-colors border border-gray-300 rounded-lg hover:border-black"
                            >
                              {isExpanded ? 'Hide Details' : 'View Details'}
                            </button>
                            
                            {order.status !== 'cancelled' && order.status !== 'refunded' && (
                              <button
                                onClick={() => handleReorder(order)}
                                className="px-4 py-2 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
                              >
                                Reorder
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Order Details */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-6">
                          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {/* Order Items */}
                            <div>
                              <h4 className="mb-4 text-lg font-light">Order Items</h4>
                              <div className="space-y-4">
                                {order.orderedItems?.map((item, index) => (
                                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                                    <img
                                      src={item.image || "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop"}
                                      alt={item.name}
                                      className="w-16 h-16 rounded"
                                      onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop";
                                      }}
                                    />
                                    <div className="flex-1">
                                      <h5 className="text-sm font-medium">{item.name}</h5>
                                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                                      <p className="text-sm font-light">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div>
                              <h4 className="mb-4 text-lg font-light">Order Summary</h4>
                              <div className="p-4 border border-gray-100 rounded-lg">
                                <div className="mb-4 space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Items Total</span>
                                    <span className="font-light">${order.subtotal?.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-light">
                                      {order.shipping === 0 ? "FREE" : `$${order.shipping?.toFixed(2)}`}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-light">${order.tax?.toFixed(2)}</span>
                                  </div>
                                  {order.codFee > 0 && (
                                    <div className="flex justify-between text-amber-600">
                                      <span>COD Fee</span>
                                      <span className="font-light">+${order.codFee?.toFixed(2)}</span>
                                    </div>
                                  )}
                                  {order.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                      <span>Discount</span>
                                      <span className="font-light">-${order.discount?.toFixed(2)}</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="pt-4 border-t border-gray-100">
                                  <div className="flex justify-between">
                                    <span className="text-lg font-medium">Total</span>
                                    <span className="text-2xl font-light">${order.total?.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Shipping Information */}
                              <div className="mt-6">
                                <h4 className="mb-4 text-lg font-light">Shipping Information</h4>
                                <div className="p-4 border border-gray-100 rounded-lg">
                                  <div className="flex items-start gap-3 mb-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                      <p className="font-medium">
                                        {order.shippingInfo?.firstName} {order.shippingInfo?.lastName}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {order.shippingInfo?.address}
                                        {order.shippingInfo?.apartment && `, ${order.shippingInfo.apartment}`}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.zipCode}
                                      </p>
                                      <p className="text-sm text-gray-600">{order.shippingInfo?.country}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="font-medium">Phone:</span>
                                    <span>{order.shippingInfo?.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="font-medium">Email:</span>
                                    <span>{order.shippingInfo?.email}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Notes */}
                          {(order.giftMessage || order.orderNotes) && (
                            <div className="mt-8">
                              <h4 className="mb-4 text-lg font-light">Additional Information</h4>
                              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {order.giftMessage && (
                                  <div className="p-4 border border-gray-100 rounded-lg">
                                    <h5 className="mb-2 text-sm font-medium text-gray-700">Gift Message</h5>
                                    <p className="text-sm text-gray-600">{order.giftMessage}</p>
                                  </div>
                                )}
                                {order.orderNotes && (
                                  <div className="p-4 border border-gray-100 rounded-lg">
                                    <h5 className="mb-2 text-sm font-medium text-gray-700">Order Notes</h5>
                                    <p className="text-sm text-gray-600">{order.orderNotes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Order Actions */}
                          <div className="flex flex-wrap gap-3 pt-6 mt-8 border-t border-gray-100">
                            {order.status === 'pending_payment' && (
                              <button className="px-4 py-2 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800">
                                Pay Now
                              </button>
                            )}
                            
                            {order.status === 'preparing' && (
                              <button
                                onClick={() => toast.success("Support request sent! We'll contact you shortly.")}
                                className="px-4 py-2 text-sm font-light text-black transition-colors border border-gray-300 rounded-lg hover:border-black"
                              >
                                Contact Support
                              </button>
                            )}
                            
                            {order.status === 'shipped' && (
                              <button className="px-4 py-2 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800">
                                Track Order
                              </button>
                            )}
                            
                            {order.status === 'delivered' && (
                              <>
                                <button className="px-4 py-2 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800">
                                  Leave Review
                                </button>
                                <button
                                  onClick={() => toast.success("Return request submitted! Check your email for instructions.")}
                                  className="px-4 py-2 text-sm font-light text-black transition-colors border border-gray-300 rounded-lg hover:border-black"
                                >
                                  Request Return
                                </button>
                              </>
                            )}
                            
                            {!order.isPaid && order.paymentMethod === 'cod' && (
                              <div className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg text-amber-600 bg-amber-50 border-amber-200">
                                <AlertCircle className="w-4 h-4" />
                                <span>Payment due upon delivery</span>
                              </div>
                            )}
                            
                            <button
                              onClick={() => handleViewOrderDetails(order._id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-light text-black transition-colors border border-gray-300 rounded-lg hover:border-black"
                            >
                              View Full Order
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Help Section */}
          {orders.length > 0 && (
            <div className="p-8 mt-12 border border-gray-100 rounded-lg">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gray-50">
                      <Truck className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <h4 className="mb-2 text-lg font-light">Track Your Order</h4>
                  <p className="text-sm text-gray-600">
                    Get real-time updates on your order status and delivery information
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gray-50">
                      <RefreshCw className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <h4 className="mb-2 text-lg font-light">Easy Returns</h4>
                  <p className="text-sm text-gray-600">
                    30-day return policy. Start a return from your order details
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gray-50">
                      <AlertCircle className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  <h4 className="mb-2 text-lg font-light">Need Help?</h4>
                  <p className="text-sm text-gray-600">
                    Contact our support team for any questions about your orders
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty State Illustration */}
      {orders.length === 0 && !isLoading && (
        <div className="container px-6 py-20 mx-auto">
          <div className="max-w-lg mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-50"></div>
                <ShoppingBag className="absolute w-16 h-16 text-gray-400 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
              </div>
            </div>
            <h3 className="mb-4 text-2xl font-light">Your Order History Awaits</h3>
            <p className="mb-8 text-gray-600">
              Once you start shopping with us, all your orders will appear here. 
              You'll be able to track deliveries, view order details, and manage returns.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/shop/all"
                className="px-8 py-3 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
              >
                Browse Products
              </Link>
              <Link
                to="/account"
                className="px-8 py-3 text-sm font-light text-black transition-colors border border-gray-300 rounded-lg hover:border-black"
              >
                View Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
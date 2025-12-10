// src/home/OrderDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw,
  DollarSign,
  CreditCard,
  Wallet,
  Printer,
  Download,
  Share2,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Home,
  ChevronRight,
  AlertCircle,
  Copy,
  ExternalLink
} from "lucide-react";
import { getOrderByIdAPI } from "../../utils/orderApi";
import toast from "react-hot-toast";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Status configuration
  const statusConfig = {
    pending: {
      label: "Pending",
      icon: <Clock className="w-5 h-5" />,
      color: "text-amber-600 bg-amber-50",
      borderColor: "border-amber-200",
      bgColor: "bg-amber-100"
    },
    pending_payment: {
      label: "Awaiting Payment",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-amber-700 bg-amber-50",
      borderColor: "border-amber-300",
      bgColor: "bg-amber-100"
    },
    preparing: {
      label: "Preparing",
      icon: <Package className="w-5 h-5" />,
      color: "text-blue-600 bg-blue-50",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-100"
    },
    shipped: {
      label: "Shipped",
      icon: <Truck className="w-5 h-5" />,
      color: "text-indigo-600 bg-indigo-50",
      borderColor: "border-indigo-200",
      bgColor: "bg-indigo-100"
    },
    delivered: {
      label: "Delivered",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-600 bg-green-50",
      borderColor: "border-green-200",
      bgColor: "bg-green-100"
    },
    cancelled: {
      label: "Cancelled",
      icon: <XCircle className="w-5 h-5" />,
      color: "text-red-600 bg-red-50",
      borderColor: "border-red-200",
      bgColor: "bg-red-100"
    },
    refunded: {
      label: "Refunded",
      icon: <RefreshCw className="w-5 h-5" />,
      color: "text-purple-600 bg-purple-50",
      borderColor: "border-purple-200",
      bgColor: "bg-purple-100"
    }
  };

  // Fetch order details
  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      const result = await getOrderByIdAPI(id);
      
      if (result.success) {
        setOrder(result.order);
      } else {
        toast.error(result.message || "Order not found");
        navigate('/orders');
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
      navigate('/orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Copy order ID to clipboard
  const copyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    toast.success("Order ID copied to clipboard!");
  };

  // Print order
  const printOrder = () => {
    window.print();
  };

  // Download invoice
  const downloadInvoice = () => {
    toast.success("Invoice download started!");
    // In a real app, generate and download PDF invoice
  };

  // Share order
  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order ${order.orderId}`,
        text: `Check out my order ${order.orderId} from Elevé`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-white">
        <div className="container px-6 py-20 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-6 border-4 border-gray-300 rounded-full border-t-black animate-spin"></div>
              <h2 className="mb-2 text-xl font-light text-gray-900">Loading order details</h2>
              <p className="text-sm text-gray-500">Fetching your order information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-20 bg-white">
        <div className="container px-6 py-20 mx-auto">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gray-50">
                <AlertCircle className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-light">Order Not Found</h1>
            <p className="mb-8 text-gray-600">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <button
              onClick={() => navigate('/orders')}
              className="inline-flex items-center px-6 py-3 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;

  return (
    <div className="min-h-screen pt-20 bg-white print:pt-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 print:hidden">
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
                  <Link 
                    to="/orders" 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-black"
                  >
                    My Orders
                  </Link>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-black">Order Details</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <h1 className="text-3xl font-light md:text-4xl">Order #{order.orderId}</h1>
                  <span className={`px-4 py-2 text-sm font-medium rounded-full ${status.color} ${status.borderColor} border flex items-center gap-2`}>
                    {status.icon}
                    {status.label}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={copyOrderId}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-light text-black transition-colors border border-gray-300 rounded-lg hover:border-black"
                >
                  <Copy className="w-4 h-4" />
                  Copy ID
                </button>
                <button
                  onClick={printOrder}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-light text-black transition-colors border border-gray-300 rounded-lg hover:border-black"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={shareOrder}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-6 py-12 mx-auto print:py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Order Summary */}
            <div className="lg:col-span-2">
              {/* Order Items */}
              <div className="p-6 mb-8 border border-gray-100 rounded-lg print:border-0">
                <h2 className="mb-6 text-2xl font-light">Order Items</h2>
                <div className="space-y-4">
                  {order.orderedItems?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop"}
                        alt={item.name}
                        className="w-20 h-20 rounded"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop";
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-light">${(item.price * item.quantity).toFixed(2)}</span>
                          <span className="text-sm text-gray-500">${item.price.toFixed(2)} each</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="p-6 mb-8 border border-gray-100 rounded-lg print:border-0">
                <h2 className="mb-6 text-2xl font-light">Shipping Information</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-gray-700">Delivery Address</h4>
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
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-gray-700">Contact Information</h4>
                    <div className="p-4 border border-gray-100 rounded-lg">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{order.shippingInfo?.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{order.shippingInfo?.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(order.giftMessage || order.orderNotes) && (
                <div className="p-6 border border-gray-100 rounded-lg print:border-0">
                  <h2 className="mb-6 text-2xl font-light">Additional Information</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {order.giftMessage && (
                      <div>
                        <h4 className="mb-3 text-sm font-medium text-gray-700">Gift Message</h4>
                        <div className="p-4 border border-gray-100 rounded-lg">
                          <p className="text-sm text-gray-600">{order.giftMessage}</p>
                        </div>
                      </div>
                    )}
                    {order.orderNotes && (
                      <div>
                        <h4 className="mb-3 text-sm font-medium text-gray-700">Order Notes</h4>
                        <div className="p-4 border border-gray-100 rounded-lg">
                          <p className="text-sm text-gray-600">{order.orderNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Details */}
            <div>
              <div className="sticky top-36">
                {/* Order Summary */}
                <div className="p-6 mb-6 border border-gray-100 rounded-lg print:border-0">
                  <h2 className="mb-6 text-2xl font-light">Order Summary</h2>
                  
                  <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Order ID</span>
                      <span className="font-mono font-medium">{order.orderId}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Order Date</span>
                      <span className="font-medium">{formatDate(order.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <div className="flex items-center gap-2">
                        {order.paymentMethod === 'cod' ? <DollarSign className="w-4 h-4" /> :
                         order.paymentMethod === 'paypal' ? <Wallet className="w-4 h-4" /> :
                         <CreditCard className="w-4 h-4" />}
                        <span className="font-medium">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' :
                           order.paymentMethod === 'paypal' ? 'PayPal' : 'Credit/Debit Card'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Delivery Method</span>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        <span className="font-medium">
                          {order.deliveryMethod === 'express' ? 'Express Delivery' :
                           order.deliveryMethod === 'overnight' ? 'Overnight Delivery' :
                           order.deliveryMethod === 'free' ? 'Free Shipping' : 'Standard Delivery'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Payment Status</span>
                      <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="mb-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
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
                    {order.paymentMethod === 'cod' && !order.isPaid && (
                      <div className="p-3 mt-2 text-sm text-center rounded-lg text-amber-600 bg-amber-50">
                        <AlertCircle className="inline-block w-4 h-4 mr-2" />
                        Payment due upon delivery
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 border border-gray-100 rounded-lg print:hidden">
                  <h3 className="mb-4 text-lg font-light">Order Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={downloadInvoice}
                      className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-light text-black transition-colors border border-gray-300 rounded-lg hover:border-black"
                    >
                      <Download className="w-4 h-4" />
                      Download Invoice
                    </button>
                    
                    {order.status === 'delivered' && (
                      <button className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800">
                        <ExternalLink className="w-4 h-4" />
                        Leave Review
                      </button>
                    )}
                    
                    {order.status === 'shipped' && (
                      <button className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800">
                        <Truck className="w-4 h-4" />
                        Track Order
                      </button>
                    )}
                    
                    <button
                      onClick={() => navigate('/orders')}
                      className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-light text-black transition-colors border border-gray-300 rounded-lg hover:border-black"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Orders
                    </button>
                  </div>
                </div>

                {/* Need Help */}
                <div className="p-6 mt-6 border border-gray-100 rounded-lg print:hidden">
                  <h3 className="mb-4 text-lg font-light">Need Help?</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>Email: <a href="mailto:support@elevé.com" className="text-black hover:underline">support@elevé.com</a></p>
                    <p>Phone: <a href="tel:+18885551234" className="text-black hover:underline">1-888-555-1234</a></p>
                    <p>Order ID: <span className="font-mono">{order.orderId}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-0 {
            border: none !important;
          }
          .print\\:pt-0 {
            padding-top: 0 !important;
          }
          .print\\:py-6 {
            padding-top: 1.5rem !important;
            padding-bottom: 1.5rem !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
// import { useEffect, useState } from "react";
// import { loadCart } from "../../utils/cartFunction";
// import CartCard from "../../components/cartCard";
// import axios from "axios";

// export default function Cart() {
//   const [cart, setCart] = useState([]);
// const[total,setTotal]=useState(0)
// const [labelTotal,setLabelTotal]=useState(0)


//   useEffect(() => {
//     const cartData = loadCart();
//     setCart(cartData);
//     axios.post(import.meta.env.VITE_BACKEND_URL+"/api/orders/quote",
//         {
//             orderedItems: loadCart()
//         }
//     ).then(
//         (res)=>{
//             console.log(res.data);
//             setTotal(res.data.total)
//             setLabelTotal(res.data.labelTotal)
//         }
//     )
//   }, []);

//   function onOrderCheckOutClick(){
//     const token = localStorage.getItem("token")
//     if(token == null){
//         return
//     }

//     axios.post(import.meta.env.VITE_BACKEND_URL+"/api/orders",

//         {
//             orderedItems:cart,
//             name:"Kavidu isura",
//             address:"badulla",
//             phone:"0776479026"
//         },
//         {
//             headers: {
//               Authorization: "Bearer " + token,
//             },
//           }
//     ).then(
//         (res)=>{
//             console.log(res.data);
//         }
//     )

//   }
//   return (
//     <div className="flex flex-col items-end w-full h-full overflow-y-scroll">
//         <table className="w-full">
// <thead>
//     <th>Image</th>
//     <th>Product Name</th>
//     <th>Product Id</th>
//     <th>Quantity</th>
//     <th>Price</th>
//     <th>Total</th>
// </thead>

        
//       {cart.map((item) => {
//         return (
//           <CartCard
//             key={item.productId}
//             productId={item.productId}
//             qty={item.qty}
//           />
//         );
//       })}
//       </table>
//       <h1 className="text-3xl font-bold text-accent">Total : LKR {labelTotal.toFixed(2)}</h1>
//       <h1 className="text-3xl font-bold text-accent">Discount : LKR {(labelTotal-total).toFixed(2)}</h1>
//       <h1 className="text-3xl font-bold text-accent">Grand Total : LKR {total.toFixed(2)}</h1>
//       <button className="bg-accent text-white p-2 rounded-lg w-[300px] hover:bg-accent_light hover:text-black " onClick={onOrderCheckOutClick}>Checkout</button>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
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
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import CartCard from "../../components/cartCard";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Dummy cart data
  const dummyCartItems = [
    {
      id: 1,
      productId: "PER001",
      name: "Sacred Oud Eau de Parfum",
      category: "Perfume",
      price: 189,
      originalPrice: 220,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop",
      quantity: 1,
      inStock: true,
      isNew: true
    },
    {
      id: 2,
      productId: "SKI002",
      name: "Golden Saffron Elixir Serum",
      category: "Skincare",
      price: 145,
      image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop",
      quantity: 2,
      inStock: true,
      isBestSeller: true
    },
    {
      id: 3,
      productId: "SKI003",
      name: "Maroccan Argan Night Cream",
      category: "Skincare",
      price: 98,
      originalPrice: 120,
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1140&auto=format&fit=crop",
      quantity: 1,
      inStock: true
    }
  ];

  useEffect(() => {
    // Simulate loading cart data
    setIsLoading(true);
    setTimeout(() => {
      setCart(dummyCartItems);
      calculateTotals(dummyCartItems);
      setIsLoading(false);
    }, 500);
  }, []);

  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 75 ? 0 : 8.95;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    setSubtotal(subtotal);
    setShipping(shipping);
    setTax(tax);
    setTotal(total);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    calculateTotals(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    calculateTotals(updatedCart);
  };

  const moveToWishlist = (id) => {
    // In a real app, this would move item to wishlist
    const item = cart.find(item => item.id === id);
    alert(`Moved ${item.name} to wishlist`);
    removeItem(id);
  };

  const handleCheckout = () => {
    setIsLoading(true);
    // Simulate checkout process
    setTimeout(() => {
      alert("Checkout successful! Redirecting to payment...");
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading && cart.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] pt-20"> {/* Added pt-20 */}
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-300 rounded-full border-t-black animate-spin"></div>
          <p className="text-sm font-light text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-white"> {/* Added pt-20 */}
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
              to="/products"
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

  return (
    <div className="min-h-screen pt-20 bg-white"> {/* Added pt-20 */}
      {/* Hero */}
      <div className="py-12 bg-gray-50">
        <div className="container px-6 mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-light">Your Cart</h1>
              <p className="text-gray-600">{cart.length} items</p>
            </div>
            <Link
              to="/products"
              className="text-sm font-light text-gray-500 hover:text-black"
            >
              Continue Shopping →
            </Link>
          </div>
        </div>
      </div>

      <div className="container px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Cart Items */}
         <div className="lg:col-span-2">
  <div className="space-y-6">
    {cart.map((item, index) => (
      <CartCard
        key={item.id}
        item={item}
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
            <div className="sticky top-36"> {/* Changed from top-24 to top-36 */}
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
                  disabled={isLoading}
                  className="flex items-center justify-center w-full px-6 py-3 text-sm font-light tracking-wider text-white transition-colors bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Proceed to Checkout
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </span>
                  )}
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
    </div>
  );
}
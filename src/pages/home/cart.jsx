import { useEffect, useState } from "react";
import { loadCart } from "../../utils/cartFunction";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const cartData = loadCart();
    console.log("Cart loaded:", cartData); // Log the loaded cart data
    setCart(cartData);
  }, []);

  return (
    <div className="w-full h-full overflow-y-scroll flex flex-wrap justify-center">
      {cart.map((item) => {
        console.log("Rendering item:", item); // Log each item being rendered
        return (
          <span key={item.productId}>
            {item.productId} X {item.qty}
          </span>
        );
      })}
    </div>
  );
}

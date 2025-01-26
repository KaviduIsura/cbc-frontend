import { useEffect, useState } from "react";
import { loadCart } from "../../utils/cartFunction";
import CartCard from "../../components/cartCard";
import axios from "axios";

export default function Cart() {
  const [cart, setCart] = useState([]);
const[total,setTotal]=useState(0)
const [labelTotal,setLabelTotal]=useState(0)


  useEffect(() => {
    const cartData = loadCart();
    setCart(cartData);
    axios.post(import.meta.env.VITE_BACKEND_URL+"/api/orders/quote",
        {
            orderedItems: loadCart()
        }
    ).then(
        (res)=>{
            console.log(res.data);
            setTotal(res.data.total)
            setLabelTotal(res.data.labelTotal)
        }
    )
  }, []);

  function onOrderCheckOutClick(){
    const token = localStorage.getItem("token")
    if(token == null){
        return
    }

    axios.post(import.meta.env.VITE_BACKEND_URL+"/api/orders",

        {
            orderedItems:cart,
            name:"Kavidu isura",
            address:"badulla",
            phone:"0776479026"
        },
        {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
    ).then(
        (res)=>{
            console.log(res.data);
        }
    )

  }
  return (
    <div className="w-full h-full overflow-y-scroll flex flex-col items-end">
        <table className="w-full">
<thead>
    <th>Image</th>
    <th>Product Name</th>
    <th>Product Id</th>
    <th>Quantity</th>
    <th>Price</th>
    <th>Total</th>
</thead>

        
      {cart.map((item) => {
        return (
          <CartCard
            key={item.productId}
            productId={item.productId}
            qty={item.qty}
          />
        );
      })}
      </table>
      <h1 className="text-3xl font-bold text-accent">Total : LKR {labelTotal.toFixed(2)}</h1>
      <h1 className="text-3xl font-bold text-accent">Discount : LKR {(labelTotal-total).toFixed(2)}</h1>
      <h1 className="text-3xl font-bold text-accent">Grand Total : LKR {total.toFixed(2)}</h1>
      <button className="bg-accent text-white p-2 rounded-lg w-[300px] hover:bg-accent_light hover:text-black " onClick={onOrderCheckOutClick}>Checkout</button>
    </div>
  );
}

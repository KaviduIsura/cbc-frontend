import {Link} from "react-router-dom"

export default function ProductCard(props){
    console.log(props)
    return(
      <Link to={`/productInfo/${props.product.productId}`}>
        <div className="w-[300px] h-[500px]  m-[80px] rounded-xl shadow-lg shadow-gray-500 hover:shadow-primary hover:border-[3px] overflow-hidden flex flex-col">
        
            <img src={props.product.images[0]} alt={props.product.productName} className="w-full h-[65%] object-cover"/>
            <div className="max-h-[35%] h-[35%] p-4 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-center text-accent">{props.product.productName}</h1>
            <h2 className="text-lg text-center text-gray-500 ">{props.product.productId}</h2>
           <p className="text-lg text-left font-semibold text-gray-500 line-through">LKR {props.product.lastPrice.toFixed(2)}</p>
           {
            (props.product.lastPrice<props.product.price)&&
            <p className="text-lg text-left font-semibold">LKR {props.product.price.toFixed(2)}</p>
           }
           
           
            </div>
           
        
        </div>

      </Link>
    )
}
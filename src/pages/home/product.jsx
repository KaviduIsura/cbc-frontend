import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import ProductCard from "../../components/productCard"

export default function ProductPage(){
    const [products,setProducts] = useState([])
    const [productLoading,setProductLoading ] = useState('loading')

    useEffect(
        ()=>{
            if(productLoading==='loading'){
                axios.get(import.meta.env.VITE_BACKEND_URL+'/api/products').then(
                    (res)=>{
                        console.log(res.data)
                        setProducts(res.data.list)
                        setProductLoading('loaded')
                    }
                   
                ).catch(
                   (err)=>toast.error('Error loading products')
                )
            }
          
        }
    ,[])
    return(
        <div className="w-full h-full overflow-y-scroll flex flex-wrap justify-center">
             {
        products.map((product)=>
                <ProductCard product={product}/>
        )
       }
        </div>
      
    )
}
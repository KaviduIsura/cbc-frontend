import axios from 'axios'
export default function AdminProductsPage(){
    axios.get("http://localhost:5000/api/products").then((res)=>{
        console.log(res);
    })
        
 
    return(
        <div>
            <h1>Admin Product Page</h1>
        </div>
    )
    
}
import { useState } from "react"

export default function ImageSlider(props){
    const images = props.images
    const [activeImage, setActiveImage] = useState(0)
    return(
        <div className="w-full aspect-square flex items-center flex-col relative">
            <img src={images[activeImage]} className="w-full aspect-square object-cover" alt="" />
            <div className="w-full h-[120px] backdrop-blur-lg absolute bottom-0">
                <div className="w-full h-full  flex items-center justify-center overflow-hidden">
                {images.map((image,index)=>(
                    <img key={index} src={image} onClick={()=>setActiveImage(index)} className="w-24 h-24 object-cover mx-2 cursor-pointer" />
                ))}
                </div>
             
            </div>
            
        </div>
    )
}
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';

const ProductCard = ({ product, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      {/* Badges */}
      <div className="absolute z-10 flex gap-2 top-4 left-4">
        {product.isNew && (
          <span className="px-3 py-1 text-xs font-light tracking-wide bg-white">NEW</span>
        )}
        {product.isBestSeller && (
          <span className="px-3 py-1 text-xs font-light text-white bg-black">BESTSELLER</span>
        )}
      </div>

      <button className="absolute z-10 transition-opacity opacity-0 top-4 right-4 group-hover:opacity-100">
        <Heart className="w-5 h-5" />
      </button>

      {/* Image */}
      <div className="mb-4 overflow-hidden aspect-square bg-gray-50">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <p className="text-xs font-light tracking-wide text-gray-500">{product.category}</p>
        <h3 className="text-lg font-light">{product.name}</h3>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm">{product.rating}</span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="text-sm font-light">240 reviews</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-light">{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
          )}
        </div>

        <button className="w-full py-3 mt-4 font-light tracking-wider text-black transition-all border border-black hover:bg-black hover:text-white">
          Add to Ritual
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
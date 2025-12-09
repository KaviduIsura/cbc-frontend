import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowRight } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="container px-6 py-20 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gray-50">
                <Search className="w-16 h-16 text-gray-300" />
              </div>
              <div className="absolute inset-0 border-2 border-gray-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          
          <h1 className="mb-4 text-5xl font-light">Formulation Not Found</h1>
          
          <p className="mb-8 text-xl text-gray-600">
            The product you're looking for has either been moved or no longer exists.
          </p>
          
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
            >
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Link>
            
            <Link
              to="/shop/all"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-light text-black transition-colors border border-gray-300 rounded-lg hover:border-black"
            >
              Browse All Formulations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          
          <div className="p-6 mt-12 border border-gray-100 rounded-lg bg-gray-50">
            <p className="mb-3 text-sm text-gray-600">Try searching for:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Perfumes', 'Skincare', 'Makeup', 'Tools'].map((category) => (
                <Link
                  key={category}
                  to={`/shop/${category.toLowerCase()}`}
                  className="px-4 py-2 text-sm font-light transition-colors border border-gray-200 rounded-lg hover:border-black hover:text-black"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
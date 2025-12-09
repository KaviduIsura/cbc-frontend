import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Droplets, Leaf, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const IngredientLayout = ({ 
  children, 
  title, 
  subtitle, 
  heroImage, 
  origin,
  colorScheme = 'from-amber-900/40 to-transparent'
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-end">
        <div 
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-b ${colorScheme}`} />
        </div>
        
        <div className="container relative z-10 px-6 pb-12 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-white"
          >
            <Link 
              to="/ingredients" 
              className="inline-flex items-center gap-2 mb-6 text-sm font-light hover:opacity-80"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Ingredients
            </Link>
            
            <div className="mb-4 text-sm font-light tracking-wider uppercase opacity-80">
              Sacred Ingredient
            </div>
            <h1 className="mb-4 text-5xl font-light leading-tight md:text-6xl">
              {title}
            </h1>
            <p className="mb-6 text-xl opacity-90">
              {subtitle}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-light rounded-full bg-white/20 backdrop-blur-sm">
              <span>Origin: {origin}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container px-6 py-16 mx-auto">
        {children}
      </div>

      {/* Related Ingredients */}
      <section className="py-16 bg-gray-50">
        <div className="container px-6 mx-auto">
          <h2 className="mb-8 text-2xl font-light text-center">Explore Other Ingredients</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: 'Oud & Attars', href: '/ingredients/oud', color: 'bg-amber-50' },
              { name: 'Saffron & Gold', href: '/ingredients/saffron', color: 'bg-yellow-50' },
              { name: 'Argan & Rose', href: '/ingredients/argan', color: 'bg-pink-50' },
              { name: 'Sandalwood', href: '/ingredients/sandalwood', color: 'bg-stone-50' },
            ].map((ingredient, index) => (
              <Link
                key={index}
                to={ingredient.href}
                className={`p-6 text-center rounded-lg transition-all hover:shadow-lg ${ingredient.color}`}
              >
                <div className="mb-4 text-sm font-light text-gray-600">
                  {ingredient.name.split(' & ')[0]}
                </div>
                <div className="text-lg font-light">
                  {ingredient.name.split(' & ')[1]}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default IngredientLayout;
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Sparkles, 
  Droplets, 
  BookOpen,
  Award
} from 'lucide-react';
import { TreePine as Tree } from 'lucide-react';
import sandlewood from '../../../assets/sandalwood.jpg'
import argon from '../../../assets/argon.jpg'
import rose from '../../../assets/rose.jpg'
import saffron from '../../../assets/saffron.jpg'


const IngredientsIndex = () => {
  const ingredients = [
    {
      name: 'Oud & Attars',
      description: 'Rare resin from infected agarwood trees',
      benefits: ['Spiritual', 'Aphrodisiac', 'Meditative'],
      image: argon,
      href: '/ingredients/oud',
      color: 'amber'
    },
    {
      name: 'Saffron & Gold',
      description: 'World\'s most precious spice with 24k gold',
      benefits: ['Brightening', 'Anti-aging', 'Luxury'],
      image: saffron,
      href: '/ingredients/saffron',
      color: 'yellow'
    },
    {
      name: 'Argan & Rose',
      description: 'Moroccan oil meets Persian floral elegance',
      benefits: ['Hydrating', 'Soothing', 'Firming'],
      image: rose,
      href: '/ingredients/argan',
      color: 'pink'
    },
    {
      name: 'Sandalwood',
      description: 'Sacred wood of meditation and mindfulness',
      benefits: ['Calming', 'Anti-inflammatory', 'Spiritual'],
      image: sandlewood,
      href: '/ingredients/sandalwood',
      color: 'brown'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="py-20 bg-gray-50">
        <div className="container px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-light text-gray-600 bg-white border border-gray-200 rounded-full">
              <Leaf className="w-4 h-4" />
              <span>Ingredient Library</span>
            </div>
            <h1 className="mb-6 text-5xl font-light">Sacred Ingredients</h1>
            <p className="text-xl text-gray-600">
              Explore the cultural heritage and scientific benefits behind our 
              carefully sourced ingredients
            </p>
          </motion.div>
        </div>
      </div>

      {/* Ingredients Grid */}
      <div className="py-20">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {ingredients.map((ingredient, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={ingredient.href}
                  className="block overflow-hidden rounded-lg group"
                >
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={ingredient.image}
                      alt={ingredient.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute text-white bottom-4 left-4">
                      <div className="text-lg font-light">{ingredient.name}</div>
                    </div>
                  </div>
                  
                  <div className="p-6 border border-t-0 border-gray-100">
                    <p className="mb-4 text-gray-600">{ingredient.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {ingredient.benefits.map((benefit, idx) => (
                        <span key={idx} className="px-3 py-1 text-xs font-light text-gray-500 bg-gray-100 rounded-full">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientsIndex;
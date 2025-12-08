import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const CategoryGrid = () => {
  const categories = [
    {
      title: 'Perfumes & Scents',
      description: 'Artisanal fragrances',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop',
      count: '24 items'
    },
    {
      title: 'Skincare Rituals',
      description: 'Ancient formulations',
      image: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop',
      count: '18 items'
    },
    {
      title: 'Cultural Tools',
      description: 'Traditional implements',
      image: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1035&auto=format&fit=crop',
      count: '12 items'
    }
  ];

  return (
    <section className="py-20">
      <div className="container px-6 mx-auto">
        <h2 className="mb-12 text-3xl font-light text-center">Explore by Ritual</h2>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden group"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  src={category.image}
                  alt={category.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/30 to-transparent group-hover:opacity-100" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transition-transform duration-300 transform translate-y-2 group-hover:translate-y-0">
                <h3 className="mb-2 text-2xl font-light">{category.title}</h3>
                <p className="mb-4 text-sm font-light">{category.description}</p>
                <a href="#" className="inline-flex items-center pb-1 text-sm font-light border-b border-white/30">
                  Explore {category.count} <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ChevronRight, Star, Check, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../../components/ProductCard';
import HeroSection from '../../components/HeroSection';
import CategoryGrid from '../../components/CategoryGrid';
import BenefitsSection from '../../components/BenefitsSection';
import Footer from '../../components/footer';
import ImageSlider from '../../components/imageSlider';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sample featured products
  const featuredProducts = [
    {
      id: 1,
      name: 'Sacred Oud Eau de Parfum',
      category: 'Perfumes',
      price: '$189',
      originalPrice: '$220',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop',
      isNew: true,
    },
    {
      id: 2,
      name: 'Golden Saffron Elixir Serum',
      category: 'Skincare',
      price: '$145',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Maroccan Argan Night Cream',
      category: 'Skincare',
      price: '$98',
      originalPrice: '$120',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1140&auto=format&fit=crop',
      isBestSeller: true,
    },
    {
      id: 4,
      name: 'Rose Otto Face Oil',
      category: 'Skincare',
      price: '$165',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1140&auto=format&fit=crop',
    },
  ];


  return (
    <div className="min-h-screen bg-white">      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Benefits Bar */}
      <BenefitsSection />
      
      {/* Featured Products */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="mb-2 text-3xl font-light">Curated Collections</h2>
              <p className="text-gray-500">Essentials for your beauty ritual</p>
            </div>
            <a href="#" className="flex items-center text-sm font-light hover:text-gray-600">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Image slider */}      
      <ImageSlider />
      
      {/* Categories Section */}
      <CategoryGrid />
      
      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6 text-3xl font-light">Ancient Wisdom, Modern Science</h2>
            <p className="mb-8 leading-relaxed text-gray-600">
              We merge centuries-old beauty traditions with cutting-edge dermatological research. 
              Each product is a testament to cultural heritage, reimagined for the contemporary ritual.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-8 py-3 font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800"
            >
              Discover Our Story <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t">
        <div className="container px-6 mx-auto">
          <div className="max-w-md mx-auto text-center">
            <h3 className="mb-4 text-2xl font-light">Join Our Community</h3>
            <p className="mb-6 text-gray-500">Receive exclusive insights on rituals and early access to new formulations.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400"
              />
              <button 
                type="submit"
                className="px-6 py-3 font-light text-white transition-colors bg-black hover:bg-gray-800"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Heart, 
  Package, 
  Sparkles,
  CheckCircle,
  Shield,
  Globe,
  Award,
  Droplets,
  Star,
  Users,
  Recycle,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const BenefitsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const benefits = [
    { 
      icon: <Leaf className="w-6 h-6" />, 
      title: 'Clean Ingredients', 
      desc: '100% Natural & Organic formulations from sustainable sources',
      highlight: 'No synthetic additives',
      stat: '150+ Ingredients'
    },
    { 
      icon: <Heart className="w-6 h-6" />, 
      title: 'Cruelty-Free', 
      desc: 'Never tested on animals, certified by Leaping Bunny',
      highlight: 'PETA Approved',
      stat: 'Certified'
    },
    { 
      icon: <Package className="w-6 h-6" />, 
      title: 'Sustainable', 
      desc: 'Eco-friendly packaging that is 100% recyclable',
      highlight: 'Carbon Neutral Shipping',
      stat: 'Zero Waste'
    },
    { 
      icon: <Sparkles className="w-6 h-6" />, 
      title: 'Cultural Heritage', 
      desc: 'Ancient wisdom preserved through modern formulations',
      highlight: 'Centuries-old recipes',
      stat: '500+ Years'
    },
    { 
      icon: <Droplets className="w-6 h-6" />, 
      title: 'Hydration Science', 
      desc: 'Advanced moisture-lock technology with natural extracts',
      highlight: '72hr Hydration',
      stat: 'Clinical Studies'
    },
    { 
      icon: <Star className="w-6 h-6" />, 
      title: 'Premium Quality', 
      desc: 'Handcrafted in small batches for maximum potency',
      highlight: 'Artisan Made',
      stat: 'Small Batch'
    },
    { 
      icon: <Users className="w-6 h-6" />, 
      title: 'Community Focused', 
      desc: 'Supporting local communities and traditional artisans',
      highlight: 'Fair Trade',
      stat: '50+ Communities'
    },
    { 
      icon: <Recycle className="w-6 h-6" />, 
      title: 'Circular Economy', 
      desc: 'Refill program to reduce environmental footprint',
      highlight: 'Refill & Reuse',
      stat: '80% Less Waste'
    },
    { 
      icon: <Clock className="w-6 h-6" />, 
      title: 'Time-Honored', 
      desc: 'Traditional slow-craft methods for superior quality',
      highlight: 'Slow Crafted',
      stat: '28 Day Process'
    },
  ];

  const cardsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 4
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + cardsPerView.desktop >= benefits.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? benefits.length - cardsPerView.desktop : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Get visible cards
  const visibleBenefits = benefits.slice(currentIndex, currentIndex + cardsPerView.desktop);

  return (
    <div className="py-20 bg-gray-50">
      <div className="container px-6 mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-light">Why Choose ELEVÉ</h2>
          <p className="text-gray-600">
            Discover what makes our approach to beauty different—where heritage meets innovation.
          </p>
        </motion.div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 z-10 hidden p-2 text-gray-400 transition-colors transform -translate-x-4 -translate-y-1/2 border border-gray-200 rounded-full shadow-sm top-1/2 hover:text-black bg-white/80 hover:bg-white md:block"
            aria-label="Previous benefits"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 z-10 hidden p-2 text-gray-400 transition-colors transform translate-x-4 -translate-y-1/2 border border-gray-200 rounded-full shadow-sm top-1/2 hover:text-black bg-white/80 hover:bg-white md:block"
            aria-label="Next benefits"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Benefits Slider */}
          <div className="overflow-hidden">
            <motion.div 
              animate={{ x: `-${currentIndex * (100 / cardsPerView.desktop)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex gap-6"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % cardsPerView.desktop) * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="flex-shrink-0 w-full p-4 md:w-1/2 lg:w-1/4"
                >
                  <div className="relative h-full p-8 transition-all duration-300 bg-white border border-gray-100 rounded-lg hover:shadow-xl group">
                    {/* Icon Container */}
                    <div className="flex items-center justify-center w-16 h-16 mb-6 transition-all duration-300 rounded-full bg-gray-50 group-hover:bg-black group-hover:scale-110">
                      <div className="text-gray-600 transition-colors duration-300 group-hover:text-white">
                        {benefit.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="mb-3 text-lg font-light">{benefit.title}</h3>
                    <p className="mb-6 text-sm leading-relaxed text-gray-600">
                      {benefit.desc}
                    </p>
                    
                    {/* Highlight Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-2 mb-4 text-xs font-light text-gray-600 rounded-full bg-gray-50 group-hover:bg-black/5">
                      <CheckCircle className="w-3 h-3" />
                      {benefit.highlight}
                    </div>

                    {/* Stat */}
                    <div className="pt-4 mt-4 text-xs font-light text-gray-400 border-t border-gray-100">
                      {benefit.stat}
                    </div>

                    {/* Corner Decoration */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 transition-colors transform rotate-45 translate-x-16 -translate-y-16 bg-gray-50 group-hover:bg-black/5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {Array.from({ length: Math.ceil(benefits.length / cardsPerView.mobile) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index * cardsPerView.mobile)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex >= index * cardsPerView.mobile && 
                  currentIndex < (index + 1) * cardsPerView.mobile
                    ? 'bg-black w-4' 
                    : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Desktop Navigation Dots */}
          <div className="justify-center hidden gap-2 mt-8 md:flex">
            {Array.from({ length: Math.ceil(benefits.length / cardsPerView.desktop) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index * cardsPerView.desktop)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index * cardsPerView.desktop
                    ? 'bg-black w-4' 
                    : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Additional Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-16"
        >
        </motion.div>
      </div>
    </div>
  );
};

export default BenefitsSection;
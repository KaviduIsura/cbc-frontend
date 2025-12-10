import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const CategoryGrid = ({ categories }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const sliderRef = useRef(null);
  
  // Update visible cards based on screen size
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  // If no categories provided, use fallback
  const displayCategories = categories || [
    {
      id: 'perfumes',
      title: 'Perfumes & Scents',
      description: 'Artisanal fragrances',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop',
      count: '24 items'
    },
    {
      id: 'skincare',
      title: 'Skincare Rituals',
      description: 'Ancient formulations',
      image: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop',
      count: '18 items'
    },
    {
      id: 'makeup',
      title: 'Luxurious Makeup',
      description: 'Traditional beauty',
      image: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1035&auto=format&fit=crop',
      count: '12 items'
    },
    {
      id: 'tools',
      title: 'Ritual Tools',
      description: 'Traditional implements',
      image: 'https://images.unsplash.com/photo-1583339793403-3d9b001b6008?q=80&w=1140&auto=format&fit=crop',
      count: '8 items'
    }
  ];

  const nextSlide = () => {
    const maxSlide = displayCategories.length - visibleCards;
    if (currentSlide < maxSlide) {
      const newSlide = currentSlide + 1;
      setCurrentSlide(newSlide);
      if (sliderRef.current) {
        const cardElement = sliderRef.current.children[0];
        if (cardElement) {
          const cardWidth = cardElement.offsetWidth;
          const gap = 32; // gap-8 = 32px
          sliderRef.current.scrollLeft = newSlide * (cardWidth + gap);
        }
      }
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      const newSlide = currentSlide - 1;
      setCurrentSlide(newSlide);
      if (sliderRef.current) {
        const cardElement = sliderRef.current.children[0];
        if (cardElement) {
          const cardWidth = cardElement.offsetWidth;
          const gap = 32;
          sliderRef.current.scrollLeft = newSlide * (cardWidth + gap);
        }
      }
    }
  };

  // Calculate total slides
  const totalSlides = Math.max(0, displayCategories.length - visibleCards);
  const slides = Array.from({ length: totalSlides + 1 }, (_, i) => i);

  return (
    <section className="py-20">
      <div className="container px-6 mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-light">Explore by Ritual</h2>
          
          {displayCategories.length > visibleCards && (
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`p-2 border rounded-full transition-colors ${
                  currentSlide === 0 
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                    : 'border-gray-300 hover:border-black hover:text-black'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide >= totalSlides}
                className={`p-2 border rounded-full transition-colors ${
                  currentSlide >= totalSlides
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                    : 'border-gray-300 hover:border-black hover:text-black'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        {/* Categories Slider */}
        <div 
          ref={sliderRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ 
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-full snap-start"
              style={{
                width: `calc(${100 / visibleCards}% - ${(32 * (visibleCards - 1)) / visibleCards}px)`
              }}
            >
              <Link to={`/shop/${category.id}`}>
                <div className="relative overflow-hidden cursor-pointer group">
                  <div className="aspect-[4/5] overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                      src={category.image}
                      alt={category.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/30 to-transparent group-hover:opacity-100" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transition-transform duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <h3 className="mb-2 text-2xl font-light">{category.title}</h3>
                    <p className="mb-4 text-sm font-light">{category.description}</p>
                    <div className="inline-flex items-center pb-1 text-sm font-light border-b border-white/30">
                      Explore {category.count} <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Dots Indicator */}
        {displayCategories.length > visibleCards && slides.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {slides.map((slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => {
                  setCurrentSlide(slideIndex);
                  if (sliderRef.current) {
                    const cardElement = sliderRef.current.children[0];
                    if (cardElement) {
                      const cardWidth = cardElement.offsetWidth;
                      const gap = 32;
                      sliderRef.current.scrollLeft = slideIndex * (cardWidth + gap);
                    }
                  }
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === slideIndex ? 'bg-black' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${slideIndex + 1}`}
              />
            ))}
          </div>
        )}

        {/* Show all categories link if there are more than what's visible */}
        {displayCategories.length > visibleCards && (
          <div className="mt-8 text-center">
            <Link 
              to="/shop" 
              className="inline-flex items-center text-sm font-light text-gray-600 transition-colors hover:text-black"
            >
              View all categories
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

// Add CSS to hide scrollbar
const styles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default CategoryGrid;
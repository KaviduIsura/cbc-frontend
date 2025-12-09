import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Img1 from "../assets/perfume1.jpg"
import Img2 from "../assets/perfume2.jpg"
import Img3 from "../assets/perfume4.jpg"
import Img4 from "../assets/perfume3.jpg"


const ImageSlider = () => {
  const slides = [
    {
      id: 1,
      image: Img1,
      title: 'Cultural Heritage Collection',
    },
    {
      id: 2,
      image: Img2,
      title: 'Natural Ingredients',
    },
    {
      id: 3,
      image: Img3,
      title: 'Sustainable Packaging',
    },
    {
      id: 4,
      image: Img4,
      title: 'Sustainable Packaging',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container px-6 mx-auto">
        <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              
              <div className="absolute max-w-md text-white bottom-8 left-8">
                <h3 className="mb-2 text-2xl font-light">
                  {slides[currentSlide].title}
                </h3>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <button
            onClick={prevSlide}
            className="absolute p-2 transition-colors transform -translate-y-1/2 rounded-full left-4 top-1/2 bg-white/80 hover:bg-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute p-2 transition-colors transform -translate-y-1/2 rounded-full right-4 top-1/2 bg-white/80 hover:bg-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute flex gap-2 transform -translate-x-1/2 bottom-4 left-1/2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageSlider;
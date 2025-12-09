import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import OilImg from '../assets/main.jpg'
import BgImage from '../assets/background_landing.jpg'
const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen pt-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${BgImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-white/90"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 px-6 mx-auto">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left side - Original content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <span className="text-sm font-light tracking-widest uppercase">Cultural Formulations</span>
              <h1 className="mt-4 mb-6 text-5xl font-light leading-tight md:text-7xl">
                Beauty Rooted in <br />
                <span className="font-bold">Tradition</span>
              </h1>
              <p className="max-w-lg mb-10 text-lg text-gray-600">
                Experience the fusion of ancient beauty rituals with modern minimalist design. 
                Each product tells a story of cultural heritage.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <button className="flex items-center justify-center px-8 py-4 font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800">
                Explore Collections <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button className="px-8 py-4 font-light tracking-wider text-black transition-all border border-black hover:bg-black hover:text-white">
                View Rituals
              </button>
            </motion.div>
          </div>

          {/* Right side - New floating image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full max-w-lg ml-auto">
              {/* Main floating image */}
              <div className="relative overflow-hidden shadow-2xl">
                <img 
                  src={OilImg}
                  alt="Cultural beauty product arrangement"
                  className="object-cover w-full h-[500px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              
              {/* Floating decorative element 1 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute top-8 -left-8"
              >
                <div className="p-4 bg-white shadow-lg">
                  <div className="text-sm font-light">Saffron Elixir</div>
                  <div className="text-xs text-gray-500">Ancient Formula</div>
                </div>
              </motion.div>
              
              {/* Floating decorative element 2 */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute -bottom-6 -right-6"
              >
                <div className="p-6 bg-white shadow-lg">
                  <div className="text-2xl font-light">24+</div>
                  <div className="text-xs font-light text-gray-500">Heritage Ingredients</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute hidden transform -translate-x-1/2 bottom-8 left-1/2 lg:left-1/4 lg:translate-x-0"
        >
          <div className="w-px h-16 mx-auto bg-gray-300">
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-px h-8 bg-black"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
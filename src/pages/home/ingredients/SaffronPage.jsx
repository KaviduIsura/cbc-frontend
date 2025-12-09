import IngredientLayout from '../../../components/IngredientLayout';
import { motion } from 'framer-motion';
import { 
  Sun, 
  Star, 
  Award, 
  Droplets,
  Zap,
  Shield,
  Sparkles
} from 'lucide-react';
import saffron from '../../../assets/saffron.jpg'

const SaffronPage = () => {
  const details = {
    title: 'Saffron & Gold',
    subtitle: 'The crimson threads of luxury and luminosity',
    heroImage: saffron,
    origin: 'Iran, Spain, Kashmir',
    colorScheme: 'from-yellow-900/40 to-transparent'
  };

  return (
    <IngredientLayout {...details}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="mb-6 text-2xl font-light">The Golden Spice</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Saffron, derived from the stigma of the Crocus sativus flower, is the world's 
                  most expensive spice by weight. It takes approximately 75,000 saffron flowers 
                  to produce a single pound of saffron threads.
                </p>
                <p>
                  Ancient Egyptian queens used saffron in their baths for its beautifying 
                  properties. Cleopatra famously used saffron-infused milk baths to enhance 
                  her complexion. In traditional Ayurveda, saffron is considered a "sattvic" 
                  spice that promotes clarity and radiance.
                </p>
                <p>
                  Our formulations combine 24-karat gold nanoparticles with premium saffron 
                  extract, creating a synergy that targets hyperpigmentation while imparting 
                  a luxurious golden glow.
                </p>
              </div>
            </motion.div>

            {/* Key Compounds */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="mb-6 text-2xl font-light">Active Compounds</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'Crocin', effect: 'Powerful antioxidant, 100x Vitamin C' },
                  { name: 'Safranal', effect: 'Anti-inflammatory, mood-enhancing' },
                  { name: 'Picrocrocin', effect: 'Skin brightening, UV protection' },
                ].map((compound, index) => (
                  <div key={index} className="p-6 text-center border border-gray-100 rounded-lg">
                    <div className="mb-3 text-lg font-light text-yellow-600">{compound.name}</div>
                    <p className="text-sm text-gray-600">{compound.effect}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div>
            {/* Harvest Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 mb-6 border border-gray-100 rounded-lg"
            >
              <h3 className="mb-4 text-lg font-light">Harvest Facts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Harvest Season</span>
                  <span className="text-sm font-light">October-November</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Harvest Time</span>
                  <span className="text-sm font-light">Dawn (before flowers open)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Labor Required</span>
                  <span className="text-sm font-light">40 hours/ounce</span>
                </div>
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 border border-gray-100 rounded-lg"
            >
              <h3 className="mb-4 text-lg font-light">Skin Benefits</h3>
              <div className="space-y-3">
                {[
                  { icon: <Sparkles className="w-4 h-4" />, text: 'Reduces dark spots by 45% in 4 weeks' },
                  { icon: <Shield className="w-4 h-4" />, text: 'Protects against blue light damage' },
                  { icon: <Droplets className="w-4 h-4" />, text: 'Increases hydration by 200%' },
                  { icon: <Zap className="w-4 h-4" />, text: 'Boosts collagen production' },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-yellow-500">{benefit.icon}</div>
                    <span className="text-sm text-gray-600">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </IngredientLayout>
  );
};

export default SaffronPage;
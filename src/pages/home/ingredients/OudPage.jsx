import IngredientLayout from '../../../components/IngredientLayout';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Droplets, 
  Heart, 
  Moon, 
  Star, 
  Thermometer,
  Wind,
  Zap
} from 'lucide-react';
import argon from '../../../assets/argon.jpg'

const OudPage = () => {
  const details = {
    title: 'Oud & Attars',
    subtitle: 'The liquid gold of perfumery, cherished for millennia',
    heroImage: argon,
    origin: 'Middle East & Southeast Asia',
    colorScheme: 'from-amber-900/40 to-transparent'
  };

  const benefits = [
    { icon: <Heart className="w-5 h-5" />, title: 'Emotional Balance', desc: 'Calms the mind and uplifts spirits' },
    { icon: <Wind className="w-5 h-5" />, title: 'Spiritual Connection', desc: 'Used in meditation and prayer' },
    { icon: <Zap className="w-5 h-5" />, title: 'Aphrodisiac', desc: 'Stimulates attraction and romance' },
    { icon: <Moon className="w-5 h-5" />, title: 'Deep Relaxation', desc: 'Promotes restful sleep' },
  ];

  const productionSteps = [
    { step: 1, title: 'Infection', desc: 'Aquilaria trees naturally infected with mold' },
    { step: 2, title: 'Resin Formation', desc: 'Tree produces dark, aromatic resin as defense' },
    { step: 3, title: 'Harvesting', desc: 'Trees aged 20+ years carefully harvested' },
    { step: 4, title: 'Distillation', desc: 'Resin steam-distilled for 30+ days' },
  ];

  return (
    <IngredientLayout {...details}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="mb-6 text-2xl font-light">The Sacred Resin</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Oud, also known as agarwood, is one of the world's most precious and rare 
                  ingredients. Formed when the Aquilaria tree becomes infected with a specific 
                  type of mold, it produces a dark, aromatic resin as a defense mechanism.
                </p>
                <p>
                  For over 3,000 years, oud has been mentioned in ancient texts including 
                  the Sanskrit Vedas, the Old Testament, and classical Chinese medical texts. 
                  It was so valuable that it was often traded weight-for-weight with gold.
                </p>
                <p>
                  In Middle Eastern culture, burning oud (bakhoor) is a sign of hospitality 
                  and celebration. The scent is believed to purify spaces and attract 
                  positive energy.
                </p>
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="mb-6 text-2xl font-light">Traditional Benefits</h2>
              <div className="grid grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="p-6 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full text-amber-600 bg-amber-50">
                        {benefit.icon}
                      </div>
                      <h3 className="font-light">{benefit.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Production Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="mb-6 text-2xl font-light">Artisanal Production</h2>
              <div className="space-y-4">
                {productionSteps.map((step) => (
                  <div key={step.step} className="flex gap-6 p-6 border border-gray-100 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 text-lg font-light text-white rounded-full bg-amber-900">
                        {step.step}
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 font-light">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="sticky space-y-8 top-24"
            >
              {/* Quick Facts */}
              <div className="p-6 border border-gray-100 rounded-lg">
                <h3 className="mb-4 text-lg font-light">Quick Facts</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Scientific Name</span>
                    <span className="text-sm font-light">Aquilaria</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Aging Required</span>
                    <span className="text-sm font-light">20+ years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Yield per Tree</span>
                    <span className="text-sm font-light">~300g resin</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Price Range</span>
                    <span className="text-sm font-light">$5,000-$50,000/kg</span>
                  </div>
                </div>
              </div>

              {/* Scent Profile */}
              <div className="p-6 border border-gray-100 rounded-lg">
                <h3 className="mb-4 text-lg font-light">Scent Profile</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-gray-500">Woody</span>
                      <span className="font-light">90%</span>
                    </div>
                    <div className="h-1 rounded-full bg-amber-100">
                      <div className="w-11/12 h-full rounded-full bg-amber-600"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-gray-500">Balsamic</span>
                      <span className="font-light">75%</span>
                    </div>
                    <div className="h-1 rounded-full bg-amber-100">
                      <div className="w-3/4 h-full rounded-full bg-amber-500"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-gray-500">Sweet</span>
                      <span className="font-light">60%</span>
                    </div>
                    <div className="h-1 rounded-full bg-amber-100">
                      <div className="w-3/5 h-full rounded-full bg-amber-400"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Products */}
              <div className="p-6 border border-gray-100 rounded-lg">
                <h3 className="mb-4 text-lg font-light">Featured Products</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="w-12 h-12 rounded bg-amber-100"></div>
                    <div>
                      <div className="text-sm font-light">Royal Oud Attar</div>
                      <div className="text-xs text-gray-500">Pure concentration</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="w-12 h-12 rounded bg-amber-100"></div>
                    <div>
                      <div className="text-sm font-light">Oud Wood Perfume</div>
                      <div className="text-xs text-gray-500">Modern blend</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </IngredientLayout>
  );
};

export default OudPage;
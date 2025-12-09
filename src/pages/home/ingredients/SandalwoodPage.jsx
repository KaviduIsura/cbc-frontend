import IngredientLayout from '../../../components/IngredientLayout';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Brain,
  Shield,
  Zap
} from 'lucide-react';
import { TreePine as Tree } from 'lucide-react';
import sandlewood from '../../../assets/sandalwood.jpg'

const SandalwoodPage = () => {
  const details = {
    title: 'Sandalwood',
    subtitle: 'The sacred wood of meditation and mindfulness',
    heroImage: sandlewood,
    origin: 'India, Australia',
    colorScheme: 'from-brown-900/40 to-transparent'
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
              <h2 className="mb-6 text-2xl font-light">The Heartwood Essence</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  True sandalwood (Santalum album) is one of the most revered ingredients in 
                  Ayurveda, known as "Chandana." It must age for at least 30 years before 
                  the heartwood develops its full aromatic and therapeutic potential.
                </p>
                <p>
                  In Hindu and Buddhist traditions, sandalwood paste is applied to the forehead 
                  during religious ceremonies to cool the mind and enhance spiritual awareness. 
                  Ancient temples were often constructed from sandalwood for its preservative 
                  and aromatic properties.
                </p>
                <p>
                  Modern research confirms sandalwood's ability to increase alpha brain waves 
                  by 40%, promoting a meditative state and reducing anxiety. Its 
                  anti-inflammatory properties make it ideal for sensitive and reactive skin.
                </p>
              </div>
            </motion.div>
          </div>

          <div>
            {/* Aging Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 mb-6 border border-gray-100 rounded-lg"
            >
              <h3 className="mb-4 text-lg font-light">Aging Timeline</h3>
              <div className="space-y-4">
                {[
                  { years: '0-15', stage: 'Sapling growth', color: 'bg-brown-100' },
                  { years: '15-30', stage: 'Heartwood formation', color: 'bg-brown-200' },
                  { years: '30-50', stage: 'Aroma development', color: 'bg-brown-300' },
                  { years: '50+', stage: 'Peak potency', color: 'bg-brown-400' },
                ].map((stage, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-light">{stage.years} years</div>
                      <div className="text-xs text-gray-500">{stage.stage}</div>
                    </div>
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

export default SandalwoodPage;
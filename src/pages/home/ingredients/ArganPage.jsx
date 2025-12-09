import IngredientLayout from '../../../components/IngredientLayout';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Shield, 
  Sun,
  Heart,
  Users
} from 'lucide-react';
import { TreePine as Tree } from 'lucide-react';
import rose from '../../../assets/rose.jpg'

const ArganPage = () => {
  const details = {
    title: 'Argan & Rose',
    subtitle: 'Moroccan liquid gold meets Persian floral elegance',
    heroImage: rose,
    origin: 'Morocco & Iran',
    colorScheme: 'from-pink-900/40 to-transparent'
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
              <h2 className="mb-6 text-2xl font-light">Berber Beauty Secret</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Argan oil, extracted from the kernels of the argan tree (endemic to Morocco), 
                  has been used by Berber women for centuries as a beauty elixir. The argan 
                  forest is a UNESCO-protected biosphere, and production is exclusively managed 
                  by women's cooperatives.
                </p>
                <p>
                  Damask rose (Rosa damascena), known as "Gol-e Mohammadi" in Persian, blooms 
                  for only 20-30 days each spring in Iran's Rose Valley. It takes approximately 
                  10,000 roses to produce just 5ml of rose otto absolute.
                </p>
                <p>
                  Together, these ingredients create a powerful synergy: argan oil's nourishing 
                  fatty acids combined with rose's anti-inflammatory compounds provide 
                  comprehensive skin nourishment and emotional uplift.
                </p>
              </div>
            </motion.div>
          </div>

          <div>
            {/* Production Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 border border-gray-100 rounded-lg"
            >
              <h3 className="mb-4 text-lg font-light">Women's Cooperatives</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>All our argan oil comes from women-run cooperatives in Morocco that:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-pink-500" />
                    <span>Provide fair wages and literacy programs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Tree className="w-4 h-4 text-pink-500" />
                    <span>Practice sustainable harvesting methods</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span>Preserve traditional Berber knowledge</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </IngredientLayout>
  );
};

export default ArganPage;
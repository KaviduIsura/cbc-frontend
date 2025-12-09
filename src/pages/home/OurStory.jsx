import { motion } from 'framer-motion';
import { 
  Heart, 
  Leaf, 
  Clock, 
  Users, 
  Globe, 
  Award, 
  Sparkles,
  ChevronRight,
  Quote,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BgImg from '../../assets/bg_story.jpg'
import MainImg from '../../assets/our_story_main.jpg'
import story1 from '../../assets/story1.jpg'
import story2 from '../../assets/story2.jpg'
import story3 from '../../assets/story3.jpg'
import story4 from '../../assets/story4.jpg'



const OurStoryPage = () => {
  const timeline = [
    { year: '2015', title: 'The Beginning', desc: 'Founded with a vision to bridge ancient beauty rituals with modern science' },
    { year: '2017', title: 'First Collection', desc: 'Launched our debut line of Oud-based perfumes and Argan skincare' },
    { year: '2019', title: 'Sustainable Commitment', desc: 'Transitioned to 100% recyclable packaging and carbon-neutral operations' },
    { year: '2021', title: 'Global Recognition', desc: 'Received Beauty Innovator Award for cultural preservation' },
    { year: '2023', title: 'Community Expansion', desc: 'Partnered with 50+ artisan communities across 3 continents' },
  ];

  const values = [
    { icon: <Heart className="w-6 h-6" />, title: 'Cultural Integrity', desc: 'Preserving authentic traditions without appropriation' },
    { icon: <Leaf className="w-6 h-6" />, title: 'Sustainable Sourcing', desc: 'Ethically sourcing ingredients from verified communities' },
    { icon: <Clock className="w-6 h-6" />, title: 'Slow Craftsmanship', desc: 'Traditional methods, modern precision' },
    { icon: <Users className="w-6 h-6" />, title: 'Community First', desc: 'Supporting artisan communities through fair partnerships' },
    { icon: <Globe className="w-6 h-6" />, title: 'Global Consciousness', desc: 'Minimal environmental impact, maximum cultural impact' },
    { icon: <Award className="w-6 h-6" />, title: 'Excellence', desc: 'Never compromising on quality or integrity' },
  ];

  const founders = [
    { name: 'Aisha Al-Farsi', role: 'Cultural Anthropologist', quote: 'Beauty is not just appearance—it\'s heritage made visible.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1061&auto=format&fit=crop' },
    { name: 'Dr. Elena Rodriguez', role: 'Dermatologist', quote: 'Ancient wisdom meets modern science for transformative results.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1170&auto=format&fit=crop' },
    { name: 'Leila Chen', role: 'Master Perfumer', quote: 'Every scent tells a story of place, people, and tradition.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=988&auto=format&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-center bg-cover"
          style={{
            backgroundImage:`url(${BgImg})`,
          }}
        >
          <div className="absolute inset-0 bg-white/80"></div>
        </div>
        
        <div className="container relative z-10 px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="mb-6 text-5xl font-light leading-tight md:text-7xl">
              Beauty with <span className="font-bold">Purpose</span>
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              Where centuries-old traditions meet contemporary minimalism. 
              Our story is woven from cultural heritage and modern innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Introduction */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-light">Our Journey Begins</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  In 2015, three women from different corners of the world united with a shared vision: 
                  to preserve cultural beauty traditions while making them accessible to the modern world.
                </p>
                <p>
                  Aisha, a cultural anthropologist from Morocco, witnessed firsthand how ancient beauty 
                  rituals were fading with globalization. Dr. Elena, a dermatologist, saw the scientific 
                  potential in these traditional formulations. Leila, a third-generation perfumer from 
                  Hong Kong, understood the artistry of scent and tradition.
                </p>
                <p>
                  Together, they founded ELEVÉ—a name meaning "elevated" in French—to honor the 
                  elevation of traditional beauty into modern luxury.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="overflow-hidden rounded-lg aspect-square">
                <img 
                  src={MainImg} 
                  alt="Artisan crafting beauty products"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute max-w-xs p-6 bottom-6 left-6 bg-white/90 backdrop-blur-sm">
                <p className="text-sm italic text-gray-600">
                  "Beauty rituals are living traditions—they should evolve, not disappear."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-light">Our Evolution</h2>
            <p className="text-gray-600">Key milestones in our journey of cultural preservation</p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute hidden w-px h-full transform -translate-x-1/2 bg-gray-200 left-1/2 md:block"></div>
            
            {/* Timeline Items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Year */}
                  <div className="mb-4 md:w-1/2 md:px-8 md:mb-0">
                    <div className={`text-right ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                      <div className="text-2xl font-light text-gray-400">{item.year}</div>
                    </div>
                  </div>
                  
                  {/* Dot */}
                  <div className="absolute hidden w-4 h-4 transform -translate-x-1/2 bg-black rounded-full left-1/2 md:block"></div>
                  
                  {/* Content */}
                  <div className="md:w-1/2 md:px-8">
                    <div className={`p-6 bg-white border border-gray-100 rounded-lg shadow-sm ${
                      index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                    }`}>
                      <h3 className="mb-2 text-lg font-light">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-light">Our Guiding Principles</h2>
            <p className="text-gray-600">The values that shape every formulation and partnership</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 text-center transition-all border border-gray-100 rounded-lg hover:shadow-lg"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-gray-50">
                    <div className="text-gray-600">{value.icon}</div>
                  </div>
                </div>
                <h3 className="mb-3 text-lg font-light">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-light">The Founders</h2>
            <p className="text-gray-600">Three visionaries, one mission</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="aspect-square overflow-hidden rounded-full mb-4 mx-auto max-w-[200px]">
                    <img 
                      src={founder.image} 
                      alt={founder.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="absolute bottom-0 p-2 bg-white rounded-full shadow-sm right-1/4">
                    <Sparkles className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <h3 className="mb-1 text-lg font-light">{founder.name}</h3>
                <p className="mb-4 text-sm text-gray-500">{founder.role}</p>
                <div className="relative p-4 bg-white border border-gray-100 rounded-lg">
                  <Quote className="absolute w-4 h-4 text-gray-200 -top-2 left-4" />
                  <p className="text-sm italic text-gray-600">"{founder.quote}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Impact */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-light">Beyond Beauty</h2>
              <div className="mb-8 space-y-4 text-gray-600">
                <p>
                  ELEVÉ is more than a beauty brand—it's a movement to preserve cultural heritage. 
                  We work directly with artisan communities, ensuring traditional methods are 
                  preserved and practitioners are fairly compensated.
                </p>
                <p>
                  Through our Heritage Preservation Fund, 5% of every purchase supports 
                  cultural education programs and artisan workshops worldwide.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 border border-gray-100 rounded-lg">
                  <div className="text-2xl font-light text-gray-800">50+</div>
                  <div className="text-xs text-gray-500">Artisan Communities</div>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg">
                  <div className="text-2xl font-light text-gray-800">15</div>
                  <div className="text-xs text-gray-500">Countries</div>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg">
                  <div className="text-2xl font-light text-gray-800">$2.5M+</div>
                  <div className="text-xs text-gray-500">Community Investment</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="overflow-hidden rounded-lg aspect-square">
                <img 
                  src={story1}
                  alt="Artisan at work"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="overflow-hidden rounded-lg aspect-square">
                <img 
                  src={story2}
                  alt="Community workshop"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="overflow-hidden rounded-lg aspect-square">
                <img 
                  src={story3} 
                  alt="Sustainable harvesting"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="overflow-hidden rounded-lg aspect-square">
                <img 
                  src={story4}
                  alt="Product craftsmanship"
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white bg-black">
        <div className="container px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-3xl font-light">Join Our Journey</h2>
              <p className="mb-8 text-gray-300">
                Experience beauty that respects tradition, honors craftsmanship, 
                and celebrates cultural diversity.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-8 py-3 font-light tracking-wider text-black transition-colors bg-white hover:bg-gray-100"
                >
                  Explore Collections <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="/ingredients"
                  className="inline-flex items-center justify-center px-8 py-3 font-light tracking-wider text-white transition-colors border border-white hover:bg-white hover:text-black"
                >
                  Discover Ingredients
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStoryPage;
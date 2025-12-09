import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock,
  Users,
  Star,
  Heart,
  Bookmark,
  Share2,
  Play,
  ChevronRight,
  ArrowRight,
  Target,
  Droplets,
  Moon,
  Sun,
  Wind,
  Feather,
  Sparkles,
  Award,
  CheckCircle,
  Calendar,
  Zap,
  Leaf,
  Gem
} from 'lucide-react';
import bgImg from '../../assets/bg_rituals.jpg'
import { Link } from 'react-router-dom';

const RitualsPage = () => {
  const [activeRitual, setActiveRitual] = useState('morning');
  const [savedRituals, setSavedRituals] = useState([]);

  const ritualCategories = [
    { id: 'morning', name: 'Morning Rituals', icon: <Sun className="w-5 h-5" /> },
    { id: 'evening', name: 'Evening Rituals', icon: <Moon className="w-5 h-5" /> },
    { id: 'weekly', name: 'Weekly Treatments', icon: <Calendar className="w-5 h-5" /> },
    { id: 'seasonal', name: 'Seasonal Practices', icon: <Wind className="w-5 h-5" /> },
    { id: 'cultural', name: 'Cultural Traditions', icon: <Users className="w-5 h-5" /> },
    { id: 'wellness', name: 'Mind-Body Wellness', icon: <Zap className="w-5 h-5" /> },
  ];

  const morningRituals = [
    {
      id: 1,
      title: 'Japanese Mizu Ritual',
      origin: 'Japan',
      duration: '15 min',
      difficulty: 'Beginner',
      benefits: ['Hydration', 'Radiance', 'Detoxification'],
      steps: [
        { step: 1, action: 'Cold water splash', duration: '2 min', details: 'Begin with 30 splashes of cold water to awaken skin and improve circulation' },
        { step: 2, action: 'Layering hydration', duration: '5 min', details: 'Apply 7 layers of hydrating toner using gentle patting motions' },
        { step: 3, action: 'Facial massage', duration: '5 min', details: 'Gua sha or facial roller massage following lymphatic pathways' },
        { step: 4, action: 'Final seal', duration: '3 min', details: 'Lock in moisture with a water-based gel and SPF 50+' }
      ],
      ingredients: [
        { name: 'Hyaluronic Acid Toner', purpose: 'Deep hydration' },
        { name: 'Vitamin C Serum', purpose: 'Antioxidant protection' },
        { name: 'Gua Sha Tool', purpose: 'Lymphatic drainage' },
        { name: 'Mineral SPF', purpose: 'Sun protection' }
      ],
      culturalContext: 'Rooted in Japanese skincare philosophy of "mizu" (water), emphasizing hydration as the foundation of beauty. Traditional geishas used multiple layers of water-based products to maintain porcelain-like skin.',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2070&auto=format&fit=crop',
      rating: 4.9,
      reviews: 234
    },
    {
      id: 2,
      title: 'Moroccan Sunrise Cleanse',
      origin: 'Morocco',
      duration: '20 min',
      difficulty: 'Intermediate',
      benefits: ['Purification', 'Exfoliation', 'Glow'],
      steps: [
        { step: 1, action: 'Ghassoul clay mask', duration: '10 min', details: 'Mix ghassoul clay with rose water, apply as cleansing mask' },
        { step: 2, action: 'Orange blossom mist', duration: '2 min', details: 'Spritz face with neroli-infused hydrosol' },
        { step: 3, action: 'Argan oil massage', duration: '5 min', details: 'Warm pure argan oil between palms, massage face and neck' },
        { step: 4, action: 'Final rinse', duration: '3 min', details: 'Cool water splash with gentle circular motions' }
      ],
      ingredients: [
        { name: 'Ghassoul Clay', purpose: 'Deep cleansing' },
        { name: 'Rose Water', purpose: 'Toning & soothing' },
        { name: 'Argan Oil', purpose: 'Nourishment' },
        { name: 'Neroli Hydrosol', purpose: 'Balancing' }
      ],
      culturalContext: 'Based on traditional hammam practices, this ritual prepares skin for the day while honoring Berber beauty traditions that date back centuries.',
      image: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=2070&auto=format&fit=crop',
      rating: 4.8,
      reviews: 189
    }
  ];

  const eveningRituals = [
    {
      id: 3,
      title: 'Korean Glass Skin Routine',
      origin: 'Korea',
      duration: '25 min',
      difficulty: 'Advanced',
      benefits: ['Repair', 'Brightening', 'Smooth texture'],
      image: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 4,
      title: 'Ayurvedic Night Rejuvenation',
      origin: 'India',
      duration: '30 min',
      difficulty: 'Intermediate',
      benefits: ['Anti-aging', 'Calming', 'Balance'],
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  const culturalHighlights = [
    {
      culture: 'Japanese',
      practice: 'Shinrin-yoku (Forest Bathing)',
      description: 'Incorporating nature into beauty rituals for stress reduction and skin health',
      icon: <Leaf className="w-5 h-5" />
    },
    {
      culture: 'Moroccan',
      practice: 'Hammam Tradition',
      description: 'Weekly steam bath ritual for deep cleansing and social bonding',
      icon: <Droplets className="w-5 h-5" />
    },
    {
      culture: 'Korean',
      practice: '10-Step Skincare',
      description: 'Layered approach focusing on hydration and prevention',
      icon: <Gem className="w-5 h-5" />
    },
    {
      culture: 'Indian',
      practice: 'Abhyanga (Oil Massage)',
      description: 'Warm oil self-massage for detoxification and rejuvenation',
      icon: <Feather className="w-5 h-5" />
    }
  ];

  const featuredRitual = morningRituals[0];

  const handleSaveRitual = (id) => {
    setSavedRituals(prev => 
      prev.includes(id) 
        ? prev.filter(ritualId => ritualId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
   <section className="relative py-24 overflow-hidden">
  {/* Background Image with Overlay */}
  <div className="absolute inset-0">
    {/* Background Image */}
    <img
      src={bgImg}
      alt="Beauty ritual background"
      className="object-cover w-full h-full"
    />
    
    {/* White Overlay */}
    <div className="absolute inset-0 bg-white/80"></div>
    
    {/* Subtle gradient for depth */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/20"></div>
    
    {/* Decorative blur elements - now subtle on white */}
    <div className="absolute top-0 right-0 w-64 h-64 transform translate-x-32 -translate-y-32 rounded-full bg-white/30 blur-3xl"></div>
    <div className="absolute bottom-0 left-0 transform -translate-x-48 translate-y-48 rounded-full w-96 h-96 bg-white/20 blur-3xl"></div>
  </div>
  
  {/* Content */}
  <div className="container relative px-6 mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto text-center"
    >
      {/* Tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-light text-gray-700 border border-gray-100 rounded-full shadow-sm bg-white/90 backdrop-blur-sm"
      >
        <Sparkles className="w-4 h-4" />
        <span>Sacred Practices</span>
      </motion.div>
      
      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 text-5xl font-light leading-tight text-gray-900 md:text-6xl"
      >
        The Art of <span className="font-bold">Beauty Rituals</span>
      </motion.h1>
      
      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-3xl mx-auto mb-8 text-xl text-gray-700"
      >
        Journey through centuries-old beauty traditions, thoughtfully adapted 
        for modern life. Each ritual is a mindful practice connecting you to 
        cultural heritage and holistic wellness.
      </motion.p>
      
      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <button className="inline-flex items-center px-6 py-3 text-sm font-light text-white transition-all duration-300 bg-black rounded-lg hover:bg-gray-800 hover:shadow-lg">
          <Play className="w-4 h-4 mr-2" />
          Start Your Journey
        </button>
        <button className="inline-flex items-center px-6 py-3 text-sm font-light text-gray-800 transition-all duration-300 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg">
          <Bookmark className="w-4 h-4 mr-2" />
          Save For Later
        </button>
      </motion.div>
    </motion.div>
  </div>
</section>

      {/* Cultural Highlights */}
      <section className="py-16 border-b border-gray-100">
        <div className="container px-6 mx-auto">
          <h2 className="mb-8 text-2xl font-light text-center">Cultural Wisdom</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {culturalHighlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 text-center transition-shadow border border-gray-100 rounded-lg hover:shadow-sm"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gray-50">
                    {highlight.icon}
                  </div>
                </div>
                <div className="mb-2 text-sm font-light text-gray-500">{highlight.culture}</div>
                <h3 className="mb-2 text-sm font-light">{highlight.practice}</h3>
                <p className="text-xs text-gray-500">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ritual Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container px-6 mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {ritualCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveRitual(category.id)}
                className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-light rounded-lg transition-all ${
                  activeRitual === category.id
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-600 hover:text-black hover:bg-white hover:shadow-sm'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ritual Detail */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Left Column - Visual & Info */}
              <div>
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <img
                    src={featuredRitual.image}
                    alt={featuredRitual.title}
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute flex gap-2 top-4 left-4">
                    <span className="px-3 py-1 text-xs font-light text-white rounded-full bg-black/80">
                      {featuredRitual.origin}
                    </span>
                    <span className="px-3 py-1 text-xs font-light text-black rounded-full bg-white/90">
                      {featuredRitual.duration}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleSaveRitual(featuredRitual.id)}
                    className="absolute p-2 rounded-full top-4 right-4 bg-white/90 hover:bg-white"
                  >
                    <Heart className={`w-5 h-5 ${savedRituals.includes(featuredRitual.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="mb-2 text-2xl font-light">{featuredRitual.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredRitual.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {featuredRitual.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-light">{featuredRitual.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">{featuredRitual.reviews} reviews</div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-8">
                  <h3 className="mb-3 text-sm font-light text-gray-500">Key Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {featuredRitual.benefits.map((benefit, index) => (
                      <span key={index} className="px-3 py-1 text-xs font-light text-gray-600 bg-gray-100 rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 py-3 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800">
                    Start This Ritual
                  </button>
                  <button className="p-3 transition-colors border border-gray-200 rounded-lg hover:border-black">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Right Column - Steps & Details */}
              <div>
                {/* Cultural Context */}
                <div className="p-6 mb-8 bg-gray-50 rounded-xl">
                  <h3 className="mb-3 text-sm font-light text-gray-500">Cultural Context</h3>
                  <p className="leading-relaxed text-gray-600">{featuredRitual.culturalContext}</p>
                </div>

                {/* Step-by-Step Guide */}
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-light">Step-by-Step Guide</h3>
                  <div className="space-y-4">
                    {featuredRitual.steps.map((step) => (
                      <div key={step.step} className="flex gap-4 p-4 transition-colors border border-gray-100 rounded-lg hover:border-gray-200">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-8 h-8 text-sm font-light text-white bg-black rounded-full">
                            {step.step}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-light">{step.action}</h4>
                            <span className="text-sm text-gray-500">{step.duration}</span>
                          </div>
                          <p className="text-sm text-gray-600">{step.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required Ingredients */}
                <div>
                  <h3 className="mb-4 text-lg font-light">Required Ingredients & Tools</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {featuredRitual.ingredients.map((item, index) => (
                      <div key={index} className="p-4 border border-gray-100 rounded-lg">
                        <div className="mb-1 font-light">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.purpose}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Rituals Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container px-6 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light">Explore More Rituals</h2>
            <Link to="/rituals/all" className="flex items-center text-sm font-light text-gray-500 hover:text-black">
              View all rituals <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...morningRituals.slice(1), ...eveningRituals].map((ritual, index) => (
              <motion.article
                key={ritual.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="overflow-hidden transition-all bg-white border border-gray-100 rounded-xl hover:shadow-lg group"
              >
                <div className="relative">
                  <div className="overflow-hidden aspect-video">
                    <img
                      src={ritual.image}
                      alt={ritual.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-light text-white rounded-full bg-black/80">
                      {ritual.origin}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleSaveRitual(ritual.id)}
                    className="absolute p-2 rounded-full top-4 right-4 bg-white/90 hover:bg-white"
                  >
                    <Heart className={`w-5 h-5 ${savedRituals.includes(ritual.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 text-xs font-light text-gray-500 bg-gray-100 rounded-full">
                      {ritual.duration}
                    </span>
                    <span className="text-sm text-gray-500">{ritual.difficulty}</span>
                  </div>
                  
                  <h3 className="mb-3 text-lg font-light transition-colors group-hover:text-gray-600">
                    {ritual.title}
                  </h3>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {ritual.benefits?.map((benefit, index) => (
                        <span key={index} className="px-2 py-1 text-xs font-light text-gray-500 rounded bg-gray-50">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Link 
                    to={`/rituals/${ritual.id}`}
                    className="inline-flex items-center text-sm font-light text-black hover:text-gray-600"
                  >
                    Learn ritual details <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Ritual Principles */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h2 className="mb-4 text-3xl font-light">Our Ritual Philosophy</h2>
            <p className="text-gray-600">
              Beauty rituals are more than skincare—they're mindful practices that connect 
              us to culture, self-care, and intentional living.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Intention Setting',
                description: 'Begin each ritual with clear intention, transforming routine into meaningful practice',
                principles: ['Mindful presence', 'Clear focus', 'Personal dedication']
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: 'Cultural Respect',
                description: 'Honor traditional practices while adapting them respectfully for modern use',
                principles: ['Authentic research', 'Community consultation', 'Ethical adaptation']
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: 'Sustainable Practice',
                description: 'Choose ingredients and methods that respect people, cultures, and planet',
                principles: ['Ethical sourcing', 'Minimal waste', 'Conscious consumption']
              }
            ].map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 text-center border border-gray-100 rounded-xl"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-gray-50">
                    {principle.icon}
                  </div>
                </div>
                <h3 className="mb-3 text-lg font-light">{principle.title}</h3>
                <p className="mb-6 text-sm text-gray-600">{principle.description}</p>
                <div className="space-y-2">
                  {principle.principles.map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-500">• {item}</div>
                  ))}
                </div>
              </motion.div>
            ))}
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
              <h2 className="mb-6 text-3xl font-light">Begin Your Ritual Journey</h2>
              <p className="mb-8 text-gray-300">
                Create your personalized ritual collection. Save practices, track progress, 
                and discover rituals tailored to your skin needs and cultural interests.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button className="px-8 py-3 font-light tracking-wider text-black transition-colors bg-white rounded-lg hover:bg-gray-100">
                  Create Free Account
                </button>
                <button className="px-8 py-3 font-light tracking-wider text-white transition-colors border border-white rounded-lg hover:bg-white hover:text-black">
                  Take Ritual Quiz
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RitualsPage;
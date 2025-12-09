import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Clock,
  User,
  Tag,
  ChevronRight,
  ArrowRight,
  Search,
  Filter,
  BookOpen,
  Sparkles,
  Heart,
  Share2,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import cover from '../../assets/bg_journal.jpg'

const JournalPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Articles' },
    { id: 'rituals', name: 'Beauty Rituals' },
    { id: 'ingredients', name: 'Ingredients' },
    { id: 'culture', name: 'Cultural Stories' },
    { id: 'sustainability', name: 'Sustainability' },
    { id: 'wellness', name: 'Wellness' },
  ];

  const featuredArticles = [
    {
      id: 1,
      title: 'The Art of Oud: From Ancient Arabia to Modern Perfumery',
      excerpt: 'Discover the rich history and cultural significance of oud, one of the world\'s most precious ingredients.',
      category: 'ingredients',
      readTime: '8 min',
      date: 'Mar 15, 2024',
      author: 'Leila Chen',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop',
      tags: ['Oud', 'Perfumery', 'Tradition'],
      featured: true
    },
    {
      id: 2,
      title: 'Morning Beauty Rituals from Around the World',
      excerpt: 'How different cultures approach their daily beauty routines and what we can learn from them.',
      category: 'rituals',
      readTime: '6 min',
      date: 'Mar 10, 2024',
      author: 'Aisha Al-Farsi',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1140&auto=format&fit=crop',
      tags: ['Rituals', 'Global', 'Wellness'],
      featured: true
    },
  ];

  const articles = [
    {
      id: 3,
      title: 'Saffron & Gold: The Luxurious Skincare Elixir',
      excerpt: 'Exploring saffron\'s antioxidant properties and its traditional use in luxury skincare.',
      category: 'ingredients',
      readTime: '5 min',
      date: 'Mar 5, 2024',
      author: 'Dr. Elena Rodriguez',
      image: 'https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop',
      tags: ['Saffron', 'Skincare', 'Antioxidants']
    },
    {
      id: 4,
      title: 'Sustainable Packaging: Our Journey to Zero Waste',
      excerpt: 'How we redesigned our packaging to minimize environmental impact while maintaining luxury.',
      category: 'sustainability',
      readTime: '7 min',
      date: 'Feb 28, 2024',
      author: 'Sustainability Team',
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1140&auto=format&fit=crop',
      tags: ['Sustainability', 'Packaging', 'Eco-Friendly']
    },
    {
      id: 5,
      title: 'The Moroccan Hammam Ritual: A Complete Guide',
      excerpt: 'Step-by-step guide to the traditional Moroccan steam bath and its skin benefits.',
      category: 'rituals',
      readTime: '10 min',
      date: 'Feb 22, 2024',
      author: 'Aisha Al-Farsi',
      image: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1140&auto=format&fit=crop',
      tags: ['Hammam', 'Morocco', 'Detox']
    },
    {
      id: 6,
      title: 'Ayurvedic Beauty Principles for Modern Skin',
      excerpt: 'Ancient Indian wisdom meets contemporary skincare science.',
      category: 'culture',
      readTime: '9 min',
      date: 'Feb 18, 2024',
      author: 'Dr. Elena Rodriguez',
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1140&auto=format&fit=crop',
      tags: ['Ayurveda', 'Holistic', 'Traditional']
    },
    {
      id: 7,
      title: 'The Psychology of Scent: How Fragrance Affects Mood',
      excerpt: 'Exploring the deep connection between olfactory experiences and emotional well-being.',
      category: 'wellness',
      readTime: '6 min',
      date: 'Feb 14, 2024',
      author: 'Leila Chen',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop',
      tags: ['Psychology', 'Fragrance', 'Wellbeing']
    },
    {
      id: 8,
      title: 'Preserving Indigenous Beauty Knowledge',
      excerpt: 'How we collaborate with indigenous communities to protect traditional beauty wisdom.',
      category: 'culture',
      readTime: '8 min',
      date: 'Feb 10, 2024',
      author: 'Community Team',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1140&auto=format&fit=crop',
      tags: ['Indigenous', 'Preservation', 'Community']
    },
  ];

  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
     <section className="relative py-20 overflow-hidden">
  {/* Background Image with Overlay */}
  <div className="absolute inset-0">
    {/* Background Image - Choose one that fits the "knowledge" theme */}
    <img
      src={cover}
      alt="Knowledge and beauty background"
      className="object-cover w-full h-full"
    />
    
    {/* White Overlay */}
    <div className="absolute inset-0 bg-white/80"></div>
    
    {/* Subtle decorative elements */}
    <div className="absolute top-0 left-0 w-64 h-64 transform -translate-x-32 -translate-y-32 rounded-full bg-white/20 blur-3xl"></div>
    <div className="absolute bottom-0 right-0 transform translate-x-48 translate-y-48 rounded-full w-96 h-96 bg-white/30 blur-3xl"></div>
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
        <BookOpen className="w-4 h-4" />
        <span>ELEVÉ Journal</span>
      </motion.div>
      
      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 text-5xl font-light leading-tight text-gray-900"
      >
        Beauty Through <span className="font-bold">Knowledge</span>
      </motion.h1>
      
      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 text-xl text-gray-700"
      >
        Exploring the intersection of culture, science, and sustainable beauty
      </motion.p>
      
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-md mx-auto"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search articles, ingredients, rituals..."
            className="w-full py-3 pl-10 pr-10 text-sm transition-all duration-300 border border-gray-200 rounded-lg bg-white/90 backdrop-blur-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white"
          />
          <button className="absolute inset-y-0 right-0 flex items-center pr-3 transition-colors hover:text-gray-600">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        {/* Quick Filter Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mt-4"
        >
          {['Rituals', 'Ingredients', 'Science', 'Culture', 'Sustainability'].map((tag) => (
            <button
              key={tag}
              className="px-3 py-1 text-xs font-light text-gray-600 transition-colors border border-gray-200 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:border-gray-300"
            >
              {tag}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
</section>

      {/* Categories */}
      <section className="py-8 border-b border-gray-100">
        <div className="container px-6 mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 text-sm font-light rounded-full transition-colors ${
                  activeCategory === category.id
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
        <div className="container px-6 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light">Featured Stories</h2>
            <Link to="/journal/featured" className="flex items-center text-sm font-light text-gray-500 hover:text-black">
              View all featured <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {featuredArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/journal/${article.id}`}>
                  <div className="mb-6 overflow-hidden rounded-lg">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-light text-white rounded-full bg-black/80">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime} read
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {article.author}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-light transition-colors group-hover:text-gray-600">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 text-xs font-light text-gray-500 bg-gray-100 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-black">
                        <Heart className="w-4 h-4" />
                        <span>24</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-black">
                        <MessageCircle className="w-4 h-4" />
                        <span>8</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-black">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* All Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container px-6 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light">Latest Articles</h2>
            <div className="text-sm font-light text-gray-500">
              Showing {filteredArticles.length} articles
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="overflow-hidden transition-all bg-white border border-gray-100 rounded-lg hover:shadow-lg group"
              >
                <Link to={`/journal/${article.id}`} className="block">
                  <div className="overflow-hidden aspect-video">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 text-xs font-light text-gray-500 bg-gray-100 rounded-full">
                        {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    
                    <h3 className="mb-3 text-lg font-light transition-colors group-hover:text-gray-600 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {article.author}
                      </div>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <button className="inline-flex items-center px-6 py-3 text-sm font-light text-black transition-colors border border-black rounded-lg hover:bg-black hover:text-white">
              Load More Articles <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 border-t border-gray-100">
        <div className="container px-6 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 p-3 mb-6 rounded-full bg-gray-50">
              <Sparkles className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="mb-4 text-3xl font-light">Stay Inspired</h2>
            <p className="mb-8 text-gray-600">
              Join our community of beauty enthusiasts. Get weekly articles, exclusive content, 
              and early access to new research.
            </p>
            <form className="flex flex-col max-w-md gap-4 mx-auto sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className="px-6 py-3 text-sm font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-xs text-gray-400">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Tags */}
      <section className="py-16">
        <div className="container px-6 mx-auto">
          <h2 className="mb-8 text-2xl font-light text-center">Explore Topics</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Traditional Rituals',
              'Skincare Science',
              'Cultural Heritage',
              'Sustainable Beauty',
              'Ingredient Deep Dives',
              'Wellness Practices',
              'Artisan Stories',
              'Fragrance Notes',
              'Seasonal Routines',
              'Ethical Sourcing'
            ].map((tag) => (
              <Link
                key={tag}
                to={`/journal/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 text-sm font-light text-gray-600 transition-colors border border-gray-200 rounded-full hover:border-black hover:text-black"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default JournalPage;
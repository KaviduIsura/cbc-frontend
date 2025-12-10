// pages/LandingPage.jsx
import { useState, useEffect, useMemo } from "react";
import { ChevronRight, ArrowRight, Sparkles, Filter, Search, Grid, List, X, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import HeroSection from "../../components/HeroSection";
import CategoryGrid from "../../components/CategoryGrid";
import BenefitsSection from "../../components/BenefitsSection";
import ImageSlider from "../../components/ImageSlider";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const LandingPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    price: [],
    benefits: [],
    category: []
  });
  
  // Price ranges for filtering
  const priceRanges = [
    { label: "Under $50", value: "under-50", min: 0, max: 50 },
    { label: "$50 - $100", value: "50-100", min: 50, max: 100 },
    { label: "$100 - $200", value: "100-200", min: 100, max: 200 },
    { label: "$200+", value: "200-plus", min: 200, max: 10000 },
  ];

  // Fetch all featured products once
  const fetchFeaturedProducts = async () => {
    try {
      console.log("Fetching featured products from API...");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/featured`
      );

      if (response.data.products) {
        console.log("Received featured products:", response.data.products.length);
        // Transform backend data to match ProductCard format
        const transformedProducts = response.data.products.map(
          (product, index) => ({
            id: product._id || product.id,
            _id: product._id,
            productId: product.productId || product._id,
            name: product.productName || product.name,
            productName: product.productName || product.name,
            category: product.category || 'all',
            price: product.lastPrice || product.price,
            originalPrice: product.originalPrice,
            rating: product.rating || 0,
            reviewCount: product.reviewCount || 0,
            image: product.images && product.images.length > 0
              ? product.images[0]
              : "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop",
            images: product.images || [],
            isNew: product.isNew || false,
            isBestSeller: product.isBestSeller || false,
            stock: product.stock || 0,
            description: product.description || "",
            detailedDescription: product.detailedDescription || "",
            benefits: product.benefits || [],
            features: product.features || [],
            skinType: product.skinType || [],
            scentFamily: product.scentFamily || [],
            tags: product.tags || []
          })
        );

        console.log("Transformed products:", transformedProducts.length);
        setFeaturedProducts(transformedProducts);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
      toast.error("Failed to load featured products");
      
      // Fallback data if API fails
      setFeaturedProducts(getFallbackProducts());
    }
  };

  // Fallback products
  const getFallbackProducts = () => [
    {
      id: "SKI001",
      _id: "fallback-1",
      productId: "SKI001",
      name: "Golden Saffron Elixir Serum",
      category: "skincare",
      price: 145,
      originalPrice: 175,
      rating: 4.8,
      reviewCount: 87,
      image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop"],
      isNew: true,
      isBestSeller: true,
      stock: 10,
      benefits: ["hydrating", "anti-aging", "brightening"],
      description: "A luxurious serum infused with pure saffron and 24K gold for radiant skin.",
    },
    {
      id: "PER001",
      _id: "fallback-2",
      productId: "PER001",
      name: "Oud Imperial Perfume",
      category: "perfumes",
      price: 220,
      originalPrice: 250,
      rating: 4.9,
      reviewCount: 124,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop"],
      isNew: false,
      isBestSeller: true,
      stock: 15,
      benefits: ["calming"],
      scentFamily: ["woody", "oriental"],
      description: "An intense, woody fragrance with notes of rare oud and amber.",
    },
    {
      id: "SKI002",
      _id: "fallback-3",
      productId: "SKI002",
      name: "Rose Quartz Gua Sha",
      category: "tools",
      price: 65,
      originalPrice: 80,
      rating: 4.7,
      reviewCount: 45,
      image: "https://images.unsplash.com/photo-1583339793403-3d9b001b6008?q=80&w=1140&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1583339793403-3d9b001b6008?q=80&w=1140&auto=format&fit=crop"],
      isNew: true,
      isBestSeller: false,
      stock: 20,
      benefits: ["soothing", "calming"],
      description: "A beautiful rose quartz gua sha tool for facial massage and lymphatic drainage.",
    },
    {
      id: "MKP001",
      _id: "fallback-4",
      productId: "MKP001",
      name: "Silk Veil Foundation",
      category: "makeup",
      price: 95,
      originalPrice: 110,
      rating: 4.6,
      reviewCount: 92,
      image: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1035&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1035&auto=format&fit=crop"],
      isNew: false,
      isBestSeller: true,
      stock: 25,
      benefits: ["hydrating", "brightening"],
      description: "A lightweight foundation that provides flawless coverage with a natural finish.",
    },
    {
      id: "SKI003",
      _id: "fallback-5",
      productId: "SKI003",
      name: "Vitamin C Brightening Serum",
      category: "skincare",
      price: 85,
      originalPrice: 100,
      rating: 4.5,
      reviewCount: 56,
      image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop"],
      isNew: true,
      isBestSeller: false,
      stock: 30,
      benefits: ["brightening", "anti-aging"],
      description: "Powerful vitamin C serum for radiant, even-toned skin.",
    },
    {
      id: "PER002",
      _id: "fallback-6",
      productId: "PER002",
      name: "Jasmine Blossom Eau de Parfum",
      category: "perfumes",
      price: 180,
      originalPrice: 200,
      rating: 4.7,
      reviewCount: 78,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop"],
      isNew: false,
      isBestSeller: true,
      stock: 18,
      benefits: ["energizing"],
      scentFamily: ["floral"],
      description: "A delicate floral fragrance with notes of jasmine and white musk.",
    },
    {
      id: "SKI004",
      _id: "fallback-7",
      productId: "SKI004",
      name: "Ceramide Repair Cream",
      category: "skincare",
      price: 120,
      originalPrice: 140,
      rating: 4.8,
      reviewCount: 102,
      image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop"],
      isNew: false,
      isBestSeller: true,
      stock: 22,
      benefits: ["hydrating", "soothing", "calming"],
      description: "Intensive moisturizer that repairs skin barrier and locks in moisture.",
    },
    {
      id: "MKP002",
      _id: "fallback-8",
      productId: "MKP002",
      name: "Velvet Matte Lipstick",
      category: "makeup",
      price: 45,
      originalPrice: 55,
      rating: 4.9,
      reviewCount: 134,
      image: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1035&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1035&auto=format&fit=crop"],
      isNew: true,
      isBestSeller: true,
      stock: 40,
      benefits: ["hydrating"],
      description: "Long-lasting matte lipstick with a velvety finish and intense pigment.",
    },
    {
      id: "TLS001",
      _id: "fallback-9",
      productId: "TLS001",
      name: "Amethyst Facial Roller",
      category: "tools",
      price: 75,
      originalPrice: 90,
      rating: 4.6,
      reviewCount: 67,
      image: "https://images.unsplash.com/photo-1583339793403-3d9b001b6008?q=80&w=1140&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1583339793403-3d9b001b6008?q=80&w=1140&auto=format&fit=crop"],
      isNew: true,
      isBestSeller: false,
      stock: 28,
      benefits: ["soothing", "calming", "energizing"],
      description: "Amethyst crystal facial roller for reducing puffiness and promoting circulation.",
    }
  ];

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/categories`);
      if (response.data.categories) {
        // Remove 'all' category for display purposes
        const filteredCategories = response.data.categories
          .filter((cat) => cat.category !== "all")
          .map((cat) => ({
            id: cat.category,
            title: getCategoryTitle(cat.category),
            description: getCategoryDescription(cat.category),
            image: getCategoryImage(cat.category),
            count: `${cat.count} items`,
            category: cat.category
          }));

        setCategories(filteredCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback categories
      setCategories([
        {
          id: "perfumes",
          title: "Perfumes & Scents",
          description: "Artisanal fragrances",
          image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop",
          count: "24 items",
          category: "perfumes"
        },
        {
          id: "skincare",
          title: "Skincare Rituals",
          description: "Ancient formulations",
          image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop",
          count: "18 items",
          category: "skincare"
        },
        {
          id: "makeup",
          title: "Cultural Makeup",
          description: "Traditional beauty",
          image: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1035&auto=format&fit=crop",
          count: "12 items",
          category: "makeup"
        },
        {
          id: "tools",
          title: "Ritual Tools",
          description: "Traditional implements",
          image: "https://images.unsplash.com/photo-1583339793403-3d9b001b6008?q=80&w=1140&auto=format&fit=crop",
          count: "8 items",
          category: "tools"
        }
      ]);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchFeaturedProducts(), fetchCategories()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Apply client-side filtering to the fetched featured products
  const filteredProducts = useMemo(() => {
    let filtered = [...featuredProducts];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.productName?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (activeCategory && activeCategory !== 'all') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }

    // Apply price filters
    if (appliedFilters.price.length > 0) {
      filtered = filtered.filter(product => {
        const price = product.price || product.lastPrice || 0;
        return appliedFilters.price.some(range => {
          const priceRange = priceRanges.find(r => r.value === range);
          if (!priceRange) return false;
          return price >= priceRange.min && price <= priceRange.max;
        });
      });
    }

    // Apply benefits filter
    if (appliedFilters.benefits.length > 0) {
      filtered = filtered.filter(product =>
        appliedFilters.benefits.every(benefit =>
          product.benefits?.includes(benefit)
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'price-low':
          return (a.price || a.lastPrice || 0) - (b.price || b.lastPrice || 0);
        case 'price-high':
          return (b.price || b.lastPrice || 0) - (a.price || a.lastPrice || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          // Assuming products have createdAt or isNew
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        case 'featured':
        default:
          // Featured: best sellers first, then new, then by rating
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return (b.rating || 0) - (a.rating || 0);
      }
    });

    return filtered;
  }, [featuredProducts, searchQuery, activeCategory, appliedFilters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setAppliedFilters(prev => {
      const currentFilters = [...prev[filterType]];
      const index = currentFilters.indexOf(value);
      
      if (index > -1) {
        currentFilters.splice(index, 1);
      } else {
        currentFilters.push(value);
      }
      
      return {
        ...prev,
        [filterType]: currentFilters
      };
    });
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setSortBy("featured");
    setAppliedFilters({
      price: [],
      benefits: [],
      category: []
    });
  };

  const getCategoryTitle = (category) => {
    const titles = {
      perfumes: "Perfumes & Scents",
      skincare: "Skincare Rituals",
      makeup: "Luxurious Makeup",
      tools: "Ritual Tools",
    };
    return (
      titles[category] || category.charAt(0).toUpperCase() + category.slice(1)
    );
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      perfumes: "Artisanal fragrances",
      skincare: "Ancient formulations",
      makeup: "Luxurious beauty",
      tools: "Traditional implements",
    };
    return descriptions[category] || "Explore our collection";
  };

  const getCategoryImage = (category) => {
    const images = {
      perfumes:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop",
      skincare:
        "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop",
      makeup:
        "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1035&auto=format&fit=crop",
      tools:
        "https://images.unsplash.com/photo-1583339793403-3d9b001b6008?q=80&w=1140&auto=format&fit=crop",
    };
    return (
      images[category] ||
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop"
    );
  };

  if (loading && featuredProducts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-300 rounded-full border-t-black animate-spin"></div>
          <p className="text-sm font-light text-gray-500">Loading featured collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Benefits Bar */}
      <BenefitsSection />

      {/* Featured Products Section with Filters */}
      <section className="py-16 bg-white">
        <div className="container px-6 mx-auto">
          {/* Header with Search and Filters */}
          <div className="flex flex-col justify-between mb-8 space-y-4 md:space-y-0 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 text-xs font-light text-gray-600 rounded-full bg-gray-50">
                <Sparkles className="w-3 h-3" />
                <span>Featured Collection</span>
              </div>
              <h2 className="mb-2 text-3xl font-light">Curated Collections</h2>
              <p className="text-gray-500">
                {featuredProducts.length} premium formulations for your beauty ritual
              </p>
            </div>
            
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
              {/* Search Bar */}
              <div className="relative w-full md:w-auto">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search featured products..."
                  className="w-full py-2 pl-10 pr-8 text-sm border border-gray-200 rounded-lg md:w-64 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-gray-600"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              
              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-light text-gray-600 transition-colors border border-gray-200 rounded-lg hover:border-black"
              >
                <Filter className="w-4 h-4" />
                Filters
                {(searchQuery || activeCategory !== 'all' || Object.values(appliedFilters).flat().length > 0) && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-black rounded-full">
                    {[searchQuery, activeCategory !== 'all' ? 1 : 0, ...Object.values(appliedFilters).flat()].filter(Boolean).length}
                  </span>
                )}
              </button>
              
              <Link
                to="/shop"
                className="flex items-center px-4 py-2 text-sm font-light text-black transition-colors border border-black rounded-lg hover:bg-black hover:text-white"
              >
                View All Shop
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Quick Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-4 py-2 text-sm font-light rounded-lg transition-colors ${
                activeCategory === "all"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({featuredProducts.length})
            </button>
            {categories.map((category) => {
              const count = featuredProducts.filter(p => p.category === category.id).length;
              if (count > 0) {
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 text-sm font-light rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category.title} ({count})
                  </button>
                );
              }
              return null;
            })}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-6 mb-8 border border-gray-100 rounded-lg"
            >
              <div className="flex flex-col gap-6 md:flex-row">
                {/* Left: Active filters and clear button */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">Active Filters</h3>
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-xs font-light text-gray-500 hover:text-black"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Clear all
                    </button>
                  </div>
                  
                  {/* Active filters display */}
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs text-black bg-gray-100 rounded-full">
                        Search: "{searchQuery}"
                        <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-gray-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    
                    {activeCategory !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs text-black bg-gray-100 rounded-full">
                        Category: {getCategoryTitle(activeCategory)}
                        <button 
                          onClick={() => setActiveCategory("all")} 
                          className="ml-1 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    
                    {appliedFilters.price.map(price => (
                      <span key={price} className="inline-flex items-center gap-1 px-3 py-1 text-xs text-black bg-gray-100 rounded-full">
                        {priceRanges.find(p => p.value === price)?.label || price}
                        <button 
                          onClick={() => handleFilterChange("price", price)} 
                          className="ml-1 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    
                    {appliedFilters.benefits.map(benefit => (
                      <span key={benefit} className="inline-flex items-center gap-1 px-3 py-1 text-xs text-black capitalize bg-gray-100 rounded-full">
                        {benefit.replace('-', ' ')}
                        <button 
                          onClick={() => handleFilterChange("benefits", benefit)} 
                          className="ml-1 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    
                    {!searchQuery && activeCategory === 'all' && Object.values(appliedFilters).flat().length === 0 && (
                      <p className="text-sm text-gray-500">No filters applied. Showing all featured products.</p>
                    )}
                  </div>
                </div>
                
                {/* Right: Sort dropdown and view toggle */}
                <div className="flex flex-col gap-4 md:w-64">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Sort by</label>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full py-2 pl-4 pr-8 text-sm font-light text-gray-600 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-black"
                      >
                        <option value="featured">Featured</option>
                        <option value="newest">New Arrivals</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronRight className="w-4 h-4 text-gray-400 transform rotate-90" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">View</label>
                    <div className="flex items-center gap-1 p-1 border border-gray-200 rounded-lg w-fit">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded transition-colors ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Filter Options */}
              <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
                {/* Price Filter */}
                <div>
                  <h4 className="mb-3 text-xs font-medium text-gray-900">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((price) => (
                      <label key={price.value} className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={appliedFilters.price.includes(price.value)}
                          onChange={() => handleFilterChange("price", price.value)}
                          className="w-4 h-4 text-black border-gray-300 rounded"
                        />
                        <span className="text-sm font-light">{price.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Benefits Filter */}
                <div>
                  <h4 className="mb-3 text-xs font-medium text-gray-900">Benefits</h4>
                  <div className="space-y-2">
                    {[
                      { label: "Hydrating", value: "hydrating" },
                      { label: "Anti-Aging", value: "anti-aging" },
                      { label: "Brightening", value: "brightening" },
                      { label: "Soothing", value: "soothing" },
                      { label: "Calming", value: "calming" },
                      { label: "Energizing", value: "energizing" }
                    ].map((benefit) => (
                      <label key={benefit.value} className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={appliedFilters.benefits.includes(benefit.value)}
                          onChange={() => handleFilterChange("benefits", benefit.value)}
                          className="w-4 h-4 text-black border-gray-300 rounded"
                        />
                        <span className="text-sm font-light">{benefit.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Count and Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium text-black">{filteredProducts.length}</span> of {featuredProducts.length} featured products
              {(searchQuery || activeCategory !== 'all' || Object.values(appliedFilters).flat().length > 0) && (
                <span className="ml-2">
                  (filtered)
                </span>
              )}
            </div>
            
            {filteredProducts.length < featuredProducts.length && (
              <button
                onClick={clearFilters}
                className="text-sm font-light text-gray-500 hover:text-black"
              >
                Clear filters to see all {featuredProducts.length} products
              </button>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2 text-lg font-light">No products match your filters</h3>
              <p className="mb-6 text-gray-500">Try adjusting your filters or search terms</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 text-sm font-light text-gray-600 transition-colors border border-gray-300 rounded-lg hover:border-black"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product._id || product.id || `product-${index}`}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
          
          {/* View All Button */}
          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-8 py-3 font-light text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
            >
              View All Products in Shop
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Image slider */}
      <ImageSlider />

      {/* Categories Section */}
      <CategoryGrid categories={categories} />

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6 text-3xl font-light">
              Ancient Wisdom, Modern Science
            </h2>
            <p className="mb-8 leading-relaxed text-gray-600">
              We merge centuries-old beauty traditions with cutting-edge
              dermatological research. Each product is a testament to cultural
              heritage, reimagined for the contemporary ritual.
            </p>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-8 py-3 font-light tracking-wider text-white transition-colors bg-black hover:bg-gray-800"
              >
                Discover Our Story <ArrowRight className="w-4 h-4 ml-2" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t">
        <div className="container px-6 mx-auto">
          <div className="max-w-md mx-auto text-center">
            <h3 className="mb-4 text-2xl font-light">Join Our Community</h3>
            <p className="mb-6 text-gray-500">
              Receive exclusive insights on rituals and early access to new
              formulations.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 font-light text-white transition-colors bg-black hover:bg-gray-800"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
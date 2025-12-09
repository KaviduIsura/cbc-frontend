import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Filter, 
  Search, 
  ChevronDown, 
  Grid, 
  List, 
  Star,
  Sparkles,
  X,
  RefreshCw,
  Sliders,
  ShoppingBag,
  Heart,
  BookOpen,
  ArrowRight
} from "lucide-react";
import ProductCard from "../../components/ProductCard";

export default function ProductPage() {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    price: [],
    skinType: [],
    benefits: [],
    scentFamily: []
  });

  // Helper function to extract category from URL path
  const getCategoryFromPath = (pathname) => {
    const parts = pathname.split('/').filter(part => part.trim() !== '');
    
    console.log("Path parts:", parts);
    
    // If we're at /shop or /shop/, it's "all"
    if (parts.length === 1 && parts[0] === 'shop') {
      console.log("Detected 'all' category from path");
      return 'all';
    }
    
    // If we're at /shop/:category, return the category
    if (parts.length === 2 && parts[0] === 'shop') {
      const categoryFromPath = parts[1];
      console.log(`Detected category from path: ${categoryFromPath}`);
      return categoryFromPath;
    }
    
    console.log("Defaulting to 'all' category");
    return 'all';
  };

  // Dummy data for products
  const dummyProducts = [
    {
      id: "1",
      _id: "1",
      name: "Sacred Oud Eau de Parfum",
      productName: "Sacred Oud Eau de Parfum",
      category: "perfumes",
      price: 189,
      originalPrice: 220,
      lastPrice: 189,
      rating: 4.9,
      reviewCount: 124,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop",
      isNew: true,
      isBestSeller: true,
      description: "An opulent fragrance that captures the essence of ancient Arabian nights with rare oud wood."
    },
    {
      id: "2",
      _id: "2",
      name: "Golden Saffron Elixir Serum",
      productName: "Golden Saffron Elixir Serum",
      category: "skincare",
      price: 145,
      lastPrice: 145,
      rating: 4.8,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop",
      isNew: false,
      isBestSeller: true,
      description: "A luminous serum infused with precious saffron threads for radiant, glowing skin."
    },
    {
      id: "3",
      _id: "3",
      name: "Maroccan Argan Night Cream",
      productName: "Maroccan Argan Night Cream",
      category: "skincare",
      price: 98,
      originalPrice: 120,
      lastPrice: 98,
      rating: 4.7,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1140&auto=format&fit=crop",
      isNew: false,
      isBestSeller: false,
      description: "Rich overnight treatment with pure argan oil to deeply nourish and restore skin."
    },
    {
      id: "4",
      _id: "4",
      name: "Rose Otto Face Oil",
      productName: "Rose Otto Face Oil",
      category: "skincare",
      price: 165,
      lastPrice: 165,
      rating: 5.0,
      reviewCount: 67,
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1140&auto=format&fit=crop",
      isNew: true,
      isBestSeller: true,
      description: "Pure rose otto oil for facial hydration and emotional balance."
    },
    {
      id: "5",
      _id: "5",
      name: "Sandalwood Meditation Mist",
      productName: "Sandalwood Meditation Mist",
      category: "perfumes",
      price: 85,
      lastPrice: 85,
      rating: 4.6,
      reviewCount: 42,
      image: "https://images.unsplash.com/photo-1543246239-7ae5eac997dc?q=80&w=1140&auto=format&fit=crop",
      isNew: true,
      isBestSeller: false,
      description: "A calming mist with sacred sandalwood for mindfulness and relaxation."
    },
    {
      id: "6",
      _id: "6",
      name: "24K Gold Illuminator",
      productName: "24K Gold Illuminator",
      category: "makeup",
      price: 125,
      originalPrice: 150,
      lastPrice: 125,
      rating: 4.9,
      reviewCount: 231,
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1140&auto=format&fit=crop",
      isNew: false,
      isBestSeller: true,
      description: "Luxurious highlighter infused with real 24K gold particles for a radiant glow."
    },
    {
      id: "7",
      _id: "7",
      name: "Jade Gua Sha Tool",
      productName: "Jade Gua Sha Tool",
      category: "tools",
      price: 65,
      lastPrice: 65,
      rating: 4.8,
      reviewCount: 178,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1140&auto=format&fit=crop",
      isNew: false,
      isBestSeller: true,
      description: "Authentic jade tool for facial massage and lymphatic drainage."
    },
    {
      id: "8",
      _id: "8",
      name: "Velvet Kohl Eyeliner",
      productName: "Velvet Kohl Eyeliner",
      category: "makeup",
      price: 42,
      lastPrice: 42,
      rating: 4.7,
      reviewCount: 94,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1140&auto=format&fit=crop",
      isNew: true,
      isBestSeller: false,
      description: "Traditional formula eyeliner for dramatic, smudge-proof definition."
    }
  ];

  const categories = [
    { id: "all", label: "All Products", count: dummyProducts.length },
    { id: "perfumes", label: "Perfumes", count: dummyProducts.filter(p => p.category === "perfumes").length },
    { id: "skincare", label: "Skincare", count: dummyProducts.filter(p => p.category === "skincare").length },
    { id: "makeup", label: "Makeup", count: dummyProducts.filter(p => p.category === "makeup").length },
    { id: "tools", label: "Tools", count: dummyProducts.filter(p => p.category === "tools").length },
  ];

  // Load products on component mount
  useEffect(() => {
    console.log("ProductPage mounted");
    setLoading(true);
    setTimeout(() => {
      setProducts(dummyProducts);
      setLoading(false);
      console.log("Products loaded:", dummyProducts.length);
    }, 500);
  }, []);

  // Debug: Log when location changes
  useEffect(() => {
    console.log("Location changed:", location);
    console.log("Category param from useParams():", category);
    console.log("Current pathname:", location.pathname);
  }, [location, category]);

  // Update activeCategory when URL changes
  useEffect(() => {
    console.log("=== URL CHANGE DETECTED ===");
    console.log("Pathname:", location.pathname);
    console.log("Category param:", category);
    
    const categoryFromPath = getCategoryFromPath(location.pathname);
    console.log("Setting activeCategory to:", categoryFromPath);
    
    setActiveCategory(categoryFromPath);
    
    // Reset search when category changes
    setSearchQuery("");
    // Reset filters when category changes
    setAppliedFilters({
      price: [],
      skinType: [],
      benefits: [],
      scentFamily: []
    });
    
    // Scroll to top when category changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, category]);

  // Debug: Log when activeCategory changes
  useEffect(() => {
    console.log("activeCategory changed to:", activeCategory);
  }, [activeCategory]);

  // Filter and sort products whenever dependencies change
  useEffect(() => {
    console.log("=== FILTERING PRODUCTS ===");
    console.log("Active category:", activeCategory);
    console.log("Sort by:", sortBy);
    console.log("Search query:", searchQuery);
    console.log("Applied filters:", appliedFilters);
    console.log("Total products:", products.length);
    
    filterAndSortProducts();
  }, [activeCategory, sortBy, searchQuery, appliedFilters, products]);

  const filterAndSortProducts = () => {
    console.log("Running filterAndSortProducts function");
    let filtered = [...products];

    // 1. Filter by category
    if (activeCategory !== "all") {
      console.log(`Filtering by category: ${activeCategory}`);
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === activeCategory.toLowerCase()
      );
      console.log(`Products after category filter: ${filtered.length}`);
    } else {
      console.log("Showing all products (no category filter)");
    }

    // 2. Filter by search query
    if (searchQuery) {
      console.log(`Filtering by search query: ${searchQuery}`);
      const originalCount = filtered.length;
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log(`Products after search filter: ${filtered.length} (removed ${originalCount - filtered.length})`);
    }

    // 3. Apply price filters
    if (appliedFilters.price.length > 0) {
      console.log(`Applying price filters: ${appliedFilters.price.join(', ')}`);
      const originalCount = filtered.length;
      filtered = filtered.filter(product => {
        const price = product.lastPrice || product.price;
        return appliedFilters.price.some(filter => {
          switch (filter) {
            case "under-50": return price < 50;
            case "50-100": return price >= 50 && price <= 100;
            case "100-200": return price >= 100 && price <= 200;
            case "200-plus": return price > 200;
            default: return true;
          }
        });
      });
      console.log(`Products after price filter: ${filtered.length} (removed ${originalCount - filtered.length})`);
    }

    // 4. Apply skin type filters for skincare
    if (activeCategory === "skincare" && appliedFilters.skinType.length > 0) {
      console.log(`Applying skin type filters: ${appliedFilters.skinType.join(', ')}`);
      // This is a dummy filter - in a real app, you would have skinType property in product data
      const originalCount = filtered.length;
      filtered = filtered.filter((_, index) => index % 2 === 0); // Dummy logic
      console.log(`Products after skin type filter: ${filtered.length} (removed ${originalCount - filtered.length})`);
    }

    // 5. Apply scent family filters for perfumes
    if (activeCategory === "perfumes" && appliedFilters.scentFamily.length > 0) {
      console.log(`Applying scent family filters: ${appliedFilters.scentFamily.join(', ')}`);
      // This is a dummy filter - in a real app, you would have scentFamily property in product data
      const originalCount = filtered.length;
      filtered = filtered.filter((_, index) => index % 2 === 0); // Dummy logic
      console.log(`Products after scent family filter: ${filtered.length} (removed ${originalCount - filtered.length})`);
    }

    // 6. Apply benefits filters
    if (appliedFilters.benefits.length > 0) {
      console.log(`Applying benefits filters: ${appliedFilters.benefits.join(', ')}`);
      // This is a dummy filter - in a real app, you would have benefits property in product data
      const originalCount = filtered.length;
      filtered = filtered.filter((_, index) => index % 2 === 0); // Dummy logic
      console.log(`Products after benefits filter: ${filtered.length} (removed ${originalCount - filtered.length})`);
    }

    // 7. Sort products
    console.log(`Sorting products by: ${sortBy}`);
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      }
    });

    console.log("Final filtered products count:", filtered.length);
    setFilteredProducts(filtered);
  };

  const handleCategoryClick = (categoryId) => {
    console.log(`Category clicked: ${categoryId}`);
    setActiveCategory(categoryId);
    if (categoryId === "all") {
      console.log("Navigating to /shop");
      navigate("/shop");
    } else {
      console.log(`Navigating to /shop/${categoryId}`);
      navigate(`/shop/${categoryId}`);
    }
    setSearchQuery("");
    setAppliedFilters({
      price: [],
      skinType: [],
      benefits: [],
      scentFamily: []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (filterType, value) => {
    console.log(`Filter change: ${filterType} - ${value}`);
    setAppliedFilters(prev => {
      const currentFilters = [...prev[filterType]];
      const index = currentFilters.indexOf(value);
      
      if (index > -1) {
        // Remove filter if already selected
        currentFilters.splice(index, 1);
        console.log(`Removed filter ${value} from ${filterType}`);
      } else {
        // Add filter if not selected
        currentFilters.push(value);
        console.log(`Added filter ${value} to ${filterType}`);
      }
      
      const newFilters = {
        ...prev,
        [filterType]: currentFilters
      };
      
      console.log("Updated filters:", newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    console.log("Clearing all filters");
    setActiveCategory("all");
    setSearchQuery("");
    setSortBy("featured");
    setAppliedFilters({
      price: [],
      skinType: [],
      benefits: [],
      scentFamily: []
    });
    navigate("/shop");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20 bg-white">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-300 rounded-full border-t-black animate-spin"></div>
          <p className="text-sm font-light text-gray-500">Loading formulations...</p>
        </div>
      </div>
    );
  }

  console.log("Rendering ProductPage with:", {
    activeCategory,
    filteredProductsLength: filteredProducts.length,
    showFilters,
    viewMode
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1920&auto=format&fit=crop"
            alt="Products background"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-white/80"></div>
          <div className="absolute top-0 right-0 w-64 h-64 transform translate-x-32 -translate-y-32 rounded-full bg-white/30 blur-3xl"></div>
        </div>
        
        <div className="container relative px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-light text-gray-700 border border-gray-100 rounded-full shadow-sm bg-white/90 backdrop-blur-sm">
              <BookOpen className="w-4 h-4" />
              <span>ELEVÉ Formulations</span>
            </div>
            <h1 className="mb-6 text-5xl font-light leading-tight text-gray-900 md:text-6xl">
              {activeCategory === "perfumes" ? "Exquisite Fragrances" : 
               activeCategory === "skincare" ? "Radiant Skincare" :
               activeCategory === "makeup" ? "Luxurious Makeup" :
               activeCategory === "tools" ? "Ritual Tools" : 
               "Ancient Wisdom, Modern Science"}
            </h1>
            <p className="max-w-3xl mx-auto mb-8 text-xl text-gray-700">
              {activeCategory === "perfumes" ? "Discover rare and exotic fragrances that tell stories of ancient cultures" :
               activeCategory === "skincare" ? "Premium formulations for radiant, healthy skin rooted in tradition" :
               activeCategory === "makeup" ? "Clean, luxurious makeup designed to enhance your natural beauty" :
               activeCategory === "tools" ? "Ritual tools crafted to elevate your self-care practice" :
               "Discover thoughtfully crafted beauty products rooted in tradition and innovation"}
            </p>
            
            {/* Category-specific text */}
            {activeCategory !== "all" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-lg text-gray-600"
              >
                {activeCategory === "skincare" && "Premium skincare formulations for radiant, healthy skin"}
                {activeCategory === "perfumes" && "Exquisite fragrances that tell stories of ancient cultures"}
                {activeCategory === "makeup" && "Clean, luxurious makeup for effortless beauty"}
                {activeCategory === "tools" && "Ritual tools for mindful self-care practices"}
              </motion.p>
            )}
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => {
                    console.log("Search query changed:", e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  placeholder={`Search ${activeCategory === "all" ? "all products" : activeCategory}...`}
                  className="w-full py-3 pl-10 pr-10 text-sm border border-gray-200 rounded-lg bg-white/90 backdrop-blur-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      console.log("Clearing search query");
                      setSearchQuery("");
                    }}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 transition-colors hover:text-gray-600"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="sticky top-0 z-40 py-4 bg-white border-b border-gray-100 backdrop-blur-sm bg-white/90">
        <div className="container px-6 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex-shrink-0 pb-2 text-sm font-light transition-colors border-b-2 whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'text-black border-black'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {cat.label}
                  <span className="ml-2 text-xs text-gray-400">({cat.count})</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                console.log("Show filters toggled:", !showFilters);
                setShowFilters(!showFilters);
              }}
              className="items-center hidden gap-2 px-4 py-2 text-sm font-light text-gray-600 transition-colors border border-gray-200 rounded-lg md:flex hover:border-black"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters && <ChevronDown className="w-3 h-3 ml-1 rotate-180" />}
              {!showFilters && <ChevronDown className="w-3 h-3 ml-1" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-6 py-12 mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:w-64"
            >
              <div className="p-6 border border-gray-100 rounded-lg bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-light">Refine Selection</h3>
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs font-light text-gray-500 hover:text-black"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Clear all
                  </button>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h4 className="mb-3 text-xs font-light text-gray-500">Price Range</h4>
                  <div className="space-y-2">
                    {[
                      { label: "Under $50", value: "under-50" },
                      { label: "$50 - $100", value: "50-100" },
                      { label: "$100 - $200", value: "100-200" },
                      { label: "$200+", value: "200-plus" },
                    ].map((price) => (
                      <label key={price.value} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            checked={appliedFilters.price.includes(price.value)}
                            onChange={() => handleFilterChange("price", price.value)}
                            className="w-4 h-4 text-black border-gray-300 rounded peer" 
                          />
                          <div className="absolute inset-0 flex items-center justify-center invisible peer-checked:visible">
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                          </div>
                        </div>
                        <span className="text-sm font-light group-hover:text-gray-700">{price.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category-specific filters for skincare */}
                {activeCategory === "skincare" && (
                  <div className="mb-6">
                    <h4 className="mb-3 text-xs font-light text-gray-500">Skin Type</h4>
                    <div className="space-y-2">
                      {["Dry", "Oily", "Combination", "Sensitive", "Normal"].map((type) => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              checked={appliedFilters.skinType.includes(type.toLowerCase())}
                              onChange={() => handleFilterChange("skinType", type.toLowerCase())}
                              className="w-4 h-4 text-black border-gray-300 rounded peer" 
                            />
                            <div className="absolute inset-0 flex items-center justify-center invisible peer-checked:visible">
                              <div className="w-2 h-2 bg-black rounded-full"></div>
                            </div>
                          </div>
                          <span className="text-sm font-light group-hover:text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category-specific filters for perfumes */}
                {activeCategory === "perfumes" && (
                  <div className="mb-6">
                    <h4 className="mb-3 text-xs font-light text-gray-500">Scent Family</h4>
                    <div className="space-y-2">
                      {["Woody", "Floral", "Oriental", "Fresh", "Spicy"].map((scent) => (
                        <label key={scent} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              checked={appliedFilters.scentFamily.includes(scent.toLowerCase())}
                              onChange={() => handleFilterChange("scentFamily", scent.toLowerCase())}
                              className="w-4 h-4 text-black border-gray-300 rounded peer" 
                            />
                            <div className="absolute inset-0 flex items-center justify-center invisible peer-checked:visible">
                              <div className="w-2 h-2 bg-black rounded-full"></div>
                            </div>
                          </div>
                          <span className="text-sm font-light group-hover:text-gray-700">{scent}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits Filter */}
                <div className="mb-6">
                  <h4 className="mb-3 text-xs font-light text-gray-500">Benefits</h4>
                  <div className="space-y-2">
                    {[
                      { label: "Hydrating", value: "hydrating" },
                      { label: "Anti-Aging", value: "anti-aging" },
                      { label: "Brightening", value: "brightening" },
                      { label: "Soothing", value: "soothing" },
                    ].map((benefit) => (
                      <label key={benefit.value} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            checked={appliedFilters.benefits.includes(benefit.value)}
                            onChange={() => handleFilterChange("benefits", benefit.value)}
                            className="w-4 h-4 text-black border-gray-300 rounded peer" 
                          />
                          <div className="absolute inset-0 flex items-center justify-center invisible peer-checked:visible">
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                          </div>
                        </div>
                        <span className="text-sm font-light group-hover:text-gray-700">{benefit.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    console.log("Apply filters clicked");
                    setShowFilters(false);
                  }}
                  className="w-full py-3 text-sm font-light tracking-wider text-white transition-colors bg-black rounded-lg hover:bg-gray-800"
                >
                  Apply Filters ({Object.values(appliedFilters).flat().length})
                </button>
              </div>
            </motion.div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8">
              <div className="text-sm text-gray-500">
                Showing <span className="font-light text-black">{filteredProducts.length}</span> {activeCategory !== "all" ? activeCategory : "formulations"}
                {Object.values(appliedFilters).flat().length > 0 && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({Object.values(appliedFilters).flat().length} filter{Object.values(appliedFilters).flat().length > 1 ? 's' : ''} applied)
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex items-center gap-1 p-1 border border-gray-200 rounded-lg bg-gray-50">
                  <button
                    onClick={() => {
                      console.log("Setting view mode to grid");
                      setViewMode("grid");
                    }}
                    className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      console.log("Setting view mode to list");
                      setViewMode("list");
                    }}
                    className={`p-2 rounded transition-colors ${viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      console.log("Sort by changed to:", e.target.value);
                      setSortBy(e.target.value);
                    }}
                    className="py-2 pl-4 pr-8 text-sm font-light text-gray-600 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-black"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">New Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="mb-2 text-lg font-light">No {activeCategory} found</h3>
                <p className="mb-6 text-gray-500">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 text-sm font-light text-gray-600 transition-colors border border-gray-300 rounded-lg hover:border-black"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {/* Category-specific header */}
                {activeCategory !== "all" && (
                  <div className="mb-8">
                    <h2 className="mb-4 text-2xl font-light">
                      {categories.find(c => c.id === activeCategory)?.label}
                      <span className="ml-2 text-sm font-light text-gray-500">
                        ({filteredProducts.length} products)
                      </span>
                    </h2>
                    {activeCategory === "skincare" && (
                      <p className="max-w-3xl mb-6 text-gray-600">
                        Our skincare collection combines ancient botanical wisdom with modern dermatological 
                        science. Each formulation is crafted to nurture and transform your skin's natural radiance.
                      </p>
                    )}
                    {activeCategory === "perfumes" && (
                      <p className="max-w-3xl mb-6 text-gray-600">
                        Experience the art of perfumery with our collection of rare and exotic fragrances. 
                        Each scent tells a story of cultural heritage and olfactory artistry.
                      </p>
                    )}
                    {activeCategory === "makeup" && (
                      <p className="max-w-3xl mb-6 text-gray-600">
                        Clean, luxurious makeup designed to enhance your natural beauty. Our formulations 
                        prioritize skin health while delivering exceptional color and performance.
                      </p>
                    )}
                    {activeCategory === "tools" && (
                      <p className="max-w-3xl mb-6 text-gray-600">
                        Ritual tools crafted to elevate your self-care practice. Each piece is designed 
                        with intention, combining functionality with mindful design.
                      </p>
                    )}
                  </div>
                )}

                {/* All Products */}
                <div>
                  <div className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product._id || product.id} product={product} index={index} />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-sm font-light text-gray-500 transition-colors border border-gray-200 rounded-lg hover:border-black hover:text-black">
                    Previous
                  </button>
                  <button className="px-4 py-2 text-sm font-light text-white bg-black border border-black rounded-lg">
                    1
                  </button>
                  <button className="px-4 py-2 text-sm font-light text-gray-500 transition-colors border border-gray-200 rounded-lg hover:border-black hover:text-black">
                    2
                  </button>
                  <button className="px-4 py-2 text-sm font-light text-gray-500 transition-colors border border-gray-200 rounded-lg hover:border-black hover:text-black">
                    3
                  </button>
                  <span className="px-2 text-gray-400">...</span>
                  <button className="px-4 py-2 text-sm font-light text-gray-500 transition-colors border border-gray-200 rounded-lg hover:border-black hover:text-black">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Button */}
      <button
        onClick={() => {
          console.log("Mobile filters toggled:", !showFilters);
          setShowFilters(!showFilters);
        }}
        className="fixed z-50 flex items-center gap-2 px-4 py-3 text-sm font-light text-white transition-all bg-black rounded-full shadow-lg bottom-6 right-6 md:hidden hover:bg-gray-800"
      >
        <Sliders className="w-4 h-4" />
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>
    </div>
  );
}
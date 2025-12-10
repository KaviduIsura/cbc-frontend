import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
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
  ArrowRight,
  Loader
} from "lucide-react";
import ProductCard from "../../components/ProductCard";
import axios from "axios";
import toast from "react-hot-toast";
import ProdImg from '../../assets/products.jpg'

export default function ProductPage() {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Price ranges for filtering
  const priceRanges = [
    { label: "Under $50", value: "under-50", min: 0, max: 50 },
    { label: "$50 - $100", value: "50-100", min: 50, max: 100 },
    { label: "$100 - $200", value: "100-200", min: 100, max: 200 },
    { label: "$200+", value: "200-plus", min: 200, max: 10000 },
  ];

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/categories`);
      if (response.data.categories) {
        const formattedCategories = response.data.categories.map(cat => ({
          id: cat.category,
          label: cat.category === 'all' ? 'All Products' : cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
          count: cat.count
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback categories
      setCategories([
        { id: "all", label: "All Products", count: 0 },
        { id: "perfumes", label: "Perfumes", count: 0 },
        { id: "skincare", label: "Skincare", count: 0 },
        { id: "makeup", label: "Makeup", count: 0 },
        { id: "tools", label: "Tools", count: 0 },
      ]);
    }
  };

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = {
        page: currentPage,
        limit: itemsPerPage
      };
      
      if (activeCategory && activeCategory !== 'all') {
        params.category = activeCategory;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      // Apply price filters
      if (appliedFilters.price.length > 0) {
        const priceRanges = appliedFilters.price.map(range => {
          switch(range) {
            case 'under-50': return { min: 0, max: 50 };
            case '50-100': return { min: 50, max: 100 };
            case '100-200': return { min: 100, max: 200 };
            case '200-plus': return { min: 200, max: 10000 };
            default: return null;
          }
        }).filter(Boolean);
        
        if (priceRanges.length > 0) {
          params.minPrice = Math.min(...priceRanges.map(r => r.min));
          params.maxPrice = Math.max(...priceRanges.map(r => r.max));
        }
      }
      
      // Apply other filters
      if (appliedFilters.benefits.length > 0) {
        params.benefits = appliedFilters.benefits.join(',');
      }
      if (appliedFilters.skinType.length > 0) {
        params.skinType = appliedFilters.skinType.join(',');
      }
      if (appliedFilters.scentFamily.length > 0) {
        params.scentFamily = appliedFilters.scentFamily.join(',');
      }
      
      // Apply sorting
      switch(sortBy) {
        case 'price-low': params.sortBy = 'price-low'; break;
        case 'price-high': params.sortBy = 'price-high'; break;
        case 'rating': params.sortBy = 'rating'; break;
        case 'newest': params.sortBy = 'newest'; break;
        default: params.sortBy = 'featured'; break;
      }
      
      console.log("Fetching products with params:", params);
      
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`, { params });
      
      if (response.data.products) {
        // Transform backend data to match frontend format
        const transformedProducts = response.data.products.map(product => ({
          id: product._id,
          _id: product._id,
          name: product.productName || product.name,
          productName: product.productName || product.name,
          category: product.category || 'all',
          price: product.price,
          originalPrice: product.originalPrice,
          lastPrice: product.lastPrice || product.price,
          rating: product.rating || 0,
          reviewCount: product.reviewCount || 0,
          image: product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop',
          isNew: product.isNew || false,
          isBestSeller: product.isBestSeller || false,
          description: product.description || '',
          stock: product.stock || 0,
          features: product.features || [],
          benefits: product.benefits || [],
          skinType: product.skinType || [],
          scentFamily: product.scentFamily || []
        }));
        
        setProducts(transformedProducts);
        
        // Update pagination info
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
          setCurrentPage(response.data.pagination.page);
          setTotalProducts(response.data.pagination.total);
        } else {
          // Fallback calculation if backend doesn't provide pagination
          setTotalPages(1);
          setTotalProducts(transformedProducts.length);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products. Please try again.");
      // Fallback to empty products
      setProducts([]);
      setTotalPages(1);
      setCurrentPage(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  // Reset page to 1
  const resetPage = () => {
    setCurrentPage(1);
  };

  // Initialize
  useEffect(() => {
    console.log("ProductPage mounted");
    fetchCategories();
  }, []);

  // Update activeCategory when URL changes
  useEffect(() => {
    console.log("URL changed:", location.pathname, "Category param:", category);
    
    const pathParts = location.pathname.split('/').filter(part => part.trim() !== '');
    let newCategory = "all";
    
    if (pathParts.length === 1 && pathParts[0] === 'shop') {
      newCategory = 'all';
    } else if (pathParts.length === 2 && pathParts[0] === 'shop') {
      newCategory = pathParts[1];
    }
    
    console.log("Setting activeCategory to:", newCategory);
    setActiveCategory(newCategory);
  }, [location.pathname, category]);

  // Fetch products when dependencies change
  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [activeCategory, searchQuery, appliedFilters, sortBy, categories, currentPage, itemsPerPage]);

  const handleCategoryClick = (categoryId) => {
    console.log(`Category clicked: ${categoryId}`);
    setActiveCategory(categoryId);
    resetPage(); // Reset to first page
    if (categoryId === "all") {
      navigate("/shop");
    } else {
      navigate(`/shop/${categoryId}`);
    }
    setSearchQuery("");
    setAppliedFilters({
      price: [],
      skinType: [],
      benefits: [],
      scentFamily: []
    });
  };

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
    resetPage(); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setSortBy("featured");
    resetPage(); // Reset to first page
    setAppliedFilters({
      price: [],
      skinType: [],
      benefits: [],
      scentFamily: []
    });
    navigate("/shop");
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    resetPage(); // Reset to first page when changing items per page
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // If only 1 page, just show it
    if (totalPages === 1) {
      return pages;
    }
    
    // Calculate start and end for middle pages
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust if near start
    if (currentPage <= 2) {
      endPage = Math.min(totalPages - 1, 4);
    }
    
    // Adjust if near end
    if (currentPage >= totalPages - 1) {
      startPage = Math.max(2, totalPages - 3);
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Add last page
    pages.push(totalPages);
    
    return pages;
  };

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20 bg-white">
        <div className="text-center">
          <Loader className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
          <p className="text-sm font-light text-gray-500">Loading formulations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ProdImg}
            alt="Products background"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-white/30"></div>
        </div>
        
        <div className="container relative px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeCategory === "all" ? "all products" : activeCategory}...`}
                  className="w-full py-3 pl-10 pr-10 text-sm border border-gray-200 rounded-lg bg-white/90 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-gray-600"
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
      <div className="sticky top-0 z-40 py-4 bg-white border-b border-gray-100">
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
              onClick={() => setShowFilters(!showFilters)}
              className="items-center hidden gap-2 px-4 py-2 text-sm font-light text-gray-600 transition-colors border border-gray-200 rounded-lg md:flex hover:border-black"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
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
              className="lg:w-64"
            >
              <div className="p-6 border border-gray-100 rounded-lg">
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

                {/* Category-specific filters */}
                {activeCategory === "skincare" && (
                  <div className="mb-6">
                    <h4 className="mb-3 text-xs font-light text-gray-500">Skin Type</h4>
                    <div className="space-y-2">
                      {["dry", "oily", "combination", "sensitive", "normal"].map((type) => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={appliedFilters.skinType.includes(type)}
                            onChange={() => handleFilterChange("skinType", type)}
                            className="w-4 h-4 text-black border-gray-300 rounded"
                          />
                          <span className="text-sm font-light capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeCategory === "perfumes" && (
                  <div className="mb-6">
                    <h4 className="mb-3 text-xs font-light text-gray-500">Scent Family</h4>
                    <div className="space-y-2">
                      {["woody", "floral", "oriental", "fresh", "spicy"].map((scent) => (
                        <label key={scent} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={appliedFilters.scentFamily.includes(scent)}
                            onChange={() => handleFilterChange("scentFamily", scent)}
                            className="w-4 h-4 text-black border-gray-300 rounded"
                          />
                          <span className="text-sm font-light capitalize">{scent}</span>
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

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8">
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-light text-black">
                  {totalProducts === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalProducts)}
                </span>{" "}
                of <span className="font-light text-black">{totalProducts}</span>{" "}
                {activeCategory !== "all" ? activeCategory : "formulations"}
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex items-center gap-1 p-1 border border-gray-200 rounded-lg">
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

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
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
            {products.length === 0 ? (
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
                <div className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                  {products.map((product, index) => (
                    <ProductCard key={product._id} product={product} index={index} />
                  ))}
                </div>

                {/* Pagination - ALWAYS SHOW when there are products */}
                {products.length > 0 && (
                  <div className="flex flex-col items-center justify-between gap-4 mt-12 md:flex-row">
                    {/* Items per page selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Show:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                        className="py-1 pl-3 pr-8 text-sm font-light text-gray-600 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-black"
                      >
                        <option value={12}>12 per page</option>
                        <option value={24}>24 per page</option>
                        <option value={48}>48 per page</option>
                        <option value={96}>96 per page</option>
                      </select>
                    </div>
                    
                    {/* Page info */}
                    <div className="text-sm text-gray-500">
                      Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} items
                    </div>
                    
                    {/* Pagination buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 text-sm font-light transition-colors border border-gray-200 rounded-lg ${
                          currentPage === 1 
                            ? 'text-gray-400 cursor-not-allowed opacity-50' 
                            : 'text-gray-600 hover:border-black hover:text-black'
                        }`}
                      >
                        Previous
                      </button>
                      
                      {/* Page numbers */}
                      <div className="flex items-center gap-1">
                        {generatePageNumbers().map((pageNum, index) => (
                          pageNum === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                              ...
                            </span>
                          ) : (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg ${
                                currentPage === pageNum
                                  ? 'font-medium text-white bg-black border border-black'
                                  : 'font-light text-gray-600 border border-gray-200 hover:border-black'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        ))}
                      </div>
                      
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 text-sm font-light transition-colors border border-gray-200 rounded-lg ${
                          currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed opacity-50'
                            : 'text-gray-600 hover:border-black hover:text-black'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="fixed z-50 flex items-center gap-2 px-4 py-3 text-sm font-light text-white transition-all bg-black rounded-full shadow-lg bottom-6 right-6 md:hidden hover:bg-gray-800"
      >
        <Sliders className="w-4 h-4" />
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>
    </div>
  );
}
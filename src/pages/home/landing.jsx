import { useState, useEffect } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch featured products
        const featuredResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/featured`
        );

        if (featuredResponse.data.products) {
          // Transform backend data to match ProductCard format
          // In LandingPage.js, update the product transformation section
          const transformedProducts = featuredResponse.data.products.map(
            (product, index) => ({
              id: product._id || product.id, // Use _id as primary ID
              _id: product._id, // Keep _id
              productId: product._id, // productId from backend
              name: product.productName || product.name,
              productName: product.productName || product.name,
              category: product.category,
              price: product.lastPrice || product.price,
              originalPrice: product.originalPrice,
              rating: product.rating || 0,
              reviewCount: product.reviewCount || 0,
              image:
                product.images && product.images.length > 0
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
            })
          );

          setFeaturedProducts(transformedProducts);
        }

        // Fetch categories with counts
        const categoriesResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/categories`
        );

        if (categoriesResponse.data.categories) {
          // Remove 'all' category for display purposes
          const filteredCategories = categoriesResponse.data.categories
            .filter((cat) => cat.category !== "all")
            .map((cat) => ({
              id: cat.category,
              title: getCategoryTitle(cat.category),
              description: getCategoryDescription(cat.category),
              image: getCategoryImage(cat.category),
              count: `${cat.count} items`,
            }));

          setCategories(filteredCategories);
        }
      } catch (error) {
        console.error("Error fetching landing page data:", error);
        toast.error("Failed to load featured content");

        // Fallback data if API fails
        setFeaturedProducts([
          {
            id: "fallback-1",
            _id: "fallback-1",
            productId: "SKI001",
            name: "Golden Saffron Elixir Serum",
            category: "skincare",
            price: 145,
            rating: 4.8,
            image:
              "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop",
            isNew: true,
            stock: 10,
          },
        ]);

        setCategories([
          {
            id: "perfumes",
            title: "Perfumes & Scents",
            description: "Artisanal fragrances",
            image:
              "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1140&auto=format&fit=crop",
            count: "24 items",
          },
          {
            id: "skincare",
            title: "Skincare Rituals",
            description: "Ancient formulations",
            image:
              "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=1140&auto=format&fit=crop",
            count: "18 items",
          },
          {
            id: "makeup",
            title: "Cultural Makeup",
            description: "Traditional beauty",
            image:
              "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1035&auto=format&fit=crop",
            count: "12 items",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-300 rounded-full border-t-black animate-spin"></div>
          <p className="text-sm font-light text-gray-500">Loading...</p>
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

      {/* Featured Products */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="mb-2 text-3xl font-light">Curated Collections</h2>
              <p className="text-gray-500">Essentials for your beauty ritual</p>
            </div>
            <Link
              to="/shop"
              className="flex items-center text-sm font-light hover:text-gray-600"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">No featured products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
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

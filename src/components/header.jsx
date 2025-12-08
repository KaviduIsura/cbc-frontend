import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ShoppingBag, Heart, Search, User, ChevronDown, Sparkles } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);

  // Handle scroll effect for subtle header transformation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Wellness-focused navigation with dropdowns
  const wellnessCategories = [
    {
      name: "Rituals",
      path: "/rituals",
      subItems: [
        { name: "Morning Calming", path: "/rituals/morning" },
        { name: "Evening Renewal", path: "/rituals/evening" },
        { name: "Weekly Self-Care", path: "/rituals/weekly" },
        { name: "Cultural Ceremonies", path: "/rituals/ceremonies" }
      ]
    },
    {
      name: "Products",
      path: "/products",
      subItems: [
        { name: "By Concern", path: "/products/concern" },
        { name: "By Ingredient", path: "/products/ingredient" },
        { name: "By Culture", path: "/products/culture" },
        { name: "New Arrivals", path: "/products/new" }
      ]
    },
    { name: "Our Story", path: "/story" },
    {
      name: "Wellness",
      path: "/wellness",
      subItems: [
        { name: "Guided Rituals", path: "/wellness/guides" },
        { name: "Mindfulness Blog", path: "/wellness/blog" },
        { name: "Community Stories", path: "/wellness/community" },
        { name: "Practitioner Tips", path: "/wellness/tips" }
      ]
    },
    { name: "Impact", path: "/impact" }
  ];

  const utilityLinks = [
    { icon: <Search className="w-5 h-5" />, path: "/search", label: "Search" },
    { icon: <Heart className="w-5 h-5" />, path: "/wishlist", label: "Wishlist" },
    { icon: <User className="w-5 h-5" />, path: "/account", label: "Account" },
    { icon: <ShoppingBag className="w-5 h-5" />, path: "/cart", label: "Cart", badge: 3 }
  ];

  const handleDropdownEnter = (index) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(index);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? "hidden" : "unset";
  };

  const handleNavClick = (path) => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
    navigate(path);
  };

  return (
    <>
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-white/95 backdrop-blur-md shadow-lg py-3" 
            : "bg-gradient-to-b from-sage-50/90 to-white/80 backdrop-blur-sm py-5"
        }`}
      >
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo with subtle animation */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
              onClick={() => handleNavClick("/")}
            >
              <div className="relative p-1 overflow-hidden transition-transform duration-500 border-2 rounded-full border-terracotta-200 group-hover:scale-105 group-hover:border-terracotta-300">
                <img
                  src="/logo.png"
                  alt="Sage & Bloom Beauty"
                  className="object-cover rounded-full h-14 w-14"
                />
                <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-white/10 to-transparent group-hover:opacity-100"></div>
              </div>
              <div className="hidden md:block">
                <h1 className="font-serif text-2xl font-bold tracking-tight text-sage-800">Sage & Bloom</h1>
                <p className="text-xs font-light tracking-wider text-terracotta-600">Inclusive Beauty Rituals</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="items-center hidden space-x-8 lg:flex">
              {wellnessCategories.map((item, index) => (
                <div 
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(index)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-1 font-medium transition-all duration-300 ${
                      location.pathname.startsWith(item.path)
                        ? "text-terracotta-600"
                        : scrolled ? "text-sage-800 hover:text-terracotta-500" : "text-sage-700 hover:text-terracotta-500"
                    }`}
                  >
                    <span className="relative">
                      {item.name}
                      {item.name === "Rituals" && (
                        <Sparkles className="absolute w-3 h-3 -top-2 -right-3 text-amber-400 fill-amber-400" />
                      )}
                    </span>
                    {item.subItems && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        activeDropdown === index ? "rotate-180" : ""
                      }`} />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.subItems && activeDropdown === index && (
                    <div 
                      className="absolute left-0 w-56 mt-2 overflow-hidden border shadow-2xl top-full bg-white/95 backdrop-blur-md rounded-xl border-sage-100 animate-fadeIn"
                      onMouseEnter={() => handleDropdownEnter(index)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="py-3">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className="flex items-center px-4 py-3 transition-all duration-300 text-sage-700 hover:bg-sage-50/80 hover:text-terracotta-600 group"
                            onClick={() => handleNavClick(subItem.path)}
                          >
                            <div className="w-2 h-2 mr-3 transition-all duration-500 rounded-full opacity-0 bg-terracotta-200 group-hover:opacity-100 group-hover:scale-125"></div>
                            <span className="text-sm font-medium">{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-6">
              {/* Utility Icons */}
              <div className="items-center hidden space-x-5 md:flex">
                {utilityLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`relative p-2 rounded-full transition-all duration-300 ${
                      scrolled 
                        ? "text-sage-700 hover:bg-sage-100/80 hover:text-terracotta-500" 
                        : "text-sage-600 hover:bg-white/60 hover:text-terracotta-500"
                    }`}
                    aria-label={link.label}
                  >
                    {link.icon}
                    {link.badge && (
                      <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -top-1 -right-1 bg-terracotta-500 animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => handleNavClick("/rituals")}
                className="hidden md:block px-5 py-2.5 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white font-medium rounded-full hover:from-terracotta-600 hover:to-terracotta-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                Find Your Ritual
              </button>

              {/* Mobile Menu Button */}
              <button
                className="p-2 rounded-full lg:hidden"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <div className={`relative w-6 h-6 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}>
                  <div className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-sage-700 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                    isOpen ? "rotate-45" : "-translate-y-2"
                  }`}></div>
                  <div className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-sage-700 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                    isOpen ? "opacity-0" : "opacity-100"
                  }`}></div>
                  <div className={`absolute top-1/2 left-1/2 w-6 h-0.5 bg-sage-700 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                    isOpen ? "-rotate-45" : "translate-y-2"
                  }`}></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-40 lg:hidden transition-all duration-700 ease-in-out ${
          isOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        style={{ 
          background: "radial-gradient(circle at 20% 50%, rgba(184, 206, 194, 0.1) 0%, rgba(255, 255, 255, 0.95) 70%)"
        }}
      >
        <div className="flex flex-col h-full px-6 pt-24 pb-10 overflow-y-auto">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-10">
            <div className="text-center">
              <img
                src="/logo.png"
                alt="Sage & Bloom Beauty"
                className="object-cover w-20 h-20 mx-auto mb-4 rounded-full"
              />
              <h2 className="font-serif text-3xl font-bold text-sage-800">Sage & Bloom</h2>
              <p className="mt-2 text-terracotta-600">Where Culture Meets Self-Care</p>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="mb-10 space-y-1">
            {wellnessCategories.map((item) => (
              <div key={item.name} className="border-b border-sage-100 last:border-0">
                <button
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center justify-between w-full py-4 text-left ${
                    location.pathname.startsWith(item.path)
                      ? "text-terracotta-600"
                      : "text-sage-800"
                  }`}
                >
                  <span className="text-lg font-medium">{item.name}</span>
                  {item.subItems && (
                    <ChevronDown className="w-5 h-5 text-sage-500" />
                  )}
                </button>
                
                {/* Mobile Submenu */}
                {item.subItems && (
                  <div className="pb-3 pl-4 space-y-2">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className="block py-2 transition-colors text-sage-600 hover:text-terracotta-500"
                        onClick={() => handleNavClick(subItem.path)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-auto space-y-4">
            <button
              onClick={() => handleNavClick("/rituals")}
              className="w-full py-3.5 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white font-medium rounded-full text-lg hover:from-terracotta-600 hover:to-terracotta-700 transition-all duration-300 shadow-lg"
            >
              Begin Your Ritual Journey
            </button>
            
            <div className="flex justify-center pt-4 space-x-6">
              {utilityLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="p-3 transition-all duration-300 rounded-full bg-sage-50 text-sage-700 hover:bg-terracotta-50 hover:text-terracotta-600"
                  onClick={() => handleNavClick(link.path)}
                  aria-label={link.label}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add these to your global CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
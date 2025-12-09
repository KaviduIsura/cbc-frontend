import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown, User, LogOut, Settings, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userProfileDropdown, setUserProfileDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleSignup = () => {
    navigate('/signup');
    setIsMenuOpen(false);
  };
  
  const handleCart = () => {
    navigate('/cart');
    setIsMenuOpen(false);
  }

  const handleWishlist = () => {
    navigate('/wishlist');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setUserProfileDropdown(false);
    localStorage.removeItem('user');
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { 
      label: 'Shop', 
      hasDropdown: true,
      dropdownItems: [
        { label: 'All Products', to: '/shop/all' },
        { label: 'Perfumes', to: '/shop/perfumes' },
        { label: 'Skincare', to: '/shop/skincare' },
        { label: 'Makeup', to: '/shop/makeup' },
        { label: 'Tools', to: '/shop/tools' },
      ]
    },
    { label: 'Our Story', to: '/story' },
    { 
      label: 'Ingredients', 
      hasDropdown: true,
      dropdownItems: [
        { label: 'Oud & Attars', to: '/ingredients/oud' },
        { label: 'Saffron & Gold', to: '/ingredients/saffron' },
        { label: 'Argan & Rose', to: '/ingredients/argan' },
        { label: 'Sandalwood', to: '/ingredients/sandalwood' },
      ]
    },
    { label: 'Rituals', to: '/rituals' },
    { label: 'Journal', to: '/journal' },
  ];

  const handleMouseEnter = (label) => {
    if (navItems.find(item => item.label === label)?.hasDropdown) {
      setActiveDropdown(label);
    }
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container px-6 py-4 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-light tracking-wider"
          >
            <Link to="/" className="transition-colors hover:text-gray-600">
              ELEVÉ
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="items-center hidden space-x-8 md:flex">
            {navItems.map((item) => (
              <div 
                key={item.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.label)}
              >
                {item.hasDropdown ? (
                  <button
                    className="flex items-center gap-1 text-sm font-light tracking-wide transition-colors hover:text-gray-600"
                  >
                    {item.label}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link 
                    to={item.to}
                    className="flex items-center gap-1 text-sm font-light tracking-wide transition-colors hover:text-gray-600"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 w-48 py-2 mt-2 bg-white border border-gray-100 shadow-lg top-full"
                  >
                    {item.dropdownItems.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.label}
                        to={dropdownItem.to}
                        className="block px-4 py-2 text-sm font-light transition-colors hover:bg-gray-50"
                      >
                        {dropdownItem.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Icons & Actions */}
          <div className="flex items-center space-x-6">
            <button className="hidden transition-colors md:block hover:text-gray-600" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button 
              className="relative transition-colors hover:text-gray-600" 
              aria-label="Wishlist" 
              onClick={handleWishlist}
            >
              <Heart className="w-5 h-5" />
              <span className="absolute w-2 h-2 bg-red-500 rounded-full -top-1 -right-1"></span>
            </button>
            <button 
              className="relative transition-colors hover:text-gray-600" 
              aria-label="Shopping cart"
              onClick={handleCart}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-black rounded-full -top-2 -right-2">
                3
              </span>
            </button>
            
            {/* User Profile / Auth Buttons */}
            <div className="relative">
              {isLoggedIn ? (
                <div 
                  className="relative"
                  onMouseEnter={() => setUserProfileDropdown(true)}
                  onMouseLeave={() => setUserProfileDropdown(false)}
                >
                  <button 
                    className="flex items-center gap-2 transition-colors hover:text-gray-600"
                    aria-label="User profile"
                  >
                    <div className="flex items-center justify-center w-8 h-8 text-sm text-white bg-black rounded-full">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden text-sm font-light md:block">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${userProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Profile Dropdown */}
                  <AnimatePresence>
                    {userProfileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 w-48 py-2 mt-2 bg-white border border-gray-100 shadow-lg top-full"
                        onMouseEnter={() => setUserProfileDropdown(true)}
                        onMouseLeave={() => setUserProfileDropdown(false)}
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-sm font-light transition-colors hover:bg-gray-50">
                          <User className="w-4 h-4" />
                          My Account
                        </Link>
                        <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm font-light transition-colors hover:bg-gray-50">
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>
                        <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm font-light transition-colors hover:bg-gray-50">
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full gap-2 px-4 py-2 text-sm font-light text-left text-red-500 transition-colors hover:bg-gray-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="items-center hidden gap-3 md:flex">
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 text-sm font-light text-black transition-all border border-black rounded hover:bg-black hover:text-white"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleSignup}
                    className="px-4 py-2 text-sm font-light text-white transition-colors bg-black rounded hover:bg-gray-800"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
            
            <button 
              className="transition-colors md:hidden hover:text-gray-600" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 mt-4 overflow-hidden border-t md:hidden"
            >
              <div className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.hasDropdown ? (
                      <>
                        <div className="block py-3 text-sm font-light border-b border-gray-50">
                          {item.label}
                        </div>
                        <div className="pl-4 space-y-1">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.label}
                              to={dropdownItem.to}
                              className="block py-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link 
                        to={item.to}
                        className="block py-3 text-sm font-light transition-colors border-b hover:text-gray-600 border-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Mobile-only links with auth */}
                <div className="pt-4 space-y-3">
                  {isLoggedIn ? (
                    <>
                      <div className="px-2 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link to="/account" className="block text-sm font-light transition-colors hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                        My Account
                      </Link>
                      <Link to="/orders" className="block text-sm font-light transition-colors hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-sm font-light text-left text-red-500 transition-colors hover:text-red-600"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleLogin}
                        className="block w-full py-3 text-sm font-light text-center text-black transition-all border border-black rounded hover:bg-black hover:text-white"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={handleSignup}
                        className="block w-full py-3 text-sm font-light text-center text-white transition-colors bg-black rounded hover:bg-gray-800"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                  <button 
                    onClick={handleWishlist}
                    className="flex items-center gap-2 text-sm font-light transition-colors hover:text-gray-600"
                  >
                    <Heart className="w-4 h-4" />
                    Wishlist
                  </button>
                  <button 
                    onClick={handleCart}
                    className="flex items-center gap-2 text-sm font-light transition-colors hover:text-gray-600"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Cart
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
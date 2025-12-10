// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ChevronDown, User, LogOut, Settings, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import the context

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userProfileDropdown, setUserProfileDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Use the cart context
  const { cartCount, fetchCartCount } = useCart();

  useEffect(() => {
    // Check both token and user in localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
        // Fetch cart count when user logs in
        fetchCartCount();
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [fetchCartCount]);

  // Listen for storage changes (for login/logout from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          setIsLoggedIn(true);
          setUser(JSON.parse(storedUser));
          fetchCartCount(); // Fetch cart when user logs in
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchCartCount]);

  // Listen for cart update events
  useEffect(() => {
    const handleCartUpdateEvent = () => {
      if (isLoggedIn) {
        fetchCartCount();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdateEvent);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdateEvent);
    };
  }, [isLoggedIn, fetchCartCount]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };
  
  const handleCart = () => {
    navigate('/cart');
  }

  const handleWishlist = () => {
    navigate('/wishlist');
  };

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setIsLoggedIn(false);
    setUser(null);
    setUserProfileDropdown(false);
    setIsMenuOpen(false);
    
    // Reset cart count
    fetchCartCount();
    
    // Navigate to home
    navigate('/');
    
    // Optional: Show logout success message
    // toast.success('Logged out successfully');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { 
      label: 'Shop', 
      hasDropdown: true,
      dropdownItems: [
        { label: 'All Products', href: '/shop/all' },
        { label: 'Perfumes', href: '/shop/perfumes' },
        { label: 'Skincare', href: '/shop/skincare' },
        { label: 'Makeup', href: '/shop/makeup' },
        { label: 'Tools', href: '/shop/tools' },
      ]
    },
    { label: 'Our Story', href: '/story' },
    { 
      label: 'Ingredients', 
      hasDropdown: true,
      dropdownItems: [
        { label: 'Oud & Attars', href: '/ingredients/oud' },
        { label: 'Saffron & Gold', href: '/ingredients/saffron' },
        { label: 'Argan & Rose', href: '/ingredients/argan' },
        { label: 'Sandalwood', href: '/ingredients/sandalwood' },
      ]
    },
    { label: 'Rituals', href: '/rituals' },
    { label: 'Journal', href: '/journal' },
  ];

  const handleMouseEnter = (label) => {
    if (navItems.find(item => item.label === label)?.hasDropdown) {
      setActiveDropdown(label);
    }
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  // Format user name from backend response
  const getUserName = () => {
    if (!user) return 'User';
    
    // Backend returns firstName and lastName separately
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    // Fallback to name if exists
    if (user.name) {
      return user.name;
    }
    
    // Fallback to email first part
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User';
  };

  // Get user initial for avatar
  const getUserInitial = () => {
    if (!user) return 'U';
    
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  // Get user profile picture
  const getUserProfilePic = () => {
    if (user && user.profilePic) {
      return user.profilePic;
    }
    return null;
  };

  // Function to trigger cart update from other components
  const triggerCartUpdate = () => {
    if (isLoggedIn) {
      fetchCartCount();
    }
  };

  // Expose function to window for other components to use
  useEffect(() => {
    window.triggerCartUpdate = triggerCartUpdate;
    return () => {
      delete window.triggerCartUpdate;
    };
  }, [isLoggedIn]);

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
                <Link 
                  to={item.href || '#'}
                  className="flex items-center gap-1 text-sm font-light tracking-wide transition-colors hover:text-gray-600"
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  )}
                </Link>

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
                        to={dropdownItem.href}
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
            
            {isLoggedIn && (
              <button className="relative transition-colors hover:text-gray-600" aria-label="Wishlist" onClick={handleWishlist}>
                <Heart className="w-5 h-5" />
                <span className="absolute w-2 h-2 bg-red-500 rounded-full -top-1 -right-1"></span>
              </button>
            )}
            
            {isLoggedIn && (
              <button className="relative transition-colors hover:text-gray-600" aria-label="Shopping cart" onClick={handleCart}>
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-black rounded-full -top-2 -right-2"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </button>
            )}
            
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
                    {getUserProfilePic() ? (
                      <img 
                        src={getUserProfilePic()} 
                        alt={getUserName()}
                        className="object-cover w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-8 h-8 text-sm text-white bg-black rounded-full">
                        {getUserInitial()}
                      </div>
                    )}
                    <span className="hidden text-sm font-light md:block">
                      {getUserName().split(' ')[0]}
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
                          <p className="text-sm font-medium truncate">{getUserName()}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                          {user?.type === 'admin' && (
                            <span className="inline-block px-2 py-1 mt-1 text-xs font-medium text-white bg-red-500 rounded">
                              Admin
                            </span>
                          )}
                        </div>
                        
                        <Link 
                          to="/account" 
                          className="flex items-center gap-2 px-4 py-2 text-sm font-light transition-colors hover:bg-gray-50"
                          onClick={() => setUserProfileDropdown(false)}
                        >
                          <User className="w-4 h-4" />
                          My Account
                        </Link>
                        
                        <Link 
                          to="/orders" 
                          className="flex items-center gap-2 px-4 py-2 text-sm font-light transition-colors hover:bg-gray-50"
                          onClick={() => setUserProfileDropdown(false)}
                        >
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>
                        
                        <Link 
                          to="/wishlist" 
                          className="flex items-center gap-2 px-4 py-2 text-sm font-light transition-colors hover:bg-gray-50"
                          onClick={() => setUserProfileDropdown(false)}
                        >
                          <Heart className="w-4 h-4" />
                          Wishlist
                        </Link>
                        
                        <div className="flex items-center gap-2 px-4 py-2 text-sm font-light">
                          <ShoppingBag className="w-4 h-4" />
                          Cart ({cartCount} items)
                        </div>
                        
                        <Link 
                          to="/settings" 
                          className="flex items-center gap-2 px-4 py-2 text-sm font-light transition-colors hover:bg-gray-50"
                          onClick={() => setUserProfileDropdown(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        
                        {user?.type === 'admin' && (
                          <Link 
                            to="/admin" 
                            className="flex items-center gap-2 px-4 py-2 text-sm font-light transition-colors hover:bg-gray-50"
                            onClick={() => setUserProfileDropdown(false)}
                          >
                            <Settings className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        
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
                    className="px-4 py-2 text-sm font-light text-black transition-all border border-black hover:bg-black hover:text-white"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleSignup}
                    className="px-4 py-2 text-sm font-light text-white transition-colors bg-black hover:bg-gray-800"
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
                    <Link 
                      to={item.href || '#'}
                      className="block py-3 text-sm font-light transition-colors border-b hover:text-gray-600 border-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.hasDropdown && (
                      <div className="pl-4 space-y-1">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.label}
                            to={dropdownItem.href}
                            className="block py-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Mobile-only links with auth */}
                <div className="pt-4 space-y-3">
                  {isLoggedIn ? (
                    <>
                      <div className="px-2 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium">{getUserName()}</p>
                        <p className="text-xs text-gray-500">{user?.email || ''}</p>
                        {user?.type === 'admin' && (
                          <span className="inline-block px-2 py-1 mt-1 text-xs font-medium text-white bg-red-500 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      <Link 
                        to="/account" 
                        className="block text-sm font-light transition-colors hover:text-gray-600" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link 
                        to="/orders" 
                        className="block text-sm font-light transition-colors hover:text-gray-600" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link 
                        to="/wishlist" 
                        className="block text-sm font-light transition-colors hover:text-gray-600" 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Wishlist
                      </Link>
                      <div className="block text-sm font-light">
                        Cart ({cartCount} items)
                      </div>
                      {user?.type === 'admin' && (
                        <Link 
                          to="/admin" 
                          className="block text-sm font-light transition-colors hover:text-gray-600" 
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
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
                        className="block w-full py-3 text-sm font-light text-center text-black transition-all border border-black hover:bg-black hover:text-white"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={handleSignup}
                        className="block w-full py-3 text-sm font-light text-center text-white transition-colors bg-black hover:bg-gray-800"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                  <Link 
                    to="/contact" 
                    className="block text-sm font-light transition-colors hover:text-gray-600" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
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
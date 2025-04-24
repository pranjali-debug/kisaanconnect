import React, { useState, useEffect } from 'react';
import { Menu, X, Sprout, LogIn, UserPlus, LogOut, User, ShoppingCart, MessageCircle } from 'lucide-react';
import { NavItem } from '../types';
import AuthModal from './Auth/AuthModal';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Produce', href: '#produce' },
  { label: 'Contact', href: '#contact' },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  
  const { currentUser, logout } = useAuth();
  const { cartCount } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openLoginModal = () => {
    setAuthModalTab('login');
    setShowAuthModal(true);
  };

  const openSignupModal = () => {
    setAuthModalTab('signup');
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // User authentication actions
  const renderAuthButtons = () => {
    if (currentUser) {
      return (
        <div className="flex items-center space-x-3">
          <a 
            href="#/cart"
            className="relative p-1 text-kisaan-darkbrown hover:text-kisaan-green transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-kisaan-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>
          <a 
            href="#/chatbot"
            className="p-1 text-kisaan-darkbrown hover:text-kisaan-green transition-colors"
            title="Agricultural Assistant"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <span className="flex items-center gap-2 text-kisaan-darkbrown">
            <User className="h-4 w-4" />
            <span className="text-sm hidden lg:inline">
              {currentUser.email?.split('@')[0]}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-kisaan-cream text-kisaan-darkbrown px-4 py-2 rounded-md hover:bg-kisaan-cream/80 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-3">
        <a 
          href="#/cart"
          className="relative p-1 text-kisaan-darkbrown hover:text-kisaan-green transition-colors"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-kisaan-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </a>
        <a 
          href="#/chatbot"
          className="p-1 text-kisaan-darkbrown hover:text-kisaan-green transition-colors"
          title="Agricultural Assistant"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
        <button
          onClick={openLoginModal}
          className="flex items-center gap-2 text-kisaan-darkbrown hover:text-kisaan-green transition-colors"
        >
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </button>
        <button
          onClick={openSignupModal}
          className="flex items-center gap-2 bg-kisaan-green text-white px-4 py-2 rounded-md hover:bg-kisaan-green/90 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          <span>Sign Up</span>
        </button>
      </div>
    );
  };

  // Mobile navigation auth buttons
  const renderMobileAuthButtons = () => {
    if (currentUser) {
      return (
        <>
          <div className="flex items-center px-4 py-2">
            <a 
              href="#/cart"
              className="relative p-1 text-kisaan-darkbrown hover:text-kisaan-green transition-colors mr-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-kisaan-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>
            <a 
              href="#/chatbot"
              className="p-1 text-kisaan-darkbrown hover:text-kisaan-green transition-colors mr-3"
              title="Agricultural Assistant"
              onClick={() => setIsMenuOpen(false)}
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <div className="text-kisaan-darkbrown font-medium">
              <User className="h-4 w-4 inline mr-2" />
              {currentUser.email?.split('@')[0]}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 mx-4 bg-kisaan-cream text-kisaan-darkbrown px-4 py-2 rounded-md hover:bg-kisaan-cream/80 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </>
      );
    }
    
    return (
      <>
        <div className="flex items-center px-4 py-2">
          <a 
            href="#/cart"
            className="relative p-1 text-kisaan-darkbrown hover:text-kisaan-green transition-colors mr-3"
            onClick={() => setIsMenuOpen(false)}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-kisaan-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>
          <a 
            href="#/chatbot"
            className="p-1 text-kisaan-darkbrown hover:text-kisaan-green transition-colors mr-3"
            title="Agricultural Assistant"
            onClick={() => setIsMenuOpen(false)}
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
        <button
          onClick={() => {
            openLoginModal();
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-2 px-4 py-2 text-kisaan-darkbrown hover:text-kisaan-green transition-colors"
        >
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </button>
        <button
          onClick={() => {
            openSignupModal();
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-2 mx-4 bg-kisaan-green text-white px-4 py-2 rounded-md hover:bg-kisaan-green/90 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          <span>Sign Up</span>
        </button>
      </>
    );
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <a href="#home" className="flex items-center gap-2 text-kisaan-darkbrown">
              <Sprout className="h-8 w-8 text-kisaan-green" />
              <span className="text-xl font-bold">KisaanConnect</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`transition-colors duration-200 hover:text-kisaan-green ${
                    activeSection === item.href.slice(1)
                      ? 'text-emerald-700 font-bold'
                      : 'text-kisaan-darkbrown font-medium'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              {renderAuthButtons()}
            </div>

            {/* Mobile Navigation Toggle */}
            <button
              className="md:hidden text-kisaan-darkbrown focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg animate-slide-down">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`px-4 py-2 transition-colors hover:text-kisaan-green ${
                      activeSection === item.href.slice(1)
                        ? 'text-emerald-700 font-bold bg-kisaan-cream'
                        : 'text-kisaan-darkbrown font-medium'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <hr className="border-gray-200" />
                {renderMobileAuthButtons()}
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialTab={authModalTab} 
      />
    </>
  );
};

export default Navbar;
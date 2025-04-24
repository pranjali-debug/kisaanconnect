import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Produce from './components/Produce';
import AllProduce from './components/AllProduce';
import Contact from './components/Contact';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  const [currentHash, setCurrentHash] = useState<string>('');

  useEffect(() => {
    // Track hash changes for simple routing
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    // Set initial hash
    handleHashChange();

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Simple component to handle rendering based on hash
  const RouterContent = () => {
    const { currentUser } = useAuth();
    
    // Cart page
    if (currentHash === '#/cart') {
      return <Cart />;
    }
    
    // Checkout page - only accessible if logged in
    if (currentHash === '#/checkout') {
      if (currentUser) {
        return <Checkout />;
      } else {
        // Redirect to cart if not logged in
        window.location.hash = '/cart';
        return <Cart />;
      }
    }
    
    // Chatbot page
    if (currentHash === '#/chatbot') {
      return <Chatbot />;
    }
    
    // If hash is #/all-produce, show AllProduce component
    if (currentHash === '#/all-produce') {
      if (currentUser) {
        return <AllProduce />;
      } else {
        // Redirect to home if not logged in
        window.location.hash = '';
        return (
          <>
            <Hero />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <About />
              <Produce />
              <Contact />
            </div>
          </>
        );
      }
    }

    // Default view
    return (
      <>
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <About />
          <Produce />
          <Contact />
        </div>
      </>
    );
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="font-sans bg-gray-50">
          <Navbar />
          <RouterContent />
          <Footer />
          <ScrollToTop />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import ProduceCard from './ProduceCard';
import { produceData } from '../data/produce';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './Auth/AuthModal';
// Replace cookieStorage import with storage.ts import
import { initializeProduceData } from '../utils/storage';
import { ProduceItem } from '../types';

const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Spices'];

const Produce: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<ProduceItem[]>([]);
  
  // Load products from localStorage on component mount
  useEffect(() => {
    const storedProducts = initializeProduceData(produceData);
    setProducts(storedProducts);
  }, []);

  const filteredProduce = activeCategory === 'All' 
    ? products 
    : products.filter(item => item.category === activeCategory);

  const handleViewAllProduce = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentUser) {
      // Navigate to all produce page if logged in
      window.location.href = "#/all-produce";
    } else {
      // Show the AuthModal component if not logged in
      setShowAuthModal(true);
    }
  };

  return (
    <section id="produce" className="py-12 bg-white rounded-lg shadow-sm mb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-kisaan-darkbrown mb-3">
            Available Produce
          </h2>
          <div className="w-16 h-1 bg-kisaan-green mx-auto mb-4"></div>
          <p className="max-w-2xl mx-auto text-kisaan-brown">
            Browse fresh, surplus produce directly from Indian farmers, ready for your NGO to purchase.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-kisaan-green text-white'
                  : 'bg-gray-100 text-kisaan-darkbrown hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProduce.slice(0, 3).map((item) => (
            <ProduceCard key={item.id} item={item} />
          ))}
        </div>

        {filteredProduce.length === 0 && (
          <div className="text-center py-8">
            <p className="text-kisaan-brown">
              No produce available in this category at the moment.
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <a
            href="#"
            onClick={handleViewAllProduce}
            className="bg-kisaan-cream text-kisaan-darkbrown px-5 py-2 rounded-md font-medium hover:bg-kisaan-cream/80 transition-colors inline-block text-sm"
          >
            View All Produce
          </a>
        </div>
      </div>
      
      {/* Directly use the AuthModal component instead of custom modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialTab="signup"
      />
    </section>
  );
};

export default Produce;
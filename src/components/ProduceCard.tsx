import React, { useState } from 'react';
import { MapPin, ShoppingCart, X } from 'lucide-react';
import { ProduceItem } from '../types';
import AuthModal from './Auth/AuthModal';
import { useAuth } from '../contexts/AuthContext';

interface ProduceCardProps {
  item: ProduceItem;
}

const ProduceCard: React.FC<ProduceCardProps> = ({ item }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { currentUser } = useAuth();

  const handleBuyNow = (e: React.MouseEvent) => {
    if (!currentUser) {
      // If user is not logged in, show auth modal
      e.preventDefault();
      setShowAuthModal(true);
    } else {
      // If user is logged in, show product details modal
      setShowDetailModal(true);
    }
  };

  // Detail Modal Component
  const DetailModal = () => {
    if (!showDetailModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center p-5 border-b">
            <h2 className="text-xl font-semibold text-kisaan-darkbrown">
              Product Details
            </h2>
            <button 
              onClick={() => setShowDetailModal(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors hover:bg-gray-100 p-1.5 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="md:w-1/3">
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              
              {/* Product Details */}
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-kisaan-darkbrown mb-2">{item.name}</h3>
                
                <div className="mb-4">
                  <span className="inline-block bg-kisaan-green text-white px-3 py-1 rounded-full text-sm">
                    {item.category}
                  </span>
                </div>
                
                <p className="text-kisaan-brown mb-4">
                  <span className="font-semibold">Farmer:</span> {item.farmer}
                </p>
                
                <div className="flex items-center text-kisaan-brown mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{item.location}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xl font-bold text-kisaan-green">
                    ₹{item.price} <span className="text-sm font-normal">per {item.unit}</span>
                  </div>
                  <div className="text-kisaan-brown">
                    Available: {item.quantity} {item.unit}
                  </div>
                </div>
                
                {/* Additional Details */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h4 className="font-semibold text-kisaan-darkbrown mb-2">Additional Information</h4>
                  <p className="text-kisaan-brown mb-2">
                    <span className="font-medium">Harvested:</span> {new Date().toLocaleDateString()}
                  </p>
                  <p className="text-kisaan-brown mb-2">
                    <span className="font-medium">Best Before:</span> {new Date(Date.now() + 12096e5).toLocaleDateString()}
                  </p>
                  <p className="text-kisaan-brown">
                    <span className="font-medium">Storage:</span> Keep refrigerated for longer shelf life.
                  </p>
                </div>
                
                {/* Call to Action Buttons */}
                <div className="flex gap-4">
                  <button 
                    className="flex-1 bg-kisaan-green hover:bg-kisaan-green/90 text-white py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                  <button 
                    className="flex-1 bg-kisaan-cream hover:bg-kisaan-cream/80 text-kisaan-darkbrown py-3 rounded-md font-medium transition-colors"
                  >
                    Contact Farmer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
      <div className="relative overflow-hidden h-48">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium text-kisaan-darkbrown">
          {item.category}
        </div>
        {item.available ? (
          <div className="absolute bottom-3 left-3 bg-kisaan-lightgreen px-2 py-1 rounded-full text-xs font-medium text-white">
            In Stock
          </div>
        ) : (
          <div className="absolute bottom-3 left-3 bg-red-500 px-2 py-1 rounded-full text-xs font-medium text-white">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-kisaan-darkbrown mb-1 group-hover:text-kisaan-green transition-colors">
          {item.name}
        </h3>
        <p className="text-kisaan-brown text-sm mb-2">
          Farmer: {item.farmer}
        </p>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1 text-kisaan-brown" />
          <span>{item.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-kisaan-green font-semibold">
            ₹{item.price}/{item.unit}
          </p>
          <p className="text-sm text-kisaan-brown">
            Available: {item.quantity} {item.unit}
          </p>
        </div>
        <button 
          className={`mt-4 w-full py-2 rounded-md flex items-center justify-center gap-2 font-medium transition-colors ${
            item.available
              ? 'bg-kisaan-green text-white hover:bg-kisaan-green/90'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
          disabled={!item.available}
          onClick={handleBuyNow}
        >
          <ShoppingCart className="h-4 w-4" />
          Buy Now
        </button>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialTab="signup"
      />

      {/* Product Detail Modal */}
      <DetailModal />
    </div>
  );
};

export default ProduceCard;
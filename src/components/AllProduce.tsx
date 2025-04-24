import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, ShoppingCart, Filter, ArrowLeft, X, PlusCircle, Plus, Minus } from 'lucide-react';
import { produceData } from '../data/produce';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AuthModal from './Auth/AuthModal';
import { ProduceItem } from '../types';
import GoogleMapComponent from './GoogleMapComponent';
import AddProductForm from './AddProductForm';
import { initializeProduceData, saveProduceData, addProduceToStorage } from '../utils/storage';

const AllProduce: React.FC = () => {
  // Initialize products from localStorage or fall back to static data
  const [products, setProducts] = useState<ProduceItem[]>(() => {
    return initializeProduceData(produceData);
  });
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([5, 1000]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProduceItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { userType, currentUser } = useAuth();
  const { addToCart } = useCart();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Initialize the slider fill on component mount
  useEffect(() => {
    const slider = document.getElementById('priceRange') as HTMLInputElement;
    if (slider) {
      const percent = ((priceRange[1] - 5) / (1000 - 5)) * 100;
      slider.style.setProperty('--slider-percent', `${percent}%`);
    }
  }, []);

  // Update localStorage whenever products change to ensure persistence
  useEffect(() => {
    saveProduceData(products);
  }, [products]);

  const handleBuyNow = (e: React.MouseEvent, product: ProduceItem) => {
    if (!currentUser) {
      // If user is not logged in, show auth modal
      e.preventDefault();
      setShowAuthModal(true);
    } else {
      // If user is logged in, show product details modal
      setSelectedProduct(product);
      setShowDetailModal(true);
    }
  };

  const handleSelectProductFromMap = (product: ProduceItem) => {
    setSelectedProduct(product);
    // Auto-scroll to the product in the list
    const productElement = document.getElementById(`product-${product.id}`);
    if (productElement) {
      productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPriceRange([priceRange[0], value]);
    
    // Calculate and set the percentage for the slider fill
    const percent = ((value - 5) / (1000 - 5)) * 100;
    e.target.style.setProperty('--slider-percent', `${percent}%`);
  };

  // Handle adding a new product
  const handleAddProduct = (newProduct: Omit<ProduceItem, 'id'>) => {
    // Generate a new ID for the product
    const newId = (products.length + 1).toString();
    
    // Create the complete product with ID
    const productWithId: ProduceItem = {
      ...newProduct,
      id: newId
    };
    
    // Log for debugging
    console.log("Adding new product with coordinates:", productWithId.coordinates);
    
    // Add the new product to the state
    // Using functional state update to prevent race conditions
    setProducts(prevProducts => [...prevProducts, productWithId]);
    
    // Also add to localStorage directly to ensure it persists
    addProduceToStorage(productWithId);
  };

  // Recalculate filtered produce for the component to use
  const filteredProduce = useMemo(() => {
    return products
      .filter(item => activeCategory === 'All' || item.category === activeCategory)
      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    item.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.location.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);
  }, [products, activeCategory, searchTerm, priceRange]);

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Spices'];

  // Product Detail Modal Component
  const ProductDetailModal = () => {
    if (!showDetailModal || !selectedProduct) return null;
    
    const handleAddToCart = () => {
      addToCart(selectedProduct, quantity);
      // No alert here - just close the modal and reset quantity
      setShowDetailModal(false);
      // Reset quantity for next product
      setQuantity(1);
    };
    
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
              onClick={() => {
                setShowDetailModal(false);
                setQuantity(1); // Reset quantity when closing
              }}
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
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              
              {/* Product Details */}
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-kisaan-darkbrown mb-2">{selectedProduct.name}</h3>
                
                <div className="mb-4">
                  <span className="inline-block bg-kisaan-green text-white px-3 py-1 rounded-full text-sm">
                    {selectedProduct.category}
                  </span>
                </div>
                
                <p className="text-kisaan-brown mb-4">
                  <span className="font-semibold">Farmer:</span> {selectedProduct.farmer}
                </p>
                
                <div className="flex items-center text-kisaan-brown mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{selectedProduct.location}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xl font-bold text-kisaan-green">
                    ₹{selectedProduct.price} <span className="text-sm font-normal">per {selectedProduct.unit}</span>
                  </div>
                  <div className="text-kisaan-brown">
                    Available: {selectedProduct.quantity} {selectedProduct.unit}
                  </div>
                </div>
                
                {/* Quantity Selector */}
                <div className="flex items-center mb-6">
                  <span className="text-kisaan-darkbrown mr-4">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1 text-gray-500 hover:text-gray-700 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="px-3 py-1 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="ml-4 text-kisaan-green font-medium">
                    ₹{(selectedProduct.price * quantity).toFixed(2)}
                  </span>
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
                    onClick={handleAddToCart}
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
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col mb-8 space-y-4">
          <a 
            href="#produce" 
            className="flex items-center gap-2 text-kisaan-darkbrown hover:text-kisaan-green transition-colors self-start mt-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Homepage</span>
          </a>
          
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <h1 className="text-2xl md:text-3xl font-bold text-kisaan-darkbrown">
              All Available Produce
            </h1>
            
            <button 
              onClick={() => setShowAddProductForm(true)}
              className="flex items-center gap-2 bg-kisaan-green text-white px-4 py-2 rounded-md hover:bg-kisaan-green/90 transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              Add Your Produce
            </button>
          </div>
        </div>

        {/* Filters section */}
        <div className="bg-white p-5 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                Search Produce
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, farmer, or location..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="md:w-1/4">
              <label htmlFor="priceRange" className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                Price Range (₹{priceRange[0]} - ₹{priceRange[1]})
              </label>
              <input
                type="range"
                id="priceRange"
                min="5"
                max="1000"
                step="5"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-kisaan-green"
                value={priceRange[1]}
                onChange={handlePriceRangeChange}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-kisaan-green" />
            <h3 className="text-sm font-medium text-kisaan-darkbrown">Categories:</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
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
          </div>
        </div>

        {/* Display number of results */}
        <div className="mb-6">
          <p className="text-kisaan-darkbrown">
            Showing {filteredProduce.length} {filteredProduce.length === 1 ? 'result' : 'results'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Produce grid */}
          <div className="md:w-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredProduce.map((item) => (
                <div 
                  key={item.id} 
                  id={`product-${item.id}`}
                  className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group ${
                    selectedProduct?.id === item.id ? "ring-2 ring-kisaan-green" : ""
                  }`}
                  onClick={() => setSelectedProduct(item)}
                >
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
                    
                    {userType === 'ngo' && (
                      <div className="mt-4 flex gap-2">
                        <button 
                          className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 font-medium transition-colors ${
                            item.available
                              ? 'bg-kisaan-green text-white hover:bg-kisaan-green/90'
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          }`}
                          disabled={!item.available}
                          onClick={(e) => handleBuyNow(e, item)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Buy Now
                        </button>
                        <button 
                          className="flex-1 py-2 rounded-md flex items-center justify-center gap-2 font-medium bg-kisaan-cream text-kisaan-darkbrown hover:bg-kisaan-cream/80 transition-colors"
                        >
                          Contact Farmer
                        </button>
                      </div>
                    )}

                    {userType === 'farmer' && (
                      <div className="mt-4 flex gap-2">
                        <button 
                          className="flex-1 py-2 rounded-md flex items-center justify-center gap-2 font-medium bg-kisaan-green text-white hover:bg-kisaan-green/90 transition-colors"
                        >
                          Edit Listing
                        </button>
                        <button 
                          className="flex-1 py-2 rounded-md flex items-center justify-center gap-2 font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    
                    {!userType && (
                      <button 
                        className={`mt-4 w-full py-2 rounded-md flex items-center justify-center gap-2 font-medium transition-colors ${
                          item.available
                            ? 'bg-kisaan-green text-white hover:bg-kisaan-green/90'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        }`}
                        disabled={!item.available}
                        onClick={(e) => handleBuyNow(e, item)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredProduce.length === 0 && (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <p className="text-kisaan-brown text-lg">
                  No produce matching your filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>

          {/* Map section - always visible */}
          <div className="md:w-1/2 h-[600px] bg-white rounded-lg overflow-hidden shadow-md">
            <GoogleMapComponent 
              produceItems={filteredProduce}
              onSelectProduct={handleSelectProductFromMap}
              selectedProduct={selectedProduct}
            />
          </div>
        </div>
      </div>

      {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
      {showDetailModal && <ProductDetailModal />}
      <AddProductForm 
        isOpen={showAddProductForm}
        onClose={() => setShowAddProductForm(false)}
        onSubmit={handleAddProduct}
      />
    </section>
  );
};

export default AllProduce;
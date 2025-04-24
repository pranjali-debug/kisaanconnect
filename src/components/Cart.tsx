import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './Auth/AuthModal';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const { currentUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const handleCheckout = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    
    // Navigate to checkout page
    window.location.href = "#/checkout";
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-16 px-4 text-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto">
          <div className="flex justify-center mb-4">
            <ShoppingCart size={64} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold text-kisaan-darkbrown mb-2">Your cart is empty</h2>
          <p className="text-kisaan-brown mb-6">
            Browse our fresh produce and add items to your cart.
          </p>
          <a 
            href="#/all-produce" 
            className="bg-kisaan-green text-white px-5 py-2 rounded-md font-medium hover:bg-kisaan-green/90 transition-colors inline-block"
          >
            Browse Produce
          </a>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <a 
            href="#/all-produce" 
            className="flex items-center gap-2 text-kisaan-darkbrown hover:text-kisaan-green transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Continue Shopping</span>
          </a>
          
          <h1 className="text-2xl font-bold text-kisaan-darkbrown ml-auto">
            Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {/* Cart Items */}
          <div className="divide-y divide-gray-100">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center">
                <div className="flex-shrink-0 w-20 h-20 rounded overflow-hidden mb-4 sm:mb-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="sm:ml-6 flex-grow">
                  <h3 className="font-semibold text-kisaan-darkbrown">{item.name}</h3>
                  <p className="text-sm text-kisaan-brown">Farmer: {item.farmer}</p>
                  <div className="text-kisaan-green font-medium mt-1">
                    ₹{item.price}/{item.unit}
                  </div>
                </div>
                
                <div className="flex items-center mt-4 sm:mt-0">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span className="w-10 text-center">{item.quantity}</span>
                  
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="font-semibold text-kisaan-darkbrown sm:w-24 text-right mt-4 sm:mt-0">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 ml-4 text-red-500 hover:text-red-700 transition-colors"
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cart Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-kisaan-darkbrown mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-kisaan-brown">Subtotal</span>
              <span className="text-kisaan-darkbrown">₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-kisaan-brown">Platform Fee (5%)</span>
              <span className="text-kisaan-darkbrown">₹{(cartTotal * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-kisaan-brown">Delivery Fee</span>
              <span className="text-kisaan-darkbrown">₹20.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-kisaan-brown">GST (5%)</span>
              <span className="text-kisaan-darkbrown">₹{(cartTotal * 0.05).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between font-semibold">
              <span className="text-kisaan-darkbrown">Total</span>
              <span className="text-kisaan-green text-xl">
                ₹{(cartTotal + 20 + (cartTotal * 0.05) + (cartTotal * 0.05)).toFixed(2)}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleCheckout}
            className="w-full bg-kisaan-green hover:bg-kisaan-green/90 text-white py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
      {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
    </section>
  );
};

export default Cart;
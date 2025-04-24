import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Building, Wallet, CheckCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import GoogleMapComponent from './GoogleMapComponent';

enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  UPI = 'upi',
  NET_BANKING = 'net_banking'
}

const Checkout: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Credit card form state
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // UPI form state
  const [upiId, setUpiId] = useState('');

  // Net Banking form state
  const [bankName, setBankName] = useState('');

  // Updated fees
  const deliveryFee = 20;
  const platformFee = cartTotal * 0.05;
  const gst = cartTotal * 0.05;
  const totalAmount = cartTotal + deliveryFee + platformFee + gst;

  // Get user's location for delivery
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to center of India
          setUserLocation({ lat: 20.5937, lng: 78.9629 });
        }
      );
    } else {
      // Fallback if geolocation not supported
      setUserLocation({ lat: 20.5937, lng: 78.9629 });
    }
  }, []);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    // Format with spaces every 4 digits
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardDetails({ ...cardDetails, number: formattedValue });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    // Format as MM/YY
    let formattedValue = value;
    if (value.length > 2) {
      formattedValue = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setCardDetails({ ...cardDetails, expiry: formattedValue });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    // Limit to 3-4 digits
    setCardDetails({ ...cardDetails, cvv: value.slice(0, 4) });
  };

  const validatePaymentDetails = () => {
    switch (paymentMethod) {
      case PaymentMethod.CREDIT_CARD:
        return cardDetails.number.replace(/\s/g, '').length >= 16 && 
               cardDetails.name.trim() !== '' && 
               cardDetails.expiry.length === 5 && 
               cardDetails.cvv.length >= 3;
      case PaymentMethod.UPI:
        return upiId.includes('@') && upiId.length > 3;
      case PaymentMethod.NET_BANKING:
        return bankName !== '';
      default:
        return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePaymentDetails()) {
      alert('Please fill in all required fields correctly');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      clearCart(); // Clear the cart after successful payment
    }, 2000);
  };

  if (isComplete) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle size={80} className="text-kisaan-green" />
            </div>
            <h1 className="text-2xl font-bold text-kisaan-darkbrown mb-4">
              Payment Successful!
            </h1>
            <p className="text-kisaan-brown mb-6">
              Thank you for your purchase! Your order has been confirmed and will be processed soon.
            </p>
            <p className="text-kisaan-green font-semibold mb-6">
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <a 
                href="#produce" 
                className="bg-kisaan-cream text-kisaan-darkbrown px-6 py-3 rounded-md font-medium hover:bg-kisaan-cream/80 transition-colors"
              >
                Continue Shopping
              </a>
              <a 
                href="#home" 
                className="bg-kisaan-green text-white px-6 py-3 rounded-md font-medium hover:bg-kisaan-green/90 transition-colors"
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <h1 className="text-xl font-semibold text-kisaan-darkbrown mb-4">
              Your cart is empty
            </h1>
            <p className="text-kisaan-brown mb-6">
              Add some products to your cart before checking out.
            </p>
            <a 
              href="#/all-produce" 
              className="bg-kisaan-green text-white px-5 py-2 rounded-md font-medium hover:bg-kisaan-green/90 transition-colors inline-block"
            >
              Browse Products
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <a 
            href="#/cart" 
            className="flex items-center gap-2 text-kisaan-darkbrown hover:text-kisaan-green transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Cart</span>
          </a>
          
          <h1 className="text-2xl font-bold text-kisaan-darkbrown ml-auto">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-kisaan-darkbrown mb-4">Order Summary</h2>
                
                <div className="divide-y divide-gray-100">
                  {cartItems.map(item => (
                    <div key={item.id} className="py-3 flex items-center">
                      <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-gray-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <h3 className="font-medium text-kisaan-darkbrown">{item.name}</h3>
                        <p className="text-sm text-kisaan-brown">
                          {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <div className="font-semibold text-kisaan-darkbrown">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-kisaan-brown">Subtotal</span>
                    <span className="text-kisaan-darkbrown">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-kisaan-brown">Platform Fee (5%)</span>
                    <span className="text-kisaan-darkbrown">₹{platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-kisaan-brown">Delivery Fee</span>
                    <span className="text-kisaan-darkbrown">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-kisaan-brown">GST (5%)</span>
                    <span className="text-kisaan-darkbrown">₹{gst.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between font-semibold">
                    <span className="text-kisaan-darkbrown">Total</span>
                    <span className="text-kisaan-green text-xl">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details with Map */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-kisaan-darkbrown mb-4">Delivery Details</h2>
              
              <div className="mb-4">
                <p className="text-kisaan-brown">
                  <span className="font-medium">Delivering to:</span> {currentUser?.email}
                </p>
                <p className="text-kisaan-brown">
                  <span className="font-medium">Estimated Delivery:</span> Within 24-48 hours
                </p>
              </div>
              
              {/* Delivery Location Map */}
              <div className="h-64 rounded-lg overflow-hidden mb-4 border border-gray-200">
                <GoogleMapComponent
                  produceItems={[]}
                  onSelectProduct={() => {}}
                  selectedProduct={null}
                  initialLocation={userLocation || { lat: 20.5937, lng: 78.9629 }}
                  showUserLocationOnly={true}
                />
              </div>
              
              <div className="bg-kisaan-cream/20 p-4 rounded-md">
                <p className="text-sm text-kisaan-brown flex items-start">
                  <ShieldCheck className="h-4 w-4 mr-1 text-kisaan-green flex-shrink-0 mt-0.5" />
                  <span>Your produce will be delivered fresh directly from farmers to the location shown on the map.</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-kisaan-darkbrown mb-6">Payment Method</h2>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <button 
                className={`flex items-center px-4 py-2 border rounded-md ${
                  paymentMethod === PaymentMethod.CREDIT_CARD 
                    ? 'border-kisaan-green bg-kisaan-green/5 text-kisaan-green' 
                    : 'border-gray-300 text-gray-600'
                }`}
                onClick={() => setPaymentMethod(PaymentMethod.CREDIT_CARD)}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Credit Card
              </button>
              
              <button 
                className={`flex items-center px-4 py-2 border rounded-md ${
                  paymentMethod === PaymentMethod.UPI 
                    ? 'border-kisaan-green bg-kisaan-green/5 text-kisaan-green' 
                    : 'border-gray-300 text-gray-600'
                }`}
                onClick={() => setPaymentMethod(PaymentMethod.UPI)}
              >
                <Wallet className="h-5 w-5 mr-2" />
                UPI
              </button>
              
              <button 
                className={`flex items-center px-4 py-2 border rounded-md ${
                  paymentMethod === PaymentMethod.NET_BANKING 
                    ? 'border-kisaan-green bg-kisaan-green/5 text-kisaan-green' 
                    : 'border-gray-300 text-gray-600'
                }`}
                onClick={() => setPaymentMethod(PaymentMethod.NET_BANKING)}
              >
                <Building className="h-5 w-5 mr-2" />
                Net Banking
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Credit Card Form */}
              {paymentMethod === PaymentMethod.CREDIT_CARD && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={handleCardNumberChange}
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength={19}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      placeholder="Name"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        maxLength={4}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* UPI Form */}
              {paymentMethod === PaymentMethod.UPI && (
                <div>
                  <label className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                    UPI ID *
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green"
                    required
                  />
                  
                  {/* UPI QR Code */}
                  <div className="mt-4 flex justify-center">
                    <div className="p-4 border border-gray-200 rounded-lg bg-white">
                      <div className="text-center mb-2 text-sm font-medium text-kisaan-darkbrown">
                        Scan to pay with UPI
                      </div>
                      <div className="w-48 h-48 bg-white p-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 29 29"
                          shape-rendering="crispEdges"
                          width="100%"
                          height="100%"
                          className="border border-gray-200"
                        >
                          <path fill="#ffffff" d="M0 0h29v29H0z"></path>
                          <path fill="#000000" d="M1 1h7v1H1zm8 0h1v1H9zm3 0h3v1h-3zm4 0h3v1h-3zm5 0h7v1h-7zM1 2h1v1H1zm7 0h1v1H8zm3 0h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm3 0h1v1h-1zm7 0h1v1h-1zM1 3h1v1H1zm7 0h1v1H8zm2 0h1v1h-1zm2 0h4v1H12zm7 0h2v1h-2zm7 0h1v1h-1zM1 4h1v1H1zm7 0h1v1H8zm3 0h3v1h-3zm5 0h3v1h-3zm3 0h1v1h-1zm7 0h1v1h-1zM1 5h1v1H1zm7 0h1v1H8zm3 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm7 0h1v1h-1zM1 6h1v1H1zm3 0h3v1H4zm3 0h1v1H7zm4 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm3 0h3v1h-3zM1 7h7v1H1zm8 0h1v1H9zm3 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm8 0h1v1h-1zM9 8h2v1H9zm3 0h1v1h-1zm2 0h2v1h-2zm4 0h2v1h-2zm6 0h1v1h-1zM1 9h1v1H1zm4 0h1v1H5zm3 0h4v1H8zm6 0h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm4 0h1v1h-1zM1 10h3v1H1zm6 0h1v1H7zm2 0h1v1H9zm2 0h2v1h-2zm7 0h1v1h-1zm3 0h4v1h-4zm6 0h1v1h-1zM0 11h2v1H0zm3 0h3v1H3zm5 0h1v1H8zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h3v1h-3zm4 0h2v1h-2zm3 0h3v1h-3zM0 12h1v1H0zm4 0h4v1H4zm5 0h1v1H9zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h4v1h-4zm5 0h1v1h-1zm2 0h1v1h-1zM1 13h3v1H1zm5 0h2v1H6zm3 0h2v1H9zm5 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm3 0h4v1h-4zM0 14h1v1H0zm3 0h4v1H3zm5 0h1v1H8zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm3 0h2v1h-2zm4 0h1v1h-1zM1 15h3v1H1zm8 0h1v1H9zm3 0h1v1h-1zm4 0h1v1h-1zm2 0h1v1h-1zm7 0h1v1h-1zM1 16h3v1H1zm6 0h2v1H7zm5 0h1v1h-1zm2 0h1v1h-1zm7 0h1v1h-1zm5 0h1v1h-1zM1 17h1v1H1zm3 0h1v1H4zm3 0h1v1H7zm2 0h6v1H9zm7 0h5v1h-5zm6 0h1v1h-1zm2 0h1v1h-1zM1 18h7v1H1zm8 0h1v1H9zm2 0h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm3 0h4v1h-4zm5 0h1v1h-1zM1 19h1v1H1zm7 0h1v1H8zm2 0h3v1h-3zm4 0h1v1h-1zm6 0h1v1h-1zm6 0h1v1h-1zM1 20h1v1H1zm3 0h3v1H4zm4 0h1v1H8zm2 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h3v1h-3zm4 0h2v1h-2zM1 21h1v1H1zm3 0h1v1H4zm3 0h1v1H7zm2 0h1v1H9zm3 0h1v1h-1zm4 0h1v1h-1zm2 0h4v1h-4zm5 0h1v1h-1zM1 22h1v1H1zm3 0h1v1H4zm3 0h1v1H7zm2 0h1v1H9zm2 0h5v1h-5zm6 0h1v1h-1zm3 0h3v1h-3zM9 23h1v1H9zm2 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zM1 24h7v1H1zm8 0h1v1H9zm2 0h2v1h-2zm5 0h3v1h-3zm5 0h3v1h-3zM1 25h1v1H1zm7 0h1v1H8zm5 0h3v1h-3zm4 0h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zM1 26h1v1H1zm7 0h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm5 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h3v1h-3zM1 27h1v1H1zm7 0h1v1H8zm2 0h1v1h-1zm2 0h2v1h-2zm4 0h2v1h-2zm3 0h1v1h-1zm3 0h3v1h-3zM1 28h7v1H1zm9 0h2v1h-2zm3 0h4v1h-4zm5 0h1v1h-1zm3 0h2v1h-2z"></path>
                        </svg>
                      </div>
                      <div className="text-center mt-2 text-sm text-kisaan-brown">
                        KisaanConnect UPI
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Enter your UPI ID linked with your bank account (e.g., name@okicici, name@ybl) or scan the QR code
                  </p>
                </div>
              )}
              
              {/* Net Banking Form */}
              {paymentMethod === PaymentMethod.NET_BANKING && (
                <div>
                  <label className="block text-sm font-medium text-kisaan-darkbrown mb-1">
                    Select Bank *
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green"
                    required
                  >
                    <option value="">Select your bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="BOB">Bank of Baroda</option>
                    <option value="PNB">Punjab National Bank</option>
                  </select>
                </div>
              )}
              
              <div className="mt-8">
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-kisaan-green hover:bg-kisaan-green/90 text-white py-3 rounded-md font-medium transition-colors flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${totalAmount.toFixed(2)}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProduceItem } from '../types';

// Using Omit to create a new type without the quantity property
interface CartItem extends Omit<ProduceItem, 'quantity'> {
  quantity: number;
  originalQuantity: string; // Keep the original quantity string for reference
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (product: ProduceItem, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Initialize cart from localStorage
    const savedCart = localStorage.getItem('kisaan_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kisaan_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate cart count (total number of items)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate cart total price
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Add a product to cart
  const addToCart = (product: ProduceItem, quantity: number = 1) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item with quantity and store original quantity string
        return [...prevItems, { 
          ...product, 
          quantity, 
          originalQuantity: product.quantity 
        }];
      }
    });
  };

  // Remove an item from cart
  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Update quantity of an item
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    cartCount,
    cartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
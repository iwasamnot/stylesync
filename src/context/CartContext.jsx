import { createContext, useContext, useState } from 'react';

const CartContext = createContext({});

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // TODO: Add cart functions (addToCart, removeFromCart, clearCart, etc.)
  const addToCart = (item) => {
    // Placeholder - implement later
    console.log('Add to cart:', item);
  };

  const removeFromCart = (itemId) => {
    // Placeholder - implement later
    console.log('Remove from cart:', itemId);
  };

  const clearCart = () => {
    // Placeholder - implement later
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};


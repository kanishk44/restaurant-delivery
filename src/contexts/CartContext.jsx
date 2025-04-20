import { createContext, useContext, useState, useEffect } from "react";
import { useUserAuth } from "./UserAuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useUserAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (recipe) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === recipe.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === recipe.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...recipe, quantity: 1 }];
    });
  };

  const removeFromCart = (recipeId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== recipeId));
  };

  const updateQuantity = (recipeId, quantity) => {
    if (quantity < 1) {
      removeFromCart(recipeId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === recipeId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

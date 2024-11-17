// cartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const exist = cartItems.find((x) => x._id === product._id);
    if (exist) {
      if (exist.qty < product.stock) {
        setCartItems(
          cartItems.map((x) =>
            x._id === product._id ? { ...exist, qty: exist.qty + 1 } : x
          )
        );
        // toast.success("Product quantity increased", {
        //   className: 'custom-toast'
        // });
      } else {
        toast.error("Cannot add more than available stock", {
          className: 'custom-toast'
        });
      }
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
      toast.success("Product added to cart", {
        className: 'custom-toast'
      });
    }
  };

  const removeItem = (product) => {
    const exist = cartItems.find((x) => x._id === product._id);
    if (exist.qty === 1) {
      setCartItems(cartItems.filter((x) => x._id !== product._id));
      toast.info("Product removed from cart", {
        className: 'custom-toast'
      });
    } else {
      setCartItems(
        cartItems.map((x) =>
          x._id === product._id ? { ...exist, qty: exist.qty - 1 } : x
        )
      );
      // toast.success("Product quantity decreased", {
      //   className: 'custom-toast'
      // });
    }
  };

  const deleteProduct = (product) => {
    setCartItems(cartItems.filter((x) => x._id !== product._id));
    toast.success("Product removed from cart", {
      className: 'custom-toast'
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider value={{ cartItems, removeItem, addToCart, deleteProduct, clearCart }}>
      {children}
      <ToastContainer />
    </CartContext.Provider>
  );
};

const useCartContext = () => {
  return useContext(CartContext);
};

export { CartProvider, useCartContext };

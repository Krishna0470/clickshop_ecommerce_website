import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FavoriteContext = createContext();

const FavoriteProvider = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState(
    JSON.parse(localStorage.getItem("favoriteItems")) || []
  );

  useEffect(() => {
    localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  const addToFavorite = (product) => {
    const exist = favoriteItems.find((x) => x._id === product._id);
    if (exist) {
      setFavoriteItems(
        favoriteItems.map((x) =>
          x._id === product._id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
    } else {
      setFavoriteItems([...favoriteItems, { ...product, qty: 1 }]);
      toast.success(`${product.name} added to favorites!`);
    }
  };

  const removeFromFavorite = (product) => {
    const exist = favoriteItems.find((x) => x._id === product._id);
    if (exist.qty === 1) {
      setFavoriteItems(favoriteItems.filter((x) => x._id !== product._id));
    } else {
      setFavoriteItems(
        favoriteItems.map((x) =>
          x._id === product._id ? { ...exist, qty: exist.qty - 1 } : x
        )
      );
    }
  };

  return (
    <FavoriteContext.Provider value={{ favoriteItems, addToFavorite, removeFromFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

const useFavoriteContext = () => {
  return useContext(FavoriteContext);
};

export { FavoriteProvider, useFavoriteContext };

import React from 'react';
import ReactDOM from 'react-dom';
import Landing from "./components/landing/Landing";
import { CartProvider } from './context/cartContext';
import { FavoriteProvider } from './context/favoriteContext';
import { UserProvider } from './context/userContext';




function App() {

  return (
    <React.StrictMode>
    <UserProvider>
    <CartProvider>
       <FavoriteProvider>
  <Landing/>
      </FavoriteProvider>
    </CartProvider>
    </UserProvider>
    </React.StrictMode>
  
  )
}

export default App;

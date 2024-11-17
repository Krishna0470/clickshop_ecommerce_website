import React from 'react';
import { Link } from 'react-router-dom';
import './signin.css';
import { useCartContext } from '../../context/cartContext';
import { useFavoriteContext } from '../../context/favoriteContext';


function SigninNav() {

  const { cartItems } = useCartContext();
  const { favoriteItems } = useFavoriteContext();


  return (
    <>

<section className=" top-txt ">
    <div className="head container ">
      <div className="head-txt ">
        <p>Free shipping, 30-day return or refund guarantee.</p>
      </div>
      <div className="sing_in_up ">
        <Link href="# ">SIGN IN</Link>
        {/* <a href="# ">SIGN UP</a> */}
      </div>
    </div>
  </section>
  <nav className="navbar">
    <div className="navbar-container">
      <input type="checkbox" name="" id="checkbox" />
      <div className="hamburger-lines">
        <span className="line line1" />
        <span className="line line2" />
        <span className="line line3" />
      </div>
      <ul className="menu-items">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="#sellers">Men</Link>
        </li>
        <li>
          <Link href="#news">Women</Link>
        </li>
        <li>
          <Link href="#contact">Kids</Link>
        </li>
        <li>
      <div className="dropdown">
                {/* <div tabIndex={0} role="button" className="btn btn-ghost btn-circle"> */}
                  <div className="indicator">
                  <div className='nav-login-cart' >
              <a href="#"><span className="material-symbols-outlined">shopping_cart</span></a>
              <div className='nav-cart-count' >{cartItems?.length || 0}</div>
              </div>
                  </div>
                {/* </div> */}
                <div className="dropdown-content">

                <div tabIndex={0} >
                  <div className="card-body">
                    <span className="font-bold text-lg">{cartItems?.length || 0} Items</span>
                    <div className="card-actions">
                      <Link to="/viewcart">
                        <button className='bg-[#f54748] active:scale-90 transition duration-150 transform hover:shadow-xl shadow-md rounded-full px-8 py-2 text-xl font-medium text-white mx-auto text-center mb-3 mt-5' type='submit'>view cart</button>
                      </Link>
                    </div>
                  </div>
                </div>
                </div>
              </div>
      </li>
      <li>
      <div className="dropdown">
                {/* <div tabIndex={0} role="button" className="btn btn-ghost btn-circle"> */}
                  <div className="indicator">
                  <div className='nav-login-cart' >
                  <a href="#"><span className="material-symbols-outlined">favorite</span></a>
              <div className='nav-cart-count' >{favoriteItems?.length || 0}</div>
              </div>
                  </div>
                {/* </div> */}
                <div className="dropdown-content">

                <div tabIndex={0} >
                  <div className="card-body">
                    <span className="font-bold text-lg">{favoriteItems?.length || 0} Items</span>
                    <div className="card-actions">
                      <Link to="/ViewFavorite">
                        <button className='bg-[#f54748] active:scale-90 transition duration-150 transform hover:shadow-xl shadow-md rounded-full px-8 py-2 text-xl font-medium text-white mx-auto text-center mb-3 mt-5' type='submit'>view Favorite</button>
                      </Link>
                    </div>
                  </div>
                </div>
                </div>
              </div>
      </li>

  
      </ul>
      <div className="logo">
      <img src='/landing/logo.png' alt=""  />
      <samp className='bebas-neue-regular'>Click</samp>
            <samp className='lugrasimo-regular'>Shop</samp>
            
      </div>
    </div>
  </nav>
    </>
  );
}

export default SigninNav;




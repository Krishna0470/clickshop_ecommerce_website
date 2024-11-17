import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './success.css';


function SuccessNav() {

  return (
    <>

<section className=" top-txt ">
    <div className="head container ">
      <div className="head-txt ">
        <p>Free shipping, 30-day return or refund guarantee.</p>
      </div>
      <div className="sing_in_up ">
        <a href="# ">SIGN IN</a>
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
          <a href="/">Home</a>
        </li>
        <li>
          <a href="#sellers">Men</a>
        </li>
        <li>
          <a href="#news">Women</a>
        </li>
        <li>
          <a href="#contact">Kids</a>
        </li>
        <li>
      <div className='nav-login-cart' >
              <a href="#"><span className="material-symbols-outlined">shopping_cart</span></a>
              <div className='nav-cart-count' >0</div>
              
        </div>
      </li>
      <li>
      <div className='nav-login-favorite' >
      <a href="#"><span className="material-symbols-outlined">favorite</span></a>
      <div className='nav-cart-favorite' >0</div>
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

export default SuccessNav;
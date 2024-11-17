import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './admin.css';
import { useCartContext } from '../../context/cartContext';
import { useFavoriteContext } from '../../context/favoriteContext';




function AdminNav() {
  const { id } = useParams();
    const [user, setUser] = useState(null);
    const token = !!localStorage.getItem('accessTocken');
    const { cartItems } = useCartContext();
    const { favoriteItems } = useFavoriteContext();


    




    const logout = async () => {
      try {
        const token = localStorage.getItem('accessTocken');
        await axios.post('http://localhost:443/logout', null, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        localStorage.removeItem('cartItems');
        localStorage.removeItem('favoriteItems');
        localStorage.removeItem('accessTocken');
        
        navigate('/Signin');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
    

      useEffect(() => {
        const fetchUser = async () => {
          try {
            const token = localStorage.getItem('accessTocken');
            const response = await axios.get(`http://localhost:443/getData/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            setUser(response.data);
            console.error('response:', response);
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        };
    
        fetchUser();
      }, [id]);
    
      const toggleMenu = () => {
        setIsMenuActive(!isMenuActive);
      };

  return (
    <>

<section className=" top-txt ">
    <div className="head container ">
      <div className="head-txt ">
        <p>Free shipping, 30-day return or refund guarantee.</p>
      </div>
      <div className="sing_in_up ">
        {/* <a href="# ">SIGN IN</a> */}
        <a href="/Signin " onClick={logout}>Log out</a>
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
          <a href="/MensCategory">Men</a>
        </li>
        <li>
          <a href="/WomenCategory">Women</a>
        </li>
        <li>
          <a href="/KidsCategory">Kids</a>
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
      {/* <div className='nav-login-favorite' >
      <a href="#"><span className="material-symbols-outlined">favorite</span></a>
      <div className='nav-cart-favorite' >0</div>
      </div> */}
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
      <li>
      <div className="dropdown">
      {user && (
              <a className="dropbtn"> {user.username}</a>
          )}
  <div className="dropdown-content">
    <a href="/Oredrs">Orders</a>
    <Link to={(`/UpdateProfile/${id}`) }>Profile</Link> 
    <a href="/Userlist">Users</a>
    <a href="/ProductList">Products</a>
    <a href="/Category">Category</a>
    <a href="/AllProduct">AllProducts</a>
    <a href="/CreateProduct">CreateProducts</a>
    {/* <a href="#">CreateCategory</a> */}
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

export default AdminNav;
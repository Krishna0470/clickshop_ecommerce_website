import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './landing.css';
import { useCartContext } from '../../context/cartContext';
import { useFavoriteContext } from '../../context/favoriteContext';
import { SnackbarProvider, useSnackbar } from 'notistack'; // Import Notistack
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Landingpage() {


  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [specialproduct, setspecialProduct] = useState([]);
  const [newproduct, setnewProduct] = useState([]);
  const { cartItems } = useCartContext();
  const { favoriteItems } = useFavoriteContext();
  const { addToCart } = useCartContext();
  const { addToFavorite } = useFavoriteContext();
  const { enqueueSnackbar } = useSnackbar(); // Use Notistack hook

  const navigate = useNavigate();




  // const handleBtn = (btn) => {
  //   setActive(btn.id);
  //   setValue(btn.value);
  // };
  const params = useParams()

  const getTopProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:443/getTopRatedd`)
      if (res.data.success) {
        const visibleProducts = res.data.data.product.filter(p => !p.isBlocked);
        setProduct(visibleProducts);
      }
    } catch (error) {
      console.log(error);

    }
  }

  const getSpecialProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:443/specialProduct`)
      if (res.data.success) {
        const visibleProducts = res.data.data.product.filter(p => !p.isBlocked);
        setspecialProduct(visibleProducts);
      }
    } catch (error) {
      console.log(error);

    }
  }


  const getNewProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:443/getNewProduct`)
      if (res.data.success) {
        const visibleProducts = res.data.data.product.filter(p => !p.isBlocked);
        setnewProduct(visibleProducts);
      }
    } catch (error) {
      console.log(error);

    }
  }


  // console.log(product);
  useEffect(() => {
    getTopProducts()
  }, [product])

  // console.log(specialproduct);
  useEffect(() => {
    getSpecialProducts()
  }, [specialproduct])

  // console.log(newproduct);
  useEffect(() => {
    getNewProduct()
  }, [newproduct])


  const handleAddToCart = (productDetails) => {
    const currentUserId = localStorage.getItem('userId');
    if (!localStorage.getItem('accessTocken')) {
      navigate('/Signin');
      swal("Warning", "Login to go to Cart Page", "error");
    } else if (productDetails.user === currentUserId) {
      enqueueSnackbar("You cannot purchase your own product.", { variant: 'error' });
    } else {
      addToCart({ ...productDetails, qty: 1 });
    }
  };

  const handleAddToFavorite = (productDetails) => {
    if (!localStorage.getItem('accessTocken')) {
      navigate('/Signin');
      swal("Warning", "Login to add items to your favorites", "error");
    } else {
      addToFavorite({ ...productDetails, qty: 1 });
    }
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };

  const isInFavorite = (productId) => {
    return favoriteItems.some(item => item._id === productId);
  };


  return (
    <>

      <section className="top-txt">
        <div className="head container">
          <div className="head-txt">
            <p>Free shipping, 30-day return or refund guarantee.</p>
          </div>
          <div className="sing_in_up">
            <Link to="/Signin">SIGN IN</Link>
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
              <Link to="#home">Home</Link>
            </li>
            <li>
              <Link to="/MensCat">Men</Link>
            </li>
            <li>
              <Link to="/WomenCat">Women</Link>
            </li>
            <li>
              <Link to="/KidsCat">Kids</Link>
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
            <img src="/landing/logo.png" alt="" />
            <samp className="bebas-neue-regular">Click</samp>
            <samp className="lugrasimo-regular">Shop</samp>
          </div>
        </div>
      </nav>
      <section id="home">
        <div className="home_page">
          <div className="home_img">
            <img src="/landing/homebg.jpg" alt="img" />
          </div>
          <div className="home_txt">
            <p className="collectio">SUMMER COLLECTION</p>
            <h1 id="seventy_p">50% <samp className='dancing-script-uniquifier'> OFF </samp></h1>
            <div className="home_label">
              <p>
                A specialist label creating luxury essentials. Ethically crafted
                <br />
                with an unwavering commitment to exceptional quality.
              </p>
            </div>
            <button>
              <a href="#sellers">SHOP NOW</a>
              <i className="bx bx-right-arrow-alt" />
            </button>
            <div className="home_social_icons">
              <a href="#">
                <i className="bx bxl-facebook" />
              </a>
              <a href="#">
                <i className="bx bxl-twitter" />
              </a>
              <a href="#">
                <i className="bx bxl-pinterest" />
              </a>
              <a href="#">
                <i className="bx bxl-instagram" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="collection">
        <section id="collection">
          <div className="collections container">
            <div className="content">
              <img src="/landing/men.webp" alt="img" />
              <div className="img-content">
                <p>Men's Collections</p>
                <button>
                  <a href="/MensCat">SHOP NOW</a>
                </button>
              </div>
            </div>

            <div className="content">
              <img src="/landing/women.avif" alt="img" />
              <div className="img-content">
                <p>Women's Collections</p>
                <button>
                  <a href="/WomenCat">SHOP NOW</a>
                </button>
              </div>
            </div>
            <div className="content">
              <img src="/landing/kids.jpg" alt="img" />
              <div className="img-content">
                <p>Kids Collections</p>
                <button>
                  <a href="/KidsCat">SHOP NOW</a>
                </button>
              </div>
            </div>
          </div>
        </section>

      </section>


      <section id="sellers">
        <div className="seller container">
          <h2>Recommended<span className='prodects-h' >Products</span> </h2>
          <div className="best-seller">
            <div className="row">
              {
                product?.map((curElem) => (
                  <div key={curElem._id} className="col-lg-4 col-md-6 col-sm-12">
                    <div className="best-p1">
                      <div className="relative mb-3">
                        <img src={curElem.productImages[0]} alt="" />
                        <a
                          onClick={() => handleAddToFavorite(curElem)}
                          className="wishlist-btn"
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faHeart}
                            color={isInFavorite(curElem._id) ? 'red' : 'grey'}
                            size="lg"
                          />
                        </a>
                        <div className="best-p1-txt">
                          <div className="name-of-p">
                            <p>{curElem.name}</p>
                          </div>
                          <div className="rating">
                            <i className="bx bxs-star" />
                            <i className="bx bxs-star" />
                            <i className="bx bxs-star" />
                            <i className="bx bxs-star" />
                            <i className="bx bx-star" />
                          </div>
                          <div className="price">
                            ${curElem.price}
                            <div className="colors">
                              <i className="bx bxs-circle brown" />
                              <i className="bx bxs-circle green" />
                              <i className="bx bxs-circle blue" />
                            </div>
                          </div>
                          <div className="buy-now">

                            {curElem.stock > 0 ? (
                              <button
                                className={`add-to-cart ${isInCart(curElem._id) ? 'red' : ''}`}
                                onClick={() => handleAddToCart(curElem)}
                              >
                                {isInCart(curElem._id) ? 'Item In Cart' : 'Add To Cart'}
                              </button>
                            ) : (
                              <button className='out-of-stock' disabled>
                                OutofStock
                              </button>
                            )}

                            <button
                              className='favo'
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>

      <section id="sellers">
        <div className="seller container">
          <h2>Special    <span className='prodects-h' >Offers</span> </h2>
          <div className="best-seller">
            <div className="row">
              {
                specialproduct?.map((curElem) => (
                  <div key={curElem._id} className="col-lg-4 col-md-6 col-sm-12">
                    <div className="best-p1">
                      <div className="relative mb-3">
                        <img src={curElem.productImages[0]} alt="" />
                        <a
                          onClick={() => handleAddToFavorite(curElem)}
                          className="wishlist-btn"
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faHeart}
                            color={isInFavorite(curElem._id) ? 'red' : 'grey'}
                            size="lg"
                          />
                        </a>
                        <div className="best-p1-txt">
                          <div className="name-of-p">
                            <p>{curElem.name}</p>
                          </div>
                          <div className="rating">
                            <i className="bx bxs-star" />
                            <i className="bx bxs-star" />
                            <i className="bx bxs-star" />
                            <i className="bx bxs-star" />
                            <i className="bx bx-star" />
                          </div>
                          <div className="price">
                            ${curElem.price}
                            <div className="colors">
                              <i className="bx bxs-circle brown" />
                              <i className="bx bxs-circle green" />
                              <i className="bx bxs-circle blue" />
                            </div>
                          </div>
                          <div className="buy-now">

                            {curElem.stock > 0 ? (
                              <button
                                className={`add-to-cart ${isInCart(curElem._id) ? 'red' : ''}`}
                                onClick={() => handleAddToCart(curElem)}
                              >
                                {isInCart(curElem._id) ? 'Item In Cart' : 'Add To Cart'}
                              </button>
                            ) : (
                              <button className='out-of-stock' disabled>
                                OutofStock
                              </button>
                            )}
                            <button
                              className='favo'
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>

      <section id="sellers">
        <div className="seller container">
          <h2>
            New <span className="prodects-h">Products</span>
          </h2>    <div className="best-seller">
            <div className="row">
              {
                newproduct?.map((curElem) => (
                  <div key={curElem._id} className="col-lg-4 col-md-6 col-sm-12">
                    <div className="best-p1">
                      <div className="relative mb-3">
                        <img src={curElem.productImages[0]} alt="" />
                        <a
                          onClick={() => handleAddToFavorite(curElem)}
                          className="wishlist-btn"
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faHeart}
                            color={isInFavorite(curElem._id) ? 'red' : 'grey'}
                            size="lg"
                          />
                        </a>
                        <div className="best-p1-txt">
                          <div className="name-of-p">
                            <p>{curElem.name}</p>
                          </div>
                          <div className="rating">
                            <i className="bx bxs-star" />
                            <i className="bx bxs-star" />
                            <i className="bx bxs-star" />
                            <i className="bx bxs-star" />
                            <i className="bx bx-star" />
                          </div>
                          <div className="price">
                            ${curElem.price}
                            <div className="colors">
                              <i className="bx bxs-circle brown" />
                              <i className="bx bxs-circle green" />
                              <i className="bx bxs-circle blue" />
                            </div>
                          </div>
                          <div className="buy-now">

                            {curElem.stock > 0 ? (
                              <button
                                className={`add-to-cart ${isInCart(curElem._id) ? 'red' : ''}`}
                                onClick={() => handleAddToCart(curElem)}
                              >
                                {isInCart(curElem._id) ? 'Item In Cart' : 'Add To Cart'}
                              </button>
                            ) : (
                              <button className='out-of-stock' disabled>
                                OutofStock
                              </button>
                            )}
                            <button
                              className='favo'
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>

      <section id="news">
        <div className="news-heading">
          <p>LATEST NEWS</p>
          <h2>Fashion New Trends</h2>
        </div>
        <div className="l-news container">
          <div className="l-news1">
            <div className="news1-img">
              <img src="https://i.postimg.cc/2y6wbZCm/news1.jpg" alt="img" />
            </div>
            <div className="news1-conte">
              <div className="date-news1">
                <p>
                  <i className="bx bxs-calendar" /> 12 February 2024
                </p>
                <h4>What Curling Irons Are The Best Ones</h4>
                <a
                  href=""
                  target="_blank"
                >
                  read more
                </a>
              </div>
            </div>
          </div>
          <div className="l-news2">
            <div className="news2-img">
              <img src="https://i.postimg.cc/9MXPK7RT/news2.jpg" alt="img" />
            </div>
            <div className="news2-conte">
              <div className="date-news2">
                <p>
                  <i className="bx bxs-calendar" /> 17 February 2024
                </p>
                <h4>The Health Benefits Of Sunglasses</h4>
                <a
                  href=""
                  target="_blank"
                >
                  read more
                </a>
              </div>
            </div>
          </div>
          <div className="l-news3">
            <div className="news3-img">
              <img src="https://i.postimg.cc/x1KKdRLM/news3.jpg" alt="img" />
            </div>
            <div className="news3-conte">
              <div className="date-news3">
                <p>
                  <i className="bx bxs-calendar" /> 26 February 2024
                </p>
                <h4>Eternity Bands Do Last Forever</h4>
                <a
                  href=""
                  target="_blank"
                >
                  read more
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section id="contact">
    <div className="contact container">
      <div className="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.121169986175!2d73.90618951442687!3d18.568575172551647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c131ed5b54a7%3A0xad718b8b2c93d36d!2sSky%20Vista!5e0!3m2!1sen!2sin!4v1654257749399!5m2!1sen!2sin"
          width={600}
          height={450}
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <form action="https://formspree.io/f/xzbowpjq" method="POST">
        <div className="form">
          <div className="form-txt">
            <h4>INFORMATION</h4>
            <h1>Contact Us</h1>
            <span>
              As you might expect of a company that began as a high-end
              interiors contractor, we pay strict attention.
            </span>
            <h3>USA</h3>
            <p>
              195 E Parker Square Dr, Parker, CO 801
              <br />
              +43 982-314-0958
            </p>
            <h3>India</h3>
            <p>
              HW95+C9C, Lorem ipsum dolor sit.
              <br />
              411014
            </p>
          </div>
          <div className="form-details">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              required=""
            />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required=""
            />
            <textarea
              name="message"
              id="message"
              cols={52}
              rows={7}
              placeholder="Message"
              required=""
              defaultValue={""}
            />
            <button>SEND MESSAGE</button>
          </div>
        </div>
      </form>
    </div>
  </section> */}
      <footer>
        <div className="footer-container container">
          <div className="content_1">
            <img src='/landing/logo.png' alt="" />
            <samp className='bebas-neue-regular1'>Click</samp>
            <samp className='lugrasimo-regular'>Shop</samp>        <p>
              The customer is at the heart of our
              <br />
              unique business model, which includes
              <br />
              design.
            </p>
            <img src="https://i.postimg.cc/Nj9dgJ98/cards.png" alt="cards" />
          </div>
          <div className="content_2">
            <h4>SHOPPING</h4>
            <a href="#sellers">Clothing Store</a>
            <a href="#sellers">Trending Shoes</a>
            <a href="#sellers">Accessories</a>
            <a href="#sellers">Sale</a>
          </div>
          <div className="content_3">
            <h4>SHOPPING</h4>
            <a href="./contact.html">Contact Us</a>
            <a href="https://payment-method-sb.netlify.app/" target="_blank">
              Payment Method
            </a>
            <a href="https://delivery-status-sb.netlify.app/" target="_blank">
              Delivery
            </a>
            <a href="https://codepen.io/sandeshbodake/full/Jexxrv" target="_blank">
              Return and Exchange
            </a>
          </div>
          <div className="content_4">
            <h4>NEWLETTER</h4>
            <p>
              Be the first to know about new
              <br />
              arrivals, look books, sales &amp; promos!
            </p>
            <div className="f-mail">
              <input type="email" placeholder="Your Email" />
              <i className="bx bx-envelope" />
            </div>
            <hr />
          </div>
        </div>
        <div className="f-design">
          <div className="f-design-txt container">
            <p>Design and Code by Krishna s</p>
          </div>
        </div>
      </footer>
    </>
  );
}


const App = () => (
  <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Set anchorOrigin to top-right
  >
    <Landingpage />
  </SnackbarProvider>
);

export default App;


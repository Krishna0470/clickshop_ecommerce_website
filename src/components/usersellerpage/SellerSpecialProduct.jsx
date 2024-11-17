import React, { useEffect, useState }  from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './userseller.css';
import { useCartContext } from '../../context/cartContext';
import { useFavoriteContext } from '../../context/favoriteContext';
import { SnackbarProvider, useSnackbar } from 'notistack'; // Import Notistack
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';


function SellerSpecialpage() {

  const [product, setProduct] = useState([]);
  const [value, setValue] = useState('all');
  const { addToCart,cartItems } = useCartContext();
  const { addToFavorite, favoriteItems  } = useFavoriteContext();
  const { enqueueSnackbar } = useSnackbar(); // Use Notistack hook
  const navigate = useNavigate();


  const handleBtn = (btn) => {
    setActive(btn.id);
    setValue(btn.value);
  };
  const params = useParams()

  const getProducts = async () => {
    try {
      const token = localStorage.getItem('accessTocken');
      const res = await axios.get(`http://localhost:443/specialProducts?category=${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        const visibleProducts = res.data.data.product.filter(p => !p.isBlocked);
        setProduct(visibleProducts);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(product);
  useEffect(() => {
    getProducts()
  }, [value])

  const handleAddToCart = (productDetails) => {
    const currentUserId = localStorage.getItem('userId');
    if (productDetails.user === currentUserId) {
      enqueueSnackbar("You cannot purchase your own product.", { variant: 'error' }); // Show Notistack message
      return;
    }

    if (!isInCart(productDetails._id)) {
      addToCart({ ...productDetails, qty: 1 });
    }
  };

  const handleBuyNow = (productDetails) => {
    if (!isInCart(productDetails._id)) {
      addToCart({ ...productDetails, qty: 1 });
    }
    const userId = localStorage.getItem('userId');
    navigate(`/Shipping/${userId}`);
  };

  const handleAddToFavorite = (productDetails) => {
    if (isInFavorite(productDetails._id)) {
      removeFromFavorite(productDetails._id);
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


<section id="sellers">
   
    <div className="seller container">
      <h2>Special    <span className='prodects-h' >Offers</span> </h2>
      <section id="sellers">
  <div className="seller container">
    <div className="best-seller">
      <div className="row">
      {product.map((curElem) => (
  <div key={curElem._id} className="col-lg-4 col-md-6 col-sm-12">
    <div className="best-p1">
      <div className="relative mb-3">
        <Link to={`/product/${curElem._id}`}>
          {/* Display only the first image */}
          {curElem.productImages.length > 0 && (
            <img 
              src={curElem.productImages[0]} 
              alt={`${curElem.name} Image 1`} 
              style={{ width: '100%' }} 
            />
          )}
        </Link>
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
        Out of Stock
      </button>
    )}

<button className='favo' onClick={() => handleBuyNow(curElem)}>
                        Buy Now
                      </button>
  </div>
        </div>
      </div>
    </div>
  </div>
))}
      </div>
    </div>
  </div>
</section>
    </div>
  </section>
  <footer>
    <div className="footer-container container">
      <div className="content_1">
      <img src='/landing/logo.png' alt=""  />
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
    <SellerSpecialpage />
  </SnackbarProvider>
);

export default App;
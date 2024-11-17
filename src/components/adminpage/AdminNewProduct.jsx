import React, { useEffect, useState } from 'react';
import { useParams,useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCartContext } from '../../context/cartContext';
import { useFavoriteContext } from '../../context/favoriteContext';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';


import './admin.css';

const AdminNewpage = () => {
  const [product, setProduct] = useState([]);
  const { addToCart, cartItems } = useCartContext();
  const { addToFavorite, removeFromFavorite, favoriteItems } = useFavoriteContext();

  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const navigate = useNavigate();

  const getTopProducts = async () => {
    try {
      const token = localStorage.getItem('accessTocken');
      const res = await axios.get('http://localhost:443/getNewProducts', {
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

  useEffect(() => {
    getTopProducts();
  }, []);

  const handleAddToCart = (productDetails) => {
    const currentUserId = localStorage.getItem('userId');
    if (productDetails.user === currentUserId) {
      enqueueSnackbar("You cannot purchase your own product.", { variant: 'error' });
      return;
    }

    if (!isInCart(productDetails._id)) {
      addToCart({ ...productDetails, qty: 1 });
    }
  };

  const handleBuyNow = (productDetails) => {
    const currentUserId = localStorage.getItem('userId');
    
    if (productDetails.user === currentUserId) {
      enqueueSnackbar("You cannot purchase your own product.", { variant: 'error' });
      return;
    }
  
    navigate(`/Shipping/${currentUserId}`);
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
    <section id="sellers">
      <div className="seller container">
        <h2>
          New <span className="prodects-h">Products</span>
        </h2>
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
  {/* Heart icon button */}
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
  );
};

const App = () => (
  <SnackbarProvider 
    maxSnack={3} 
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <AdminNewpage />
  </SnackbarProvider>
);

export default App;

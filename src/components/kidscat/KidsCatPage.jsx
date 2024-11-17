import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartContext } from '../../context/cartContext';
import { useFavoriteContext } from '../../context/favoriteContext';
import { SnackbarProvider, useSnackbar } from 'notistack'; // Import Notistack
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import './kidscat.css';

const KidsCatpage = () => {
  const [products, setProduct] = useState([]);
  const { addToCart, cartItems } = useCartContext();
  const { addToFavorite , favoriteItems  } = useFavoriteContext();
  const { enqueueSnackbar } = useSnackbar(); // Use Notistack hook

  const navigate = useNavigate();


  const params = useParams();

  const getTopProducts = async () =>{
    try{
    const res = await axios.get(`http://localhost:443/getNewProduct`)
    if (res.data.success) {
      const kidsCategoryId = '66b4e03377384dd5182cb939';
      const visibleProducts = res.data.data.product.filter(p => !p.isBlocked && p.category === kidsCategoryId);

      console.log('Filtered Products:', visibleProducts); // Log filtered products
      setProduct(visibleProducts);
    } else {
      console.error('API Response Error:', res.data.message || 'No success message provided');
    }
}catch(error){
  console.log(error);

  }
  }


  useEffect(() => {
    getTopProducts();
  }, []);

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
    <section id="sellers">
      <div className="seller container">
        <h2>
        Kids <span className="prodects-h">Products</span>
        </h2>
        <div className="best-seller">
          <div className="row">
            {products.map((curElem) => (
              <div key={curElem._id} className="col-lg col-md-6 col-sm-12">
                <div className="best-p1">
                  <div className="relative mb-3">
                    <Link >
                      <img src={curElem.productImages[0]} alt="" />
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
                        ₹{curElem.price}
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
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Set anchorOrigin to top-right
  >
    <KidsCatpage />
  </SnackbarProvider>
);

export default App;
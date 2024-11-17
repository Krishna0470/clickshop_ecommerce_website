import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useCartContext } from '../../context/cartContext';
import { useFavoriteContext } from '../../context/favoriteContext';
import './product.css';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

function ProductPage() {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [Qty, setQuantity] = useState(1);
  const { addToCart, cartItems } = useCartContext();
  const { favoriteItems, addToFavorite, removeFromFavorite } = useFavoriteContext();
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    user: 'Anonymous'
  });
  const [hasPurchased, setHasPurchased] = useState(false);

  const imgShowcaseRef = useRef(null);
  const imgSelectRef = useRef([]);
  const { enqueueSnackbar } = useSnackbar();

  const getProductDetails = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');
      const res = await axios.get(`http://localhost:443/getProduct/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        const product = res.data.data.product;
        setProductDetails(product);
        setReviews(product.reviews || []);
        
        if (userId) {
          const purchaseRes = await axios.get(`http://localhost:443/checkPurchase/${userId}/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setHasPurchased(purchaseRes.data.hasPurchased);
        }
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, [id]);

  const handleAddToCart = (productDetails) => {
    const currentUserId = localStorage.getItem('userId');
    if (productDetails.user === currentUserId) {
      enqueueSnackbar("You cannot purchase your own product.", { variant: 'error' });
      return;
    }

    if (!isInCart(productDetails._id)) {
      addToCart({ ...productDetails, qty: Qty });
    }
  };

  const handleAddToFavorite = () => {
    if (isInFavorite(productDetails._id)) {
      removeFromFavorite(productDetails);
    } else {
      addToFavorite(productDetails);
    }
  };

  const isInCart = (productId) => cartItems.some(item => item._id === productId);

  const isInFavorite = (productId) => favoriteItems.some(item => item._id === productId);

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    setNewReview((prevReview) => ({ ...prevReview, rating }));
  };

  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, comment: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!hasPurchased) {
      enqueueSnackbar('You must purchase the product before leaving a review.', { variant: 'error' });
      return;
    }
    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');
      const userEmail = localStorage.getItem('userEmail');

      const reviewToSubmit = {
        ...newReview,
        user: userId || 'Anonymous',
        userEmail: userEmail || 'Anonymous'
      };

      if (!reviewToSubmit.rating || reviewToSubmit.rating < 1 || reviewToSubmit.rating > 5) {
        enqueueSnackbar('Invalid rating', { variant: 'error' });
        return;
      }
      if (!reviewToSubmit.comment) {
        enqueueSnackbar('Comment is required', { variant: 'error' });
        return;
      }

      await axios.post(`http://localhost:443/product/${id}/review`, reviewToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getProductDetails();
      setNewReview({ rating: 0, comment: '', user: '' });
      setSelectedRating(0);

    } catch (error) {
      enqueueSnackbar('Error submitting review:', { variant: 'error' });
    }
  };

  useEffect(() => {
    const imgs = imgSelectRef.current;
    let imgId = 1;

    const slideImage = () => {
      const displayWidth = imgShowcaseRef.current?.querySelector('img:first-child')?.clientWidth || 0;
      if (imgShowcaseRef.current) {
        imgShowcaseRef.current.style.transform = `translateX(${-(imgId - 1) * displayWidth}px)`;
      }
    };

    const handleImageClick = (event, id) => {
      event.preventDefault();
      imgId = id;
      slideImage();
    };

    imgs.forEach((imgItem, index) => {
      if (imgItem) {
        imgItem.addEventListener('click', (event) => handleImageClick(event, index + 1));
      }
    });

    window.addEventListener('resize', slideImage);

    return () => {
      imgs.forEach((imgItem) => {
        if (imgItem) {
          imgItem.removeEventListener('click', (event) => handleImageClick(event, index + 1));
        }
      });
      window.removeEventListener('resize', slideImage);
    };
  }, []);

  return (
    <div className="pd-wrap">
      <div className="container">
        <div className="heading-section">
          <h2>Product Details</h2>
        </div>
        <div className="row">
        <div className="col-md-4">
            <div className="img-display">
              <div className="img-showcase" ref={imgShowcaseRef}>
                {/* Display images dynamically */}
                <img 
                  src={productDetails.productImages?.[0] || 'default-image.jpg'} 
                  alt="main product" 
                  className="showcase-img w-full h-[25rem] cursor-pointer" 
                />
                <img 
                  src={productDetails.productImages?.[1] || 'default-image.jpg'} 
                  alt="shoe image 2" 
                  className="showcase-img" 
                />
                <img 
                  src={productDetails.productImages?.[2] || 'default-image.jpg'} 
                  alt="shoe image 3" 
                  className="showcase-img" 
                />
                <img 
                  src={productDetails.productImages?.[3] || 'default-image.jpg'} 
                  alt="shoe image 4" 
                  className="showcase-img" 
                />
              </div>
            </div>
            <div className="img-select">
              {[1, 2, 3, 4].map((id, index) => (
                <div className="img-item" key={index}>
                  <a href="#" data-id={id} ref={(el) => imgSelectRef.current[index] = el}>
                    <img 
                      src={productDetails.productImages?.[index] || 'default-image.jpg'} 
                      alt={`shoe image ${id}`} 
                      className="select-img w-full h-[25rem] cursor-pointer" 
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <div className="product-dtl">
              <div className="product-info">
                <div className="product-name">{productDetails?.name || 'Product Name'}</div>
                <div className="reviews-counter">
                  <div className="rate">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <React.Fragment key={rating}>
                        <input type="radio" id={`star${rating}`} name="rate" value={rating} checked={selectedRating === rating} onChange={() => handleRatingChange(rating)} />
                        <label htmlFor={`star${rating}`} title={`${rating} stars`}>{`${rating} stars`}</label>
                      </React.Fragment>
                    ))}
                  </div>
                  <span>{reviews.length} Reviews</span>
                </div>
                <div className="product-price-discount">
                  <span>${productDetails?.price || '0.00'}</span>
                  <span className="line-through">$2999</span>
                </div>
              </div>
              <p>100% Original Products. Pay on delivery might be available. Easy 14 days returns and exchanges.</p>
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="size">Size</label>
                  <select id="size" name="size" className="form-control">
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                  </select>
                </div>
              </div>
              <div className="product-count">
                {productDetails.stock > 0 ? (
                  <button
                    className={`add-to-cart ${isInCart(productDetails._id) ? 'red' : ''}`}
                    onClick={() => handleAddToCart(productDetails)}
                  >
                    {isInCart(productDetails._id) ? 'Item In Cart' : 'Add To Cart'}
                  </button>
                ) : (
                  <button className='out-of-stock' disabled>
                    Out of Stock
                  </button>
                )}
                <a onClick={handleAddToFavorite} className="wishlist-btn">
                  <FontAwesomeIcon icon={faHeart} color={isInFavorite(productDetails._id) ? 'red' : 'grey'} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="product-info-tabs">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="description-tab" data-toggle="tab" href="#description" role="tab" aria-controls="description" aria-selected="true">Description</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="review-tab" data-toggle="tab" href="#review" role="tab" aria-controls="review" aria-selected="false">Reviews ({reviews.length})</a>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
              <p>{productDetails?.description || 'No description available'}</p>
            </div>
            <div className="tab-pane fade" id="review" role="tabpanel" aria-labelledby="review-tab">
              <div className="review-heading">REVIEWS</div>
              {reviews.length === 0 ? (
                <p className="mb-20">There are no reviews yet.</p>
              ) : (
                reviews.map((review, index) => (
                  <div key={index} className="review">
                    <div className="review-author"><h3>{review.userEmail || 'Anonymous'}</h3></div>
                    <div className="review-rating"><h6>{review.rating || 0} stars</h6></div>
                    <div className="review-comment"><p className='mess'>{review.comment || 'No comment'}</p></div>
                  </div>
                ))
              )}
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label>Your rating</label>
                  <div className="reviews-counter">
                    <div className="rate">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <React.Fragment key={rating}>
                          <input
                            type="radio"
                            id={`star${rating}`}
                            name="rate"
                            value={rating}
                            checked={selectedRating === rating}
                            onChange={() => handleRatingChange(rating)}
                          />
                          <label htmlFor={`star${rating}`} title={`${rating} stars`}>
                            {`${rating} stars`}
                          </label>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Your message</label>
                  <textarea
                    className="form-control"
                    rows={10}
                    value={newReview.comment}
                    onChange={handleReviewChange}
                    required
                  />
                </div>
                <button type="submit" className="round-black-btn" disabled={!hasPurchased}>
                  Submit Review
                </button>
                {!hasPurchased && <p className="error-message">You must purchase the product before leaving a review.</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const App = () => (
  <SnackbarProvider 
    maxSnack={3} 
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <ProductPage />
  </SnackbarProvider>
);

export default App;

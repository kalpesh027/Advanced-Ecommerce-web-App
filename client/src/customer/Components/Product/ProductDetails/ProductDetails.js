import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct, fetchSuggestedProducts } from "../../../../Redux/Product/productSlice";
import Reviews from "../../ReviewProduct/RateProduct";
import "./ProductDetails.css";
import { addToCart } from '../../../../Redux/Cart/cartSlice';
import ProductCards from "./ProductCrads";
import axiosInstance from "../../../../axiosConfig";
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";
import { addToWishlist, removeFromWishlist,fetchWishlist } from "../../../../Redux/Wishlist/wishlistslice";


function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  // State and selectors
  const { productDetails, suggestedProducts, status, error } = useSelector((state) => state.products);
  const [showAll, setShowAll] = useState(false);
  const [tab, setTab] = useState("Reviews");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [mainImage, setMainImage] = useState(''); // State for the main image
  const [productCardRendered, setProductCardRendered] = useState(false); // State for controlling ProductCards rendering

  const token = localStorage.getItem('authToken');
  const [like,setLike]=useState(false)

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchProduct(id)).then((resultAction) => {
      if (fetchProduct.fulfilled.match(resultAction)) {
        console.log('Product details fetched successfully:', resultAction.payload);
        // Set the initial main image to the first image in the array
        setMainImage(resultAction.payload.imageUrl[0]); 
      } else if (fetchProduct.rejected.match(resultAction)) {
        console.error('Failed to fetch product details:', resultAction.payload);
      }
    });
  }, [dispatch, id]);

  useEffect(() => {
    if (productDetails && productDetails.category) {
      dispatch(fetchSuggestedProducts(productDetails.category._id || productDetails.category)).then((resultAction) => {
        if (fetchSuggestedProducts.fulfilled.match(resultAction)) {
          console.log('Suggested products fetched successfully:', resultAction.payload);
        } else if (fetchSuggestedProducts.rejected.match(resultAction)) {
          console.error('Failed to fetch suggested products:', resultAction.payload);
        }
      });
    } else {
      console.log('No categoryId found in productDetails.');
    }
  }, [dispatch, productDetails?.category]);

  useEffect(() => {
    const getReview = async () => {
      try {
        const resp = await axiosInstance.get(`/review/product/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setReviews(resp.data); // Save response in state
        const averageRating = resp.data.reduce((sum, review) => sum + review.rating, 0) / resp.data.length;
        setRating(averageRating);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    getReview(); // Call the function to fetch reviews
  }, [id, token]);

  useEffect(() => {
    const fetchWishList = async () => {
      try {
        const resp = await dispatch(fetchWishlist()).unwrap();

        const productInWishlist = resp.some(item => item._id === id);
        if (productInWishlist) {
          setLike(true); 
        } else {
          setLike(false); 
        }
      } catch (error) {
        console.log("Error fetching wishlist:", error);
      }
    };
    fetchWishList();
  }, [dispatch]);

  const sharedClasses = {
    starRating: 'flex space-x-1 text-yellow-500',
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      navigate('/login'); // Redirect to the login page if not logged in
      return;
    }
    
    const resultAction = dispatch(addToCart(id));
    if (addToCart.rejected.match(resultAction) && resultAction.payload && resultAction.payload.isUnauthorized) {
      navigate('/login');
    }
  };

  const handleRatingClick = (index) => setRating(index + 1);
  const handleMouseLeave = () => setHoverRating(0);
  const handleMouseEnter = (index) => setHoverRating(index + 1);
  const handleViewAllClick = () => setShowAll(!showAll);

  const handleThumbnailClick = (url) => {
    setMainImage(url); // Update the main image on thumbnail click
  };

  const sectionHeight = showAll ? '1000px' : '150px';

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }
  // const handleAddToWishlist = () => {
  //   // Implement your logic for adding to the wishlist here
  //   console.log('Added to wishlist');
  // };


  const toggleLike =()=>{

    const token = localStorage.getItem('authToken');
    
    if (!token) {
      navigate('/login'); // Redirect to the login page if not logged in
      return;
    }

    console.log("product id",productDetails._id)

    if(like){
      console.log("id",productDetails._id)
      setLike(false)
        dispatch(removeFromWishlist(productDetails._id));
    }else{
      setLike(true)
        dispatch(addToWishlist(productDetails._id));
    }
  }
  return (
    <>
      <div className="lg:block">
        <Navbar number={12} />
      </div>
      <div>
        <div style={{ height: sectionHeight + '30px', overflow: 'hidden', transition: 'height 0.3s ease' }} className="product-details-container mt-20 mb-8">
          <div className="product-image-section">
            <div className="image-frame">
              <div className="main-image-container relative rounded-lg overflow-hidden">
                <img
                  src={mainImage}
                  alt="Main Product Image"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="image-gallery">
              {(productDetails?.imageUrl || []).map((url, index) => (
                <div key={index} className="thumbnail" onClick={() => handleThumbnailClick(url)}>
                  <img
                    src={url}
                    alt={`Product Thumbnail ${index + 1}`}
                    className="thumbnail-img cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="product-info-section">
            <h1 className="product-title">{productDetails?.title}</h1>
            <div className="product-pricing">
              <div className={sharedClasses.starRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRatingClick(star - 1)}
                    onMouseEnter={() => handleMouseEnter(star - 1)}
                    onMouseLeave={handleMouseLeave}
                    className={star <= (hoverRating || rating) ? 'text-yellow-500 cursor-pointer' : 'text-zinc-300 cursor-pointer'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-text">
                {reviews.length} Ratings
              </span>
              <span className="stock-status font-bold">In Stock</span>
            </div>
            <div className="product-pricing flex gap-2">
              <span className="discounted-price">
                ₹{productDetails?.discountedPrice}
              </span>

              <span className="original-price">
                ₹{productDetails?.price}
              </span>
            </div>
            <div>
              <h2 className="tab-title">Description</h2>
              <div style={{ height: sectionHeight, overflow: 'hidden', transition: 'height 0.3s ease'}} className="description-content" dangerouslySetInnerHTML={{ __html: productDetails?.description }} />
            </div>
            <button onClick={handleViewAllClick} className="text-orange-500 ml-30">
              {showAll ? 'Show Less' : 'View All'}
            </button>

            <div className="button-group">
              <div className="quantity-selector">
                <label htmlFor="quantity" className="text-sm">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max="100"
                  defaultValue="1"
                  className="quantity-input"
                />
              </div>
              <button onClick={handleAddToCart} className="buy-now-btn">Add to cart</button>
              {/* <button onClick={addToCart(id)} className="buy-now-btn">Add to cart</button> */}
              {/* <button onClick={handleAddToWishlist} className="wishlist-btn">
                <span role="img" aria-label="Wishlist">❤️</span> 
              </button> */}
              <button onClick={toggleLike} className="wishlist-btn">
                <span role="img" aria-label="Wishlist">{like?<FcLike/>:<FcLikePlaceholder/>}</span> {/* Heart emoji */}
              </button>
            </div>
          </div>
        </div>

        <nav className="tabs-navigation">
          <ul
            onClick={() => setTab("Reviews")}
            className={`tab-item ${tab === "Reviews" ? "active" : ""}`}
          >
            Reviews
          </ul>
          <ul
            onClick={() => setTab("Country of Origin")}
            className={`tab-item ${tab === "Country of Origin" ? "active" : ""}`}
          >
            Country of Origin
          </ul>
          <ul
            onClick={() => setTab("Shipping & Returns")}
            className={`tab-item ${tab === "Shipping & Returns" ? "active" : ""}`}
          >
            Shipping & Returns
          </ul>
        </nav>

        <div className="tab-content">
          {tab === "Reviews" && (
            <Reviews reviews={reviews} />
          )}
          {tab === "Country of Origin" && (
            <p className="country-origin">Made in {productDetails?.countryOfOrigin}</p>
          )}
          {tab === "Shipping & Returns" && (
            <p className="shipping-returns">
              {productDetails?.shippingReturnsInfo}
            </p>
          )}
        </div>

        <div className="suggested-products">
          <h2 className="suggested-products-title">You might also like</h2>
          <div className="product-cards-container">
            {suggestedProducts.length > 0 && (
              <ProductCards key={suggestedProducts[0]._id} product={suggestedProducts[0]} />
            )}
            {/* Set the rendered state to true after the first render */}
            {!productCardRendered && setProductCardRendered(true)}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetails;

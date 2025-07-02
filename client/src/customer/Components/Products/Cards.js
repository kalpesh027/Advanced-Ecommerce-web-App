import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { addQuantity, addToCart, removeFromCart, updateCartQuantity,fetchCart } from '../../../Redux/Cart/cartSlice';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../../../Redux/Wishlist/wishlistslice'; // Import wishlist actions
import { FcLikePlaceholder, FcLike } from 'react-icons/fc'; // Import heart icons for wishlist

const truncateText = (text, wordLimit) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return `${words.slice(0, wordLimit).join(' ')}...`;
  }
  return text;
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1); // Local state for product quantity
  const [addedToCart, setAddedToCart] = useState(false); // Track if item is added to cart
  const { items } = useSelector((state) => state.cart);
  const [like, setLike] = useState(false); // Wishlist state

  useEffect(() => {
    const fetchWishList = async () => {
      try {
        const resp = await dispatch(fetchWishlist()).unwrap();

        const productInWishlist = resp.some(item => item._id === product._id);
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
  }, [dispatch, product._id]);
  const [isFirstAdd, setIsFirstAdd] = useState(true); // State to track first addition

  const handleAddToCart = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login'); 
      return;
    }
  
    const isProductInCart = items.length > 0 && items[0] ? items[0].find(item => item.product?._id === product._id) : null;
  
    if (!isProductInCart) {
      await dispatch(addToCart(product._id));
      setAddedToCart(true);
      setQuantity(1); 
      
      // Instead of reloading, dispatch an action to fetch the updated cart
      await dispatch(fetchCart()); // Make sure you have this action defined to get updated cart items
  
      setIsFirstAdd(false);
    } else {
      setAddedToCart(true);
      setQuantity(1); 
    }
  };
  
  

  const increaseQuantity = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login'); 
      return;
    }

    setQuantity((prev) => prev + 1); // Update local state
    dispatch(addQuantity(product._id)); // Dispatch the action to update quantity in the global state
  };

  // Function to decrease quantity
  const decreaseQuantity = (id) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    const item = items.length > 0 && items[0] ? items[0].find(item => item.product?._id === product._id) : null; // Find the product in the cart
    // const item = items.length > 0 ? items[0].find((item) => item.product._id === id) : null; // Handle the case where items is empty

    if (!item) return;

    if (item.quantity > 1) {
      setQuantity((prev) => prev - 1); // Update local state
      dispatch(updateCartQuantity({ productId: item._id, quantity: item.quantity - 1 })); // Dispatch the action to update quantity in the global state
    }
  };

  // Handle removing the item from the cart
  const handleRemove = () => {
    if (currentItemInCart) {
      dispatch(removeFromCart(currentItemInCart._id));
      setQuantity(0); // Reset quantity when removed
    }
  };

  // Handle toggling the wishlist state
  const toggleLike = () => {
    if (like) {
      setLike(false);
      dispatch(removeFromWishlist(product._id)); // Dispatch remove from wishlist
    } else {
      setLike(true);
      dispatch(addToWishlist(product._id)); // Dispatch add to wishlist
    }
  };

  const imageUrl = Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl;
  const currentItemInCart = items.length > 0 && items[0] ? items[0].find(item => item.product?._id === product._id) : null;


  return (
    <div key={product._id} className="border-2 p-4 rounded-lg bg-gray-100 hover:bg-orange-100 shadow-lg transition ease-in">
      <Link to={`/product/${product._id}`}>
        <img src={imageUrl} alt={product.title} className="w-full object-contain mb-2 h-28" />
        <h3 className="text-sm sm:text-lg font-semibold">{truncateText(product.title, 2)}</h3>
      </Link>

      <div className="flex items-center justify-between">
        <div className="text-base sm:text-xl font-bold text-green-600">₹{product.discountedPrice}</div>
        {/* Static Red Heart Icon for Wishlist */}
        <button onClick={toggleLike} className="text-2xl">
          {like ? <FcLike style={{ color: 'darkred' }}  /> : <FcLikePlaceholder style={{ color: 'lightcoral' }}/> }
        </button>
      </div>

      <div className="text-xs sm:text-sm text-gray-500 line-through">₹ {product.price}</div>
      <div className="text-xs sm:text-sm text-zinc-500 mb-2">
        {product.quantity > 0 ? 'Available' : 'Not Available'}
      </div>

      {addedToCart || currentItemInCart ? (
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => decreaseQuantity(product._id)}
            className="bg-blue-500 text-white w-8 h-8 rounded-md shadow-sm hover:bg-blue-600 transition-colors "
            disabled={quantity <= 0}
           
          >
            -
          </button>
          <span className="w-12 text-center border border-gray-300 rounded-md shadow-sm">
            {currentItemInCart ? currentItemInCart.quantity : quantity}
          </span>
          <button
            onClick={increaseQuantity}
            className="bg-blue-500 text-white w-8 h-8 rounded-md shadow-sm hover:bg-blue-600 transition-colors "
            disabled={quantity >= product.quantity}
          >
            +
          </button>
        </div>
      ) : (
        <div className="flex flex-col space-y-1">
          <button
             disabled={product.quantity < 1}
            onClick={handleAddToCart}
            className="w-full bg-green-600 text-white rounded-lg py-1 hover:bg-green-700 transition"
          >
            Add to Cart
          </button>
        </div>
      )}

{(addedToCart || currentItemInCart) && (
  <button
    onClick={handleRemove}
    className="w-full bg-red-600 text-white rounded-lg py-1 hover:bg-red-700 transition"
  >
    Remove from Cart
  </button>
)}

    </div>
  );
};

export default ProductCard;

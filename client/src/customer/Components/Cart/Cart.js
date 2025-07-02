import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import MobNavBar from '../Navbar/MobileNavbar';
import { BsFillTrashFill } from 'react-icons/bs';
import { FaCircleInfo } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchCart, removeFromCart, clearCart, updateCartQuantity, addQuantity, UpdateCart } from '../../../Redux/Cart/cartSlice';

// import { fetchCart, removeFromCart, clearCart, updateCartQuantity, addQuantity,updateCartPriceSummary } from '../../../Redux/Cart/cartSlice';

import { addToWishlist, removeFromWishlist, fetchWishlist } from '../../../Redux/Wishlist/wishlistslice';
import { fetchCoupons } from '../../../Redux/Coupons/couponSlice';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { AiFillHeart } from 'react-icons/ai';
import { AlarmPlus } from 'lucide-react';

import { FcLikePlaceholder, FcLike } from 'react-icons/fc';


const CartItem = ({ unik, productId, actualPrice, imageSrc, productName, price, savings, qty, decreaseQuantity, increaseQuantity, removeItem, prodid, toggleLike, isLiked }) => {
  const imageSource = Array.isArray(imageSrc) ? imageSrc[0] : imageSrc;
  return (
    <tr className="border-b bg-white hover:bg-gray-50 transition-colors duration-300">
      <td className="py-4 px-4 flex items-center space-x-4">
        <img src={imageSource} alt="Product Image" className="w-16 h-16 rounded-md shadow-md" />
        <div>
          <span className="bg-green-300 text-black text-xs font-semibold px-2.5 py-0.5 rounded-md inline-block mb-1">Home Delivery Only</span>
          <p className="text-base font-medium text-gray-700">{productName}</p>
        </div>
      </td>
      <td className="py-4 px-4 text-center text-gray-700">₹{actualPrice}</td>
      <td className="py-4 px-4 text-center text-gray-700">₹{price}</td>
      <td className="py-4 px-4 text-center font-bold text-green-600">₹{savings}</td>
      <td className="py-4 px-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <button
            className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-300"
            onClick={() => { toggleLike(productId) }}>
            {isLiked ? <FcLike style={{ color: 'darkred' }} /> : <FcLikePlaceholder style={{ color: 'lightcoral' }} />}

          </button>
          <button className="bg-blue-500 text-white w-8 h-8 rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300" onClick={() => decreaseQuantity(unik)}>-</button>
          <input type="number" value={qty} readOnly min="1" className="w-14 text-center border border-gray-300 rounded-md shadow-sm" />
          <button className="bg-blue-500 text-white w-8 h-8 rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-300" onClick={() => increaseQuantity(prodid)}>+</button>
          <button className="text-red-500 hover:text-red-700 transition-colors duration-300" onClick={() => removeItem(unik)}>
            <BsFillTrashFill className="text-2xl" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [priceSummary, setPriceSummary] = useState({ totalDiscountedPrice: 0, discount: 0, totalActualPrice: 0, id: "" });
  const { items, status, fetchCartError } = useSelector((state) => state.cart);
  const [viewport, setViewport] = useState(window.innerWidth < 620);
  const { coupons, status: couponsstatus } = useSelector((state) => state.coupons);
  const [showCouponOverlay, setShowCouponOverlay] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [wishlistProductIds, setWishlistProductIds] = useState(new Set());


  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const [originalTotalPrice, setOriginalTotalPrice] = useState(0);


  useEffect(() => {
    if (items && items.length > 0 && items[0].length > 0) {
      const totalDiscountedPrice = items[0].reduce((acc, item) => {
        if (item.product) {
          return acc + item.product.discountedPrice * item.quantity;
        }
        return acc;
      }, 0);
      const totalActualPrice = items[0].reduce((acc, item) => {
        if (item.product) {
          return acc + item.product.price * item.quantity;
        }
        return acc;
      }, 0);


      const discount = totalActualPrice - totalDiscountedPrice;
      setPriceSummary({ totalDiscountedPrice, discount, totalActualPrice });



      // setOriginalTotalPrice(totalActualPrice); // Set the original total price
      setOriginalTotalPrice(totalActualPrice); // Set the original total price
    }
  }, [items]);

  console.log("before", priceSummary)

  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        const response = await dispatch(fetchWishlist()).unwrap();
        const wishlistIds = new Set(response.map(item => item._id)); // Store product IDs in a Set
        setWishlistProductIds(wishlistIds);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlistData();
  }, [dispatch]);


  useEffect(() => {
    const handleResize = () => {
      setViewport(window.innerWidth < 620);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      const resultAction = await dispatch(fetchCart());
      if (fetchCart.rejected.match(resultAction) && resultAction.payload && resultAction.payload.isUnauthorized) {
        navigate('/login');
      }
    };
    fetchCartItems();
  }, [dispatch, navigate]);


  const [validCoupons, setValidCoupons] = useState([]);

  useEffect(() => {
    // Get current date
    const currentDate = new Date();

    // Filter out expired coupons
    const filteredCoupons = coupons.filter(coupon => new Date(coupon.expirationDate) > currentDate);
    setValidCoupons(filteredCoupons);
  }, [coupons]);


  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [usedCoupons, setUsedCoupons] = useState([]);





  const applyCoupon = () => {

    if (selectedCoupon) {
      const coupon = coupons.find(c => c._id === selectedCoupon);

      // If there's an existing coupon applied, remove it
      if (appliedCoupons.length > 0) {
        const existingCoupon = appliedCoupons[0]; // Get the first applied coupon
        let discount = 0;

        // Calculate the discount of the existing coupon
        if (existingCoupon.discountType === 'percentage') {
          discount = (priceSummary.totalDiscountedPrice * existingCoupon.discountValue) / 100;
        } else {
          discount = existingCoupon.discountValue;
        }

        // Update price summary to remove the existing coupon discount
        setPriceSummary(prev => {
          const updatedTotal = prev.totalDiscountedPrice + discount;
          const updatedDiscount = prev.discount - discount;
          const ids = items[1]._id

          return {
            ...prev,
            totalDiscountedPrice: updatedTotal,
            discount: updatedDiscount,
            id: ids
          };
        });

        // Remove the existing coupon
        setAppliedCoupons([]); // Clear the applied coupons
      }

      // Now apply the new coupon
      if (coupon) {
        let discount = 0;

        if (coupon.discountType === 'percentage') {
          discount = (priceSummary.totalDiscountedPrice * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }

        // Ensure discount does not exceed the total price

        discount = Math.min(discount, priceSummary.totalDiscountedPrice);

        setPriceSummary(prev => ({
          ...prev,
          totalDiscountedPrice: prev.totalDiscountedPrice - discount,
          discount: prev.discount + discount,
        }));

        dispatch(UpdateCart({
          totalDiscountedPrice: priceSummary.totalDiscountedPrice - discount,
          discount: priceSummary.discount,
          couponValue: discount
        }));

        setAppliedCoupons([coupon]); // Set the new coupon as the only applied coupon

        console.log('Applying coupon:', coupon.code, 'Discount:', discount);

      }

      setSelectedCoupon(null);
      setShowCouponOverlay(false);
    }
  };


  const removeCoupon = (couponToRemove) => {
    setAppliedCoupons(prev => prev.filter(coupon => coupon._id !== couponToRemove._id));

    // Determine the discount amount based on the coupon type
    let discount = 0;
    if (couponToRemove.discountType === 'percentage') {
      // discount = (priceSummary.totalDiscountedPrice * couponToRemove.discountValue) / 100;
      discount = (priceSummary.totalDiscountedPrice * couponToRemove.discountValue) / (100 - couponToRemove.discountValue);;
    } else {
      discount = couponToRemove.discountValue;
    }
    // Update price summary
    setPriceSummary(prev => {
      const updatedTotalDiscountedPrice = Math.round((prev.totalDiscountedPrice + discount) * 100) / 100; // Add back the discount
      const updatedDiscount = Math.round((prev.discount - discount) * 100) / 100;

      dispatch(UpdateCart({
        totalDiscountedPrice: updatedTotalDiscountedPrice,
        discount: updatedDiscount,
        couponValue: 0
      }));

      return {
        ...prev,
        totalDiscountedPrice: updatedTotalDiscountedPrice,
        discount: updatedDiscount,
      };
    });
  };


  const handleAddToCart = async () => {
    const resultAction = await dispatch(fetchCart());
    if (fetchCart.rejected.match(resultAction) && resultAction.payload && resultAction.payload.isUnauthorized) {
      navigate('/login');
    }
  };

  const increaseQuantity = (id) => {
    const item = items[0].find(item => item._id === id);
    dispatch(addQuantity(id));
  };

  const decreaseQuantity = (id) => {
    // console.log(items,"Ram Deshmukh");
    // console.log(items[0],"Nikita Deshmukh");
    const item = items[0].find(item => item._id === id);
    // console.log(item._id,"Namdev Naik");
    // console.log(item,"Nikita Naik");
    // console.log(id,"Durgesh Naik");
    if (item.quantity > 1) {
      dispatch(updateCartQuantity({ productId: id, quantity: item.quantity - 1 }));
    }
  };

  const removeItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkOut = () => {
    if (!selectedCoupon) {
      console.log("checkout", selectedCoupon)
      dispatch(UpdateCart({
        totalDiscountedPrice: priceSummary.totalDiscountedPrice,
        discount: priceSummary.discount,
        couponValue: 0
    }));
    }
    navigate('/checkout');
  };

  const clearCartItems = () => {
    dispatch(clearCart());
    setPriceSummary({ totalDiscountedPrice: 0, discount: 0, totalActualPrice: 0 });
  };

  const toggleLike = (productId) => {
    if (wishlistProductIds.has(productId)) {
      dispatch(removeFromWishlist(productId));
      setWishlistProductIds(prevState => {
        const newWishlist = new Set(prevState);
        newWishlist.delete(productId);
        return newWishlist;
      });
    } else {
      dispatch(addToWishlist(productId));
      setWishlistProductIds(prevState => new Set(prevState).add(productId));
    }
  };

  if (!items || items.length === 0) {
    return <div>Loading....</div>;
  }

  return (

    <div className="min-h-screen bg-gray-50 ">
      <div>
        <Navbar />
      </div>
      <div className="container mx-auto p-4 mt-4">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/4">
            <h3 className="text-xs mb-4">
              <span className="text-green-500 font-semibold text-xm">Cart /</span> <span>Checkout</span> / Confirmation ({items[0].length} items)</h3>
            <div className="overflow-x-auto rounded-md  shadow-sm">
              <table className="min-w-full ">
                <thead className="bg-Orange-500">
                  <tr>
                    <th className="py-2 bg-orange-200 px-2 sm:py-2 sm:px-4 border-b">Product</th>
                    <th className="py-2 bg-orange-200 px-2 sm:py-2 sm:px-4 border-b">Price</th>
                    <th className="py-2 bg-orange-200 px-2 sm:py-2 sm:px-4 border-b">Aapla Bajar Price</th>
                    <th className="py-2 bg-orange-200 px-2 sm:py-2 sm:px-4 border-b">You Save</th>
                    <th className="py-2 bg-orange-200 px-2 sm:py-2 sm:px-4 border-b">No. of items</th>
                    <th className="py-2 bg-orange-200 px-2 sm:py-2 sm:px-4 border-b"></th>
                  </tr>
                </thead>
                <tbody className='bg-orange-500'>

                  {items[0].map(item => (
                    <CartItem className='object-cover'
                      key={item && item._id}
                      prodid={items && item && item.product && item.product._id}
                      unik={item._id}
                      productId={items && item && item.product && item.product._id}
                      imageSrc={items && item && item.product && item.product.imageUrl}
                      productName={items && item && item.product && item.product.title}
                      actualPrice={items && item && item.product && item.product.price * item.quantity}
                      price={items && item && item.product && item.product.discountedPrice * item.quantity}
                      savings={(items && item && item.product && item.product.price - item.product.discountedPrice) * item.quantity}
                      qty={item.quantity}
                      decreaseQuantity={decreaseQuantity}
                      increaseQuantity={increaseQuantity}
                      removeItem={removeItem}
                      toggleLike={toggleLike}
                      isLiked={wishlistProductIds.has(items && item && item.product && item.product._id)}
                    />
                  ))}
                </tbody>

              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300" onClick={clearCartItems}>Remove all</button>
            </div>
          </div>
          <div className="w-full lg:w-1/4 lg:pl-4 mt-4 lg:mt-30">
            <div className="bg-orange-100 p-6 border rounded-md shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Price Summary</h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">original Total : </span>
                <span className="font-semibold text-gray-800">₹ {priceSummary.totalActualPrice}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Cart Total</span>
                <span className="font-semibold text-gray-800">₹ {priceSummary.totalDiscountedPrice}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">You Saved</span>
                <span className="font-semibold text-green-600">₹  {priceSummary.discount}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="group relative">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition duration-300">
                    <span >Delivery Charge <FaCircleInfo /></span>
                  </button>
                  <div className="absolute left-0 bottom-8 hidden mt-2 p-3 text-sm text-white bg-black border border-gray-300 rounded-md shadow-lg w-64 group-hover:block">
                    <ul className="list-disc pl-4">
                      <li>Home Delivery : Flat Rs. 40</li>
                      <li>Pick Up Point : Free Delivery</li>
                    </ul>
                  </div>
                </div>
                <span className="text-red-500 font-semibold">+ Extra</span>
              </div>

              {/* Applied Coupons Section */}
              <div className="bg-orange-100 p-4 rounded-md mt-4">
                <h3 className="text-lg font-semibold mb-2">Applied Coupons</h3>
                {appliedCoupons.length > 0 ? (
                  <ul>
                    {appliedCoupons.map(coupon => (
                      <li key={coupon._id} className="flex justify-between items-center py-2 border-b">
                        {/* <span className="text-gray-800">{${coupon.code}: ${coupon.discountType === 'percentage'} ? ${coupon.discountValue}% off : ₹${coupon.discountValue} off}</span> */}
                        <span className="text-gray-800">{coupon.code} : {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}</span>
                        <button
                          onClick={() => removeCoupon(coupon)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No coupons applied.</p>
                )}
              </div>

              {/* SHWOS HTHE AVAILABEL COUPONS */}
              <div className="relative">
                <button className="bg-green-500  w-full text-white px-4 mb-2 mt-4 py-2 rounded-md" onClick={() => setShowCouponOverlay(true)}>
                  Apply Coupons
                </button>

                {showCouponOverlay && (
                  <div className="fixed inset-0 flex z-50  items-center justify-center bg-gray-800 bg-opacity-60">
                    {/* <div className="bg-white p-4 rounded-md shadow-lg"> */}
                    <div className="w-1/2 pr-4 h-[500px] overflow-auto">
                      <div className="bg-green-100 p-8 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Select a Coupon</h2>
                        {couponsstatus === "succeeded" && validCoupons.length > 0 ? (validCoupons.map(coupon => {
                          console.log(coupons, couponsstatus)
                          return (
                            <div key={coupon._id} className="mb-4 p-2 bg-white rounded-lg items-center hover:scale-[1.02] transition duration-300">
                              <div className="flex justify-between p-4 bg-white rounded-lg items-center border-2 border-dashed border-gray-500">
                                <div className="flex items-center">
                                  <div className="mr-3 text-blue-500">
                                    <LocalOfferIcon />
                                  </div>
                                  <div>
                                    <p className="text-gray-800 font-medium">{coupon.code} : {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}</p>

                                    <p className="text-gray-600">Expires on {new Date(coupon.expirationDate).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="flex">
                                  <input
                                    type="checkbox"
                                    checked={selectedCoupon === coupon._id}
                                    onChange={() => {
                                      if (!appliedCoupons.some(c => c._id === coupon._id)) {
                                        console.log(`Selected coupon: ${coupon._id}`);
                                        setSelectedCoupon(coupon._id);
                                      }
                                    }}
                                    // disabled={appliedCoupons.some(c => c._id === coupon._id)}
                                    disabled={appliedCoupons.length > 0} // Disable if any coupon is applied
                                    className="mr-2"
                                  />
                                  {/* <div className="mr-3 text-red-300 hover:text-red-500" onClick={(e) => handleDelete(coupon._id,e)}>
                                     <RemoveCircleIcon />
                                 </div> */}
                                </div>

                              </div>
                            </div>
                          )
                        }
                        )
                        ) : (
                          <p className="text-gray-600">No valid coupons available.</p>
                        )}

                        <div className="flex justify-end mt-4">
                          <button
                            className="bg-green-300 text-white px-4 py-2 hover:bg-green-600 rounded-md"
                            onClick={applyCoupon}
                            disabled={!selectedCoupon}
                          >
                            Apply
                          </button>
                          <button className="bg-red-300 text-white px-4 hover:bg-red-600 py-2 rounded-full ml-2" onClick={() => setShowCouponOverlay(false)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={checkOut}
                disabled={items[0].length === 0}
                className={`w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors duration-300  ${items[0].length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
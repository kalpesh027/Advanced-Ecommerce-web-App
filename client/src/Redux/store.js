import { configureStore } from '@reduxjs/toolkit';
import userReducer from './User/userSlice';
import categoriesReducer from './Category/categoriesSlice';
import productReducer from './Product/productSlice';
import cartReducer from './Cart/cartSlice';  // Import the cart reducer
import advertisementReducer from './Advertisements/advertisementSlice';
import couponReducer from './Coupons/couponSlice';
import orderReducer from './Order/orderSlice';
import reviewsReducer  from './reviews/reviewsSlice';
import addressReducer from './address/AddressSlice';
import wishlistslice from './Wishlist/wishlistslice';
import TimelocationSlice from './Time_location/TimelocationSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    categories: categoriesReducer,
    cart: cartReducer,  // Add cart reducer
    advertisements: advertisementReducer,
    coupons : couponReducer,
    orders: orderReducer,
    reviews: reviewsReducer,
    addresses: addressReducer,
    wishlist: wishlistslice,
    TimeLocation:TimelocationSlice
  },
});

export default store;

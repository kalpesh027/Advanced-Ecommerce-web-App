import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";
import { toast } from "react-toastify";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/cart/getCartDetails");
      const items = [response.data.data.cartItems, response.data.data];
      return items;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          return rejectWithValue({ isForbidden: true });
        }
        if (error.response.status === 401) {
          return rejectWithValue({ isUnauthorized: true });
        }
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/cart/addCart", { productId });
      console.log("Product kya hain", response);
      if (response.data.success) {
        toast.success("Product added to cart");
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue({ isUnauthorized: true });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const addQuantity = createAsyncThunk(
  "cart/addQuantity",
  async (productId) => {
    const response = await axiosInstance.post("/cart/addCart", { productId });
    return response.data;
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId) => {
    const response = await axiosInstance.delete(
      `/cart/removeCartItem?itemId=${productId}`
    );
    console.log("removeFromCart slice", response);
    return response.data;
  }
);

export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  await axiosInstance.delete("/cart/removeAllCart");
});

// export const updateCartQuantity = createAsyncThunk(
//   "cart/updateCartQuantity",
//   async ({ productId }) => {
//     const response = await axiosInstance.delete(
//       `/cart/removeCartItemQuantity?itemId=${productId}`
//     );
//     console.log("update quantity slice", response);
//     return response.data;
//   }
// );

export const updateCartPriceSummary = createAsyncThunk(
  "cart/updateCartPriceSummary",
  async (priceSummary) => {
    const response = await axiosInstance.post("/cart/updateCart", {
      priceSummary,
    });
    return response.data;
  }
);



export const updateCartQuantity = createAsyncThunk('cart/updateCartQuantity', async ({ productId }) => {
  const response = await axiosInstance.delete(`/cart/removeCartItemQuantity?itemId=${productId}`);
  console.log("update quantity slice",response)
  return response.data;
});

// Thunk to apply coupon to the cart
export const UpdateCart = createAsyncThunk('cart/UpdateCart', async ({totalDiscountedPrice, discount, couponValue }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put('/cart/updatecart', {
      totalDiscountedPrice,
      discount,
      couponValue
    });

    if (response.data.success) {
      toast.success('Coupon data update successfully');
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return rejectWithValue({ isUnauthorized: true });
    }
    toast.error('Failed to apply coupon');
    return rejectWithValue(error.response?.data || 'An error occurred while applying the coupon');
  }
});

// http://localhost:5454/api/cart/removeCartItem?itemId=66ba0b340162debb99ed42f4


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    // pricesummary: {
    //   totalDiscountedPrice: 0,
    //   discount: 0,
    //   totalActualPrice: 0,
    // },
    status: "idle",
    error: null,
    addToCartStatus: "idle",
    addToCartError: null,
    fetchCartError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.fetchCartError = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.fetchCartError = action.payload;
        state.items[0] = [];
      })
      .addCase(addToCart.pending, (state) => {
        state.addToCartStatus = "loading";
        state.addToCartError = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.addToCartStatus = "succeeded";
        if (state.items[0]) {
          state.items[0].push(action.payload);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addToCartStatus = "failed";
        state.addToCartError = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const { data } = action.payload;
        if (state.items[0]) {
          state.items[0] = state.items[0].filter(
            (item) => item._id !== data._id
          );
          toast.success("Product removed from cart");
        }
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items[0] = [];
        toast.success("Cart cleared");
      })
      .addCase(addQuantity.fulfilled, (state, action) => {
        const { data } = action.payload;
        if (state.items[0]) {
          const existingItem = state.items[0].find(
            (item) => item._id === data._id
          );
          if (existingItem) {
            existingItem.quantity = data.quantity;
          }
        }
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { data } = action.payload;
        if (state.items[0]) {
          const existingItem = state.items[0].find(
            (item) => item._id === data._id
          );
          if (existingItem) {
            existingItem.quantity = data.quantity;
          }
        }
      })
      .addCase(updateCartPriceSummary.fulfilled, (state, action) => {
        const { totalDiscountedPrice, discount, totalActualPrice, id } =action.payload;
        // state.pricesummary = {
        // totalDiscountedPrice,
        // discount,
        // totalActualPrice,
        // };

        if (state.items[1]) {
          const existingItem = state.items[1].find((item) => item._id === id);
          if (existingItem) {
            existingItem.id = id;
            existingItem.totalActualPrice = totalActualPrice;
            existingItem.totalDiscountedPrice = totalDiscountedPrice;
            existingItem.discount = discount;
          }
        }
      });
  },
});

export default cartSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';
import { toast } from 'react-toastify'; // Import toast

// Fetch wishlist
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/wishlist/wishlist');
      return response.data.data.products;
    } catch (error) {
      // toast.error(error.response.data.message); // Display error toast
      return rejectWithValue(error.response.data);
    }
  }
);

// Add product to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/wishlist/wishlist/${productId}`);
      toast.success(response.data.message); // Success toast
      console.log("wishlist",response.products)

      return response.data.data.products;

    } catch (error) {
      toast.error(error.response.data.message); // Error toast
      return rejectWithValue(error.response.data);
    }
  }
);

// Remove product from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/wishlist/wishlist/${productId}`);
      toast.success(response.data.message); // Success toast
      return productId; // Returning productId to update state
    } catch (error) {
      toast.error(error.response.data.message); // Error toast
      return rejectWithValue(error.response.data);
    }
  }
);

// Clear wishlist
export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete('/wishlist/wishlist');
      toast.success(response.data.message); // Success toast
      return response.data.data;
    } catch (error) {
      toast.error(error.response.data.message); // Error toast
      return rejectWithValue(error.response.data);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlist: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wishlist.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wishlist = state.wishlist.filter(product => product._id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Clear wishlist
      .addCase(clearWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.status = 'succeeded';
        state.wishlist = [];
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;

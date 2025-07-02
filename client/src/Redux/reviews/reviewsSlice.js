import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../../axiosConfig';

export const fetchReviews = createAsyncThunk('reviews/fetchReviews', async (productId) => {
  const response = await axios.get(`/api/reviews/${productId}`); // Adjust the URL as needed
  return response.data;
});

export const fetchReviewsforuser = createAsyncThunk('reviews/fetchReviewsforuser', async () => {
  const response = await axiosInstance.get(`/review/getReviewRating`); // Adjust the URL as needed
  return response.data.data;
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchReviewsforuser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsforuser.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsforuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectReviews = (state) => state.reviews.reviews;
export const selectLoading = (state) => state.reviews.loading;
export const selectError = (state) => state.reviews.error;

export default reviewsSlice.reducer;

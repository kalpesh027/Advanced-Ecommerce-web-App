import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';

// Async thunk to create a new payment order
export const createPaymentOrder = createAsyncThunk('payment/createOrder', async (paymentData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/payment/create-order`, paymentData);
    return response.data.order;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk to verify a payment
export const verifyPayment = createAsyncThunk('payment/verifyPayment', async (verificationData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`payment/verify-payment`, verificationData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    order: null,
    verificationStatus: 'idle', // Could be 'pending', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentOrder.pending, (state) => {
        state.verificationStatus = 'pending';
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.verificationStatus = 'succeeded';
        state.order = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.verificationStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.verificationStatus = 'pending';
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verificationStatus = 'succeeded';
        // Handle verification success (e.g., show a success message or update state)
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verificationStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;

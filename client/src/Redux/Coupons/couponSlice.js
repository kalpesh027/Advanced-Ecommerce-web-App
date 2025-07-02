import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';


export const createCoupon = createAsyncThunk('coupons/create', async (couponData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/admin/coupons/create', couponData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


export const fetchCoupons = createAsyncThunk('coupons/view', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/admin/coupons/view');
    // console.log(response.data.data);
    return response.data.data;
    
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteCoupon = createAsyncThunk('coupons/delete', async (couponId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/admin/coupons/delete/${couponId}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateCoupon = createAsyncThunk('coupons/update', async ({ id, couponData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/admin/coupons/update/${id}`, couponData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});



const couponSlice = createSlice({
  name: 'coupons',
  initialState: {
    coupons: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCoupon.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coupons = action.payload;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchCoupons.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteCoupon.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coupons = state.coupons.filter((coupon) => coupon._id !== action.meta.arg);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateCoupon.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.coupons.findIndex((coupon) => coupon._id === action.payload._id);
        state.coupons[index] = action.payload;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
      
  },
});

export default couponSlice.reducer;

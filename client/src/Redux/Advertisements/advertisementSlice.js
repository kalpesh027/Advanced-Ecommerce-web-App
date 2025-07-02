import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';


export const createAdvertisement = createAsyncThunk('advertisement/create', async (advertisementData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/admin/advertisement/create', advertisementData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


export const fetchAdvertisements = createAsyncThunk('advertisement/view', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/admin/advertisement/view');
    // console.log(response.data.data);
    return response.data.data;
    
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteAdvertisement = createAsyncThunk('advertisement/delete', async (advertisementId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/admin/advertisement/delete/${advertisementId}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});



const advertisementSlice = createSlice({
  name: 'advertisements',
  initialState: {
    advertisements: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAdvertisement.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAdvertisement.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.advertisements = action.payload;
      })
      .addCase(createAdvertisement.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAdvertisements.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdvertisements.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.advertisements = action.payload;
      })
      .addCase(fetchAdvertisements.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteAdvertisement.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAdvertisement.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = state.advertisements.filter((advertisement) => advertisement._id !== action.meta.arg);
      })
      .addCase(deleteAdvertisement.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
      
  },
});

export default advertisementSlice.reducer;

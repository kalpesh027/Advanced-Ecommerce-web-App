import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig'; // Reuse the existing axios instance

// Thunk for fetching all addresses
export const fetchAllAddresses = createAsyncThunk('address/fetchAllAddresses', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/address/getAllAddr');
    return response.data.data;  // Assuming the API returns addresses under `data.data`
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Create the address slice
const addressSlice = createSlice({
  name: 'addresses',
  initialState: {
    addresses: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAddresses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses = action.payload;  // Populate the addresses state
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the reducer

export default addressSlice.reducer;

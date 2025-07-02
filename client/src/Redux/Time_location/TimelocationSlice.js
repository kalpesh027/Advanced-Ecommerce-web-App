import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch all time locations
 const fetchAllTimeLocations = createAsyncThunk(
  'timeLocation/fetchAll',
  async () => {
    const response = await axios.get('http://localhost:5454/api/timelocation/alldata');
    console.log("all location = ",response.data.dataz)
    return response.data.data; // Assuming the data is structured like this
  }
);

// Async thunk to add a new time location
 const addTimeLocation = createAsyncThunk( 'timeLocation/add', async (newLocation) => {
    const response = await axios.post('http://localhost:5454/api/timelocation/createaddress', newLocation);
    return response.data.Addressdata; // Assuming the response has this structure
  }
);

// Async thunk to update a time location
 const updateTimeLocation = createAsyncThunk(
  'timeLocation/update',
  async (updatedLocation) => {
    const response = await axios.put('http://localhost:5454/api/timelocation/update', updatedLocation);
    return response.data.data; // Assuming the response has this structure
  }
);

// Async thunk to delete a time location
const deleteTimeLocation = createAsyncThunk(
  'timeLocation/delete',
  async (id) => {
    await axios.delete(`http://localhost:5454/api/timelocation/delete/${id}`);
    return id; // Return the id for easy deletion in the state
  }
);

const timeLocationSlice = createSlice({
  name: 'timeLocation',
  initialState: {
    locations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTimeLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTimeLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchAllTimeLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTimeLocation.fulfilled, (state, action) => {
        state.locations.push(action.payload);
      })
      .addCase(updateTimeLocation.fulfilled, (state, action) => {
        const index = state.locations.findIndex(location => location._id === action.payload._id);
        if (index !== -1) {
          state.locations[index] = action.payload;
        }
      })
      .addCase(deleteTimeLocation.fulfilled, (state, action) => {
        state.locations = state.locations.filter(location => location._id !== action.payload);
      });
  },
});

// Export the async thunks for use in components
export { fetchAllTimeLocations, addTimeLocation, updateTimeLocation, deleteTimeLocation };

// Export the reducer
export default timeLocationSlice.reducer;

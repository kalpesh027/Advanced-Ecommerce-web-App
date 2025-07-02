import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';

// Async thunks for user operations

// Fetch a user by ID
export const fetchUserById = createAsyncThunk('user/fetchUserById', async (id, { rejectWithValue }) => {
  try {
    console.log(id)
     const response = await axiosInstance.get(`/user/view/${id}`);
    
    return response.data.data; // Assuming the user data is under `data`
  } catch (error) { 
    return rejectWithValue(error.response.data);
  }
});

// Sign out a user
export const signoutUser = createAsyncThunk('user/signoutUser', async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.delete('/auth/signout');
    localStorage.removeItem("authToken");
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Fetch all users
export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/user/view');
    console.log("redux response", response.data.data)
    return response.data.data; // Assuming the users data is under `data`
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Update a user by ID
export const updateUser = createAsyncThunk('user/updateUser', async ({ id, userData }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/user/update/${id}`, userData);
    console.log(userData)
    return response.data.data; // Assuming the updated user data is under `data`
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Delete a user by ID
export const deleteUser = createAsyncThunk('user/deleteUser', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/user/delete/${id}`);
    return id; // Return the ID of the deleted user for filtering in the slice
    console.log("deleted user", response)
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [], // For storing all users
    currentUser: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        state.currentUser = null;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the currentUser and also the users list if necessary
        if (state.currentUser && state.currentUser._id === action.payload._id) {
          state.currentUser = action.payload;
        }
        state.users = state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter(user => user._id !== action.payload);
        if (state.currentUser?._id === action.payload) {
          state.currentUser = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(signoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.currentUser = null;
        state.isAuthenticated = false;
      })
      .addCase(signoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export the actions to use them in your components
export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

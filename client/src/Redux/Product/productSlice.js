import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';

// Create a product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/admin/product/create', productData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/product/view');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/admin/product/delete/${productId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update a product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/product/update/${id}`, productData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch a single product by ID
export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin/product/view/${productId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch suggested products by category ID
export const fetchSuggestedProducts = createAsyncThunk(
  'category/fetchSuggestedProducts',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/category/suggested?CategoriesId=${categoryId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    productDetails: {},
    similarProducts: [],
    suggestedProducts: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestedProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSuggestedProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('Suggested Products fetched:', action.payload); // Debugging log
        state.suggestedProducts = action.payload;
      })
      .addCase(fetchSuggestedProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error('Failed to fetch suggested products:', action.payload); // Debugging log
      })
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = state.products.filter(
          (product) => product._id !== action.meta.arg
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productDetails = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '../../axiosConfig';

// export const suggestProduct = createAsyncThunk(
//   'products/suggestProduct',
//   async (CategoriesId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/admin/product/similar?CategoriesId=${CategoriesId}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
// export const createProduct = createAsyncThunk('products/createProduct', async (productData, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.post('/admin/product/create', productData);
//     return response.data.data;
//   } catch (error) {
//     return rejectWithValue(error.response.data);
//   }
// });


// export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get('/admin/product/view');
//     // console.log(response.data.data);
//     return response.data.data;
    
//   } catch (error) {
//     return rejectWithValue(error.response.data);
//   }
// });

// export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.delete(`/admin/product/delete/${productId}`);
//     return response.data.data;
//   } catch (error) {
//     return rejectWithValue(error.response.data);
//   }
// });

// export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, productData }, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.put(`/admin/product/update/${id}`, productData);
//     return response.data.data;
//   } catch (error) {
//     return rejectWithValue(error.response.data);
//   }
// });

// export const fetchProduct = createAsyncThunk('products/fetchProduct', async (productId, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get(`/admin/product/view/${productId}`);
//     return response.data.data;
//   } catch (error) {
//     return rejectWithValue(error.response.data);
//   }
// });

// const productSlice = createSlice({
//   name: 'products',
//   initialState: {
//     products: [],
//     productDetails: {},
//     similarProducts: [],
//     status: 'idle',
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(createProduct.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(createProduct.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.products.push(action.payload);
//       })
//       .addCase(createProduct.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       })
//       .addCase(fetchProducts.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.products = action.payload;
//       })
//       .addCase(fetchProducts.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       })
//       .addCase(deleteProduct.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(deleteProduct.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.products = state.products.filter((product) => product._id !== action.meta.arg);
//       })
//       .addCase(deleteProduct.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       })
//       .addCase(updateProduct.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(updateProduct.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const index = state.products.findIndex((product) => product._id === action.payload._id);
//         state.products[index] = action.payload;
//       })
//       .addCase(updateProduct.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       })
//       .addCase(fetchProduct.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchProduct.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.productDetails = action.payload;
//       })
//       .addCase(fetchProduct.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       })
//       .addCase(suggestProduct.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(suggestProduct.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.similarProducts = action.payload;
//       })
//       .addCase(suggestProduct.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       });
//   },
// });

// export default productSlice.reducer;
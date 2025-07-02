// client/src/redux/reducers/productReducer.js

const initialState = {
    suggestedProducts: [],
  };
  
  export const productReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_SUGGESTED_PRODUCTS_SUCCESS':
        return { ...state, suggestedProducts: action.payload };
      case 'FETCH_SUGGESTED_PRODUCTS_FAIL':
        return { ...state, error: action.payload };
      default:
        return state;
    }
  };
  
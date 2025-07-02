import React from 'react'

function cartReducer(state, action) {
    if (action.type === "ADD") {
        let {product} = action.payload;
      //  console.log(action.payload)
      const newprod={
        id:product.id ||product._id,
        image:product.image||product.imageUrl,
        mrp:product.mrp||product.price,
        name:product.name||product.title,
        price:product.discountedPrice||product.price,
        qty:1,
        discount:product.discount||product.discountPercent,
        weight:product.weight
      }

        // Ensure state is an array
        if (!Array.isArray(state)) {
            state = [];
        }
        console.log(newprod)
        // Avoid direct mutation of the state
        const newState = [...state,newprod];

        // Store the updated state in local storage
        localStorage.setItem('cart', JSON.stringify(newState));

        return newState;
    }

    return state;
}

export default cartReducer;

// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case 'ADD':
//       return [...state, action.payload.product];
//     // Add other cases as needed
//     default:
//       return state;
//   }
// };

// export default cartReducer;
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },

    cartItems: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "cartItems",

        required: true,  
    }],  
 


    totalPrice: {
        type: Number,
        required: true,
        default:0
    },

    totalItem:{
        type: Number,
        required: true,
        default:0 
    },

    totalDiscountedPrice:{
        type: Number,
        required: true,
        default:0 
    },

    discount:{
        type: Number,
        required: true,
        default:0 
    },

    couponPrice: {
        type: Number,
        required: true,
        default: 0,
    },

})

const Cart = mongoose.model("cart", cartSchema);

export default Cart;

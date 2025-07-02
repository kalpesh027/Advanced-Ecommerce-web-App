import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        // required: true,
    },
    orderItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"orderItems",
    }],
    orderDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    delivaryDate: {
        type: Date,
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
    paymentDetails: {
        paymentMethod: {
            type: String,
            required: true,
        },
        razorpay_order_id: {
            type: String,
        },
        razorpay_payment_id: {
            type: String,
        },
        razorpay_signature: {
            type: String,
        },
        transactionId: {
            type: String,
        },
        paymentId: {
            type: String,
        },
        paymentStatus: {
            type: String,
            default: "PENDING",
        },
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    totalDiscountedPrice: {
        type: Number,
        required: true,
    },
    GST:{
     type:Number,
     required:true,
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
   orderStatus: {
        type: String,
        required: true,
        default: "ORDERED"
    },
    coupenDiscount:{
        type:Number,
        default:0,
    },
    totalItem: {
        type: Number,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model("orders", orderSchema);

export default Order;

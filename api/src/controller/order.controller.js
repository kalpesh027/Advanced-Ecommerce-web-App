import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import OrderItem from "../models/orderItems.js";
import CartItem from "../models/cartItem.model.js";
import Product from "../models/product.model.js";
import { handleAllTotalOnlineSales, TotalAllupdateSalesData } from "./sale.controller.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";

const placeOrder = asyncHandler(async (req, res) => {
  const { id } = req.user;

  // Fetch the user's cart and populate cartItems
  const cart = await Cart.findOne({ user: id }).populate("cartItems");

  if (!cart) {
    return res.status(404).json(new ApiResponse(404, "Cart not found", null));
  }

  try {
    const orderItems = [];
    let purchaseRate = 0;

    // Loop through each cartItem and create corresponding orderItems
    for (const cartItem of cart.cartItems) {
      const product = await Product.findById(cartItem.product);

      // Check if enough quantity is available
      if (product.quantity < cartItem.quantity) {
        return res.status(400).json(new ApiResponse(400, "Insufficient product quantity", null));
      }

      const orderItem = new OrderItem({
        product: cartItem.product,
        quantity: cartItem.quantity,
        price: cartItem.price,
        discountedPrice: cartItem.discountedPrice,
        userId: id,
      });
      await orderItem.save();
      orderItems.push(orderItem._id);
      purchaseRate += product.purchaseRate;

      // Decrease the product quantity
      product.quantity -= cartItem.quantity;
      await product.save();

    }

    // Create the order
    const order = new Order({
      user: id,
      orderItems: orderItems,
      totalPrice: cart.totalPrice,
      totalDiscountedPrice: cart.totalDiscountedPrice,
      totalItem: cart.totalItem,
      discount: cart.discount,
      couponPrice: cart.couponPrice,
      GST: 0,
      shippingAddress: req.body.shippingAddress,
      paymentDetails: req.body.paymentDetails,
    });

    const OrderSale = {
      totalPrice: cart.totalPrice,
      totalDiscountedPrice: cart.totalDiscountedPrice,
      GST: 0,
      discount: cart.discount,
      totalItem: cart.totalItem,
      totalPurchaseRate: purchaseRate,
      totalProfit: cart.totalDiscountedPrice - purchaseRate,
      finalPriceWithGST: cart.totalDiscountedPrice,
    };

    await order.save();
    await handleAllTotalOnlineSales(OrderSale);

    // Delete cartItems after the order is placed
    await CartItem.deleteMany({
      _id: { $in: cart.cartItems.map((item) => item._id) },
    });

    // Delete the cart after placing the order
    await Cart.findByIdAndDelete(cart._id);

    return res
      .status(200)
      .json(new ApiResponse(200, "Order placed successfully", order));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Error placing order", error.message));
  }
});


const getAllOrders = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const orders = await Order.find({ user: id }).populate({
      path: "orderItems",
      populate: {
        path: "product",
        model: "products",
      },
    });

    if (!orders) {
      return res
        .status(404)
        .json(new ApiResponse(404, "No orders found", null));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Orders fetched successfully", orders));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Error fetching orders", error.message));
  }
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId).populate({
    path: "orderItems",
    populate: {
        path: "product",
        model: "products",
    },
}); // Populate to access product data within orderItems

  if (!order) {
    return res.status(404).json(new ApiResponse(404, "Order not found", null));
  }

  if (order.orderStatus === "CANCELLED") {
    return res
      .status(400)
      .json(new ApiResponse(400, "Order is already cancelled", null));
  }

  // Fields to reset in the order
  const cancelFields = {
    totalPrice: 0,
    totalDiscountedPrice: 0,
    GST: 0,
    discount: 0,
    couponPrice: 0,
    totalItem: 0,
    totalPurchaseRate: 0,
    totalProfit: 0,
    finalPriceWithGST: 0,
  };

  // Sales update object
  const OrderSale = {
    totalPrice: order.totalPrice,
    totalDiscountedPrice: order.totalDiscountedPrice,
    GST: order.GST,
    discount: order.discount,
    couponPrice: order.couponPrice,
    totalItem: order.totalItem,
    totalPurchaseRate: order.totalPurchaseRate || 0,
    totalProfit: order.totalProfit,
    finalPriceWithGST: order.finalPriceWithGST,
  };

  await TotalAllupdateSalesData(OrderSale, cancelFields);

  // Reset order financial fields
  Object.assign(order, cancelFields);

  // Loop through each orderItem and update product quantity
  for (const item of order.orderItems) {

    console.log("product",item)
    const product = await Product.findById(item.product._id); // Access product ID in orderItems

    if (product) {
      product.quantity = product.quantity + item.quantity; // Restore canceled quantity
      await product.save();
    }
  }

  order.orderStatus = "CANCELLED";
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Order cancelled successfully", order));
});

// Get All Orders for Admin
const getAllOrdersAdmin = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          model: "products", // Ensure this matches your Product model name
        },
      })
      .populate("user");

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, "No orders found", null));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Orders fetched successfully", orders));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, "Error fetching orders", error.message));
  }
});

// Admin Manual Order Status Update
const updateOrderStatusAdmin = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body; 

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json(new ApiResponse(404, "Order not found", null));
  }

  const validStatuses = ["ORDERED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json(new ApiResponse(400, "Invalid status", null));
  }

  order.orderStatus = status;
  order.updatedAt = new Date();

  if (status === "DELIVERED") {
    order.delivaryDate = new Date();
  }

  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Order status updated successfully", order));
});


const statusTransitions = {
  "ORDERED": "PACKED",
  "PACKED": "SHIPPED",
};

// Background auto-update status function
const autoUpdateOrderStatus = async () => {
  const orders = await Order.find({ orderStatus: { $in: Object.keys(statusTransitions) } }); 

  for (const order of orders) {
    const currentTime = new Date();
    const orderUpdateTime = new Date(order.updatedAt);
    const timeDifference = (currentTime - orderUpdateTime) / (1000 * 60 * 60); 

    // If 24 hours have passed since the last status update, change status
    if (timeDifference >= 2) {
      const nextStatus = statusTransitions[order.orderStatus];
      if (nextStatus) {
        order.orderStatus = nextStatus;
        if (nextStatus === "DELIVERED") {
          order.delivaryDate = new Date();
        }
        await order.save();
      }
    }
  }
};

setInterval(autoUpdateOrderStatus, 1000 * 60 * 60); 


// Update order details: address (by ID) and payment method
const UpdateOrderAdmin = async (req, res) => {
  const { id } = req.params;
  const { shippingAddress, paymentDetails } = req.body;
console.log("order id",id)
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update shipping address (using the address ID)
    if (shippingAddress) {
      order.shippingAddress = shippingAddress; // Save address ID
    }

    // Update payment method and status
    if (paymentDetails && paymentDetails.paymentMethod) {
      order.paymentDetails.paymentMethod = paymentDetails.paymentMethod;
      if (paymentDetails.paymentMethod === 'Online') {
        order.paymentDetails.paymentStatus = 'Paid'; // Mark as paid for online payments
      } else {
        order.paymentDetails.paymentStatus = 'Pending'; // COD payments remain pending
      }
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);

    console.log("Update order",updatedOrder)
  } catch (error) {
    console.log('Error updating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export { cancelOrder, placeOrder, getAllOrders, getAllOrdersAdmin,  updateOrderStatusAdmin, autoUpdateOrderStatus , UpdateOrderAdmin};
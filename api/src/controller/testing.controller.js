
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import CartItem from "../models/cartItem.model.js";
import TotalOnlineSales from "../models/total.online.sales.js";


// Verify OTP and create user
export const testingRegisterUser = async (req, res) => {

      try{ 
        await Order.collection.drop();
        await Cart.collection.drop();
        await CartItem.collection.drop();
        await TotalOnlineSales.collection.drop();
         await  Product.collection.drop();
         await Category.collection.drop();
         
    

        return  res
        .status(201)
        .json({ message: 'User created successfully', status: true });

    } 
    
    catch (error) {
        console.error(error);
        return res
        .status(500)
        .json({ message: 'Internal server error', status: false });
    }
}
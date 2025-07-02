import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Wishlist from "../models/wishlist.model.js";


// GET /wishlist
const getWishlist =
asyncHandler( async (req, res) => {
    const userId = req.user.id;
  
    try {
      const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
  
      if (!wishlist) {
        return res.status(404).json(new ApiResponse(404, 'Wishlist not found', null));
      }
  
      res.status(200).json(new ApiResponse(200, 'Product added to wishlist successfully',wishlist ))();
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });



// POST /wishlist/:productId
const addToWishlist = 
asyncHandler(
    async (req, res) => {
        const { productId } = req.params;

        // console.log(req.user)
        const userId = req.user.id; // Assuming you're using authentication middleware
      
        try {
          let wishlist = await Wishlist.findOne({ user: userId });
      
          if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [productId] });
          } else {
            if (!wishlist.products.includes(productId)) {
              wishlist.products.push(productId);
            } else {
              return res.status(200).json(new ApiResponse(200, 'Product already in wishlist' , null));
            }
          }
      
          await wishlist.save();
          res.status(200).json(new ApiResponse(200, 'Product added to wishlist',wishlist ));
        } catch (error) {
          res.status(500).json({success: false, error: error.message });
        }
      }
)


  

// DELETE /wishlist/:productId
const removeFromWishlist = 
asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;
  
    try {
      const wishlist = await Wishlist.findOne({ user: userId });
      
      if (!wishlist) {
        return res.status(404).json(new ApiResponse(404, 'Wishlist not found' , null));
      }
  
      wishlist.products = wishlist.products.filter(item => item.toString() !== productId);
  
      await wishlist.save();
      res.status(200).json( new ApiResponse(200, 'Product removed from wishlist',wishlist ));
    } catch (error) {
      res.status(500).json({ success: false,error: error.message });
    }
  });



  // DELETE /wishlist
const clearWishlist = asyncHandler(async (req, res) => {
    const userId = req.user.id;
  
    try {
      const wishlist = await Wishlist.findOne({ user: userId });
  
      if (!wishlist) {
        return res.status(404).json(new ApiResponse(404, 'Wishlist not found' , null));
      }
  
      wishlist.products = [];
      await wishlist.save();
  
      res.status(200).json(new ApiResponse(200,'Wishlist cleared', wishlist ));
    } catch (error) {
      res.status(500).json({success: false, error: error.message });
    }
  });
  

  export {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
}
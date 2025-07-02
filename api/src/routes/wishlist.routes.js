import express from 'express';
import authenticate from "../middleware/authenticat.js";
import { addToWishlist,removeFromWishlist,getWishlist,clearWishlist } from '../controller/wishlist.controller.js';
import { verifyToken } from '../middleware/verifyUser.js';
const router = express.Router();

router.post('/wishlist/:productId', verifyToken, addToWishlist);
router.delete('/wishlist/:productId', verifyToken, removeFromWishlist);
router.get('/wishlist', verifyToken, getWishlist);
router.delete('/wishlist', verifyToken, clearWishlist);

export default router;
 
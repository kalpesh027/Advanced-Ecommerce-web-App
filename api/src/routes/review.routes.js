import express from "express";
import authenticate from "../middleware/authenticat.js";

const router = express.Router();
import {createview,getAllview, getUserRatingsAndReviews} from "../controller/review.controller.js";
import { verifyToken } from "../middleware/verifyUser.js";

router.post("/create",authenticate,createview);
router.get("/product/:productId",authenticate,getAllview);
router.get("/getReviewRating", verifyToken, getUserRatingsAndReviews);

export default router;
import {
  createReview,
  getAllReview, 
} from '../services/review.service.js';

import Review from "../models/review.model.js";  
import Rating from "../models/rating.model.js";  

const createview = async (req, res) => { 
  const user = req.user
  const reqBody = req.body;
  
 // console.log(`product id ${reqBody.productId} - ${reqBody.review}`);

  try {
    
    const review =await createReview(reqBody, user);
        
    return res.status(201).send(review);
  } catch (error) {
    console.log("error --- ", error.message)
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getAllview = async (req, res) => {
  const productId = req.params.productId;
  console.log("product id ",productId)
  try {
   
    const reviews =await getAllReview(productId);
    return res.status(200).send(reviews);
  } catch (error) {
    console.log("error --- ", error.message)
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Controller to get reviews and ratings for a user
const getUserRatingsAndReviews = async (req, res) => {
  try {
    const {id} = req.user;  
    
    const userReviews = await Review.find({ user: id })
      .populate({
        path: "product",  
        select: "title imageUrl", 
      })
      .exec();
    

    res.status(200).json({
      success: true,
      message: "User's reviews and ratings fetched successfully",
      data: {
        reviews: userReviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user's reviews and ratings",
      error: error.message,
    });
  }
};

export {createview,getAllview,getUserRatingsAndReviews}

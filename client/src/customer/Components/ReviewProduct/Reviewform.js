import React, { useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../../axiosConfig';

const sharedClasses = {
  cardContainer: 'h-[100vh] bg-gray-200 bg-card text-card-foreground',
  flexContainer: 'bg-white w-[100%] p-3 mb-3 flex justify-between items-center',
  image: 'w-12 h-12 mr-2',
  inlineBlock: 'bg-primary text-primary-foreground px-2 py-1 rounded inline-block',
  reviewContainer: 'p-5 mr-3 h-[60vh] bg-white w-[30%] p-4 bg-muted text-muted-foreground rounded',
  ratingContainer: 'h-[86.6vh] p-5 bg-white w-2/3 pl-4',
  starRating: 'flex space-x-1 text-yellow-500',
  submitButton: 'bg-accent bg-blue-500 hover:bg-blue-600 text-accent-foreground px-6 py-2 rounded hover:bg-accent/80',
};

const RatingsAndReviews = () => {
const navigate = useNavigate();
  const { id } = useParams();
  const [rating, setRating] = useState(4);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const token = localStorage.getItem('authToken');
  const handleSubmit = async () => {
    if (!description) {
        setError("Description cannot be empty");
        return;
    }
    setError(null);

    const review = {
        productId:id,
        review: description,
        rating: rating,
    };

    try {
        const resp = await Promise.all([
          
          axiosInstance.post('/review/create', review, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          })
        ]);
console.log(resp)
        if(resp[0].status==201){
          navigate(`/product/${id}`)
        }
  
    } catch (error) {
        console.error('Error in creation:', error);
    }
};
  return (
    <div className={sharedClasses.cardContainer}>
      <div className={sharedClasses.flexContainer}>
        <h2 className="text-xl font-semibold">Ratings & Reviews</h2>
        <div className="flex items-center">
          <img src="https://placehold.co/50x50" alt="Casual Shoes For Men Sneakers" className={sharedClasses.image} />
          <div>
            <p className="font-semibold">Casual Shoes For Men Sneakers</p>
            <div className={sharedClasses.inlineBlock}>3.5 ★ (136)</div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className={sharedClasses.reviewContainer}>
          <h3 className="font-semibold mb-2">What makes a good review</h3>
          <div className="mb-4">
            <h4 className="font-semibold">Have you used this product?</h4>
            <p>Your review should be about your experience with the product.</p>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold">Why review a product?</h4>
            <p>Your valuable feedback will help fellow shoppers decide!</p>
          </div>
          <div>
            <h4 className="font-semibold">How to review a product?</h4>
            <p>Your review should include facts. An honest opinion is always appreciated. If you have an issue with the product or service, please contact us from the help centre.</p>
          </div>
        </div>
        <div className={sharedClasses.ratingContainer}>
          <div className="mb-4 h-30">
            <h3 className="font-semibold mb-2">Rate this product</h3>
            <div className="flex items-center">
              <div className={sharedClasses.starRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={star <= rating ? 'text-yellow-500 cursor-pointer' : 'text-zinc-300 cursor-pointer'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="ml-2 font-bold text-green-600">
                {rating === 1 ? "Very Bad" : rating === 2 ? "Bad" : rating === 3 ? "Good" : rating === 4 ? "Very Good" : "Best"}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">Your rating has been saved</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Review this product</h3>
            <div className="mb-2">
              <label htmlFor="description" className="block text-blue-600">Description</label>
              <textarea
                id="description"
                className="w-full p-2 border border-blue-600 rounded"
                placeholder="Description..."
                value={description}
                rows={7}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
          </div>
          <button className={sharedClasses.submitButton} onClick={handleSubmit}>SUBMIT</button>
        </div>
      </div>
    </div>
  );
};

export default RatingsAndReviews;

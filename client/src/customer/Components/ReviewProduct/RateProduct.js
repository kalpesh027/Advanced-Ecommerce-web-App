import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';

const Reviews = React.memo(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem('authToken');
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const handleViewAllClick = () => setShowAll(!showAll);

  const handleRating = useCallback(() => {
    navigate(`/review/${id}`);
  }, [navigate, id]);

  useEffect(() => {
    const getReview = async () => {
      try {
        const resp = await axiosInstance.get(`/review/product/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setReviews(resp.data); // Save response in state
      } catch (error) {
        console.error("no review");
      }
    };
    getReview(); // Call the function to fetch reviews
  }, [id, token]);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 2);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 md:mb-0">Ratings & Reviews</h2>
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded">
            <span className="text-lg font-semibold">4★</span>
          </div>
          <span className="text-sm sm:text-base text-zinc-600">{reviews.length} ratings and reviews</span>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm sm:text-base" onClick={handleRating}>Rate Product</button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <div className="mb-4 lg:mb-0">
          <h3 className="font-semibold mb-2 text-base sm:text-lg">What our customers felt:</h3>
          <div className="flex flex-wrap items-center space-x-2">
            <div className="flex items-center space-x-1 mb-2">
              <span className="text-green-500 text-sm sm:text-base">😊</span>
              <button className="border border-zinc-300 px-2 py-1 rounded text-sm sm:text-base">Look</button>
            </div>
            <button className="border border-zinc-300 px-2 py-1 rounded mb-2 text-sm sm:text-base">Colour</button>
            <button className="border border-zinc-300 px-2 py-1 rounded mb-2 text-sm sm:text-base">Comfort</button>
            <button className="border border-zinc-300 px-2 py-1 rounded mb-2 text-sm sm:text-base">Light Weight</button>
            <div className="flex items-center space-x-1 mb-2">
              <span className="text-yellow-500 text-sm sm:text-base">😐</span>
              <button className="border border-zinc-300 px-2 py-1 rounded text-sm sm:text-base">Material Quality</button>
            </div>
            <button className="border border-zinc-300 px-2 py-1 rounded mb-2 text-sm sm:text-base">True to Specs</button>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-base sm:text-lg">Images uploaded by customers:</h3>
          <div className="flex flex-wrap space-x-2">
            <img
              src="https://placehold.co/50x50"
              alt="Customer image 1"
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded mb-2"
            />
            <img
              src="https://placehold.co/50x50"
              alt="Customer image 2"
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded mb-2"
            />
            <img
              src="https://placehold.co/50x50"
              alt="Customer image 3"
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded mb-2"
            />
            <img
              src="https://placehold.co/50x50"
              alt="Customer image 4"
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded mb-2"
            />
            <img
              src="https://placehold.co/50x50"
              alt="Customer image 5"
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded mb-2"
            />
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-zinc-200 rounded mb-2">
              +6
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review._id} className="border-b pb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`flex items-center text-white px-2 py-1 rounded ${review.rating >= 4 ? 'bg-green-500' : review.rating === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                <span className="text-lg sm:text-xl font-semibold">{review.rating}★</span>
              </div>
              <span className="font-semibold text-sm sm:text-base">{review.review}</span>
            </div>
            <div className="flex flex-wrap space-x-2 mb-2">
              {review.images && review.images.length > 0 && review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded mb-2"
                />
              ))}
            </div>
            <div className="text-zinc-600 mb-2 flex justify-between text-xs sm:text-sm">
              <span>{review.user && review.user.userName}</span>
              <span>Date: {new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button className='text-blue-500 text-sm sm:text-base' onClick={handleViewAllClick}>
          {showAll ? 'Show Less' : 'View All Reviews'}
        </button>
      </div>
    </div>
  );
});

export default Reviews;

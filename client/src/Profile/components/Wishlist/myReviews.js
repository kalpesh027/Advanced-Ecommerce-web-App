import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Star } from "lucide-react";
import { FaComments } from 'react-icons/fa';
import { selectReviews, selectLoading, selectError, fetchReviewsforuser } from '../../../Redux/reviews/reviewsSlice'; // Adjust path as needed

export default function MyReviews() {
  const dispatch = useDispatch();
  const reviewsData = useSelector(selectReviews);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchReviewsforuser());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-600">Error: {error}</div>;

  const reviews = reviewsData && reviewsData.reviews ? reviewsData.reviews : [];

  if (!Array.isArray(reviews)) {
    return <div className="text-center p-6 text-red-600">Error: Invalid reviews data structure</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center p-6">No reviews found.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-4">
        <FaComments className="text-3xl text-gray-800" />
        <span className="ml-3 text-2xl font-bold text-gray-800">
          My Reviews ({reviews.length})
        </span>
      </div>
      <div className="flex flex-col space-y-4">
        {reviews.map((review) => (
          <div 
            key={review._id} 
            className="bg-white rounded-lg shadow-lg p-4 flex items-center w-4/5 mx-auto transform transition-transform duration-300 ease-in-out hover:scale-105"
            style={{ height: '15%', animation: 'fadeIn 0.5s' }}
          >
            <Link to={`/product/${review.product._id}`}>
              <img src={review.product.imageUrl[0]} alt={review.product.title} className="w-16 h-16 object-cover rounded-lg mr-4 shadow-md" />
            </Link>
            <div className="flex-grow">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{review.product.title}</h2>
              <p className="text-sm text-gray-600 mb-1">Review Date: {formatDate(review.createdAt)}</p>
              <div className="flex items-center mb-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium text-gray-600">{review.rating}/5</span>
              </div>
              <p className="text-gray-700 italic">{review.review}</p>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
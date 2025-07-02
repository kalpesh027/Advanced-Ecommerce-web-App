import React, { useState } from 'react';

const StarRating = ({ totalStars = 5 }) => {
  const [rating, setRating] = useState(0);

  const handleClick = (star) => {
    setRating(star);
  };

  return (
    <div style={{ display: 'flex', cursor: 'pointer' }}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            filled={starValue <= rating}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
};

const Star = ({ filled, onClick }) => {
    return (
      <span
        onClick={onClick}
        className={`text-4xl ${filled ? 'text-yellow-400' : 'text-blue-300'}`}
      >
        {filled ? '★' : '☆'}
      </span>
    );
  };

export default StarRating;

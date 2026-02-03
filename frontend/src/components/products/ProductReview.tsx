import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../../types';

interface ProductReviewProps {
  review: Review;
}

const ProductReview: React.FC<ProductReviewProps> = ({ review }) => {
  const date = new Date(review.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Generate stars array based on rating
  const fullStars = Math.floor(review.rating);
  const hasHalfStar = review.rating % 1 >= 0.5;
  
  return (
    <div className="border-b border-line py-4">
      <div className="flex items-center mb-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={16}
              className={`${
                index < fullStars
                  ? 'text-yellow-400 fill-current'
                  : index === fullStars && hasHalfStar
                  ? 'text-yellow-400 fill-current'
                  : 'text-line'
              } mr-1`}
            />
          ))}
        </div>
        <span className="text-muted ml-2 font-medium">{review.rating.toFixed(1)}</span>
      </div>
      
      <div className="flex items-center mb-2">
        <h4 className="font-medium text-text">{review.userName}</h4>
        <span className="mx-2 text-line">•</span>
        <span className="text-muted text-sm">{formattedDate}</span>
      </div>
      
      <p className="text-muted">{review.comment}</p>
    </div>
  );
};

export default ProductReview;

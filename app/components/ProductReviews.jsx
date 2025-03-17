import {useState} from 'react';
import {StarIcon} from '@heroicons/react/24/outline';
import {StarIcon as StarIconSolid} from '@heroicons/react/24/solid';

export function ProductReviews({reviews}) {
  const [hoverRating, setHoverRating] = useState(0);

  // Convert the ratingSnapshot array into our ratings object
  const ratings = {
    5: reviews.ratingSnapshot[4],
    4: reviews.ratingSnapshot[3],
    3: reviews.ratingSnapshot[2],
    2: reviews.ratingSnapshot[1],
    1: reviews.ratingSnapshot[0],
  };

  const totalReviews = Object.values(ratings).reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Rating Snapshot */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Rating Snapshot</h2>
        <p className="text-sm text-gray-600 mb-4">
          Select a row below to filter reviews.
        </p>

        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-2 mb-2">
            <span className="w-16 text-sm">{rating} stars</span>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{width: `${(ratings[rating] / totalReviews) * 100}%`}}
              />
            </div>
            <span className="w-8 text-sm text-right">{ratings[rating]}</span>
          </div>
        ))}
      </div>

      {/* Overall Rating */}
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-4">Overall Rating</h2>
        <div className="text-6xl font-bold mb-2">{reviews.overallRating}</div>
        <div className="flex justify-center items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((rating) => (
            <div key={rating}>
              {rating <= Math.round(reviews.overallRating) ? (
                <StarIconSolid className="w-4 h-4 text-red-500" />
              ) : (
                <StarIcon className="w-4 h-4 text-gray-300" />
              )}
            </div>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {totalReviews} Reviews
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {reviews.percentageRecommend}% of reviewers recommend this product
        </p>
      </div>

      {/* Review this Product */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Review this Product</h2>
        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onMouseEnter={() => setHoverRating(rating)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1"
            >
              {rating <= hoverRating ? (
                <StarIconSolid className="w-8 h-8 text-red-500" />
              ) : (
                <StarIcon className="w-8 h-8 text-gray-300" />
              )}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center">
          Adding a review will require a valid email for verification
        </p>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ReviewForm from './ReviewForm';

export default function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    try {
      // Backend defines GET route as /api/reviews/product/:productId
      const response = await api.get(`/reviews/product/${productId}`);
      setReviews(response.data);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleNewReview = (review) => {
    setReviews(prevReviews => [review, ...prevReviews]);
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="reviews-section">
      <ReviewForm productId={productId} onReviewAdded={handleNewReview} />
      
      <div className="reviews-list">
        <h3>Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${i < review.rating ? 'active' : ''}`}
                    />
                  ))}
                </div>
                <h4>{review.title}</h4>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
              <div className="review-author">
                By {review.user.name || 'Anonymous'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
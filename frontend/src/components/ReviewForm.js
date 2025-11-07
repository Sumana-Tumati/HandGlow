import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to submit a review');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const review = await api.post(`/reviews/${productId}`, {
        rating,
        title,
        comment
      });
      
      // Clear form
      setRating(5);
      setTitle('');
      setComment('');
      
      // Notify parent component
      if (onReviewAdded) onReviewAdded(review.data);
      
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Write a Review</h3>
      {error && <div className="error-message">{error}</div>}
      
      <div className="rating-input">
        {[5,4,3,2,1].map(star => (
          <button
            key={star}
            type="button"
            className={`star-btn ${rating >= star ? 'active' : ''}`}
            onClick={() => setRating(star)}
          >
            <i className="fas fa-star"></i>
          </button>
        ))}
      </div>
      
      <input
        type="text"
        placeholder="Review Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      
      <textarea
        placeholder="Your review"
        value={comment}
        onChange={e => setComment(e.target.value)}
        rows={4}
        required
      />
      
      <button type="submit" className="btn" disabled={loading}>
        {loading ? (
          <><i className="fas fa-spinner fa-spin"></i> Submitting...</>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
}
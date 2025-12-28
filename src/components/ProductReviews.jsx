import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const ProductReviews = ({ productId }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, 'reviews'), where('productId', '==', productId));
      const querySnapshot = await getDocs(q);
      const reviewsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please log in to leave a review', 'info');
      return;
    }

    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        rating,
        comment,
        createdAt: serverTimestamp(),
      });
      showToast('Review submitted!', 'success');
      setComment('');
      setRating(5);
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      showToast('Error submitting review', 'error');
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-12 mt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-light mb-2">
            Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= averageRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
        {currentUser && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-light"
          >
            Write Review
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 border border-gray-200 dark:border-gray-800">
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-light mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <svg
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-light mb-2">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="border border-black dark:border-white text-black dark:text-white px-6 py-2 text-xs uppercase tracking-widest font-light hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setComment('');
                setRating(5);
              }}
              className="border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-6 py-2 text-xs uppercase tracking-widest font-light hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 dark:border-gray-800 pb-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {review.userName}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-3 h-3 ${
                          star <= review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                {review.createdAt && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt.seconds * 1000).toLocaleDateString()}
                  </span>
                )}
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 dark:text-gray-300 font-light mt-2">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;


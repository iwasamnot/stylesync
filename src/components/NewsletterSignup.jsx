import { useState } from 'react';
import { useToast } from '../context/ToastContext';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      showToast('Thank you for subscribing!', 'success');
      setEmail('');
    }
  };

  return (
    <div className="border-t border-b border-gray-200 dark:border-gray-800 py-12 my-16">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-light mb-4">
          Newsletter
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 font-light">
          Subscribe to receive updates on new arrivals and special offers.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 border-b border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="border border-black dark:border-white text-black dark:text-white px-6 py-2 text-xs uppercase tracking-widest font-light hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSignup;


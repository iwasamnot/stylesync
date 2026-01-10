import { useState } from 'react';

const SocialShare = ({ product }) => {
  const [showShare, setShowShare] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/product/${product?.id}` : '';
  const text = `Check out ${product?.name} on StyleSync`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
    email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
  };

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    setShowShare(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowShare(!showShare)}
        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.935-2.186 2.25 2.25 0 00-3.935 2.186z" />
        </svg>
      </button>
      {showShare && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg p-2 z-10">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleShare('facebook')}
              className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-left"
            >
              Facebook
            </button>
            <button
              type="button"
              onClick={() => handleShare('twitter')}
              className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-left"
            >
              Twitter
            </button>
            <button
              type="button"
              onClick={() => handleShare('pinterest')}
              className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-left"
            >
              Pinterest
            </button>
            <button
              type="button"
              onClick={() => handleShare('email')}
              className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-left"
            >
              Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialShare;


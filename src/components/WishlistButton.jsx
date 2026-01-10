import { useWishlist } from '../context/WishlistContext';

const WishlistButton = ({ product, className = '' }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product?.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      className={`p-2 transition-all duration-200 ${
        inWishlist
          ? 'text-gray-900'
          : 'text-gray-400 hover:text-gray-600'
      } ${className}`}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        className="w-4 h-4"
        fill={inWishlist ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
};

export default WishlistButton;


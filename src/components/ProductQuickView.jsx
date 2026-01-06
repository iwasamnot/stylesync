import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import WishlistButton from './WishlistButton';
import { calculateDiscount } from '../utils/helpers';

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');

  if (!isOpen || !product) return null;

  const discount = product.onSale && product.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price) 
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({ ...product, selectedSize, quantity: 1 });
    }
    showToast(`${quantity} x ${product.name} added to cart!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="relative">
            <img
              src={product.image || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="w-full h-auto"
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute top-4 left-4">
              <WishlistButton product={product} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-2">{product.name}</h2>
            <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">{product.category}</p>
            
            <div className="mb-6">
              {product.onSale && product.originalPrice ? (
                <div>
                  <p className="text-xl font-light text-gray-900 dark:text-white">
                    ${product.price?.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="text-xl font-light text-gray-900 dark:text-white">
                  ${product.price?.toFixed(2)}
                </p>
              )}
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white"
                >
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border border-gray-300 dark:border-gray-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  -
                </button>
                <span className="text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="border border-gray-300 dark:border-gray-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full border border-black dark:border-white text-black dark:text-white px-6 py-3 text-xs uppercase tracking-widest font-light hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;


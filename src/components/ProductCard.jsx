import { useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateDiscount } from '../utils/helpers';
import WishlistButton from './WishlistButton';
import ProductQuickView from './ProductQuickView';

const ProductCard = ({ product }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const inStock = (product?.stock || 0) > 0;
  const discount = product?.onSale && product?.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price) 
    : 0;

  return (
    <>
      <div className="group">
        <div className="bg-white dark:bg-gray-900 overflow-hidden">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
            <Link to={`/product/${product?.id || '1'}`}>
              <img
                src={product?.image || 'https://via.placeholder.com/300'}
                alt={product?.name || 'Product'}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
              />
            </Link>
            <div className="absolute top-4 left-4">
              {product?.onSale && discount > 0 && (
                <span className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-xs font-medium tracking-wide uppercase">
                  {discount}% OFF
                </span>
              )}
              {product?.newArrival && !product?.onSale && (
                <span className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-xs font-medium tracking-wide uppercase">
                  NEW
                </span>
              )}
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <WishlistButton product={product} />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowQuickView(true);
                }}
                className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Quick view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            {!inStock && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center">
                <span className="text-sm font-medium tracking-wide uppercase text-gray-600 dark:text-gray-400">Out of Stock</span>
              </div>
            )}
          </div>
          <div className="pt-4">
            {product?.category && (
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 font-light">
                {product.category}
              </p>
            )}
            <Link to={`/product/${product?.id || '1'}`}>
              <h3 className="text-sm font-light text-gray-900 dark:text-white mb-2 tracking-wide hover:underline">
                {product?.name || 'Product Name'}
              </h3>
            </Link>
            <div className="flex items-baseline justify-between">
              <div>
                {product?.onSale && product?.originalPrice ? (
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${product?.price?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ${product?.price?.toFixed(2) || '0.00'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductQuickView 
        product={product} 
        isOpen={showQuickView} 
        onClose={() => setShowQuickView(false)} 
      />
    </>
  );
};

export default ProductCard;


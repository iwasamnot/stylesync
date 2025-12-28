import { Link } from 'react-router-dom';
import { calculateDiscount } from '../utils/helpers';
import WishlistButton from './WishlistButton';

const ProductCard = ({ product }) => {
  const inStock = (product?.stock || 0) > 0;
  const discount = product?.onSale && product?.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price) 
    : 0;

  return (
    <div className="group relative">
      <Link to={`/product/${product?.id || '1'}`} className="block">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="aspect-square bg-gray-200 overflow-hidden relative">
            <img
              src={product?.image || 'https://via.placeholder.com/300'}
              alt={product?.name || 'Product'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product?.onSale && discount > 0 && (
                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold shadow-lg animate-pulse">
                  -{discount}% OFF
                </div>
              )}
              {product?.trending && !product?.onSale && (
                <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg">
                  🔥 TRENDING
                </div>
              )}
              {product?.newArrival && !product?.onSale && !product?.trending && (
                <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg">
                  ✨ NEW
                </div>
              )}
            </div>
            <div className="absolute top-2 right-2">
              <WishlistButton product={product} />
            </div>
            {!inStock && (
              <div className="absolute bottom-2 left-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg text-center">
                Out of Stock
              </div>
            )}
          </div>
        <div className="p-4">
          {product?.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {product.category}
            </p>
          )}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product?.name || 'Product Name'}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              {product?.onSale && product?.originalPrice ? (
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-red-600">
                      ${product?.price?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="text-xl font-bold text-indigo-600">
                  ${product?.price?.toFixed(2) || '0.00'}
                </p>
              )}
            </div>
            {product?.brand && (
              <p className="text-xs text-gray-400">{product.brand}</p>
            )}
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
};

export default ProductCard;


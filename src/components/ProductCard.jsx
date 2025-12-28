import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const inStock = (product?.stock || 0) > 0;

  return (
    <Link to={`/product/${product?.id || '1'}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-gray-200 overflow-hidden relative">
          <img
            src={product?.image || 'https://via.placeholder.com/300'}
            alt={product?.name || 'Product'}
            className="w-full h-full object-cover"
          />
          {product?.onSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              SALE
            </div>
          )}
          {product?.trending && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
              TRENDING
            </div>
          )}
          {product?.newArrival && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
              NEW
            </div>
          )}
          {!inStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {product?.name || 'Product Name'}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              {product?.onSale && product?.originalPrice ? (
                <div>
                  <p className="text-xl font-bold text-red-600">
                    ${product?.price?.toFixed(2) || '0.00'}
                  </p>
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
  );
};

export default ProductCard;


import { Link } from 'react-router-dom';
import { calculateDiscount } from '../utils/helpers';
import WishlistButton from './WishlistButton';

const ProductCard = ({ product }) => {
  const inStock = (product?.stock || 0) > 0;
  const discount = product?.onSale && product?.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price) 
    : 0;

  return (
    <div className="group">
      <Link to={`/product/${product?.id || '1'}`} className="block">
        <div className="bg-white overflow-hidden">
          <div className="aspect-square bg-gray-100 overflow-hidden relative">
            <img
              src={product?.image || 'https://via.placeholder.com/300'}
              alt={product?.name || 'Product'}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
            />
            <div className="absolute top-4 left-4">
              {product?.onSale && discount > 0 && (
                <span className="bg-black text-white px-3 py-1 text-xs font-medium tracking-wide uppercase">
                  {discount}% OFF
                </span>
              )}
              {product?.newArrival && !product?.onSale && (
                <span className="bg-black text-white px-3 py-1 text-xs font-medium tracking-wide uppercase">
                  NEW
                </span>
              )}
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <WishlistButton product={product} />
            </div>
            {!inStock && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <span className="text-sm font-medium tracking-wide uppercase text-gray-600">Out of Stock</span>
              </div>
            )}
          </div>
          <div className="pt-4">
            {product?.category && (
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-light">
                {product.category}
              </p>
            )}
            <h3 className="text-sm font-light text-gray-900 mb-2 tracking-wide">
              {product?.name || 'Product Name'}
            </h3>
            <div className="flex items-baseline justify-between">
              <div>
                {product?.onSale && product?.originalPrice ? (
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ${product?.price?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-900">
                    ${product?.price?.toFixed(2) || '0.00'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;


import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product?.id || '1'}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-gray-200 overflow-hidden">
          <img
            src={product?.image || 'https://via.placeholder.com/300'}
            alt={product?.name || 'Product'}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {product?.name || 'Product Name'}
          </h3>
          <p className="text-xl font-bold text-indigo-600">
            ${product?.price?.toFixed(2) || '0.00'}
          </p>
          {product?.category && (
            <p className="text-sm text-gray-500 mt-1">{product.category}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;


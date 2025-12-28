import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Placeholder component - implement product display logic later
  return (
    <Link to={`/product/${product?.id || '1'}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-gray-200">
          {/* Placeholder for product image */}
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Image
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {product?.name || 'Product Name'}
          </h3>
          <p className="text-gray-600 mb-2">
            ${product?.price || '0.00'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;


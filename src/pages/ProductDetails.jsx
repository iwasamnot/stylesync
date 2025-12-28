import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Product Details
          </h1>
          <p className="text-gray-600">
            Product ID: {id}
          </p>
          <p className="text-gray-600 mt-4">
            Product details page will be implemented here
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;


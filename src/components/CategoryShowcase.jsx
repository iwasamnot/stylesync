import { Link } from 'react-router-dom';

const CategoryShowcase = ({ categories }) => {
  const categoryIcons = {
    'T-Shirts': '👕',
    'Jeans': '👖',
    'Hoodies': '🧥',
    'Jackets': '🧥',
    'Shoes': '👟',
    'Accessories': '👜',
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category}
            to={`/?category=${encodeURIComponent(category)}`}
            className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center border-2 border-transparent hover:border-indigo-500"
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
              {categoryIcons[category] || '🛍️'}
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {category}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryShowcase;


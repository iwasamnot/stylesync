import { Link } from 'react-router-dom';

const CategoryShowcase = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="mb-20">
      <h2 className="text-xs uppercase tracking-widest text-gray-500 font-light mb-8">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-gray-200">
        {categories.map((category) => (
          <Link
            key={category}
            to={`/?category=${encodeURIComponent(category)}`}
            className="group bg-white p-8 text-center hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-sm font-light text-gray-900 uppercase tracking-widest group-hover:underline">
              {category}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryShowcase;


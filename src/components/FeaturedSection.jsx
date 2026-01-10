import { Link } from 'react-router-dom';

const FeaturedSection = ({ title, products, viewAllLink }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product, index) => (
          <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
            {/* Product card will be rendered by parent */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSection;


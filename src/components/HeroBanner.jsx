import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div className="relative bg-black dark:bg-gray-950 text-white mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-6">
            StyleSync
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 font-light">
            Timeless elegance. Modern sophistication. Discover curated fashion for the contemporary wardrobe.
          </p>
          <Link
            to="/?tab=new"
            className="inline-block border border-white px-8 py-3 text-sm font-medium tracking-wide uppercase hover:bg-white hover:text-black transition-colors duration-200"
          >
            Shop New Arrivals
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;


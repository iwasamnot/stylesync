import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl overflow-hidden mb-12 shadow-2xl">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative px-8 py-16 sm:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 animate-fade-in">
            Discover Your Style
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Shop the latest trends in fashion. Quality clothing for every occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/?tab=sale"
              className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Shop Sale
            </Link>
            <Link
              to="/?tab=new"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transform hover:scale-105 transition-all duration-200"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
    </div>
  );
};

export default HeroBanner;


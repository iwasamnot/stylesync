import { Link } from 'react-router-dom';

const PromoBanner = ({ title, subtitle, link, linkText, gradient = 'from-indigo-500 to-purple-600' }) => {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-xl p-8 mb-8 shadow-lg transform hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-white">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-white/90">{subtitle}</p>
        </div>
        {link && (
          <Link
            to={link}
            className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default PromoBanner;


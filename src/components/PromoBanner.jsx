import { Link } from 'react-router-dom';

const PromoBanner = ({ title, subtitle, link, linkText }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 p-8 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm uppercase tracking-widest font-light text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 font-light">{subtitle}</p>
        </div>
        {link && (
          <Link
            to={link}
            className="border border-black px-6 py-3 text-xs uppercase tracking-widest font-light text-gray-900 hover:bg-black hover:text-white transition-colors whitespace-nowrap"
          >
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default PromoBanner;


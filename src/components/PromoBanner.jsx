import { Link } from 'react-router-dom';

const PromoBanner = ({ title, subtitle, link, linkText }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm uppercase tracking-widest font-light text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-light">{subtitle}</p>
        </div>
        {link && (
          <Link
            to={link}
            className="border border-black dark:border-white px-6 py-3 text-xs uppercase tracking-widest font-light text-gray-900 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap"
          >
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default PromoBanner;


import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const PromoBanner = ({ title, subtitle, link, linkText }) => {
  const { theme } = useTheme();
  const isFun = theme === 'fun';

  return (
    <div
      className={[
        'relative border p-8 mb-8 overflow-hidden',
        isFun
          ? 'rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur border-white/70 dark:border-white/10 shadow-lg'
          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
      ].join(' ')}
    >
      {isFun && (
        <div className="absolute inset-0 fun-sparkles opacity-25 pointer-events-none" />
      )}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm uppercase tracking-widest font-light text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-light">{subtitle}</p>
        </div>
        {link && (
          <Link
            to={link}
            className={[
              'px-6 py-3 text-xs uppercase tracking-widest font-light transition-colors whitespace-nowrap',
              isFun
                ? 'rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 text-white shadow-sm hover:brightness-105'
                : 'border border-black dark:border-white text-gray-900 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
            ].join(' ')}
          >
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default PromoBanner;


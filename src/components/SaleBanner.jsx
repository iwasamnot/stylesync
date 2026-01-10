import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const SaleBanner = ({ className = '' }) => {
  const { theme } = useTheme();
  const isFun = theme === 'fun';

  return (
    <Link
      to="/?tab=sale"
      className={[
        'group relative block w-full overflow-hidden rounded-xl border shadow-sm',
        isFun
          ? 'border-black/10 dark:border-white/10 text-white fun-gradient-shift'
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
        className,
      ].join(' ')}
      aria-label="Shop sale"
    >
      {isFun && <div className="absolute inset-0 fun-sparkles opacity-35 pointer-events-none" />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className={[
              'inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em]',
              isFun ? 'bg-white/15' : 'bg-gray-100 dark:bg-gray-800',
            ].join(' ')}
          >
            Limited time
          </span>
          <p className="text-sm sm:text-base font-light tracking-wide">
            Big Sale — save on selected styles
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-light">
          Shop Sale
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-rotate-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
      <div className={['h-1 w-full', isFun ? 'bg-white/25' : 'bg-gray-100 dark:bg-gray-800'].join(' ')} />
    </Link>
  );
};

export default SaleBanner;


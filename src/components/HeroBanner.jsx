import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const HeroBanner = () => {
  const { theme } = useTheme();
  const isFun = theme === 'fun';

  return (
    <div
      className={[
        'relative text-white mb-16 overflow-hidden',
        isFun ? 'bg-gradient-to-r from-rose-500 via-fuchsia-500 to-cyan-500' : 'bg-black dark:bg-gray-950',
      ].join(' ')}
    >
      {isFun && (
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-6">
            StyleSync
          </h1>
          <p className={['text-lg sm:text-xl mb-8 font-light', isFun ? 'text-white/90' : 'text-gray-300'].join(' ')}>
            Timeless elegance. Modern sophistication. Discover curated fashion for the contemporary wardrobe.
          </p>
          <Link
            to="/?tab=new"
            className={[
              'inline-block px-8 py-3 text-sm font-medium tracking-wide uppercase transition-colors duration-200',
              isFun
                ? 'rounded-xl bg-white text-black hover:bg-white/90'
                : 'border border-white hover:bg-white hover:text-black',
            ].join(' ')}
          >
            Shop New Arrivals
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;


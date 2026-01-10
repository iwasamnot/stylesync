import { Link } from 'react-router-dom';

const FunModeBanner = () => {
  return (
    <div className="relative overflow-hidden border-t border-black/10 dark:border-white/10">
      <div className="absolute inset-0 fun-gradient-shift opacity-95" />
      <div className="absolute inset-0 fun-sparkles opacity-60" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3 text-white">
            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.22em]">
              Fun Mode
            </span>
            <p className="text-xs sm:text-sm font-light tracking-wide">
              Sparkles on. Vibes up. Try the Sale tab for deals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/?tab=sale"
              className="inline-flex items-center justify-center rounded-full bg-white text-black px-4 py-2 text-[10px] uppercase tracking-[0.22em] font-medium hover:bg-white/90 transition-colors"
            >
              Shop Sale
            </Link>
            <Link
              to="/?tab=new"
              className="inline-flex items-center justify-center rounded-full border border-white/60 text-white px-4 py-2 text-[10px] uppercase tracking-[0.22em] font-light hover:bg-white/10 transition-colors"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunModeBanner;


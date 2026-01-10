import { Link } from 'react-router-dom';

const FunPromoStrip = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/70 dark:border-white/10 bg-white/60 dark:bg-gray-900/60 backdrop-blur shadow-lg">
      <div className="absolute inset-0 fun-gradient-shift opacity-25" />
      <div className="absolute inset-0 fun-sparkles opacity-25" />
      <div className="relative px-5 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-cyan-500 text-white px-3 py-1 text-[10px] uppercase tracking-[0.22em] shadow-sm">
              Party picks
            </span>
            <p className="text-sm font-light text-gray-900 dark:text-white tracking-wide">
              Fun mode is on — browse Trending, New, or the Sale tab for surprises.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/?tab=trending"
              className="inline-flex items-center justify-center rounded-full bg-black text-white px-4 py-2 text-[10px] uppercase tracking-[0.22em] font-light hover:bg-black/90 transition-colors"
            >
              Trending
            </Link>
            <Link
              to="/?tab=new"
              className="inline-flex items-center justify-center rounded-full border border-black/20 dark:border-white/20 text-gray-900 dark:text-white px-4 py-2 text-[10px] uppercase tracking-[0.22em] font-light hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
            >
              New
            </Link>
            <Link
              to="/?tab=sale"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 text-white px-4 py-2 text-[10px] uppercase tracking-[0.22em] font-medium hover:brightness-105 transition-colors"
            >
              Sale
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunPromoStrip;


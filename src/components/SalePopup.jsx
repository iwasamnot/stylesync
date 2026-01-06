import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SALE_POPUP_SESSION_KEY = 'salePopupSeen';

const SalePopup = ({ enabled = true }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    try {
      if (sessionStorage.getItem(SALE_POPUP_SESSION_KEY) === 'true') return;
      const t = window.setTimeout(() => setOpen(true), 900);
      return () => window.clearTimeout(t);
    } catch {
      // If sessionStorage is blocked, just show it once per load.
      const t = window.setTimeout(() => setOpen(true), 900);
      return () => window.clearTimeout(t);
    }
  }, [enabled]);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(SALE_POPUP_SESSION_KEY, 'true');
    } catch {
      // ignore
    }
  };

  if (!enabled || !open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={close}
        aria-label="Close sale popup"
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/15 via-fuchsia-500/10 to-cyan-500/10 pointer-events-none" />

        <div className="relative p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                Today only
              </p>
              <h3 className="mt-2 text-xl font-light tracking-wide text-gray-900 dark:text-white">
                Sale picks are live
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 font-light">
                Limited stock on selected items — grab your favorites while they’re discounted.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link
              to="/?tab=sale"
              onClick={close}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-xs uppercase tracking-[0.22em] font-light bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 transition-colors"
            >
              Shop Sale
            </Link>
            <button
              type="button"
              onClick={close}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-xs uppercase tracking-[0.22em] font-light border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalePopup;


import { useEffect, useState } from 'react';

const OfflineBanner = () => {
  const [online, setOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[65] flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-xl rounded-full border border-black/10 dark:border-white/10 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
            <p className="text-xs uppercase tracking-widest text-gray-700 dark:text-gray-200 font-light">
              You’re offline — some features may not work
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-light">
            Offline
          </span>
        </div>
      </div>
    </div>
  );
};

export default OfflineBanner;


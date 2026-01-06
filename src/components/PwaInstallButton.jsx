import { useEffect, useState } from 'react';

const PwaInstallButton = ({ className = '' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    // If already running as installed app, hide.
    const isStandalone =
      window.matchMedia?.('(display-mode: standalone)')?.matches ||
      window.navigator?.standalone === true;
    if (isStandalone) setInstalled(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  if (installed || !deferredPrompt) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          deferredPrompt.prompt();
          await deferredPrompt.userChoice;
        } finally {
          setDeferredPrompt(null);
        }
      }}
      className={[
        'text-xs uppercase tracking-widest font-light transition-colors inline-flex items-center gap-2',
        'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
        className,
      ].join(' ')}
      aria-label="Install app"
      title="Install app"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v10.5m0 0l3.75-3.75M12 13.5L8.25 9.75M4.5 15.75v3A2.25 2.25 0 006.75 21h10.5A2.25 2.25 0 0019.5 18.75v-3"
        />
      </svg>
      Install
    </button>
  );
};

export default PwaInstallButton;


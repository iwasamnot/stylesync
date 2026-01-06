import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-1 py-1"
      role="group"
      aria-label="Theme switcher"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
        aria-label="Light theme"
        title="Light"
        className={`p-2 rounded-full transition-colors ${
          theme === 'light'
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
        aria-label="Dark theme"
        title="Dark"
        className={`p-2 rounded-full transition-colors ${
          theme === 'dark'
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => setTheme('fun')}
        aria-pressed={theme === 'fun'}
        aria-label="Fun theme"
        title="Fun"
        className={`p-2 rounded-full transition-colors ${
          theme === 'fun'
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.455L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.455L18 2.25l.259 1.036a3.375 3.375 0 002.455 2.455L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.455zM16.894 20.25L16.5 21.75l-.394-1.5a2.25 2.25 0 00-1.606-1.606L13 18.25l1.5-.394a2.25 2.25 0 001.606-1.606l.394-1.5.394 1.5a2.25 2.25 0 001.606 1.606l1.5.394-1.5.394a2.25 2.25 0 00-1.606 1.606z"
          />
        </svg>
      </button>
    </div>
  );
};

export default ThemeToggle;


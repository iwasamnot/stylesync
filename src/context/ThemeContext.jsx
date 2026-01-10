import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({});

const THEME_STORAGE_KEY = 'theme';
const LEGACY_DARKMODE_STORAGE_KEY = 'darkMode';

const getInitialTheme = () => {
  // Preferred: explicit saved theme
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'fun') {
    return savedTheme;
  }

  // Backward compatibility: old darkMode boolean
  const savedDarkMode = localStorage.getItem(LEGACY_DARKMODE_STORAGE_KEY);
  if (savedDarkMode !== null) {
    return savedDarkMode === 'true' ? 'dark' : 'light';
  }

  // Fallback: system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyThemeToDocument = (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.classList.toggle('fun', theme === 'fun');
  document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
};

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const initial = getInitialTheme();
    // Apply immediately to prevent theme flash on first paint
    applyThemeToDocument(initial);
    return initial;
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.setItem(LEGACY_DARKMODE_STORAGE_KEY, (theme === 'dark').toString());
    applyThemeToDocument(theme);
  }, [theme]);

  const cycleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'fun';
      return 'light';
    });
  };

  // Backward-compatible API
  const darkMode = theme === 'dark';
  const toggleDarkMode = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      cycleTheme,
      darkMode,
      toggleDarkMode,
    }),
    [theme, darkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};


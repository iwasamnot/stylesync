import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const RecentlyViewedContext = createContext({});

export const useRecentlyViewed = () => {
  return useContext(RecentlyViewedContext);
};

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const maxItems = 10;

  useEffect(() => {
    const saved = localStorage.getItem('recentlyViewed');
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recently viewed:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = useCallback((product) => {
    if (!product || !product.id) return;
    
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item.id !== product.id);
      // Add to beginning
      const updated = [{ ...product, viewedAt: new Date().toISOString() }, ...filtered];
      // Keep only maxItems
      return updated.slice(0, maxItems);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    localStorage.removeItem('recentlyViewed');
  }, []);

  const value = useMemo(() => ({
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  }), [recentlyViewed, addToRecentlyViewed, clearRecentlyViewed]);

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};


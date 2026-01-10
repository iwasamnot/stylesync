import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const trimmed = useMemo(() => searchQuery.trim(), [searchQuery]);

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && suggestions.length > 0) {
        navigate(`/product/${suggestions[0].id}`);
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, navigate, onClose, suggestions]);

  useEffect(() => {
    if (!isOpen) return;
    if (trimmed.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const t = window.setTimeout(async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('name', '>=', trimmed),
          where('name', '<=', trimmed + '\uf8ff'),
          limit(8)
        );
        const querySnapshot = await getDocs(q);
        if (cancelled) return;
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSuggestions(products);
      } catch (error) {
        console.error('Error fetching search results:', error);
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [isOpen, trimmed]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start sm:items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Close search"
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-gray-900/85 backdrop-blur shadow-2xl animate-scale-in">
        <div className="absolute inset-0 pointer-events-none fun-sparkles opacity-[0.08]" />

        <div className="relative p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
                Search
              </p>
              <h3 className="text-lg sm:text-xl font-light tracking-wide text-gray-900 dark:text-white">
                Find products
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative">
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type at least 2 characters…"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label="Clear"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="mt-4">
            {loading && (
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white" />
                Searching…
              </div>
            )}

            {!loading && trimmed.length >= 2 && suggestions.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No results found.
              </p>
            )}

            {!loading && suggestions.length > 0 && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      onClose();
                    }}
                    className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/60 hover:bg-white dark:hover:bg-gray-900 transition-colors p-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || 'https://via.placeholder.com/80'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white font-light truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ${product.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
            <span>Esc to close</span>
            <span>Enter opens first result</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;


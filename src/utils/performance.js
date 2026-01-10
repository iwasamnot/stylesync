/**
 * Performance optimization utilities
 */

// RequestAnimationFrame polyfill for consistent 60+ FPS
export const raf = (() => {
  if (typeof window !== 'undefined' && window.requestAnimationFrame) {
    return window.requestAnimationFrame.bind(window);
  }
  return (callback) => setTimeout(callback, 1000 / 60);
})();

export const cancelRaf = (() => {
  if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
    return window.cancelAnimationFrame.bind(window);
  }
  return (id) => clearTimeout(id);
})();

// Throttle function for performance
export const throttle = (func, wait = 100) => {
  let timeout = null;
  let previous = 0;
  
  const later = () => {
    previous = Date.now();
    timeout = null;
    func();
  };
  
  return function throttled(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        cancelRaf(timeout);
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = raf(later);
    }
  };
};

// Debounce function for performance
export const debounce = (func, wait = 100) => {
  let timeout = null;
  
  return function debounced(...args) {
    const context = this;
    
    const later = () => {
      timeout = null;
      func.apply(context, args);
    };
    
    if (timeout) {
      cancelRaf(timeout);
    }
    timeout = raf(later);
  };
};

// Use Intersection Observer with better performance
export const createIntersectionObserver = (callback, options = {}) => {
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    return null;
  }
  
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    // Performance optimization
    ...options,
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Optimize image loading
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
};

// Lazy load images with intersection observer
export const lazyLoadImage = (imgElement, src, placeholder = '') => {
  if (!imgElement) return;
  
  const observer = createIntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: '50px' }
  );
  
  if (placeholder) {
    imgElement.src = placeholder;
  }
  
  observer.observe(imgElement);
  
  return () => observer.disconnect();
};

// Measure FPS
export const measureFPS = (callback, duration = 1000) => {
  let frames = 0;
  let startTime = performance.now();
  
  const countFrame = () => {
    frames++;
    const currentTime = performance.now();
    const elapsed = currentTime - startTime;
    
    if (elapsed >= duration) {
      const fps = Math.round((frames * 1000) / elapsed);
      callback(fps);
      frames = 0;
      startTime = currentTime;
    }
    
    raf(countFrame);
  };
  
  const animationId = raf(countFrame);
  
  return () => cancelRaf(animationId);
};

// Performance monitoring
export const performanceMonitor = {
  start(name) {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-start`);
    }
  },
  
  end(name) {
    if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      return measure.duration;
    }
    return null;
  },
  
  // Log performance metrics in development
  log(name) {
    if (process.env.NODE_ENV === 'development') {
      const duration = this.end(name);
      if (duration !== null) {
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
      }
    }
  },
};

// Optimize scroll events
export const optimizeScroll = (callback, options = {}) => {
  const { wait = 16, leading = true, trailing = true } = options;
  
  return throttle(callback, wait);
};

// Batch DOM updates
export const batchUpdates = (updates) => {
  raf(() => {
    updates.forEach((update) => update());
  });
};

// Prefetch resources
export const prefetchResource = (url, as = 'script') => {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = as;
  link.href = url;
  document.head.appendChild(link);
};

// Preload critical resources
export const preloadResource = (url, as = 'script') => {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = url;
  document.head.appendChild(link);
};

// Check if element is visible
export const isElementVisible = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= windowWidth
  );
};

// Force repaint for better performance
export const forceRepaint = (element) => {
  if (element) {
    element.style.display = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.display = '';
  }
};

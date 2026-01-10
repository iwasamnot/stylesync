import { useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { prefersReducedMotion } from '../utils/performance';

const ParticleSystem = ({ count = 30, className = '' }) => {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion() || prefersReducedMotion();
  const isFun = theme === 'fun';
  const containerRef = useRef(null);

  // Memoize particles array for better performance
  // Reduce particle count for better performance on lower-end devices
  const optimizedCount = shouldReduceMotion ? 0 : Math.min(count, 25);
  
  const particles = useMemo(() => Array.from({ length: optimizedCount }, (_, i) => ({
    id: i,
    delay: Math.random() * 15, // Reduced delay range
    duration: 12 + Math.random() * 8, // Slightly faster animations
    x: Math.random() * 100,
    size: 3 + Math.random() * 5, // Slightly smaller particles
    rotation: Math.random() * 360,
  })), [optimizedCount]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${
            isFun
              ? 'bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400'
              : 'bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400'
          } opacity-60 blur-[2px]`}
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            boxShadow: `0 0 ${particle.size * 1.5}px currentColor`,
            // GPU acceleration for smooth 60fps+ animations
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            // Use contain for better performance
            contain: 'layout style paint',
          }}
          initial={{
            y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
            x: 0,
            opacity: 0,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            y: typeof window !== 'undefined' ? -window.innerHeight - 50 : -1000,
            x: particle.x > 50 ? -100 : 100, // Consistent direction based on position
            opacity: [0, 0.7, 0.7, 0], // Reduced opacity for better performance
            scale: [0, 1, 1, 0.8], // Smoother scale transitions
            rotate: particle.rotation,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
            type: 'tween', // Use tween for better performance
          }}
        />
      ))}
    </div>
  );
};

export default ParticleSystem;

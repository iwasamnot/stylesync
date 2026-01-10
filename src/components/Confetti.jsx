import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { prefersReducedMotion } from '../utils/performance';

const Confetti = ({ show = false, duration = 3000, count = 50 }) => {
  const [confettiPieces, setConfettiPieces] = useState([]);
  const shouldReduceMotion = useReducedMotion() || prefersReducedMotion();

  // Memoize color array for better performance
  const colors = useMemo(() => 
    ['#6366f1', '#8b5cf6', '#ec4899', '#22d3ee', '#fbbf24', '#10b981'],
    []
  );

  useEffect(() => {
    if (show && !shouldReduceMotion) {
      // Reduce count for better performance on lower-end devices
      const optimizedCount = Math.min(count, 40);
      
      const pieces = Array.from({ length: optimizedCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.3, // Reduced delay for faster start
        duration: (duration / 1000) + Math.random() * 0.5, // Slightly faster
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 540 - 270, // Reduced rotation range
      }));
      setConfettiPieces(pieces);

      const timer = setTimeout(() => {
        setConfettiPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    } else if (!show) {
      setConfettiPieces([]);
    }
  }, [show, duration, count, shouldReduceMotion, colors]);

  return (
    <AnimatePresence>
      {show && confettiPieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                backgroundColor: piece.color,
                left: `${piece.x}%`,
                top: '-10px',
                // GPU acceleration for smooth 60fps+ animations
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                // Use transform instead of top/left for better performance
                position: 'absolute',
              }}
              initial={{
                y: 0,
                rotate: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                rotate: piece.rotation,
                opacity: [1, 1, 0.8, 0],
                scale: [1, 1.1, 1, 0.9], // Reduced scale for smoother animation
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: [0.17, 0.67, 0.83, 0.67], // Optimized easing for 60fps+
                type: 'tween', // Use tween for better performance
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default Confetti;

import { useRef, useEffect, useMemo } from 'react';
import { motion, useInView, useAnimation, useReducedMotion } from 'framer-motion';
import { prefersReducedMotion } from '../utils/performance';

const ScrollReveal = ({ children, delay = 0, direction = 'up', className = '', duration = 0.6 }) => {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion() || prefersReducedMotion();
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-100px',
    amount: 0.2, // Trigger when 20% visible for better performance
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  // Optimize variants with GPU acceleration
  const variants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : (direction === 'up' ? 40 : direction === 'down' ? -40 : 0),
      x: shouldReduceMotion ? 0 : (direction === 'left' ? 40 : direction === 'right' ? -40 : 0),
      scale: shouldReduceMotion ? 1 : (direction === 'none' ? 0.95 : 1),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.1 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1], // Optimized easing for 60fps
        // Use transform for GPU acceleration
        type: 'tween',
      },
    },
  }), [direction, delay, duration, shouldReduceMotion]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
      style={{
        // Force GPU acceleration
        willChange: isInView ? 'auto' : 'transform, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;

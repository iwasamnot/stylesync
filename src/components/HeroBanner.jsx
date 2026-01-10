import { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion, useReducedMotion } from 'framer-motion';
import ParticleSystem from './ParticleSystem';
import { prefersReducedMotion } from '../utils/performance';

const HeroBanner = memo(() => {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion() || prefersReducedMotion();
  const isFun = theme === 'fun';

  // Memoize variants for better performance
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1, // Faster for smoother feel
        delayChildren: shouldReduceMotion ? 0 : 0.15, // Reduced delay
      },
    },
  }), [shouldReduceMotion]);

  const itemVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20, // Reduced movement
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.6, // Faster for smoother feel
        ease: [0.16, 1, 0.3, 1], // Optimized easing for 60fps+
        type: 'tween', // Use tween for better performance
      },
    },
  }), [shouldReduceMotion]);

  // Optimize blob variants with reduced motion support
  const blobVariants = useMemo(() => ({
    animate: shouldReduceMotion ? {
      x: 0,
      y: 0,
      scale: 1,
      borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
      transition: {
        duration: 0.1,
      },
    } : {
      x: [0, 80, 0], // Reduced movement for smoother animation
      y: [0, -40, 0],
      scale: [1, 1.15, 1], // Reduced scale for smoother animation
      borderRadius: [
        '60% 40% 30% 70% / 60% 30% 70% 40%',
        '30% 60% 70% 40% / 50% 60% 30% 60%',
        '60% 40% 30% 70% / 60% 30% 70% 40%',
      ],
      transition: {
        duration: 18, // Faster for smoother feel
        repeat: Infinity,
        ease: [0.16, 1, 0.3, 1], // Optimized easing for 60fps+
        type: 'tween', // Use tween for better performance
      },
    },
  }), [shouldReduceMotion]);

  return (
    <div
      className={[
        'relative text-white mb-16 overflow-hidden min-h-[80vh] flex items-center',
        isFun ? 'bg-gradient-to-br from-rose-500 via-fuchsia-500 to-cyan-500' : 'bg-black dark:bg-gray-950',
      ].join(' ')}
    >
      {/* Optimized Fluid morphing blobs with GPU acceleration */}
      <motion.div
        variants={blobVariants}
        animate="animate"
        className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] pointer-events-none morph-blob-multi"
        style={{
          // GPU acceleration for smooth 60fps+ animations
          willChange: 'transform, border-radius',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          // Use contain for better performance
          contain: 'layout style paint',
        }}
      />
      <motion.div
        variants={blobVariants}
        animate="animate"
        transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 20, delay: -5, type: 'tween' }} // Faster for smoother feel
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[100px] pointer-events-none morph-blob-multi"
        style={{
          willChange: 'transform, border-radius',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          contain: 'layout style paint',
        }}
      />
      <motion.div
        variants={blobVariants}
        animate="animate"
        transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 22, delay: -8, type: 'tween' }} // Faster for smoother feel
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[60px] pointer-events-none morph-blob-multi"
        style={{
          transform: 'translate(-50%, -50%) translateZ(0)', // GPU acceleration
          willChange: 'transform, border-radius',
          backfaceVisibility: 'hidden',
          contain: 'layout style paint',
        }}
      />

      {/* Particle System */}
      {isFun && <ParticleSystem count={20} />}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Small label */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base mb-4 font-light tracking-widest uppercase text-white/70"
          >
            Your new fashion
          </motion.p>

          {/* Large split heading - ready.so style */}
          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight leading-[1.1] mb-2">
              <span className="block text-reveal reveal-up">The fashion</span>
              <span className="block text-reveal reveal-up-delayed-1">you need to wear</span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="block mt-4 text-2xl sm:text-3xl lg:text-4xl font-normal text-white/80"
              >
                StyleSync
              </motion.span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className={[
              'text-lg sm:text-xl lg:text-2xl mb-10 font-light max-w-2xl leading-relaxed',
              isFun ? 'text-white/95' : 'text-gray-200',
            ].join(' ')}
          >
            StyleSync evolves your wardrobe into a living, breathing collection of timeless pieces. 
            Discover curated fashion designed for the contemporary lifestyle.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={itemVariants}>
            <Link
              to="/?tab=new"
              className={[
                'inline-block btn-fluid',
                'px-10 py-4 text-base font-medium tracking-wide uppercase',
                'relative overflow-hidden',
                isFun
                  ? 'rounded-2xl bg-white text-black hover:bg-white/95 shadow-xl'
                  : 'rounded-lg border-2 border-white text-white hover:bg-white hover:text-black backdrop-blur-sm glass-morphism',
              ].join(' ')}
            >
              <span className="relative z-10">Shop New Arrivals</span>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.5 }}
              />
            </Link>
          </motion.div>

          {/* Floating decorative elements */}
          <motion.div
            className="absolute top-20 right-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md float-animation"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          />
          <motion.div
            className="absolute bottom-32 right-1/4 w-12 h-12 rounded-full bg-purple-400/20 backdrop-blur-md float-animation-delayed"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          />
        </motion.div>
      </div>
    </div>
  );
});

HeroBanner.displayName = 'HeroBanner';

export default HeroBanner;


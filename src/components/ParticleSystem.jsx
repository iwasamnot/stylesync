import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ParticleSystem = ({ count = 30, className = '' }) => {
  const { theme } = useTheme();
  const isFun = theme === 'fun';
  const containerRef = useRef(null);

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 20,
    duration: 15 + Math.random() * 10,
    x: Math.random() * 100,
    size: 4 + Math.random() * 6,
  }));

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
            boxShadow: `0 0 ${particle.size * 2}px currentColor`,
          }}
          initial={{
            y: '100vh',
            x: 0,
            opacity: 0,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            y: '-100vh',
            x: Math.random() * 200 - 100,
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default ParticleSystem;

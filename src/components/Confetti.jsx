import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Confetti = ({ show = false, duration = 3000, count = 50 }) => {
  const [confettiPieces, setConfettiPieces] = useState([]);

  useEffect(() => {
    if (show) {
      const pieces = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: duration / 1000 + Math.random(),
        color: ['#6366f1', '#8b5cf6', '#ec4899', '#22d3ee', '#fbbf24', '#10b981'][
          Math.floor(Math.random() * 6)
        ],
        rotation: Math.random() * 720 - 360,
      }));
      setConfettiPieces(pieces);

      const timer = setTimeout(() => {
        setConfettiPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, count]);

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
              }}
              initial={{
                y: 0,
                rotate: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                y: window.innerHeight + 100,
                rotate: piece.rotation,
                opacity: [1, 1, 0],
                scale: [1, 1.2, 0.8],
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: 'easeIn',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default Confetti;

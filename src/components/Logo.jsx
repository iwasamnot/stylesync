import { useId } from 'react';

const Logo = ({ className = '' }) => {
  const id = useId();
  const gradientId = `stylesync-gradient-${id}`;

  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="StyleSync logo"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      <circle cx="16" cy="16" r="15" fill={`url(#${gradientId})`} />
      <path
        d="M22.5 10.5c-1-1.2-2.7-2-5-2-2.8 0-4.8 1.5-4.8 3.6 0 2.3 2.1 3 4.6 3.5 3 .7 6.2 1.6 6.2 5 0 3.2-3 5.4-7.2 5.4-3.2 0-5.8-1-7.8-3l2.2-2.2c1.5 1.4 3.2 2.1 5.7 2.1 2.7 0 4.4-1.1 4.4-2.8 0-1.5-1.6-2.1-4.5-2.8-3.2-.7-6.3-1.7-6.3-5.7 0-3.4 3.2-6.2 7.6-6.2 2.8 0 5.1.9 6.9 2.6l-2 2.5z"
        fill="white"
        opacity="0.95"
      />
    </svg>
  );
};

export default Logo;


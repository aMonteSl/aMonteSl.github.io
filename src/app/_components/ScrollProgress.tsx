'use client';

import { useEffect, useState } from 'react';

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.min(Math.max(scrollPercent, 0), 1));
    };

    const handleScroll = () => {
      requestAnimationFrame(calculateProgress);
    };

    // Initial calculation
    calculateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateProgress);
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-40 h-0.5 bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-[var(--accent)] transition-transform duration-150 ease-out transform-gpu will-change-transform"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: 'left'
        }}
      />
    </div>
  );
};

export default ScrollProgress;

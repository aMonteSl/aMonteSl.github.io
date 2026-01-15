'use client';

import { useEffect, useState } from 'react';

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      // Check if we're in fullpage mode
      const isFullpage = document.documentElement.classList.contains('fullpage');
      
      if (isFullpage) {
        // Discrete progress based on slide position
        const main = document.querySelector('main.fullpage');
        if (main) {
          const currentScrollTop = main.scrollTop;
          const viewportHeight = main.clientHeight;
          const currentIndex = Math.round(currentScrollTop / viewportHeight);
          
          // Get total number of sections by counting data-snap elements
          const sections = document.querySelectorAll('section[data-snap]');
          const totalSections = sections.length;
          
          if (totalSections > 0) {
            const discreteProgress = currentIndex / (totalSections - 1);
            setProgress(Math.min(Math.max(discreteProgress, 0), 1));
          }
        }
      } else {
        // Standard continuous progress calculation
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
        setProgress(Math.min(Math.max(scrollPercent, 0), 1));
      }
    };

    const handleScroll = () => {
      requestAnimationFrame(calculateProgress);
    };

    const handleActiveSectionChange = () => {
      // Update progress when active section changes (from SlideDots)
      calculateProgress();
    };

    // Initial calculation
    calculateProgress();

    // Listen to both window scroll and main scroll for fullpage mode
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });
    
    // Listen for active section changes from SlideDots
    window.addEventListener('activeSectionChange', handleActiveSectionChange);
    
    // Also listen to scroll events on main.fullpage if it exists
    const mainElement = document.querySelector('main.fullpage');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateProgress);
      window.removeEventListener('activeSectionChange', handleActiveSectionChange);
      
      const mainElement = document.querySelector('main.fullpage');
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-40 h-0.5 bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-[var(--accent)] transition-transform duration-300 ease-out transform-gpu will-change-transform"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: 'left'
        }}
      />
    </div>
  );
};

export default ScrollProgress;

import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { MobileTopbar } from './MobileTopbar';
import { SEOHead } from '../../layout/SEOHead';
import { useMediaQuery, usePrefersReducedMotion } from '../../hooks/useMediaQuery';

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const prefersReducedMotion = usePrefersReducedMotion();

  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen);
  };

  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-bg text-ink">
      {/* Desktop Layout - Responsive Grid */}
      <div className="hidden lg:grid" style={{ gridTemplateColumns: 'clamp(260px, 24vw, 360px) minmax(0, 1fr)' }}>
        {/* Fixed Sidebar */}
        <aside className="sticky top-0 h-screen overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted/20">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            <Sidebar />
          </motion.div>
        </aside>
        
        {/* Main Content */}
        <main className="overflow-y-auto">
          <div className="min-h-screen max-w-content mx-auto 3xl:max-w-4k">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile/Tablet Layout - Stack */}
      <div className="lg:hidden">
        {/* Mobile Topbar */}
        <MobileTopbar onMenuClick={toggleMobileDrawer} />
        
        {/* Mobile Content with safe area support */}
        <main className="pt-16 pt-safe">
          <div className="px-section-x">
            {children}
          </div>
        </main>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileDrawerOpen && (
            <MobileDrawer
              isOpen={isMobileDrawerOpen}
              onClose={() => setIsMobileDrawerOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Back to Top Button */}
      <BackToTopButton />
      </div>
    </>
  );
}

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <motion.button
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-3 bg-accent text-bg rounded-full shadow-lg hover:shadow-xl focus:shadow-xl transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg no-print"
      aria-label="Back to top"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </motion.button>
  );
}

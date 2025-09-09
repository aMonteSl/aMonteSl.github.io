import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

const sections = [
  { path: '/', label: 'Home' },
  { path: '/projects', label: 'Projects' },
  { path: '/education', label: 'Education' },
  { path: '/skills', label: 'Skills' },
  { path: '/activities', label: 'Activities' },
  { path: '/languages', label: 'Languages' },
  { path: '/images', label: 'Images' },
  { path: '/contact', label: 'Contact' },
  { path: '/resume', label: 'Resume' },
];

export function QuickNav() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <nav className="space-y-1" role="navigation" aria-label="Section navigation">
      {sections.map((section, index) => (
        <motion.div
          key={section.path}
          initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            delay: prefersReducedMotion ? 0 : index * 0.1,
            duration: prefersReducedMotion ? 0 : 0.4
          }}
        >
          <NavLink
            to={section.path}
            className={({ isActive }) => `
              relative w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface-1 block
              ${isActive 
                ? 'bg-accent/10 text-accent border-l-2 border-accent shadow-sm' 
                : 'text-muted hover:text-ink hover:bg-surface-2/50'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <span className="relative z-10">
                  {section.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 bg-accent/5 rounded-lg"
                    initial={false}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 30,
                      duration: prefersReducedMotion ? 0 : undefined
                    }}
                  />
                )}
              </>
            )}
          </NavLink>
        </motion.div>
      ))}
    </nav>
  );
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'
import { navSections, type NavSection } from '../data/nav'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { activeId, scrollToSection } = useScrollSpy()
  const profile = useProfile()
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (id: string) => {
    scrollToSection(id)
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${
        isScrolled 
          ? 'bg-surface-2/60 backdrop-blur-lg border-b border-surface-2/50 py-3'
          : 'bg-surface-1/20 backdrop-blur-sm py-4'
      }`}
      initial={prefersReducedMotion ? false : { y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo/Brand */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-accent rounded-lg p-1"
        >
          {/* Avatar */}
          <div className={`rounded-full overflow-hidden ring-2 ring-accent-3/20 transition-all duration-300 ${
            isScrolled ? 'w-8 h-8' : 'w-10 h-10'
          }`}>
            <img
              src="/src/assets/profile.jpg"
              alt={profile.name}
              width="40"
              height="40"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          
          {/* Name */}
          <div className="text-left">
            <h1 className={`font-bold text-ink transition-all duration-300 ${
              isScrolled ? 'text-lg' : 'text-xl'
            }`}>
              {profile.name}
            </h1>
            {!isScrolled && (
              <p className="text-sm text-accent font-medium">
                Software Developer
              </p>
            )}
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
          {navSections.map((section: NavSection) => (
            <button
              key={section.id}
              onClick={() => handleNavClick(section.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent relative ${
                activeId === section.id
                  ? 'text-accent bg-accent/10'
                  : 'text-muted hover:text-ink hover:bg-surface-2/50'
              }`}
              aria-current={activeId === section.id ? 'page' : undefined}
            >
              {section.label}
              {activeId === section.id && (
                <motion.div
                  layoutId="activeNavItem"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full"
                  initial={false}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 30,
                    duration: prefersReducedMotion ? 0 : undefined
                  }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-muted hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent rounded-lg"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <motion.div
            animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            className="md:hidden bg-bg/95 backdrop-blur-md border-t border-surface-2/50 overflow-hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="px-6 py-4 space-y-2">
              {navSections.map((section: NavSection, index: number) => (
                <motion.button
                  key={section.id}
                  onClick={() => handleNavClick(section.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    activeId === section.id
                      ? 'text-accent bg-accent/10'
                      : 'text-muted hover:text-ink hover:bg-surface-2/50'
                  }`}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: prefersReducedMotion ? 0 : index * 0.1 }}
                  aria-current={activeId === section.id ? 'page' : undefined}
                >
                  {section.label}
                </motion.button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

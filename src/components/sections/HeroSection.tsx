import { motion } from 'framer-motion'
import { Download, Github, Linkedin, Mail } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { Button } from '../ui/Button'

export function HeroSection() {
  const profile = useProfile()
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-accent via-accent-3 to-accent-2 ${
            prefersReducedMotion ? '' : 'animate-gradient-shift'
          }`}
          style={{
            background: prefersReducedMotion 
              ? 'linear-gradient(135deg, #D2B6A1 0%, #DCA293 50%, #EFD2BC 100%)'
              : undefined
          }}
        />
        <div className="absolute inset-0 bg-bg/85" />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Profile Image */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
          className="mb-8"
        >
          <div className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto rounded-full overflow-hidden ring-4 ring-accent-3/30 shadow-2xl shadow-accent-3/20 hover:ring-accent/40 transition-all duration-500">
            <motion.img
              src="/src/assets/profile.jpg"
              alt={profile.name}
              width="224"
              height="224"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-4">
            <span className="bg-gradient-to-r from-accent via-accent-3 to-accent-2 bg-clip-text text-transparent animate-gradient-x">
              {profile.name}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-accent font-medium mb-6">
            {profile.title}
          </p>
          
          <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed mb-8">
            {profile.summary}
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            <Button
              as="a"
              href="/CV_Final.pdf"
              download="Adrian_Montes_CV.pdf"
              variant="primary"
              className="group"
            >
              <Download size={20} className="group-hover:animate-bounce" />
              Download CV
            </Button>
            
            <Button
              as="a"
              href={`https://${profile.github}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
            >
              <Github size={20} />
              GitHub
            </Button>
            
            <Button
              as="a"
              href={`https://${profile.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
            >
              <Linkedin size={20} />
              LinkedIn
            </Button>
            
            <Button
              as="a"
              href={`mailto:${profile.email}`}
              variant="outline"
            >
              <Mail size={20} />
              Email Me
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-muted"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

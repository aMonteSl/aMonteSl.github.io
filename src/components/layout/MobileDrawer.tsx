import { motion } from 'framer-motion';
import { X, MapPin, Mail, Phone, Github, Linkedin, Download } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { QuickNav } from './QuickNav';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const profile = useProfile();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ 
          type: prefersReducedMotion ? 'tween' : 'spring',
          damping: prefersReducedMotion ? undefined : 25,
          stiffness: prefersReducedMotion ? undefined : 200,
          duration: prefersReducedMotion ? 0.3 : undefined
        }}
        className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-surface-1/95 border-r border-surface-2/50 shadow-2xl overflow-y-auto backdrop-blur-xl safe-area-padding"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-2/50">
          <h2 className="text-lg font-bold text-accent">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-accent hover:text-accent bg-surface-2/20 border border-surface-2/30 hover:bg-surface-2/30 hover:border-surface-2/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="p-6 text-center border-b border-surface-2/50">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-2 ring-accent/20 shadow-lg mb-4 bg-accent/10">
            <img
              src="/headshot.jpg"
              alt={profile.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden w-full h-full bg-accent flex items-center justify-center text-2xl font-bold text-background">
              {profile.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
          </div>
          <h3 className="text-lg font-bold text-accent mb-1 balance">{profile.name}</h3>
          <p className="text-muted font-medium text-sm balance">{profile.title}</p>
        </div>

        {/* Contact Information */}
        <div className="p-6 border-b border-surface-2/50">
          <h4 className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            Contact
          </h4>
          <div className="space-y-3">
            <ContactItem
              icon={MapPin}
              text={profile.location}
              href={`https://maps.google.com/?q=${encodeURIComponent(profile.location)}`}
            />
            <ContactItem
              icon={Mail}
              text={profile.email}
              href={`mailto:${profile.email}`}
            />
            <ContactItem
              icon={Phone}
              text={profile.phone}
              href={`tel:${profile.phone}`}
            />
            <ContactItem
              icon={Github}
              text="GitHub"
              href={profile.github}
              external
            />
            <ContactItem
              icon={Linkedin}
              text="LinkedIn"
              href={profile.linkedin}
              external
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 border-b border-surface-2/50">
          <h4 className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            Navigation
          </h4>
          <div onClick={onClose}>
            <QuickNav />
          </div>
        </div>

        {/* Resume Download */}
        <div className="p-6">
          <a
            href="/CV_Final.pdf"
            download="Adrian_Montes_CV.pdf"
            onClick={onClose}
            className="flex items-center gap-3 w-full p-3 rounded-lg bg-accent hover:bg-accent/90 text-background font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-surface-1"
          >
            <Download size={18} />
            Download CV
          </a>
        </div>
      </motion.div>
    </>
  );
}

interface ContactItemProps {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  text: string;
  href: string;
  external?: boolean;
}

function ContactItem({ icon: Icon, text, href, external = false }: ContactItemProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-3 text-sm text-muted hover:text-accent transition-colors duration-200 group p-2 rounded-lg hover:bg-surface-2/20 focus:outline-none focus:ring-2 focus:ring-accent/50"
    >
      <Icon size={16} className="text-accent group-hover:text-accent transition-colors duration-200" />
      <span className="truncate">{text}</span>
    </a>
  );
}

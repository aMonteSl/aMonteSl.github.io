import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Github, Linkedin, Download } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { QuickNav } from './QuickNav';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

export function Sidebar() {
  const profile = useProfile();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
      className="w-full h-full bg-surface-1 border-r border-surface-2 flex flex-col"
    >
      {/* Portrait Section */}
      <div className="p-fluid-lg text-center border-b border-surface-2">
        <div className="relative mb-fluid-md">
          <div className="w-32 h-32 xl:w-36 xl:h-36 2xl:w-40 2xl:h-40 mx-auto rounded-full overflow-hidden ring-2 ring-accent/20 shadow-2xl shadow-accent/10">
            <img
              src="/src/assets/profile.jpg"
              alt={profile.name}
              width="160"
              height="160"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              onError={(e) => {
                // Fallback to initials if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback initials */}
            <div className="hidden w-full h-full bg-accent flex items-center justify-center text-3xl xl:text-4xl font-bold text-bg">
              {profile.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-surface-1 animate-pulse"></div>
        </div>
        
        <h1 className="text-xl xl:text-2xl font-bold text-ink mb-2 balance">
          {profile.name}
        </h1>
        <p className="text-accent font-medium mb-fluid-sm text-sm xl:text-base">
          {profile.title}
        </p>
        <p className="text-sm text-muted leading-relaxed max-w-readable mx-auto pretty">
          {profile.summary}
        </p>
      </div>

      {/* Contact Information */}
      <div className="p-fluid-lg border-b border-surface-2">
        <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-fluid-sm">
          Contact
        </h2>
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

      {/* Quick Navigation */}
      <div className="flex-1 p-fluid-lg">
        <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-fluid-sm">
          Navigation
        </h2>
        <QuickNav />
      </div>

      {/* Resume Download */}
      <div className="p-fluid-lg border-t border-surface-2">
        <a
          href="/CV_Final.pdf"
          download="Adrian_Montes_CV.pdf"
          className="flex items-center gap-3 w-full p-3 xl:p-4 rounded-lg bg-accent hover:bg-accent/90 focus:bg-accent/90 text-bg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 focus:shadow-lg focus:shadow-accent/20 transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none focus:ring-3 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface-1"
        >
          <Download size={18} />
          <span className="text-sm xl:text-base">Download CV</span>
        </a>
      </div>
    </motion.div>
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
      className="flex items-center gap-3 text-sm text-muted hover:text-ink transition-colors duration-200 group focus:text-ink focus:outline-none rounded-md p-2 -m-2 focus:ring-2 focus:ring-accent/50"
    >
      <Icon 
        size={16} 
        className="text-accent group-hover:text-accent/80 group-focus:text-accent/80 transition-colors duration-200 flex-shrink-0" 
      />
      <span className="truncate">{text}</span>
    </a>
  );
}

import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

interface MobileTopbarProps {
  onMenuClick: () => void;
}

export function MobileTopbar({ onMenuClick }: MobileTopbarProps) {
  const profile = useProfile();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.header
      initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-surface-2/50 px-4 py-3 safe-area-padding-top"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-accent/20 bg-accent/10">
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
            <div className="hidden w-full h-full bg-accent flex items-center justify-center text-sm font-bold text-background">
              {profile.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-accent truncate">{profile.name}</h1>
            <p className="text-xs text-muted truncate">{profile.title}</p>
          </div>
        </div>
        
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg bg-surface-1/50 border border-surface-2/50 hover:bg-surface-1 hover:border-surface-2 text-accent hover:text-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
      </div>
    </motion.header>
  );
}

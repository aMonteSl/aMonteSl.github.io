import { motion } from 'framer-motion';
import { Send, MessageCircle, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useProfile } from '../../hooks/useProfile';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

export function ContactSection() {
  const profile = useProfile();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section 
      id="contact" 
      className="py-20 px-6 bg-gradient-to-b from-bg to-surface-1/20"
    >
      <div className="max-w-content mx-auto">
        <SectionHeader
          title="Get In Touch"
          subtitle="Let's build something amazing together"
        />
        
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="grid gap-fluid-xl lg:grid-cols-2 max-w-7xl mx-auto"
        >
          {/* Contact Information */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            <Card className="p-fluid-lg xl:p-fluid-xl bg-surface-1/80 border-surface-2/50 backdrop-blur-sm hover:bg-surface-1 hover:border-surface-2 transition-all duration-300 h-full">
              <div className="flex items-center gap-3 mb-fluid-lg">
                <div className="w-8 h-8 xl:w-10 xl:h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20">
                  <MessageCircle className="text-accent w-5 h-5 xl:w-6 xl:h-6" />
                </div>
                <h3 className="text-xl xl:text-2xl font-bold text-accent balance">Let's Connect</h3>
              </div>
              
              <p className="text-muted mb-fluid-xl leading-relaxed text-base xl:text-lg pretty">
                I'm always interested in discussing new opportunities, innovative projects, 
                or collaborations. Whether you have a question, want to work together, or 
                just want to say hello, I'd love to hear from you.
              </p>
              
              <div className="space-y-fluid-md">
                <ContactItem
                  icon={Mail}
                  label="Email"
                  value={profile.email}
                  href={`mailto:${profile.email}`}
                />
                <ContactItem
                  icon={Phone}
                  label="Phone"
                  value={profile.phone}
                  href={`tel:${profile.phone}`}
                />
                <ContactItem
                  icon={MapPin}
                  label="Location"
                  value={profile.location}
                  href={`https://maps.google.com/?q=${encodeURIComponent(profile.location)}`}
                />
              </div>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            <Card className="p-fluid-lg xl:p-fluid-xl bg-surface-1/80 border-surface-2/50 backdrop-blur-sm hover:bg-surface-1 hover:border-surface-2 transition-all duration-300 h-full">
              <div className="flex items-center gap-3 mb-fluid-lg">
                <div className="w-8 h-8 xl:w-10 xl:h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20">
                  <Send className="text-accent w-5 h-5 xl:w-6 xl:h-6" />
                </div>
                <h3 className="text-xl xl:text-2xl font-bold text-accent balance">Send a Message</h3>
              </div>
              
              <form 
                action={`mailto:${profile.email}`}
                method="get"
                encType="text/plain"
                className="space-y-fluid-lg"
              >
                <div>
                  <label htmlFor="name" className="block text-sm xl:text-base font-medium text-accent mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 xl:px-5 xl:py-4 bg-surface-2/20 border border-surface-2/50 rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 text-sm xl:text-base"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm xl:text-base font-medium text-accent mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 xl:px-5 xl:py-4 bg-surface-2/20 border border-surface-2/50 rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 text-sm xl:text-base"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm xl:text-base font-medium text-accent mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 xl:px-5 xl:py-4 bg-surface-2/20 border border-surface-2/50 rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 text-sm xl:text-base"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm xl:text-base font-medium text-accent mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="body"
                    rows={5}
                    required
                    className="w-full px-4 py-3 xl:px-5 xl:py-4 bg-surface-2/20 border border-surface-2/50 rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 resize-none text-sm xl:text-base"
                    placeholder="Tell me more about your project or idea..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-accent text-background hover:bg-accent/90 border-accent hover:border-accent/90 text-base xl:text-lg py-3 xl:py-4"
                >
                  <Send size={18} />
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

interface ContactItemProps {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  value: string;
  href: string;
}

function ContactItem({ icon: Icon, label, value, href }: ContactItemProps) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-fluid-md p-3 xl:p-4 rounded-lg hover:bg-surface-2/20 transition-colors duration-200 group border border-transparent hover:border-surface-2/30"
    >
      <div className="w-10 h-10 xl:w-12 xl:h-12 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors duration-200 flex items-center justify-center border border-accent/20 group-hover:border-accent/30">
        <Icon size={18} className="text-accent xl:w-5 xl:h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm xl:text-base text-muted">{label}</p>
        <p className="text-accent font-medium text-base xl:text-lg truncate">{value}</p>
      </div>
      {href.startsWith('http') && (
        <ExternalLink size={16} className="text-accent/60 group-hover:text-accent transition-colors duration-200" />
      )}
    </a>
  );
}

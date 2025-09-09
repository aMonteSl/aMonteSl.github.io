import { motion } from 'framer-motion'
import { Download, Printer, FileText } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useProfile } from '../../hooks/useProfile'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

export function ResumeSection() {
  const profile = useProfile()
  const prefersReducedMotion = usePrefersReducedMotion()

  const handlePrint = () => {
    window.print()
  }

  return (
    <section id="resume" className="py-20 px-6 bg-gradient-to-b from-surface-1/20 to-bg">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Resume & CV"
          subtitle="Download or view my complete professional resume"
        />

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="mt-12"
        >
          <Card className="p-8 text-center bg-surface-1/50 border-surface-2/50">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-ink mb-2">
                Professional Resume
              </h3>
              <p className="text-muted max-w-lg mx-auto">
                A comprehensive overview of my education, experience, skills, and achievements in software development and telematics engineering.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                as="a"
                href="/CV_Final.pdf"
                download="Adrian_Montes_CV.pdf"
                variant="primary"
                className="group"
              >
                <Download size={20} className="group-hover:animate-bounce" />
                Download PDF
              </Button>
              
              <Button
                as="a"
                href="/CV_Final.pdf"
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                <FileText size={20} />
                View Online
              </Button>
              
              <Button
                onClick={handlePrint}
                variant="outline"
              >
                <Printer size={20} />
                Print Page
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-surface-2/50">
              <p className="text-sm text-muted">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.2 }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          <Card className="p-6 text-center bg-surface-1/30 border-surface-2/30">
            <h4 className="font-semibold text-accent mb-2">Education</h4>
            <p className="text-sm text-muted">Telematics Engineering Student at URJC</p>
          </Card>
          
          <Card className="p-6 text-center bg-surface-1/30 border-surface-2/30">
            <h4 className="font-semibold text-accent mb-2">Location</h4>
            <p className="text-sm text-muted">{profile.location}</p>
          </Card>
          
          <Card className="p-6 text-center bg-surface-1/30 border-surface-2/30">
            <h4 className="font-semibold text-accent mb-2">Contact</h4>
            <p className="text-sm text-muted">{profile.email}</p>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

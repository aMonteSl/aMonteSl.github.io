import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              Page Not Found
            </h2>
            <p className="text-text-muted">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button as={Link} to="/" variant="primary">
              Go Home
            </Button>
            <div>
              <Button as={Link} to="/projects" variant="ghost">
                View Projects
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

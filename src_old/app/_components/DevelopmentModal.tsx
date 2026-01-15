'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../_i18n/I18nProvider'
import { Button } from './Button'

interface DevelopmentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DevelopmentModal({ isOpen, onClose }: DevelopmentModalProps) {
  const { t } = useI18n()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-auto border border-gray-200 dark:border-gray-700">
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">🚧</div>
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t('development.title')}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {t('development.message')}
                </p>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {t('development.thanks')}
                </p>
                
                <Button 
                  onClick={onClose}
                  className="w-full"
                >
                  Entendido / Got it
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

'use client'

import { useTranslations } from '@/i18n'
import { Modal, Button } from '@/components/ui'

export interface DevelopmentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DevelopmentModal({ isOpen, onClose }: DevelopmentModalProps) {
  const t = useTranslations('development')

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 text-center">
        <div className="text-4xl mb-4">🚧</div>

        <h2 className="text-xl font-semibold text-[var(--fg)] mb-3">
          {t('title')}
        </h2>

        <p className="text-[var(--fg-muted)] mb-4 leading-relaxed">
          {t('message')}
        </p>

        <p className="text-sm text-[var(--fg-muted)]/70 mb-6">
          {t('thanks')}
        </p>

        <Button
          onClick={onClose}
          className="w-full"
        >
          {t('dismiss')}
        </Button>
      </div>
    </Modal>
  )
}

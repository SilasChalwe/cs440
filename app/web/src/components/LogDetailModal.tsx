import { useEffect, useRef } from 'react'
import type { AccessLog } from '../types/domain'

interface LogDetailModalProps {
  open: boolean
  log: AccessLog | null
  onClose: () => void
}

export function LogDetailModal({ open, log, onClose }: LogDetailModalProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    closeRef.current?.focus()

    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose, open])

  if (!open || !log) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="log-detail-title">
        <h2 id="log-detail-title">Log Detail</h2>
        <p>
          <strong>Actor:</strong> {log.userId} ({log.role})
        </p>
        <p>
          <strong>Action:</strong> {log.action}
        </p>
        <p>
          <strong>Student:</strong> {log.studentId ?? 'N/A'}
        </p>
        <p>
          <strong>Bank:</strong> {log.bankId ?? 'N/A'}
        </p>
        <p>
          <strong>Outcome:</strong> {log.result === 'denied' ? 'Blocked' : 'Success'}
        </p>
        <p>
          <strong>Reason:</strong> {log.details}
        </p>
        <div className="modal-actions">
          <button ref={closeRef} type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

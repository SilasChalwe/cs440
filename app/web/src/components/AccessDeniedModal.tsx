import { useEffect, useRef } from 'react'

interface AccessDeniedModalProps {
  open: boolean
  onClose: () => void
  detail?: string
}

export function AccessDeniedModal({ open, onClose, detail }: AccessDeniedModalProps) {
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

  if (!open) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="access-denied-title">
        <h2 id="access-denied-title">Security Warning</h2>
        <p>
          Security Warning: Attempted access to conflicting bank data has been blocked. This event has been logged.
        </p>
        {detail ? <p className="text-muted">{detail}</p> : null}
        <p>Return to your assigned student list or contact a university administrator if assignments must change.</p>
        <div className="modal-actions">
          <button ref={closeRef} type="button" onClick={onClose}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}

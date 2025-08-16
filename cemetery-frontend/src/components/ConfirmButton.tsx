import React, { useState } from 'react'
import Modal from './ui/Modal'

type Props = {
    onConfirm: () => void | Promise<void>
    children: React.ReactNode
    title?: string
    label?: string
    className?: string
}

export default function ConfirmButton({ onConfirm, children, title = 'Are you sure?', label = 'Delete', className }: Props) {
    const [open, setOpen] = useState(false)
    const [busy, setBusy] = useState(false)

    return (
        <>
            <button className={className ?? 'btn'} onClick={() => setOpen(true)}>{children}</button>
            <Modal open={open} onOpenChange={setOpen} title={title} description="This action cannot be undone.">
                <div className="flex justify-end gap-2">
                    <button className="btn" onClick={() => setOpen(false)}>Cancel</button>
                    <button
                        className="btn-danger"
                        disabled={busy}
                        onClick={async () => {
                            setBusy(true)
                            try { await onConfirm(); setOpen(false) } finally { setBusy(false) }
                        }}
                    >
                        {busy ? 'Working…' : label}
                    </button>
                </div>
            </Modal>
        </>
    )
}

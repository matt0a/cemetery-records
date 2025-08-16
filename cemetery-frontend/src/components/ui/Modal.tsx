import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import React from 'react'

type ModalProps = {
    open: boolean
    onOpenChange: (v: boolean) => void
    title?: string
    description?: string
    children: React.ReactNode
    maxWidthClass?: string
    /** optional extra classes for the white card */
    contentClassName?: string
}

export default function Modal({
                                  open,
                                  onOpenChange,
                                  title,
                                  description,
                                  children,
                                  maxWidthClass = 'max-w-lg',
                                  contentClassName = '',
                              }: ModalProps) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <AnimatePresence>
                {open && (
                    <Dialog.Portal forceMount>
                        {/* Dim / blur overlay */}
                        <Dialog.Overlay asChild>
                            <motion.div
                                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        </Dialog.Overlay>

                        {/* Fullscreen flex container keeps content centered at all sizes */}
                        <Dialog.Content asChild>
                            <motion.div
                                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            >
                                {/* The card */}
                                <div
                                    className={`w-full ${maxWidthClass} rounded-2xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none max-h-[85vh] overflow-y-auto ${contentClassName}`}
                                >
                                    {/* Sticky header so the close button stays visible while scrolling */}
                                    <div className="p-4 border-b flex items-start justify-between gap-4 sticky top-0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                                        <div>
                                            {title && (
                                                <Dialog.Title className="text-lg font-semibold text-charcoal">
                                                    {title}
                                                </Dialog.Title>
                                            )}
                                            {description && (
                                                <Dialog.Description className="text-sm text-gray-500 mt-0.5">
                                                    {description}
                                                </Dialog.Description>
                                            )}
                                        </div>
                                        <Dialog.Close className="btn px-2 py-1 text-sm shrink-0" aria-label="Close">
                                            <X className="h-4 w-4" />
                                        </Dialog.Close>
                                    </div>

                                    <div className="p-4">{children}</div>
                                </div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    )
}

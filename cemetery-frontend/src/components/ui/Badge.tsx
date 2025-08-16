import { twMerge } from 'tailwind-merge'
import React from 'react'

type Props = {
    children: React.ReactNode
    color?: 'gray' | 'green' | 'red' | 'blue'
    className?: string
}

export default function Badge({ children, color = 'gray', className }: Props) {
    const map = {
        gray: 'bg-gray-100 text-gray-700 ring-gray-200',
        green: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
        red: 'bg-rose-100 text-rose-700 ring-rose-200',
        blue: 'bg-blue-100 text-blue-700 ring-blue-200',
    } as const

    return (
        <span
            className={twMerge(
                `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${map[color]}`,
                className
            )}
        >
      {children}
    </span>
    )
}

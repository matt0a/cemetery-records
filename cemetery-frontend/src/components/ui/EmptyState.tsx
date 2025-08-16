type Props = { title: string; subtitle?: string; action?: React.ReactNode }
export default function EmptyState({ title, subtitle, action }: Props) {
    return (
        <div className="text-center py-10">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">🪦</div>
            <h3 className="text-base font-semibold text-charcoal">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    )
}

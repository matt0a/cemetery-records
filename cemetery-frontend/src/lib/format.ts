import { format, parseISO } from 'date-fns'

export function fmtDate(d?: string | null) {
    if (!d) return '—'
    try {
        return format(typeof d === 'string' ? parseISO(d) : d, 'MMM d, yyyy')
    } catch {
        return d?.toString() ?? '—'
    }
}

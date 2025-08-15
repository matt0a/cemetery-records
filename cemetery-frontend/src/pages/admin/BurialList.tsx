import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listBurialRecords, patchBurialRecord, deleteBurialRecord, type BurialRecord } from '@api/burials'
import toast from 'react-hot-toast'

function Row({ r }: { r: BurialRecord }) {
    const qc = useQueryClient()
    const [editing, setEditing] = useState(false)
    const [date, setDate] = useState(r.burialDate || '')
    const [notes, setNotes] = useState(r.notes || '')

    const save = useMutation({
        mutationFn: (payload: { burialDate?: string; notes?: string }) => patchBurialRecord(r.id, payload),
        onSuccess: () => {
            toast.success('Updated')
            setEditing(false)
            qc.invalidateQueries({ queryKey: ['burials'] })
            qc.invalidateQueries({ queryKey: ['admin-people'] })
            qc.invalidateQueries({ queryKey: ['admin-plots'] })
            qc.invalidateQueries({ queryKey: ['deceased'] })
        },
        onError: () => toast.error('Update failed'),
    })

    const del = useMutation({
        mutationFn: () => deleteBurialRecord(r.id),
        // Optimistically remove from list so UI updates even before refetch
        onMutate: async () => {
            await qc.cancelQueries({ queryKey: ['burials'] })
            const prev = qc.getQueryData<BurialRecord[]>(['burials'])
            if (prev) qc.setQueryData<BurialRecord[]>(['burials'], prev.filter(b => b.id !== r.id))
            return { prev }
        },
        onError: (_err, _v, ctx) => {
            // rollback if server failed
            if (ctx?.prev) qc.setQueryData(['burials'], ctx.prev)
            toast.error('Delete failed')
        },
        onSuccess: () => {
            toast.success('Deleted')
        },
        onSettled: () => {
            // always refetch authoritative state and dependent lists
            qc.invalidateQueries({ queryKey: ['burials'] })
            qc.invalidateQueries({ queryKey: ['admin-people'] })
            qc.invalidateQueries({ queryKey: ['admin-plots'] })
            qc.invalidateQueries({ queryKey: ['deceased'] })
        },
    })

    return (
        <tr className="border-b last:border-none">
            <td className="py-2 pr-2">{r.id}</td>
            <td className="py-2 pr-2">
                {editing ? (
                    <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                ) : (r.burialDate || '—')}
            </td>
            <td className="py-2 pr-2">
                {editing ? (
                    <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} />
                ) : (r.notes || '—')}
            </td>
            <td className="py-2 pr-2">
                {editing ? (
                    <div className="flex gap-2">
                        <button className="btn-primary"
                                onClick={() => save.mutate({ burialDate: date || undefined, notes: notes || undefined })}>
                            Save
                        </button>
                        <button className="btn"
                                onClick={() => { setEditing(false); setDate(r.burialDate || ''); setNotes(r.notes || '') }}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button className="btn" onClick={() => setEditing(true)}>Edit</button>
                        <button className="btn" onClick={() => { if (confirm('Delete this burial record?')) del.mutate() }}>
                            Delete
                        </button>
                    </div>
                )}
            </td>
        </tr>
    )
}

export default function BurialList() {
    const { data, isLoading } = useQuery({ queryKey: ['burials'], queryFn: listBurialRecords })
    return (
        <div className="card">
            <h2 className="text-xl font-semibold mb-3">Burial Records</h2>
            {isLoading && <p>Loading…</p>}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left border-b">
                        <th className="py-2 pr-2">ID</th>
                        <th className="py-2 pr-2">Date</th>
                        <th className="py-2 pr-2">Notes</th>
                        <th className="py-2 pr-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(data ?? []).map((r) => <Row key={r.id} r={r} />)}
                    {(!isLoading && (data ?? []).length === 0) && (
                        <tr><td className="py-4 text-gray-600" colSpan={4}>No burial records.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

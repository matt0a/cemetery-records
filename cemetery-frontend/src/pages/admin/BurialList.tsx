import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listBurialRecords, patchBurialRecord, deleteBurialRecord, type BurialRecord } from '@api/burials'
import toast from 'react-hot-toast'
import ConfirmButton from '@components/ConfirmButton'
import Spinner from '@components/ui/Spinner'
import { fmtDate } from '@lib/format'

function Row({ r }: { r: BurialRecord }) {
    const qc = useQueryClient()
    const [editing, setEditing] = useState(false)
    const [date, setDate] = useState(r.burialDate || '')
    const [notes, setNotes] = useState(r.notes || '')

    const save = useMutation({
        mutationFn: (payload: { burialDate?: string; notes?: string }) => patchBurialRecord(r.id, payload),
        onSuccess: () => { toast.success('Updated'); qc.invalidateQueries({ queryKey: ['burials'] }) },
        onError: () => toast.error('Update failed'),
    })

    const del = useMutation({
        mutationFn: () => deleteBurialRecord(r.id),
        onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['burials'] }) },
        onError: () => toast.error('Delete failed'),
    })

    return (
        <tr className="border-b last:border-none odd:bg-white even:bg-gray-50">
            <td className="py-2 px-3 text-gray-500">{r.id}</td>
            <td className="py-2 px-3">
                {editing
                    ? <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    : <span>{fmtDate(r.burialDate)}</span>}
            </td>
            <td className="py-2 px-3">
                {editing
                    ? <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    : <span className="line-clamp-1">{r.notes || '—'}</span>}
            </td>
            <td className="py-2 px-3 text-right">
                {editing ? (
                    <div className="inline-flex gap-2">
                        <button
                            className="btn-primary"
                            onClick={() => save.mutate({ burialDate: date || undefined, notes: notes || undefined })}
                        >Save</button>
                        <button
                            className="btn"
                            onClick={() => { setEditing(false); setDate(r.burialDate || ''); setNotes(r.notes || '') }}
                        >Cancel</button>
                    </div>
                ) : (
                    <div className="inline-flex gap-2">
                        <button className="btn" onClick={() => setEditing(true)}>Edit</button>
                        <ConfirmButton className="btn-danger" label="Delete" title="Delete burial record?" onConfirm={() => del.mutate()}>
                            Delete
                        </ConfirmButton>
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
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Burial Records</h2>
            </div>

            <div className="overflow-x-auto mt-3 rounded-xl ring-1 ring-gray-100">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="text-left border-b">
                        <th className="py-2 px-3 w-16">ID</th>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Notes</th>
                        <th className="py-2 px-3 w-[190px] text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading && (
                        <tr><td colSpan={4} className="py-6 px-3"><div className="flex items-center gap-2"><Spinner /> Loading…</div></td></tr>
                    )}
                    {!isLoading && (data ?? []).length === 0 && (
                        <tr><td colSpan={4} className="py-10"><div className="text-center text-gray-600">No records.</div></td></tr>
                    )}
                    {(data ?? []).map((r) => <Row key={r.id} r={r} />)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

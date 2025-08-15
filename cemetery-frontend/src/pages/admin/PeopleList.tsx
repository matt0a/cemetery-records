import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminSearchPeople, adminUpdatePerson, adminDeletePerson, type DeceasedPerson } from '@api/deceased'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdminPersonSchema, type AdminPersonValues } from '@/types/schemas'
import toast from 'react-hot-toast'

/** Minimal “axios-like” shape so we can safely read response/status without importing axios types */
type Axiosish = { isAxiosError?: boolean; response?: { status?: number; data?: any } }
function isAxiosErr(e: unknown): e is Axiosish {
    return !!e && typeof e === 'object' && 'isAxiosError' in (e as any)
}

function useDebounced<T>(value: T, delay = 300) {
    const [v, setV] = useState(value)
    useEffect(() => { const id = setTimeout(() => setV(value), delay); return () => clearTimeout(id) }, [value, delay])
    return v
}

function EditModal({ person, onClose }: { person: DeceasedPerson; onClose: () => void }) {
    const qc = useQueryClient()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AdminPersonValues>({
        resolver: zodResolver(AdminPersonSchema),
        defaultValues: {
            firstName: person.firstName,
            lastName: person.lastName,
            dateOfBirth: person.dateOfBirth || '',
            dateOfDeath: person.dateOfDeath || '',
            gender: (person.gender as any) ?? 'OTHER',
        },
    })

    const { mutateAsync } = useMutation({
        mutationFn: (payload: AdminPersonValues) => adminUpdatePerson(person.id, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-people'] }),
    })

    const onSubmit = async (values: AdminPersonValues) => {
        try {
            await mutateAsync(values)
            toast.success('Person updated')
            onClose()
        } catch {
            toast.error('Update failed')
        }
    }

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">Edit Person</h3>
                        <button className="btn" onClick={onClose}>Close</button>
                    </div>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block mb-1">First Name</label>
                            <input className="input" {...register('firstName')} />
                            {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName.message}</p>}
                        </div>
                        <div>
                            <label className="block mb-1">Last Name</label>
                            <input className="input" {...register('lastName')} />
                            {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName.message}</p>}
                        </div>
                        <div>
                            <label className="block mb-1">Date of Birth</label>
                            <input className="input" type="date" {...register('dateOfBirth')} />
                        </div>
                        <div>
                            <label className="block mb-1">Date of Death</label>
                            <input className="input" type="date" {...register('dateOfDeath')} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block mb-1">Gender</label>
                            <select className="input" {...register('gender')}>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex gap-2 pt-1">
                            <button className="btn" type="button" onClick={onClose}>Cancel</button>
                            <button className="btn-primary ml-auto" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function PeopleList() {
    const [q, setQ] = useState('')
    const dq = useDebounced(q)
    const [editing, setEditing] = useState<DeceasedPerson | null>(null)

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-people', dq],
        queryFn: () => adminSearchPeople(dq),
    })

    useEffect(() => { refetch() }, [dq, refetch])
    const people = useMemo(() => data ?? [], [data])
    const qc = useQueryClient()

    const del = useMutation({
        mutationFn: (id: number) => adminDeletePerson(id),
        onSuccess: () => {
            toast.success('Deleted')
            qc.invalidateQueries({ queryKey: ['admin-people'] })
        },
        onError: (err: unknown) => {
            if (isAxiosErr(err)) {
                if (err.response?.status === 409) {
                    const data = err.response?.data as { error?: string; burialCount?: number } | undefined
                    const msg = data?.error ?? 'Cannot delete: linked burial records exist.'
                    const count = data?.burialCount
                    toast.error(count ? `${msg} (${count})` : msg)
                    return
                }
            }
            toast.error('Delete failed')
        },
    })

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">People</h2>
                <input className="input w-64" placeholder="Search name…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>

            {isLoading && <p>Loading…</p>}

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left border-b">
                        <th className="py-2 pr-2">ID</th>
                        <th className="py-2 pr-2">Name</th>
                        <th className="py-2 pr-2">DOB</th>
                        <th className="py-2 pr-2">DOD</th>
                        <th className="py-2 pr-2">Gender</th>
                        <th className="py-2 pr-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {people.map(p => (
                        <tr key={p.id} className="border-b last:border-none">
                            <td className="py-2 pr-2">{p.id}</td>
                            <td className="py-2 pr-2">{p.firstName} {p.lastName}</td>
                            <td className="py-2 pr-2">{p.dateOfBirth || '—'}</td>
                            <td className="py-2 pr-2">{p.dateOfDeath || '—'}</td>
                            <td className="py-2 pr-2">{p.gender || '—'}</td>
                            <td className="py-2 pr-2">
                                <div className="flex gap-2">
                                    <button className="btn" onClick={() => setEditing(p)}>Edit</button>
                                    <button className="btn" onClick={() => { if (confirm('Delete this person?')) del.mutate(p.id) }}>
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {people.length === 0 && !isLoading && (
                        <tr><td className="py-4 text-gray-600" colSpan={6}>No matches.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            {editing && <EditModal person={editing} onClose={() => setEditing(null)} />}
        </div>
    )
}

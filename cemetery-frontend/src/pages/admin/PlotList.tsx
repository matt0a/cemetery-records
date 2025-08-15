import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminSearchPlots, adminUpdatePlot, adminDeletePlot, type GravePlot } from '@api/plots'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdminPlotSchema, type AdminPlotValues } from '@/types/schemas'
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

function EditModal({ plot, onClose }: { plot: GravePlot; onClose: () => void }) {
    const qc = useQueryClient()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AdminPlotValues>({
        resolver: zodResolver(AdminPlotSchema),
        defaultValues: {
            section: plot.section || '',
            plotNumber: plot.plotNumber || '',
            locationDescription: plot.locationDescription || '',
        },
    })

    const { mutateAsync } = useMutation({
        mutationFn: (payload: AdminPlotValues) => adminUpdatePlot(plot.id, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-plots'] }),
    })

    const onSubmit = async (values: AdminPlotValues) => {
        try {
            await mutateAsync(values)
            toast.success('Plot updated')
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
                        <h3 className="text-lg font-semibold">Edit Plot</h3>
                        <button className="btn" onClick={onClose}>Close</button>
                    </div>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block mb-1">Section</label>
                            <input className="input" {...register('section')} />
                            {errors.section && <p className="text-red-600 text-sm">{errors.section.message}</p>}
                        </div>
                        <div>
                            <label className="block mb-1">Plot Number</label>
                            <input className="input" {...register('plotNumber')} />
                            {errors.plotNumber && <p className="text-red-600 text-sm">{errors.plotNumber.message}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block mb-1">Location Description</label>
                            <input className="input" {...register('locationDescription')} />
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

export default function PlotList() {
    const [section, setSection] = useState('')
    const [plotNumber, setPlotNumber] = useState('')
    const dSection = useDebounced(section)
    const dPlot = useDebounced(plotNumber)
    const [editing, setEditing] = useState<GravePlot | null>(null)

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-plots', dSection, dPlot],
        queryFn: () => adminSearchPlots({ section: dSection, plotNumber: dPlot }),
    })

    useEffect(() => { refetch() }, [dSection, dPlot, refetch])
    const plots = useMemo(() => data ?? [], [data])
    const qc = useQueryClient()

    const del = useMutation({
        mutationFn: (id: number) => adminDeletePlot(id),
        onSuccess: () => {
            toast.success('Deleted')
            qc.invalidateQueries({ queryKey: ['admin-plots'] })
        },
        onError: (err: unknown) => {
            if (isAxiosErr(err)) {
                if (err.response?.status === 409) {
                    const data = err.response?.data as { error?: string; burialCount?: number } | undefined
                    const msg = data?.error ?? 'Cannot delete: plot is used by burial records.'
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
            <div className="flex flex-wrap items-center gap-2 mb-3">
                <h2 className="text-xl font-semibold mr-auto">Plots</h2>
                <input className="input w-40" placeholder="Section" value={section} onChange={(e) => setSection(e.target.value)} />
                <input className="input w-40" placeholder="Plot Number" value={plotNumber} onChange={(e) => setPlotNumber(e.target.value)} />
            </div>

            {isLoading && <p>Loading…</p>}

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left border-b">
                        <th className="py-2 pr-2">ID</th>
                        <th className="py-2 pr-2">Section</th>
                        <th className="py-2 pr-2">Plot #</th>
                        <th className="py-2 pr-2">Location</th>
                        <th className="py-2 pr-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {plots.map(p => (
                        <tr key={p.id} className="border-b last:border-none">
                            <td className="py-2 pr-2">{p.id}</td>
                            <td className="py-2 pr-2">{p.section || '—'}</td>
                            <td className="py-2 pr-2">{p.plotNumber || '—'}</td>
                            <td className="py-2 pr-2">{p.locationDescription || '—'}</td>
                            <td className="py-2 pr-2">
                                <div className="flex gap-2">
                                    <button className="btn" onClick={() => setEditing(p)}>Edit</button>
                                    <button className="btn" onClick={() => { if (confirm('Delete this plot?')) del.mutate(p.id) }}>
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {plots.length === 0 && !isLoading && (
                        <tr><td className="py-4 text-gray-600" colSpan={5}>No matches.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            {editing && <EditModal plot={editing} onClose={() => setEditing(null)} />}
        </div>
    )
}

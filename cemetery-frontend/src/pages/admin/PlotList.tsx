import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminSearchPlots, adminDeletePlot, type GravePlot } from '@api/plots' // your existing helpers
import toast from 'react-hot-toast'
import ConfirmButton from '@components/ConfirmButton'
import Spinner from '@components/ui/Spinner'

function useDebounced<T>(value: T, delay = 300) {
    const [v, setV] = useState(value)
    useEffect(() => {
        const id = setTimeout(() => setV(value), delay)
        return () => clearTimeout(id)
    }, [value, delay])
    return v
}

function Row({ p }: { p: GravePlot }) {
    const qc = useQueryClient()
    const del = useMutation({
        mutationFn: () => adminDeletePlot(p.id),
        onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries({ queryKey: ['admin-plots'] }) },
        onError: () => toast.error('Cannot delete plot with burials'),
    })
    return (
        <tr className="border-b last:border-none odd:bg-white even:bg-gray-50">
            <td className="py-2 px-3">{p.id}</td>
            <td className="py-2 px-3">{p.section}</td>
            <td className="py-2 px-3">{p.plotNumber}</td>
            <td className="py-2 px-3">{p.locationDescription ?? '—'}</td>
            <td className="py-2 px-3 text-right">
                <ConfirmButton className="btn-danger" label="Delete" title="Delete plot?" onConfirm={() => del.mutate()}>
                    Delete
                </ConfirmButton>
            </td>
        </tr>
    )
}

export default function PlotList() {
    const [section, setSection] = useState('')
    const [plotNumber, setPlotNumber] = useState('')
    const dSection = useDebounced(section, 250)
    const dPlot = useDebounced(plotNumber, 250)

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-plots', dSection, dPlot],
        queryFn: () => adminSearchPlots({ section: dSection, plotNumber: dPlot }),
    })

    const plots: GravePlot[] = useMemo(() => data ?? [], [data])

    return (
        <div className="card">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold">Plots</h2>
                    <p className="text-sm text-gray-600">Search by section and plot number.</p>
                </div>
                <button className="btn" onClick={() => refetch()}>Refresh</button>
            </div>

            <div className="grid md:grid-cols-3 gap-3 mt-3">
                <div>
                    <label className="block text-sm mb-1">Section</label>
                    <input className="input" value={section} onChange={(e) => setSection(e.target.value)} placeholder="A…" />
                </div>
                <div>
                    <label className="block text-sm mb-1">Plot number</label>
                    <input className="input" value={plotNumber} onChange={(e) => setPlotNumber(e.target.value)} placeholder="17…" />
                </div>
            </div>

            <div className="overflow-x-auto mt-3 rounded-xl ring-1 ring-gray-100">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr className="text-left border-b">
                        <th className="py-2 px-3 w-16">ID</th>
                        <th className="py-2 px-3">Section</th>
                        <th className="py-2 px-3">Plot #</th>
                        <th className="py-2 px-3">Location</th>
                        <th className="py-2 px-3 w-[140px] text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading && (
                        <tr><td colSpan={5} className="py-6 px-3"><div className="flex items-center gap-2"><Spinner /> Loading…</div></td></tr>
                    )}
                    {!isLoading && plots.length === 0 && (
                        <tr><td colSpan={5} className="py-10"><div className="text-center text-gray-600">No plots match.</div></td></tr>
                    )}
                    {plots.map(p => <Row key={p.id} p={p} />)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

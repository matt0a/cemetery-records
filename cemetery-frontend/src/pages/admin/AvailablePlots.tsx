// src/pages/admin/AvailablePlots.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { adminGetAvailablePlots, GravePlot } from '@api/plots'
import EmptyState from '@components/ui/EmptyState'
import Spinner from '@components/ui/Spinner'
import { MapPin } from 'lucide-react'

export default function AvailablePlots() {
    const navigate = useNavigate()

    const [section, setSection] = useState('')
    const [plotNumber, setPlotNumber] = useState('')

    const { data, isFetching, isFetched, refetch } = useQuery<GravePlot[]>({
        queryKey: ['admin-available-plots', { section, plotNumber }],
        queryFn: () => adminGetAvailablePlots({ section, plotNumber }),
    })

    const count = data?.length ?? 0

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="card">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <h1 className="text-xl font-semibold text-charcoal">Available plots</h1>
                    </div>
                    <div className="text-sm text-gray-600">
                        {isFetching ? 'Loading…' : `${count} available`}
                    </div>
                </div>

                {/* Filters */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-sm mb-1">Section</label>
                        <input
                            className="input"
                            placeholder="e.g. A"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Plot number</label>
                        <input
                            className="input"
                            placeholder="e.g. 12"
                            value={plotNumber}
                            onChange={(e) => setPlotNumber(e.target.value)}
                        />
                    </div>
                    <div className="flex items-end gap-2">
                        <button
                            className="btn"
                            onClick={() => {
                                setSection('')
                                setPlotNumber('')
                            }}
                        >
                            Clear
                        </button>
                        <button className="btn-primary" onClick={() => refetch()}>
                            Apply
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="mt-6">
                    {isFetching && (
                        <div className="flex items-center gap-2 py-6">
                            <Spinner /> <span>Loading available plots…</span>
                        </div>
                    )}

                    {isFetched && (data ?? []).length === 0 && (
                        <EmptyState
                            title="No available plots"
                            subtitle="All plots currently have associated burial records."
                        />
                    )}

                    {isFetched && (data ?? []).length > 0 && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {(data ?? []).map((p) => (
                                <div key={p.id} className="card hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold">
                                            Section {p.section ?? '—'} · Plot {p.plotNumber ?? '—'}
                                        </div>
                                        <span className="text-xs rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 ring-1 ring-emerald-200">
                      Available
                    </span>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {p.locationDescription || 'No location description'}
                                    </div>

                                    {/* quick action to start a burial bundle prefilled with this plot */}
                                    <button
                                        className="btn-primary mt-3"
                                        onClick={() => navigate(`/admin/burials/new?plotId=${p.id}`)}
                                    >
                                        Assign to new burial
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

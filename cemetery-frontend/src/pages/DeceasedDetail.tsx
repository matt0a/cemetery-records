import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getDeceasedDetail, type DeceasedDetail } from '@api/deceased'

export default function DeceasedDetail() {
    const { id } = useParams()
    const deceasedId = Number(id)

    const { data, isLoading, error } = useQuery<DeceasedDetail>({
        queryKey: ['deceasedDetail', deceasedId],
        queryFn: () => getDeceasedDetail(deceasedId),
        enabled: Number.isFinite(deceasedId),
    })

    if (!Number.isFinite(deceasedId)) return <div className="p-4">Invalid ID</div>
    if (isLoading) return <div className="p-4">Loading…</div>
    if (error || !data) return <div className="p-4">Not found.</div>

    const gp = data.gravePlot

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="card">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-charcoal">
                        {data.firstName} {data.lastName}
                    </h1>
                    <Link to="/" className="btn">Back to search</Link>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div><span className="font-medium">DOB:</span> {data.dateOfBirth || '—'}</div>
                    <div><span className="font-medium">DOD:</span> {data.dateOfDeath || '—'}</div>
                    <div><span className="font-medium">Burial Date:</span> {data.burialDate || '—'}</div>
                    <div><span className="font-medium">Gender:</span> {data.gender || '—'}</div>
                </div>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-charcoal mb-2">Grave Plot</h2>
                    {gp ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div><span className="font-medium">Section:</span> {gp.section || '—'}</div>
                            <div><span className="font-medium">Plot Number:</span> {gp.plotNumber || '—'}</div>
                            <div className="md:col-span-2">
                                <span className="font-medium">Location:</span> {gp.locationDescription || '—'}
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-600">No grave plot information.</div>
                    )}
                </div>
            </div>
        </div>
    )
}

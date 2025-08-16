import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getDeceasedById, type DeceasedDetail } from '@api/deceased'
import Badge from '@components/ui/Badge'
import { fmtDate } from '@lib/format'

export default function DeceasedDetail() {
    const { id } = useParams()
    const deceasedId = Number(id)

    const { data, isLoading, isError } = useQuery<DeceasedDetail>({
        queryKey: ['deceased', deceasedId],
        queryFn: () => getDeceasedById(deceasedId),
        enabled: Number.isFinite(deceasedId),
    })

    if (!Number.isFinite(deceasedId)) return <div className="p-4">Invalid ID</div>
    if (isLoading) return <div className="p-4">Loading…</div>
    if (isError || !data) return <div className="p-4">Not found.</div>

    return (
        <div className="mx-auto max-w-3xl p-4">
            <div className="card">
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold text-charcoal">
                        {data.firstName} {data.lastName}
                    </h1>
                    <Link to="/" className="btn">
                        Back to search
                    </Link>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                    <div>
                        <span className="font-medium">DOB:</span> {fmtDate(data.dateOfBirth)}
                    </div>
                    <div>
                        <span className="font-medium">DOD:</span> {fmtDate(data.dateOfDeath)}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Gender:</span>
                        <Badge color="blue">{data.gender ?? '—'}</Badge>
                    </div>
                    <div>
                        <span className="font-medium">Burial date:</span> {fmtDate(data.burialDate)}
                    </div>
                </div>

                {data.gravePlot && (
                    <div className="mt-6 rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
                        <div className="mb-2 font-medium">Grave plot</div>
                        <div className="grid gap-2 text-sm md:grid-cols-3">
                            <div>
                                <span className="text-gray-600">Section:</span> {data.gravePlot.section ?? '—'}
                            </div>
                            <div>
                                <span className="text-gray-600">Plot #:</span> {data.gravePlot.plotNumber ?? '—'}
                            </div>
                            <div>
                                <span className="text-gray-600">Location:</span>{' '}
                                {data.gravePlot.locationDescription ?? '—'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

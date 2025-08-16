import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Modal from '@components/ui/Modal'
import EmptyState from '@components/ui/EmptyState'
import Spinner from '@components/ui/Spinner'
import { fmtDate } from '@lib/format'
import {
    searchPublicDeceased,
    type SearchValues,
    type DeceasedPerson,
} from '@api/deceased'

export default function PublicSearch() {
    const [open, setOpen] = useState(false)
    const [values, setValues] = useState<SearchValues>({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
    })
    const [submitted, setSubmitted] = useState<SearchValues | null>(null)

    const canSearch =
        !!submitted &&
        !!submitted.firstName &&
        !!submitted.lastName &&
        !!submitted.dateOfBirth

    const { data, isFetching, isFetched } = useQuery<DeceasedPerson[]>({
        queryKey: ['public-search', submitted],
        queryFn: () => searchPublicDeceased(submitted as SearchValues),
        enabled: Boolean(canSearch),
    })

    const results = (data ?? []) as DeceasedPerson[]

    return (
        <div className="mx-auto max-w-4xl p-4">
            <div className="card">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-charcoal">Cemetery Records</h1>
                        <p className="text-sm text-gray-600">
                            Search by <b>name</b> and <b>date of birth</b> to respect privacy.
                        </p>
                    </div>
                    <button className="btn-primary" onClick={() => setOpen(true)}>
                        Search records
                    </button>
                </div>

                {!isFetched && (
                    <EmptyState
                        title="Start a search"
                        subtitle="Click the button and enter First name, Last name, and Date of birth."
                    />
                )}

                {isFetching && (
                    <div className="flex items-center gap-2 py-6">
                        <Spinner /> <span>Searching…</span>
                    </div>
                )}

                {isFetched && !isFetching && (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {results.length === 0 && (
                            <EmptyState title="No results" subtitle="Try adjusting the name or date of birth." />
                        )}
                        {results.map((d) => (
                            <Link
                                key={d.id}
                                to={`/deceased/${d.id}`}
                                className="card transition-shadow hover:shadow-md"
                            >
                                <div className="font-semibold">
                                    {d.firstName} {d.lastName}
                                </div>
                                <div className="text-sm text-gray-600">
                                    DOB: {fmtDate(d.dateOfBirth)} · DOD: {fmtDate(d.dateOfDeath)}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal
                open={open}
                onOpenChange={setOpen}
                title="Secure search"
                description="Enter an exact match for first name, last name, and date of birth."
            >
                <form
                    className="space-y-3"
                    onSubmit={(e) => {
                        e.preventDefault()
                        setSubmitted(values)
                        setOpen(false)
                    }}
                >
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm">First name</label>
                            <input
                                className="input"
                                value={values.firstName}
                                onChange={(e) => setValues((v) => ({ ...v, firstName: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm">Last name</label>
                            <input
                                className="input"
                                value={values.lastName}
                                onChange={(e) => setValues((v) => ({ ...v, lastName: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm">Date of birth</label>
                            <input
                                type="date"
                                className="input w-full"
                                value={values.dateOfBirth}
                                onChange={(e) => setValues((v) => ({ ...v, dateOfBirth: e.target.value }))}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" className="btn" onClick={() => setOpen(false)}>
                            Cancel
                        </button>
                        <button className="btn-primary" type="submit">
                            Search
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

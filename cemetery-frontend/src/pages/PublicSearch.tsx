import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { strictSearch, type DeceasedPerson } from '@api/deceased'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { StrictSearchSchema, type StrictSearchValues } from '@/types/schemas'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function PublicSearch() {
    const [open, setOpen] = useState(false)
    const [results, setResults] = useState<DeceasedPerson[]>([])

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
        useForm<StrictSearchValues>({
            resolver: zodResolver(StrictSearchSchema),
            defaultValues: { firstName: '', lastName: '', dateOfBirth: '' },
        })

    const { mutateAsync } = useMutation({
        mutationFn: strictSearch,
    })

    const onSubmit = async (values: StrictSearchValues) => {
        try {
            const data = await mutateAsync(values)
            setResults(data)
            setOpen(false)
            if (data.length === 0) toast('No matches found')
        } catch {
            toast.error('Search failed')
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-semibold text-charcoal">Cemetery Records</h1>
                <button className="btn-primary" onClick={() => setOpen(true)}>Search</button>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((d) => (
                    <Link
                        to={`/deceased/${d.id}`}
                        key={d.id}
                        className="card hover:shadow-md transition-shadow"
                    >
                        <div className="font-semibold">{d.firstName} {d.lastName}</div>
                        <div className="text-sm text-gray-600">
                            DOB: {d.dateOfBirth || '—'}{d.dateOfDeath ? ` | DOD: ${d.dateOfDeath}` : ''}
                        </div>
                    </Link>
                ))}
                {results.length === 0 && (
                    <div className="text-gray-600">Use the **Search** button to find a record.</div>
                )}
            </div>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={() => { setOpen(false); reset() }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xl font-semibold text-charcoal">Search Records</h2>
                                <button className="btn" onClick={() => { setOpen(false); reset() }}>Close</button>
                            </div>

                            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
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
                                    {errors.dateOfBirth && <p className="text-red-600 text-sm">{errors.dateOfBirth.message}</p>}
                                </div>

                                <div className="flex gap-2 pt-1">
                                    <button className="btn" type="button" onClick={() => reset()}>
                                        Clear
                                    </button>
                                    <button className="btn-primary ml-auto" disabled={isSubmitting}>
                                        {isSubmitting ? 'Searching…' : 'Search'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

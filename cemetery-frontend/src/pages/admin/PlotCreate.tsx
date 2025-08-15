import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createPlot, type CreatePlotRequest } from '@api/plots'
import toast from 'react-hot-toast'

export default function PlotCreate() {
    const [form, setForm] = useState<CreatePlotRequest>({
        section: '',
        plotNumber: '',
        locationDescription: '',
    })

    const { mutate, isPending } = useMutation({
        mutationFn: createPlot,
        onSuccess: () => {
            toast.success('Plot saved')
            setForm({ section: '', plotNumber: '', locationDescription: '' })
        },
        onError: () => toast.error('Error saving plot'),
    })

    return (
        <div className="card">
            <h2 className="text-xl font-semibold mb-3">Add Grave Plot</h2>
            <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={(e) => { e.preventDefault(); mutate(form) }}
            >
                <div>
                    <label className="block mb-1">Section</label>
                    <input
                        className="input"
                        required
                        value={form.section}
                        onChange={(e) => setForm({ ...form, section: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block mb-1">Plot Number</label>
                    <input
                        className="input"
                        required
                        value={form.plotNumber}
                        onChange={(e) => setForm({ ...form, plotNumber: e.target.value })}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-1">Location Description</label>
                    <input
                        className="input"
                        value={form.locationDescription || ''}
                        onChange={(e) => setForm({ ...form, locationDescription: e.target.value })}
                    />
                </div>

                <div className="md:col-span-2">
                    <button className="btn-primary" disabled={isPending}>
                        {isPending ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    )
}

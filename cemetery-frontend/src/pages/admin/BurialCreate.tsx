import { useMutation } from '@tanstack/react-query'
import { createBurialBundle } from '@api/burials'
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BurialBundleSchema, type BurialBundleValues } from '@/types/schemas'
import toast from 'react-hot-toast'

export default function BurialCreate() {
    const resolver = zodResolver(BurialBundleSchema) as Resolver<BurialBundleValues>

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<BurialBundleValues>({
        resolver,
        defaultValues: {
            firstName: '',
            lastName: '',
            gender: 'OTHER',
            burialDate: '',
            section: '',
            plotNumber: '',
            locationDescription: '',
            notes: '',
        },
    })

    const { mutateAsync } = useMutation({ mutationFn: createBurialBundle })

    const onSubmit: SubmitHandler<BurialBundleValues> = async (values) => {
        try {
            await mutateAsync(values as any)
            toast.success('Burial saved')
        } catch {
            toast.error('Error saving burial')
        }
    }

    const useExistingId = !!watch('gravePlotId')

    return (
        <div className="card">
            <h2 className="text-xl font-semibold mb-3">Create Burial</h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
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
                    <label className="block mb-1">Gender</label>
                    <select className="input" {...register('gender')}>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1">Date of Birth</label>
                    <input className="input" type="date" {...register('dateOfBirth')} />
                </div>

                <div>
                    <label className="block mb-1">Date of Death</label>
                    <input className="input" type="date" {...register('dateOfDeath')} />
                </div>

                <div>
                    <label className="block mb-1">Burial Date</label>
                    <input className="input" type="date" {...register('burialDate')} />
                    {errors.burialDate && <p className="text-red-600 text-sm">{errors.burialDate.message}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-1">Section & Plot</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            className="input"
                            placeholder="Section"
                            {...register('section')}
                            disabled={useExistingId}
                        />
                        <input
                            className="input"
                            placeholder="Plot Number"
                            {...register('plotNumber')}
                            disabled={useExistingId}
                        />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                        Or provide an existing Grave Plot ID below.
                    </p>
                </div>

                <div>
                    <label className="block mb-1">Existing Grave Plot ID (optional)</label>
                    <input className="input" type="number" {...register('gravePlotId', { valueAsNumber: true })} />
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-1">Location Description</label>
                    <input className="input" {...register('locationDescription')} />
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-1">Notes</label>
                    <textarea className="input" rows={3} {...register('notes')} />
                </div>

                {errors.root && <p className="text-red-600 text-sm md:col-span-2">{errors.root.message}</p>}
                {isSubmitSuccessful && <p className="text-green-700 md:col-span-2">Saved.</p>}

                <div className="md:col-span-2">
                    <button className="btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    )
}

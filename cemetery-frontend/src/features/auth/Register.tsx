import { useMutation } from '@tanstack/react-query'
import { register as registerApi } from '@api/auth'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema, type RegisterValues } from '@/types/schemas'
import toast from 'react-hot-toast'

export default function Register() {
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors, isSubmitting } } =
        useForm<RegisterValues>({
            resolver: zodResolver(RegisterSchema),
            defaultValues: { fullName: '', email: '', password: '' },
        })

    const { mutateAsync } = useMutation({ mutationFn: registerApi })

    return (
        <div className="max-w-md mx-auto mt-16 card">
            <h1 className="text-2xl font-semibold mb-4 text-charcoal">Create Staff Account</h1>

            <form
                onSubmit={handleSubmit(async (values) => {
                    try {
                        await mutateAsync(values)
                        toast.success('Account created. Please sign in.')
                        navigate('/login')
                    } catch {
                        toast.error('Registration failed')
                    }
                })}
                className="space-y-3"
            >
                <div>
                    <label className="block mb-1">Full Name</label>
                    <input className="input" {...register('fullName')} />
                    {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName.message}</p>}
                </div>

                <div>
                    <label className="block mb-1">Email</label>
                    <input className="input" type="email" {...register('email')} />
                    {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block mb-1">Password</label>
                    <input className="input" type="password" {...register('password')} />
                    {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
                </div>

                <button className="btn-primary w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating…' : 'Create Account'}
                </button>
            </form>

            <div className="text-sm mt-3 text-center">
                Already have an account? <Link to="/login" className="text-primary underline">Sign in</Link>
            </div>
        </div>
    )
}

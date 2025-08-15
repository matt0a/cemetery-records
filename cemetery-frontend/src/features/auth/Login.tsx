import { useMutation } from '@tanstack/react-query'
import { login } from '@api/auth'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginValues } from '@/types/schemas'
import toast from 'react-hot-toast'

export default function Login() {
    const navigate = useNavigate()
    const location = useLocation() as any

    const { register, handleSubmit, formState: { errors, isSubmitting } } =
        useForm<LoginValues>({
            resolver: zodResolver(LoginSchema),
            defaultValues: { email: '', password: '' },
        })

    const { mutateAsync } = useMutation({ mutationFn: login })

    return (
        <div className="max-w-md mx-auto mt-16 card">
            <h1 className="text-2xl font-semibold mb-4 text-charcoal">Staff Login</h1>

            <form
                onSubmit={handleSubmit(async (values) => {
                    try {
                        const res = await mutateAsync(values)
                        localStorage.setItem('token', res.token)
                        toast.success('Welcome back!')
                        const to = location.state?.from?.pathname || '/admin'
                        navigate(to, { replace: true })
                    } catch {
                        toast.error('Login failed')
                    }
                })}
                className="space-y-3"
            >
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
                    {isSubmitting ? 'Signing in…' : 'Sign In'}
                </button>
            </form>

            <div className="text-sm mt-3 text-center">
                No account? <Link to="/register" className="text-primary underline">Register</Link>
            </div>
        </div>
    )
}

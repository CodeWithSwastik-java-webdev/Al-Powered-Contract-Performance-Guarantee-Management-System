import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../contexts/AuthContext'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Enter at least 6 characters'),
})

type LoginForm = z.infer<typeof schema>

export default function LoginPage() {
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: LoginForm) => {
    try {
      await login(values)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed')
    }
  }

  return (
    <div>
      <div className="mb-8 space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">POWERGRID CPG</p>
        <h1 className="text-3xl font-semibold text-neutral-900">Secure access</h1>
        <p className="text-sm text-neutral-600">Sign in to manage contracts, CPGs, risk, and documents.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full rounded-3xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full rounded-3xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
          {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-3xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

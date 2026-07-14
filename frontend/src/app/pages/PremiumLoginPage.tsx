import { motion } from 'framer-motion'
import PowergridLogo from '../../shared/components/layout/PowergridLogo'
import PasswordField from '../../shared/components/ui/PasswordField'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function PremiumLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()

  async function onSubmit(data: any) {
    try {
      await login({ email: data.email, password: data.password })
    } catch (err) {
      // if backend returns pending status, we expect middleware to block; handle gracefully
      // for now, show a generic card
      alert(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
      <div className="grid grid-cols-12 gap-8 min-h-screen items-center">
        <div className="col-span-7 px-12">
          <div className="max-w-xl">
            <h1 className="text-3xl font-semibold text-neutral-900 mb-4">AI-Powered Contract Performance Guarantee Management System</h1>
            <p className="text-neutral-600 mb-6">Secure enterprise platform for managing Contract Performance Guarantees, contractor onboarding, AI-powered risk analysis and document management.</p>

            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 px-3 py-1 text-sm">✓ Secure Authentication</span>
              <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 px-3 py-1 text-sm">✓ AI Risk Intelligence</span>
              <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 px-3 py-1 text-sm">✓ Enterprise Dashboard</span>
              <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 px-3 py-1 text-sm">✓ Contract Lifecycle Management</span>
            </div>

            <div className="mt-10 text-sm text-neutral-500">Trusted by large government organisations · Enterprise-grade security · Audit-ready</div>
          </div>
        </div>

        <div className="col-span-5 px-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="rounded-[18px] bg-white p-8 shadow-lg border border-neutral-100">
            <div className="flex items-center justify-between mb-6">
              <PowergridLogo className="h-10" />
              <div className="text-sm text-neutral-500">Welcome Back</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Official Email Address</label>
                <input type="email" {...register('email')} required className="w-full rounded-3xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-brand-100" />
              </div>

              <PasswordField label="Password" {...register('password')} />

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-neutral-600"><input type="checkbox" className="rounded" /> Remember me</label>
                <button type="button" className="text-sm text-brand-600">Forgot password?</button>
              </div>

              <div>
                <button type="submit" className="w-full rounded-3xl bg-brand-600 px-4 py-3 text-white font-semibold">Sign in</button>
              </div>

              <div className="text-center text-sm text-neutral-500">New to POWERGRID CPG Portal? <button type="button" onClick={() => navigate('/register')} className="text-brand-600 hover:underline">Request Access</button></div>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

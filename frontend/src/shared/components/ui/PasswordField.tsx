import { useState, forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const PasswordField = forwardRef(function PasswordField({ label, ...props }: any, ref: any) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700">{label}</label>
      <div className="relative">
        <input
          ref={ref}
          type={show ? 'text' : 'password'}
          {...props}
          className="w-full rounded-3xl border border-neutral-300 bg-white px-4 py-3 pr-12 text-sm text-neutral-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        />
        <button type="button" onClick={() => setShow(s => !s)} aria-label="Toggle password visibility" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )
})

export default PasswordField

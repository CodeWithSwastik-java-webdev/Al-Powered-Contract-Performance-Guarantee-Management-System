import { useState, useEffect } from 'react'

export default function ContractorWizard() {
  const [step, setStep] = useState(1)
  const total = 4

  useEffect(() => {
    const draft = localStorage.getItem('onboard_contractor_draft')
    if (draft) {
      const obj = JSON.parse(draft)
      if (obj?.step) setStep(obj.step)
    }
  }, [])

  function saveDraft() {
    localStorage.setItem('onboard_contractor_draft', JSON.stringify({ step }))
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-6">
        <div className="text-sm text-neutral-500">Step {step} of {total}</div>
        <div className="h-2 bg-neutral-200 rounded mt-2 overflow-hidden">
          <div className="h-2 bg-brand-600" style={{ width: `${(step/total)*100}%` }} />
        </div>
      </div>

      <div className="p-6 border rounded-lg bg-white">
        <h2 className="text-lg font-medium mb-4">{step === 1 ? 'Company Information' : step === 2 ? 'Authorized Person' : step === 3 ? 'Business Documents' : 'Review'}</h2>
        <p className="text-sm text-neutral-600 mb-6">This contractor wizard supports file uploads and document previews (demo placeholders).</p>

        <div className="flex gap-3">
          {step > 1 && <button onClick={() => setStep(s => { const ns = s-1; localStorage.setItem('onboard_contractor_draft', JSON.stringify({ step: ns })); return ns })} className="px-4 py-2 border rounded">Back</button>}
          {step < total && <button onClick={() => { setStep(s => { const ns = s+1; localStorage.setItem('onboard_contractor_draft', JSON.stringify({ step: ns })); return ns }) }} className="px-4 py-2 bg-brand-600 text-white rounded">Next</button>}
          {step === total && <button onClick={() => { localStorage.removeItem('onboard_contractor_draft'); alert('Submitted (demo) — an email would be sent'); }} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>}
          <button onClick={saveDraft} className="ml-auto px-3 py-2 border rounded">Save draft</button>
        </div>
      </div>
    </div>
  )
}

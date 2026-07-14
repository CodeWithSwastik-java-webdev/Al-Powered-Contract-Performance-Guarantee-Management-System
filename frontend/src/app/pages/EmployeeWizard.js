import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
export default function EmployeeWizard() {
    const [step, setStep] = useState(1);
    const total = 4;
    useEffect(() => {
        // load draft from localStorage
        const draft = localStorage.getItem('onboard_employee_draft');
        if (draft) {
            // minimal: keep step if saved
            const obj = JSON.parse(draft);
            if (obj?.step)
                setStep(obj.step);
        }
    }, []);
    function saveDraft() {
        localStorage.setItem('onboard_employee_draft', JSON.stringify({ step }));
    }
    return (_jsxs("div", { className: "max-w-2xl mx-auto py-12", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "text-sm text-neutral-500", children: ["Step ", step, " of ", total] }), _jsx("div", { className: "h-2 bg-neutral-200 rounded mt-2 overflow-hidden", children: _jsx("div", { className: "h-2 bg-brand-600", style: { width: `${(step / total) * 100}%` } }) })] }), _jsxs("div", { className: "p-6 border rounded-lg bg-white", children: [_jsx("h2", { className: "text-lg font-medium mb-4", children: step === 1 ? 'Basic Information' : step === 2 ? 'Department Information' : step === 3 ? 'Identity Verification' : 'Review' }), _jsx("p", { className: "text-sm text-neutral-600 mb-6", children: "This is a lightweight multi-step onboarding flow. Implement form fields as needed." }), _jsxs("div", { className: "flex gap-3", children: [step > 1 && _jsx("button", { onClick: () => setStep(s => { const ns = s - 1; localStorage.setItem('onboard_employee_draft', JSON.stringify({ step: ns })); return ns; }), className: "px-4 py-2 border rounded", children: "Back" }), step < total && _jsx("button", { onClick: () => { setStep(s => { const ns = s + 1; localStorage.setItem('onboard_employee_draft', JSON.stringify({ step: ns })); return ns; }); }, className: "px-4 py-2 bg-brand-600 text-white rounded", children: "Next" }), step === total && _jsx("button", { onClick: () => { localStorage.removeItem('onboard_employee_draft'); alert('Submitted (demo) — an email would be sent'); }, className: "px-4 py-2 bg-green-600 text-white rounded", children: "Submit" }), _jsx("button", { onClick: saveDraft, className: "ml-auto px-3 py-2 border rounded", children: "Save draft" })] })] })] }));
}

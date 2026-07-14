import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import PowergridLogo from '../../shared/components/layout/PowergridLogo';
import PasswordField from '../../shared/components/ui/PasswordField';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function PremiumLoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    async function onSubmit(data) {
        try {
            await login({ email: data.email, password: data.password });
        }
        catch (err) {
            // if backend returns pending status, we expect middleware to block; handle gracefully
            // for now, show a generic card
            alert(err instanceof Error ? err.message : 'Login failed');
        }
    }
    return (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "min-h-screen", children: _jsxs("div", { className: "grid grid-cols-12 gap-8 min-h-screen items-center", children: [_jsx("div", { className: "col-span-7 px-12", children: _jsxs("div", { className: "max-w-xl", children: [_jsx("h1", { className: "text-3xl font-semibold text-neutral-900 mb-4", children: "AI-Powered Contract Performance Guarantee Management System" }), _jsx("p", { className: "text-neutral-600 mb-6", children: "Secure enterprise platform for managing Contract Performance Guarantees, contractor onboarding, AI-powered risk analysis and document management." }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx("span", { className: "inline-flex items-center rounded-full bg-green-50 text-green-700 px-3 py-1 text-sm", children: "\u2713 Secure Authentication" }), _jsx("span", { className: "inline-flex items-center rounded-full bg-green-50 text-green-700 px-3 py-1 text-sm", children: "\u2713 AI Risk Intelligence" }), _jsx("span", { className: "inline-flex items-center rounded-full bg-green-50 text-green-700 px-3 py-1 text-sm", children: "\u2713 Enterprise Dashboard" }), _jsx("span", { className: "inline-flex items-center rounded-full bg-green-50 text-green-700 px-3 py-1 text-sm", children: "\u2713 Contract Lifecycle Management" })] }), _jsx("div", { className: "mt-10 text-sm text-neutral-500", children: "Trusted by large government organisations \u00B7 Enterprise-grade security \u00B7 Audit-ready" })] }) }), _jsx("div", { className: "col-span-5 px-8", children: _jsxs(motion.div, { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, className: "rounded-[18px] bg-white p-8 shadow-lg border border-neutral-100", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx(PowergridLogo, { className: "h-10" }), _jsx("div", { className: "text-sm text-neutral-500", children: "Welcome Back" })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-neutral-700", children: "Official Email Address" }), _jsx("input", { type: "email", ...register('email'), required: true, className: "w-full rounded-3xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-brand-100" })] }), _jsx(PasswordField, { label: "Password", ...register('password') }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { className: "inline-flex items-center gap-2 text-sm text-neutral-600", children: [_jsx("input", { type: "checkbox", className: "rounded" }), " Remember me"] }), _jsx("button", { type: "button", className: "text-sm text-brand-600", children: "Forgot password?" })] }), _jsx("div", { children: _jsx("button", { type: "submit", className: "w-full rounded-3xl bg-brand-600 px-4 py-3 text-white font-semibold", children: "Sign in" }) }), _jsxs("div", { className: "text-center text-sm text-neutral-500", children: ["New to POWERGRID CPG Portal? ", _jsx("button", { type: "button", onClick: () => navigate('/register'), className: "text-brand-600 hover:underline", children: "Request Access" })] })] })] }) })] }) }));
}

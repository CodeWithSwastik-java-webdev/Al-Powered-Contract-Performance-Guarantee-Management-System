import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
const schema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Enter at least 6 characters'),
});
export default function LoginPage() {
    const { login } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({ resolver: zodResolver(schema) });
    const onSubmit = async (values) => {
        try {
            await login(values);
        }
        catch (error) {
            alert(error instanceof Error ? error.message : 'Login failed');
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-8 space-y-2 text-center", children: [_jsx("p", { className: "text-sm uppercase tracking-[0.24em] text-neutral-500", children: "POWERGRID CPG" }), _jsx("h1", { className: "text-3xl font-semibold text-neutral-900", children: "Secure access" }), _jsx("p", { className: "text-sm text-neutral-600", children: "Sign in to manage contracts, CPGs, risk, and documents." })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-neutral-700", children: "Email" }), _jsx("input", { type: "email", ...register('email'), className: "w-full rounded-3xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100" }), errors.email && _jsx("p", { className: "mt-2 text-sm text-red-600", children: errors.email.message })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-2 block text-sm font-medium text-neutral-700", children: "Password" }), _jsx("input", { type: "password", ...register('password'), className: "w-full rounded-3xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100" }), errors.password && _jsx("p", { className: "mt-2 text-sm text-red-600", children: errors.password.message })] }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "inline-flex w-full items-center justify-center rounded-3xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60", children: isSubmitting ? 'Signing in…' : 'Sign in' })] })] }));
}

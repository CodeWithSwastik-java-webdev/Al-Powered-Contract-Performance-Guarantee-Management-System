import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
export default function ContractPage() {
    const { id } = useParams();
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm uppercase tracking-[0.24em] text-neutral-500", children: "Contract detail" }), _jsxs("h1", { className: "mt-2 text-3xl font-semibold text-neutral-900", children: ["Contract #", id] })] }), _jsx("div", { className: "rounded-[28px] border border-neutral-200 bg-white p-6 shadow-surface", children: _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-neutral-600", children: "Status" }), _jsx("p", { className: "mt-2 text-lg font-semibold text-brand-600", children: "Active" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-neutral-600", children: "Supply group" }), _jsx("p", { className: "mt-2 text-lg font-semibold text-neutral-900", children: "PG-01" })] })] }) })] }));
}

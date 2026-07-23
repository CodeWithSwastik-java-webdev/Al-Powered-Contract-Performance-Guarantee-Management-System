import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { StatusBadge } from '../../shared/components/data-display/StatusBadge';
import { DataTable } from '../../shared/components/data-display/DataTable';
import api from '../../lib/api';
export default function ContractPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('details');
    // ── Queries ──────────────────────────────────────────────────────────────
    const { data: contract, isLoading } = useQuery({
        queryKey: ['contracts', id],
        queryFn: async () => {
            const res = await api.get(`/contracts/${id}`);
            return res.data.data;
        },
    });
    // ── Handlers ─────────────────────────────────────────────────────────────
    const cpgColumns = [
        {
            key: 'bgNumber',
            header: 'CPG No.',
            render: (row) => _jsx("span", { className: "font-medium text-neutral-900", children: row.bgNumber }),
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (row) => new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: contract?.currency ?? 'INR',
                maximumFractionDigits: 0,
            }).format(typeof row.amount === 'number' ? row.amount : parseFloat(row.amount)),
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => _jsx(StatusBadge, { status: row.status }),
        },
        {
            key: 'expiryDate',
            header: 'Expiry Date',
            render: (row) => new Date(row.expiryDate).toLocaleDateString(),
        },
    ];
    if (isLoading) {
        return (_jsx("div", { className: "flex h-64 items-center justify-center", children: _jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" }) }));
    }
    if (!contract) {
        return (_jsxs("div", { className: "flex h-64 flex-col items-center justify-center gap-4", children: [_jsx("p", { className: "text-neutral-500", children: "Contract not found" }), _jsx("button", { onClick: () => navigate('/contracts'), className: "text-sm font-medium text-brand-600 hover:underline", children: "Back to contracts" })] }));
    }
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("button", { onClick: () => navigate('/contracts'), className: "mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900", children: _jsx(ArrowLeft, { className: "h-4 w-4" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("h1", { className: "text-3xl font-semibold text-neutral-900", children: contract.contractNumber }), _jsx(StatusBadge, { status: contract.status, className: "mt-1" })] }), _jsx("p", { className: "mt-1 text-lg text-neutral-600", children: contract.projectName })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => alert('Edit modal coming soon'), className: "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50", children: [_jsx(Pencil, { className: "h-4 w-4" }), "Edit"] }), _jsxs("button", { onClick: () => alert('Delete confirmation coming soon'), className: "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50", children: [_jsx(Trash2, { className: "h-4 w-4" }), "Delete"] })] })] }), _jsx("div", { className: "flex gap-6 border-b border-neutral-200", children: ['details', 'cpgs'].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab), className: `border-b-2 py-3 text-sm font-medium transition ${activeTab === tab
                        ? 'border-brand-600 text-brand-700'
                        : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'}`, children: tab === 'details' ? 'Contract Details' : `Linked CPGs (${contract.cpgs?.length ?? 0})` }, tab))) }), activeTab === 'details' && (_jsx("div", { className: "rounded-3xl border border-neutral-200 bg-white p-8 shadow-surface", children: _jsxs("div", { className: "grid gap-8 sm:grid-cols-2 lg:grid-cols-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-neutral-500", children: "Contractor" }), _jsx("p", { className: "mt-1 text-base text-neutral-900", children: contract.contractor.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-neutral-500", children: "Contract Value" }), _jsx("p", { className: "mt-1 text-base text-neutral-900", children: new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: contract.currency,
                                        maximumFractionDigits: 0,
                                    }).format(parseFloat(contract.contractValue)) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-neutral-500", children: "Zone" }), _jsx("p", { className: "mt-1 text-base text-neutral-900", children: contract.zone || '—' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-neutral-500", children: "Award Date" }), _jsx("p", { className: "mt-1 text-base text-neutral-900", children: new Date(contract.awardDate).toLocaleDateString() })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-neutral-500", children: "Completion Date" }), _jsx("p", { className: "mt-1 text-base text-neutral-900", children: contract.completionDate
                                        ? new Date(contract.completionDate).toLocaleDateString()
                                        : '—' })] }), _jsxs("div", { className: "sm:col-span-2 lg:col-span-3", children: [_jsx("p", { className: "text-sm font-medium text-neutral-500", children: "Description" }), _jsx("p", { className: "mt-1 text-base text-neutral-900", children: contract.description || 'No description provided.' })] })] }) })), activeTab === 'cpgs' && (_jsx("div", { className: "rounded-3xl border border-neutral-200 bg-white shadow-surface", children: _jsx(DataTable, { data: contract.cpgs ?? [], columns: cpgColumns, onRowClick: (cpg) => navigate(`/cpgs/${cpg.id}`), emptyMessage: "No CPGs linked to this contract." }) }))] }));
}

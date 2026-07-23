import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { DataTable } from '../../shared/components/data-display/DataTable';
import { StatusBadge } from '../../shared/components/data-display/StatusBadge';
import { SearchInput } from '../../shared/components/forms/SearchInput';
import api from '../../lib/api';
export default function ContractsPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ['contracts', page, search, statusFilter],
        queryFn: async () => {
            const res = await api.get('/contracts', {
                params: {
                    page,
                    limit: 10,
                    search: search || undefined,
                    status: statusFilter || undefined,
                },
            });
            return {
                data: res.data.data ?? [],
                meta: res.data.meta,
            };
        },
    });
    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };
    const handleRowClick = (contract) => {
        navigate(`/contracts/${contract.id}`);
    };
    const columns = [
        {
            key: 'contractNumber',
            header: 'Contract No.',
            render: (row) => (_jsx("span", { className: "font-medium text-neutral-900", children: row.contractNumber })),
        },
        {
            key: 'projectName',
            header: 'Project Name',
            render: (row) => row.projectName,
        },
        {
            key: 'contractor',
            header: 'Contractor',
            render: (row) => row.contractor?.name ?? '—',
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => _jsx(StatusBadge, { status: row.status }),
        },
        {
            key: 'completionDate',
            header: 'End Date',
            render: (row) => row.completionDate ? new Date(row.completionDate).toLocaleDateString() : '—',
        },
    ];
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm uppercase tracking-[0.24em] text-neutral-500", children: "Contracts" }), _jsx("h1", { className: "mt-2 text-3xl font-semibold text-neutral-900", children: "Portfolio contracts" })] }), _jsxs("button", { onClick: () => alert('Create contract modal coming soon'), className: "inline-flex items-center justify-center gap-2 rounded-3xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 shadow-sm", children: [_jsx(Plus, { className: "h-4 w-4" }), "Create contract"] })] }), _jsxs("div", { className: "rounded-[28px] border border-neutral-200 bg-white shadow-surface", children: [_jsxs("div", { className: "flex flex-col gap-4 border-b border-neutral-100 p-6 sm:flex-row sm:items-center sm:justify-between", children: [_jsx("div", { className: "w-full sm:max-w-xs", children: _jsx(SearchInput, { value: search, onChange: handleSearchChange, placeholder: "Search by contract no. or project..." }) }), _jsx("div", { className: "flex items-center gap-3", children: _jsxs("select", { value: statusFilter, onChange: handleStatusFilterChange, className: "h-10 rounded-xl border border-neutral-300 bg-white px-4 text-sm text-neutral-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50", children: [_jsx("option", { value: "", children: "All Statuses" }), _jsx("option", { value: "ACTIVE", children: "Active" }), _jsx("option", { value: "DRAFT", children: "Draft" }), _jsx("option", { value: "COMPLETED", children: "Completed" }), _jsx("option", { value: "TERMINATED", children: "Terminated" }), _jsx("option", { value: "SUSPENDED", children: "Suspended" })] }) })] }), _jsx("div", { className: "p-0", children: _jsx(DataTable, { data: data?.data ?? [], columns: columns, isLoading: isLoading, page: data?.meta?.page ?? 1, totalPages: data?.meta?.totalPages ?? 1, onPageChange: setPage, onRowClick: handleRowClick, emptyMessage: search || statusFilter
                                ? 'No contracts found matching your filters.'
                                : 'No contracts available.' }) })] })] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { DataTable } from '../../shared/components/data-display/DataTable';
import { SearchInput } from '../../shared/components/forms/SearchInput';
import api from '../../lib/api';
export default function ContractorsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ['contractors', page, search],
        queryFn: async () => {
            const res = await api.get('/contractors', {
                params: {
                    page,
                    limit: 10,
                    search: search || undefined,
                },
            });
            return {
                data: res.data.data ?? [],
                meta: res.data.meta,
            };
        },
    });
    const columns = [
        {
            key: 'name',
            header: 'Name',
            render: (row) => _jsx("span", { className: "font-medium text-neutral-900", children: row.name }),
        },
        {
            key: 'email',
            header: 'Email',
            render: (row) => row.email || '-',
        },
        {
            key: 'phone',
            header: 'Phone',
            render: (row) => row.phone || '-',
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => {
                if (row.isBlacklisted) {
                    return _jsx("span", { className: "inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-800", children: "Blacklisted" });
                }
                if (row.isActive) {
                    return _jsx("span", { className: "inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700", children: "Active" });
                }
                return _jsx("span", { className: "inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-700", children: "Inactive" });
            },
        },
    ];
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm uppercase tracking-[0.24em] text-neutral-500", children: "Contractors" }), _jsx("h1", { className: "mt-2 text-3xl font-semibold text-neutral-900", children: "Vendor Management" })] }), _jsxs("button", { onClick: () => alert('Create contractor modal coming soon'), className: "inline-flex items-center justify-center gap-2 rounded-3xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 shadow-sm", children: [_jsx(Plus, { className: "h-4 w-4" }), "Add Contractor"] })] }), _jsxs("div", { className: "rounded-[28px] border border-neutral-200 bg-white shadow-surface", children: [_jsx("div", { className: "border-b border-neutral-100 p-6", children: _jsx("div", { className: "w-full sm:max-w-xs", children: _jsx(SearchInput, { value: search, onChange: (v) => { setSearch(v); setPage(1); }, placeholder: "Search contractors..." }) }) }), _jsx("div", { className: "p-0", children: _jsx(DataTable, { data: data?.data ?? [], columns: columns, isLoading: isLoading,             page: data?.meta?.page ?? 1, totalPages: data?.meta?.totalPages ?? 1, onPageChange: setPage, emptyMessage: "No contractors found." }) })] })] }));
}

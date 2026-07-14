import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { DataTable } from '../../shared/components/data-display/DataTable'
import { StatusBadge } from '../../shared/components/data-display/StatusBadge'
import { SearchInput } from '../../shared/components/forms/SearchInput'
import api from '../../lib/api'

// ── Types ──────────────────────────────────────────────────────────────────
interface Contract {
  id: string
  contractNumber: string
  projectName: string
  status: string
  startDate: string
  endDate: string
  contractor: {
    id: string
    name: string
  }
}

interface ContractsResponse {
  data: Contract[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export default function ContractsPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  // ── Queries ──────────────────────────────────────────────────────────────
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
      })
      return res.data.data as ContractsResponse
    },
  })

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1) // Reset to first page on new search
  }

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
    setPage(1)
  }

  const handleRowClick = (contract: Contract) => {
    navigate(`/contracts/${contract.id}`)
  }

  // ── Columns ──────────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'contractNumber',
      header: 'Contract No.',
      render: (row: Contract) => (
        <span className="font-medium text-neutral-900">{row.contractNumber}</span>
      ),
    },
    {
      key: 'projectName',
      header: 'Project Name',
      render: (row: Contract) => row.projectName,
    },
    {
      key: 'contractor',
      header: 'Contractor',
      render: (row: Contract) => row.contractor.name,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Contract) => <StatusBadge status={row.status} />,
    },
    {
      key: 'endDate',
      header: 'End Date',
      render: (row: Contract) => new Date(row.endDate).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Contracts</p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Portfolio contracts</h1>
        </div>
        <button
          onClick={() => alert('Create contract modal coming soon')}
          className="inline-flex items-center justify-center gap-2 rounded-3xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Create contract
        </button>
      </div>

      {/* ── Filters & Table ─────────────────────────────────────────────── */}
      <div className="rounded-[28px] border border-neutral-200 bg-white shadow-surface">
        <div className="flex flex-col gap-4 border-b border-neutral-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-xs">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by contract no. or project..."
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="h-10 rounded-xl border border-neutral-300 bg-white px-4 text-sm text-neutral-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="COMPLETED">Completed</option>
              <option value="TERMINATED">Terminated</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        <div className="p-0">
          <DataTable
            data={data?.data ?? []}
            columns={columns}
            isLoading={isLoading}
            page={data?.meta.page ?? 1}
            totalPages={data?.meta.totalPages ?? 1}
            onPageChange={setPage}
            onRowClick={handleRowClick}
            emptyMessage={
              search || statusFilter
                ? 'No contracts found matching your filters.'
                : 'No contracts available.'
            }
          />
        </div>
      </div>
    </div>
  )
}

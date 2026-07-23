import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Pencil, Trash2, ArrowLeft } from 'lucide-react'
import { StatusBadge } from '../../shared/components/data-display/StatusBadge'
import { DataTable } from '../../shared/components/data-display/DataTable'
import api from '../../lib/api'

interface Cpg {
  id: string
  bgNumber: string
  amount: string | number
  status: string
  expiryDate: string
}

interface Contract {
  id: string
  contractNumber: string
  projectName: string
  description: string | null
  contractValue: string
  currency: string
  awardDate: string
  completionDate: string | null
  status: string
  zone: string | null
  contractor: {
    id: string
    name: string
  }
  cpgs: Cpg[]
}

export default function ContractPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'details' | 'cpgs'>('details')

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data: contract, isLoading } = useQuery({
    queryKey: ['contracts', id],
    queryFn: async () => {
      const res = await api.get(`/contracts/${id}`)
      return res.data.data as Contract
    },
  })

  // ── Handlers ─────────────────────────────────────────────────────────────
  const cpgColumns = [
    {
      key: 'bgNumber',
      header: 'CPG No.',
      render: (row: Cpg) => <span className="font-medium text-neutral-900">{row.bgNumber}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row: Cpg) =>
        new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: contract?.currency ?? 'INR',
          maximumFractionDigits: 0,
        }).format(typeof row.amount === 'number' ? row.amount : parseFloat(row.amount)),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Cpg) => <StatusBadge status={row.status} />,
    },
    {
      key: 'expiryDate',
      header: 'Expiry Date',
      render: (row: Cpg) => new Date(row.expiryDate).toLocaleDateString(),
    },
  ]

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-neutral-500">Contract not found</p>
        <button
          onClick={() => navigate('/contracts')}
          className="text-sm font-medium text-brand-600 hover:underline"
        >
          Back to contracts
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate('/contracts')}
            className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-neutral-900">{contract.contractNumber}</h1>
              <StatusBadge status={contract.status} className="mt-1" />
            </div>
            <p className="mt-1 text-lg text-neutral-600">{contract.projectName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert('Edit modal coming soon')}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => alert('Delete confirmation coming soon')}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="flex gap-6 border-b border-neutral-200">
        {(['details', 'cpgs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 py-3 text-sm font-medium transition ${
              activeTab === tab
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
            }`}
          >
            {tab === 'details' ? 'Contract Details' : `Linked CPGs (${contract.cpgs?.length ?? 0})`}
          </button>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────── */}
      {activeTab === 'details' && (
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-surface">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-neutral-500">Contractor</p>
              <p className="mt-1 text-base text-neutral-900">{contract.contractor.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Contract Value</p>
              <p className="mt-1 text-base text-neutral-900">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: contract.currency,
                  maximumFractionDigits: 0,
                }).format(parseFloat(contract.contractValue))}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Zone</p>
              <p className="mt-1 text-base text-neutral-900">{contract.zone || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Award Date</p>
              <p className="mt-1 text-base text-neutral-900">{new Date(contract.awardDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Completion Date</p>
              <p className="mt-1 text-base text-neutral-900">
                {contract.completionDate
                  ? new Date(contract.completionDate).toLocaleDateString()
                  : '—'}
              </p>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-sm font-medium text-neutral-500">Description</p>
              <p className="mt-1 text-base text-neutral-900">{contract.description || 'No description provided.'}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cpgs' && (
        <div className="rounded-3xl border border-neutral-200 bg-white shadow-surface">
          <DataTable
            data={contract.cpgs ?? []}
            columns={cpgColumns}
            onRowClick={(cpg) => navigate(`/cpgs/${cpg.id}`)}
            emptyMessage="No CPGs linked to this contract."
          />
        </div>
      )}
    </div>
  )
}

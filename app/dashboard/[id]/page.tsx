import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSPKById } from '@/app/actions/spk'
import { formatCurrency, formatDate } from '@/lib/utils'
import PaymentUpdateButton from '@/components/spk/payment-update-button'
import PublishButton from '@/components/spk/publish-button'

export default async function SPKDetailPage({ params }: { params: { id: string } }) {
    const { data: spk, success } = await getSPKById(params.id)

    if (!success || !spk) {
        notFound()
    }

    const payments = spk.payments || []

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 mb-2 block">
                        ← Back to Dashboard
                    </Link>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{spk.spk_number}</h1>
                            <p className="text-gray-600 mt-1">{spk.project_name}</p>
                        </div>
                        <div className="flex gap-3">
                            {spk.status === 'draft' && <PublishButton spkId={spk.id} />}
                            <a
                                href={`/api/pdf/${spk.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download PDF
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* SPK Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Vendor Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vendor Information</h2>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{spk.vendor_name}</dd>
                                </div>
                                {spk.vendor_email && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{spk.vendor_email}</dd>
                                    </div>
                                )}
                                {spk.vendor_phone && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{spk.vendor_phone}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Project Details */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Project Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{spk.project_name}</dd>
                                </div>
                                {spk.project_description && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Description</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{spk.project_description}</dd>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Contract Value</dt>
                                        <dd className="mt-1 text-lg font-semibold text-gray-900">
                                            {formatCurrency(spk.contract_value, spk.currency)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                        <dd className="mt-1">
                                            <span
                                                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${spk.status === 'published'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                            >
                                                {spk.status}
                                            </span>
                                        </dd>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{formatDate(spk.start_date)}</dd>
                                    </div>
                                    {spk.end_date && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">End Date</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(spk.end_date)}</dd>
                                        </div>
                                    )}
                                </div>
                                {spk.notes && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Notes</dt>
                                        <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{spk.notes}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Payment Breakdown */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Breakdown</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Term
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Percentage
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Paid Date
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {payments.map((payment) => (
                                            <tr key={payment.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                                                    {payment.term === 'dp' ? 'Down Payment' : payment.term === 'progress' ? 'Progress Payment' : 'Final Payment'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {payment.percentage}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatCurrency(payment.amount, spk.currency)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${payment.status === 'paid'
                                                                ? 'bg-green-100 text-green-800'
                                                                : payment.status === 'overdue'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                    >
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {payment.paid_date ? formatDate(payment.paid_date) : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    <PaymentUpdateButton payment={payment} spkId={spk.id} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
                            <dl className="space-y-3">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Created By</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{spk.created_by}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Created At</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formatDate(spk.created_at)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formatDate(spk.updated_at)}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                            <h3 className="text-sm font-semibold text-blue-900 mb-2">Vendor Access</h3>
                            <p className="text-sm text-blue-700 mb-3">
                                Vendors can view this SPK at:
                            </p>
                            <code className="text-xs bg-white px-2 py-1 rounded border border-blue-200 block break-all">
                                /vendor/{spk.vendor_name.toLowerCase().replace(/\s+/g, '-')}
                            </code>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSPK } from '@/app/actions/spk'

export default function CreateSPKPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    // Form state
    const [contractValue, setContractValue] = useState<number>(0)
    const [dpPercentage, setDpPercentage] = useState<number>(30)
    const [progressPercentage, setProgressPercentage] = useState<number>(40)
    const [finalPercentage, setFinalPercentage] = useState<number>(30)

    // Calculated amounts
    const dpAmount = (contractValue * dpPercentage) / 100
    const progressAmount = (contractValue * progressPercentage) / 100
    const finalAmount = (contractValue * finalPercentage) / 100
    const totalPercentage = dpPercentage + progressPercentage + finalPercentage

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        // Validate percentages
        if (Math.abs(totalPercentage - 100) > 0.01) {
            setError('Payment percentages must sum to 100%')
            return
        }

        setIsSubmitting(true)
        const formData = new FormData(e.currentTarget)

        const data = {
            vendorName: formData.get('vendorName') as string,
            vendorEmail: formData.get('vendorEmail') as string,
            vendorPhone: formData.get('vendorPhone') as string,
            projectName: formData.get('projectName') as string,
            projectDescription: formData.get('projectDescription') as string,
            contractValue: parseFloat(formData.get('contractValue') as string),
            currency: 'IDR',
            startDate: formData.get('startDate') as string,
            endDate: formData.get('endDate') as string,
            dpPercentage,
            progressPercentage,
            finalPercentage,
            notes: formData.get('notes') as string,
        }

        const result = await createSPK(data)

        if (result.success) {
            router.push('/dashboard')
        } else {
            setError(result.error || 'Failed to create SPK')
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 mb-2 block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Create New SPK</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Vendor Information */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vendor Information</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Vendor Name *
                                </label>
                                <input
                                    type="text"
                                    id="vendorName"
                                    name="vendorName"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="vendorEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="vendorEmail"
                                        name="vendorEmail"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="vendorPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        id="vendorPhone"
                                        name="vendorPhone"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Details */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Name *
                                </label>
                                <input
                                    type="text"
                                    id="projectName"
                                    name="projectName"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="projectDescription"
                                    name="projectDescription"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="contractValue" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contract Value (IDR) *
                                </label>
                                <input
                                    type="number"
                                    id="contractValue"
                                    name="contractValue"
                                    required
                                    min="0"
                                    step="1"
                                    value={contractValue || ''}
                                    onChange={(e) => setContractValue(parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Breakdown */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Breakdown</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="dpPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                                        Down Payment (%)
                                    </label>
                                    <input
                                        type="number"
                                        id="dpPercentage"
                                        value={dpPercentage}
                                        onChange={(e) => setDpPercentage(parseFloat(e.target.value) || 0)}
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (IDR)</label>
                                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                                        {dpAmount.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="progressPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                                        Progress Payment (%)
                                    </label>
                                    <input
                                        type="number"
                                        id="progressPercentage"
                                        value={progressPercentage}
                                        onChange={(e) => setProgressPercentage(parseFloat(e.target.value) || 0)}
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (IDR)</label>
                                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                                        {progressAmount.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="finalPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                                        Final Payment (%)
                                    </label>
                                    <input
                                        type="number"
                                        id="finalPercentage"
                                        value={finalPercentage}
                                        onChange={(e) => setFinalPercentage(parseFloat(e.target.value) || 0)}
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (IDR)</label>
                                    <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                                        {finalAmount.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">Total Percentage:</span>
                                    <span className={`font-semibold ${Math.abs(totalPercentage - 100) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                                        {totalPercentage.toFixed(1)}%
                                    </span>
                                </div>
                                {Math.abs(totalPercentage - 100) > 0.01 && (
                                    <p className="text-sm text-red-600 mt-1">Percentages must sum to 100%</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Notes</h2>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={4}
                            placeholder="Add any additional notes or special instructions..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 justify-end">
                        <Link
                            href="/dashboard"
                            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting || Math.abs(totalPercentage - 100) > 0.01}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                        >
                            {isSubmitting ? 'Creating...' : 'Create SPK'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}

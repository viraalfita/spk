'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePaymentStatus } from '@/app/actions/payment'
import type { Payment } from '@/lib/supabase/types'

export default function PaymentUpdateButton({
    payment,
    spkId,
}: {
    payment: Payment
    spkId: string
}) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState(payment.status)
    const [paidDate, setPaidDate] = useState(payment.paid_date || '')
    const [reference, setReference] = useState(payment.payment_reference || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const result = await updatePaymentStatus(payment.id, spkId, {
            status,
            paidDate: paidDate || undefined,
            paymentReference: reference || undefined,
        })

        if (result.success) {
            setIsOpen(false)
            router.refresh()
        } else {
            alert('Failed to update payment status')
        }
        setIsSubmitting(false)
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-blue-600 hover:text-blue-900 font-medium"
            >
                Update
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Update Payment Status</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Term
                                </label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 capitalize">
                                    {payment.term === 'dp' ? 'Down Payment' : payment.term === 'progress' ? 'Progress Payment' : 'Final Payment'}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status *
                                </label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as 'pending' | 'paid' | 'overdue')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="paidDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Paid Date
                                </label>
                                <input
                                    type="date"
                                    id="paidDate"
                                    value={paidDate}
                                    onChange={(e) => setPaidDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Reference
                                </label>
                                <input
                                    type="text"
                                    id="reference"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="e.g., TRX-20260121-001"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors"
                                >
                                    {isSubmitting ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

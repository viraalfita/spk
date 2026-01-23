import { getPaymentsBySPK } from "@/app/actions/payment";
import { getSPKs } from "@/app/actions/spk";
import type { Payment } from "@/lib/supabase/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function VendorDashboardPage({
  params,
}: {
  params: { vendorId: string };
}) {
  const vendorParam = decodeURIComponent(params.vendorId);
  const vendorName = vendorParam.replace(/-/g, " ");

  // Fetch SPKs for this vendor
  const result = await getSPKs();
  const allSPKs = result.success ? result.data : [];
  const spks = allSPKs.filter((spk) =>
    spk.vendor_name.toLowerCase().includes(vendorName.toLowerCase()),
  );

  // Fetch payments for each SPK
  const spksWithPayments = await Promise.all(
    spks.map(async (spk) => {
      const paymentsResult = await getPaymentsBySPK(spk.id);
      return {
        ...spk,
        payments: paymentsResult.success ? paymentsResult.data : [],
      };
    }),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Vendor Portal
              </h1>
              <p className="text-gray-600 mt-1 capitalize">{vendorName}</p>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                This is a read-only view of your work orders. For any inquiries
                or changes, please contact the admin.
              </p>
            </div>
          </div>
        </div>

        {/* SPK List */}
        {spksWithPayments.length > 0 ? (
          <div className="space-y-6">
            {spksWithPayments.map((spk) => (
              <div
                key={spk.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {spk.spk_number}
                      </h2>
                      <p className="text-gray-600 mt-1">{spk.project_name}</p>
                    </div>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        spk.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {spk.status}
                    </span>
                  </div>

                  <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Contract Value
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">
                        {formatCurrency(spk.contract_value, spk.currency)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Start Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(spk.start_date)}
                      </dd>
                    </div>
                    {spk.end_date && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          End Date
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatDate(spk.end_date)}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {spk.project_description && (
                    <p className="text-sm text-gray-600 mb-6">
                      {spk.project_description}
                    </p>
                  )}

                  {/* Payment Summary with Status */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Payment Terms & Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {spk.payments &&
                        spk.payments.map((payment: Payment) => {
                          const statusColors = {
                            pending: "bg-yellow-50 border-yellow-200",
                            paid: "bg-green-50 border-green-200",
                            overdue: "bg-red-50 border-red-200",
                          };
                          const statusBadgeColors = {
                            pending: "bg-yellow-100 text-yellow-800",
                            paid: "bg-green-100 text-green-800",
                            overdue: "bg-red-100 text-red-800",
                          };
                          const termLabels = {
                            dp: "Down Payment",
                            progress: "Progress Payment",
                            final: "Final Payment",
                          };

                          return (
                            <div
                              key={payment.id}
                              className={`rounded-lg p-3 border ${statusColors[payment.status]}`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-gray-600 font-medium">
                                  {termLabels[payment.term]}
                                </p>
                                <span
                                  className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadgeColors[payment.status]}`}
                                >
                                  {payment.status}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mb-1">
                                {formatCurrency(payment.amount, spk.currency)}
                              </p>
                              <p className="text-xs text-gray-500 mb-2">
                                {payment.percentage}%
                              </p>

                              {payment.status === "paid" &&
                                payment.paid_date && (
                                  <div className="pt-2 border-t border-gray-200">
                                    <p className="text-xs text-gray-500">
                                      Paid on:
                                    </p>
                                    <p className="text-xs font-medium text-gray-700">
                                      {formatDate(payment.paid_date)}
                                    </p>
                                    {payment.payment_reference && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Ref: {payment.payment_reference}
                                      </p>
                                    )}
                                  </div>
                                )}
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end">
                    <a
                      href={`/api/pdf/${spk.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No SPKs Found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No work orders found for this vendor. Please contact admin if you
              believe this is an error.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

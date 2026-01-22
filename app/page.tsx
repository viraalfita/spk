import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        SPK Creator
                    </h1>
                    <p className="text-xl text-gray-600">
                        Digital Work Order & Payment Tracking System
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Link
                        href="/dashboard"
                        className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-8 border-2 border-transparent hover:border-blue-500"
                    >
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                Admin Dashboard
                            </h2>
                            <p className="text-gray-600">
                                Manage SPKs, track payments, and generate documents
                            </p>
                        </div>
                    </Link>

                    <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 opacity-75">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                Vendor Portal
                            </h2>
                            <p className="text-gray-600 mb-4">
                                View your work orders and payment status
                            </p>
                            <p className="text-sm text-gray-500">
                                Access via email link or contact admin
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-600">
                    <p className="text-sm">
                        Need help? Contact{' '}
                        <a href="mailto:admin@company.com" className="text-blue-600 hover:underline">
                            admin@company.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

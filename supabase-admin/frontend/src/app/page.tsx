import Link from 'next/link'
import { Shield, Users, ClipboardList, ArrowRight } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-primary-100 rounded-2xl">
                            <Shield className="w-12 h-12 text-primary-600" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Admin Control System
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Role-based access control for managing users, moderators, and administrators.
                        Built with Supabase for secure, scalable operations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        >
                            Sign In
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            User Management
                        </h3>
                        <p className="text-gray-600">
                            Invite users, assign roles, and manage permissions with a simple UI.
                            Full audit trail for compliance.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                            <ClipboardList className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Registration Workflow
                        </h3>
                        <p className="text-gray-600">
                            Users submit documents, moderators review, admins oversee.
                            Real-time notifications keep everyone in sync.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Secure by Design
                        </h3>
                        <p className="text-gray-600">
                            Row-level security, encrypted storage, and comprehensive
                            audit logging protect your data.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                    Built with Supabase, Next.js, and TypeScript
                </div>
            </footer>
        </div>
    )
}

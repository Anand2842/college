'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
    User,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Home,
} from 'lucide-react'

interface UserAccountLayoutProps {
    children: ReactNode
}

const navigation = [
    { name: 'Dashboard', href: '/account', icon: Home },
    { name: 'My Submissions', href: '/account/submissions', icon: FileText },
    { name: 'Profile', href: '/account/profile', icon: User },
    { name: 'Settings', href: '/account/settings', icon: Settings },
]

export function UserAccountLayout({ children }: UserAccountLayoutProps) {
    const pathname = usePathname()
    const { profile, signOut, user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                        <Link href="/account" className="flex items-center gap-2">
                            <User className="w-8 h-8 text-primary-600" />
                            <span className="font-bold text-gray-900">My Account</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 text-gray-500 lg:hidden hover:bg-gray-100 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/account' && pathname.startsWith(item.href))
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Role-based quick links */}
                    {profile && ['moderator', 'admin', 'superadmin'].includes(profile.role) && (
                        <div className="px-4 py-3 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Quick Access</p>
                            {['admin', 'superadmin'].includes(profile.role) && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100"
                                >
                                    Admin Panel
                                </Link>
                            )}
                            {profile.role === 'moderator' && (
                                <Link
                                    href="/moderator"
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
                                >
                                    Moderator Panel
                                </Link>
                            )}
                        </div>
                    )}

                    {/* User section */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium">
                                    {profile?.display_name?.[0] || profile?.email?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {profile?.display_name || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500">{profile?.email}</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setUserMenuOpen(false)}
                                    />
                                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                        <button
                                            onClick={() => {
                                                setUserMenuOpen(false)
                                                signOut()
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between h-full px-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 text-gray-500 lg:hidden hover:bg-gray-100 rounded-lg"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex-1" />
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">{children}</main>
            </div>
        </div>
    )
}

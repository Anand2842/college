'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { NotificationsDropdown } from '@/components/NotificationsToast'
import { PermissionGuard } from '@/components/PermissionGuard'
import {
    ClipboardList,
    FileCheck,
    FileX,
    Clock,
    LogOut,
    Menu,
    X,
    ChevronDown,
    UserCircle,
} from 'lucide-react'

interface ModeratorLayoutProps {
    children: ReactNode
}

const navigation = [
    { name: 'Review Queue', href: '/moderator', icon: ClipboardList },
    { name: 'Pending', href: '/moderator/pending', icon: Clock },
    { name: 'Approved', href: '/moderator/approved', icon: FileCheck },
    { name: 'Rejected', href: '/moderator/rejected', icon: FileX },
]

export function ModeratorLayout({ children }: ModeratorLayoutProps) {
    const pathname = usePathname()
    const { profile, signOut } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    return (
        <PermissionGuard requiredRole="moderator" redirectTo="/login">
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
                            <Link href="/moderator" className="flex items-center gap-2">
                                <ClipboardList className="w-8 h-8 text-blue-600" />
                                <span className="font-bold text-gray-900">Moderator</span>
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
                                    (item.href !== '/moderator' && pathname.startsWith(item.href))
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Quick stats */}
                        <div className="px-4 py-3 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Today</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-lg font-semibold text-gray-900">--</p>
                                    <p className="text-xs text-gray-500">Reviewed</p>
                                </div>
                                <div className="bg-amber-50 rounded-lg p-2">
                                    <p className="text-lg font-semibold text-amber-700">--</p>
                                    <p className="text-xs text-gray-500">Pending</p>
                                </div>
                            </div>
                        </div>

                        {/* User section */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium">
                                        {profile?.display_name?.[0] || profile?.email?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {profile?.display_name || 'Moderator'}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
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
                                            <Link
                                                href="/account"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <UserCircle className="w-4 h-4" />
                                                My Account
                                            </Link>
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

                            <div className="flex-1 lg:hidden" />

                            <div className="flex items-center gap-2">
                                <NotificationsDropdown />
                            </div>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="p-4 lg:p-8">{children}</main>
                </div>
            </div>
        </PermissionGuard>
    )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Check, CheckCheck, X } from 'lucide-react'
import { useNotifications } from '@/hooks/useRealtime'
import { useAuth } from '@/hooks/useAuth'
import { Notification } from '@/services/supabaseClient'

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
}

function getNotificationIcon(type: string): string {
    switch (type) {
        case 'new_registration':
            return '📋'
        case 'registration_update':
            return '✅'
        case 'role_change':
            return '👤'
        case 'invitation':
            return '📧'
        default:
            return '🔔'
    }
}

export function NotificationsDropdown() {
    const { user } = useAuth()
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(user?.id)
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!user) return null

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fade-in">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                            >
                                <CheckCheck className="w-4 h-4" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={() => markAsRead(notification.id)}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

interface NotificationItemProps {
    notification: Notification
    onMarkAsRead: () => void
}

function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
    return (
        <li
            className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-primary-50/50' : ''
                }`}
        >
            <div className="flex gap-3">
                <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                    </p>
                    {notification.message && (
                        <p className="text-sm text-gray-500 truncate">{notification.message}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notification.created_at)}</p>
                </div>
                {!notification.read && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onMarkAsRead()
                        }}
                        className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded"
                        title="Mark as read"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                )}
            </div>
        </li>
    )
}

// Toast notification for realtime updates
export function NotificationToast({
    notification,
    onClose,
}: {
    notification: Notification
    onClose: () => void
}) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-slide-up z-50">
            <div className="flex items-start gap-3">
                <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1">
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    {notification.message && (
                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

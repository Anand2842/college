'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, Notification } from '@/services/supabaseClient'
import { RealtimeChannel } from '@supabase/supabase-js'

export function useNotifications(userId: string | undefined) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)

    const fetchNotifications = useCallback(async () => {
        if (!userId) return

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) {
            console.error('Error fetching notifications:', error)
            return
        }

        setNotifications(data as Notification[])
        setUnreadCount(data.filter(n => !n.read).length)
        setLoading(false)
    }, [userId])

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        fetchNotifications()

        // Subscribe to realtime notifications
        const channel: RealtimeChannel = supabase
            .channel(`notifications:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    const newNotification = payload.new as Notification
                    setNotifications(prev => [newNotification, ...prev])
                    setUnreadCount(prev => prev + 1)
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    const updatedNotification = payload.new as Notification
                    setNotifications(prev =>
                        prev.map(n =>
                            n.id === updatedNotification.id ? updatedNotification : n
                        )
                    )
                    // Recalculate unread count
                    setNotifications(prev => {
                        setUnreadCount(prev.filter(n => !n.read).length)
                        return prev
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, fetchNotifications])

    const markAsRead = async (notificationId: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId)

        if (!error) {
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, read: true } : n
                )
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
        }
    }

    const markAllAsRead = async () => {
        if (!userId) return

        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false)

        if (!error) {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
            setUnreadCount(0)
        }
    }

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications,
    }
}

// Generic realtime hook for any table
export function useRealtimeTable<T extends { id: string }>(
    table: string,
    filter?: { column: string; value: string }
) {
    const [data, setData] = useState<T[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = useCallback(async () => {
        let query = supabase.from(table).select('*')

        if (filter) {
            query = query.eq(filter.column, filter.value)
        }

        const { data: result, error } = await query

        if (error) {
            console.error(`Error fetching ${table}:`, error)
            return
        }

        setData(result as T[])
        setLoading(false)
    }, [table, filter])

    useEffect(() => {
        fetchData()

        const filterString = filter ? `${filter.column}=eq.${filter.value}` : undefined

        const channel = supabase
            .channel(`${table}:changes`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table,
                    filter: filterString,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setData(prev => [payload.new as T, ...prev])
                    } else if (payload.eventType === 'UPDATE') {
                        setData(prev =>
                            prev.map(item =>
                                item.id === (payload.new as T).id ? (payload.new as T) : item
                            )
                        )
                    } else if (payload.eventType === 'DELETE') {
                        setData(prev =>
                            prev.filter(item => item.id !== (payload.old as T).id)
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [table, filter, fetchData])

    return { data, loading, refresh: fetchData }
}

'use client'

import { useState, useTransition } from 'react'
import { updateUserRole } from './actions'
import { Loader2 } from 'lucide-react'

interface UserRoleSelectProps {
    userId: string
    currentRole: 'user' | 'moderator' | 'admin'
}

export function UserRoleSelect({ userId, currentRole }: UserRoleSelectProps) {
    const [isPending, startTransition] = useTransition()
    const [role, setRole] = useState(currentRole)

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as 'user' | 'moderator' | 'admin'
        setRole(newRole)

        startTransition(async () => {
            const result = await updateUserRole(userId, newRole)
            if (result?.error) {
                alert(result.error)
                // Revert on error
                setRole(currentRole)
            }
        })
    }

    return (
        <div className="flex items-center gap-2 justify-end">
            {isPending && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
            <select
                value={role}
                onChange={handleRoleChange}
                disabled={isPending}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-earth-green focus:ring focus:ring-earth-green/50 py-1 disabled:opacity-50"
            >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
            </select>
        </div>
    )
}

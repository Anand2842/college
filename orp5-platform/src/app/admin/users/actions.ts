'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(userId: string, newRole: 'user' | 'moderator' | 'admin') {
    const supabase = await createClient()

    // Verify the requester is an admin
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { data: requesterProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (requesterProfile?.role !== 'admin' && requesterProfile?.role !== 'superadmin') {
        return { error: 'You do not have permission to perform this action.' }
    }

    // Perform the update
    const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

    if (error) {
        console.error('Error updating role:', error)
        return { error: 'Failed to update role.' }
    }

    revalidatePath('/admin/users')
    return { success: true }
}

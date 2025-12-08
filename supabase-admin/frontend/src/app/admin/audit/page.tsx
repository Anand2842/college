'use client'

import { AdminLayout } from '@/components/layouts/AdminLayout'
import { AuditLogViewer } from '@/components/AuditLogViewer'

export default function AuditPage() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                    <p className="text-gray-500">
                        View all system activity and changes
                    </p>
                </div>

                <AuditLogViewer />
            </div>
        </AdminLayout>
    )
}

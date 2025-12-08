'use client'

import { ModeratorLayout } from '@/components/layouts/ModeratorLayout'
import { ModeratorQueue } from '@/components/ModeratorQueue'

export default function ModeratorPage() {
    return (
        <ModeratorLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Review Queue</h1>
                    <p className="text-gray-500">
                        Manage pending registration submissions
                    </p>
                </div>

                <ModeratorQueue />
            </div>
        </ModeratorLayout>
    )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { publishSPK } from '@/app/actions/spk'

export default function PublishButton({ spkId }: { spkId: string }) {
    const router = useRouter()
    const [isPublishing, setIsPublishing] = useState(false)

    const handlePublish = async () => {
        if (!confirm('Are you sure you want to publish this SPK? This will trigger notifications to the vendor.')) {
            return
        }

        setIsPublishing(true)
        const result = await publishSPK(spkId)

        if (result.success) {
            router.refresh()
        } else {
            alert('Failed to publish SPK')
            setIsPublishing(false)
        }
    }

    return (
        <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
            {isPublishing ? 'Publishing...' : 'Publish SPK'}
        </button>
    )
}

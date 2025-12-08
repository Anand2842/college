'use client'

import { useState } from 'react'
import { X, FileText, Image as ImageIcon, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import { Media } from '@/services/supabaseClient'

interface MediaPreviewProps {
    media: Media
    isOpen: boolean
    onClose: () => void
}

export function MediaPreview({ media, isOpen, onClose }: MediaPreviewProps) {
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)

    if (!isOpen) return null

    const isPDF = media.content_type === 'application/pdf'
    const isImage = media.content_type.startsWith('image/')

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
    const handleRotate = () => setRotation(prev => (prev + 90) % 360)
    const handleReset = () => {
        setZoom(1)
        setRotation(0)
    }

    const formatSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
                    <div className="flex items-center gap-3">
                        {isPDF ? (
                            <FileText className="w-5 h-5 text-red-400" />
                        ) : (
                            <ImageIcon className="w-5 h-5 text-blue-400" />
                        )}
                        <div>
                            <h3 className="font-medium">{media.filename}</h3>
                            <p className="text-sm text-gray-400">
                                {media.content_type} • {formatSize(media.size)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isImage && (
                            <>
                                <button
                                    onClick={handleZoomOut}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Zoom out"
                                >
                                    <ZoomOut className="w-5 h-5" />
                                </button>
                                <span className="text-sm min-w-[50px] text-center">
                                    {Math.round(zoom * 100)}%
                                </span>
                                <button
                                    onClick={handleZoomIn}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Zoom in"
                                >
                                    <ZoomIn className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleRotate}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Rotate"
                                >
                                    <RotateCw className="w-5 h-5" />
                                </button>
                                <div className="w-px h-6 bg-gray-600 mx-2" />
                            </>
                        )}

                        <a
                            href={media.url || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}`}
                            download={media.filename}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Download"
                        >
                            <Download className="w-5 h-5" />
                        </a>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors ml-2"
                            title="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                    {isPDF ? (
                        <iframe
                            src={`${media.url || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}`}#toolbar=0`}
                            className="w-full h-full max-w-4xl bg-white rounded-lg"
                            title={media.filename}
                        />
                    ) : isImage ? (
                        <div
                            className="transition-transform duration-200 cursor-move"
                            style={{
                                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                            }}
                            onDoubleClick={handleReset}
                        >
                            <img
                                src={media.url || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}`}
                                alt={media.filename}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                            />
                        </div>
                    ) : (
                        <div className="text-center text-white">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Preview not available for this file type</p>
                            <p className="text-sm text-gray-400 mt-2">{media.content_type}</p>
                            <a
                                href={media.url || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}`}
                                download={media.filename}
                                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100"
                            >
                                <Download className="w-4 h-4" />
                                Download File
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Thumbnail component for file lists
export function MediaThumbnail({
    media,
    onClick,
    className = '',
}: {
    media: Media
    onClick?: () => void
    className?: string
}) {
    const isPDF = media.content_type === 'application/pdf'
    const isImage = media.content_type.startsWith('image/')

    return (
        <button
            onClick={onClick}
            className={`relative group overflow-hidden rounded-lg border border-gray-200 hover:border-primary-400 transition-colors ${className}`}
        >
            {isImage ? (
                <img
                    src={media.url || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${media.bucket}/${media.path}`}
                    alt={media.filename}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-2">
                    <FileText className={`w-8 h-8 ${isPDF ? 'text-red-500' : 'text-gray-400'}`} />
                    <span className="text-xs text-gray-500 mt-1 truncate max-w-full">
                        {media.filename}
                    </span>
                </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white" />
            </div>
        </button>
    )
}

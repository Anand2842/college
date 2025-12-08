'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { supabase, Media } from '@/services/supabaseClient'
import { useAuth } from '@/hooks/useAuth'
import {
    Upload,
    X,
    FileText,
    Image as ImageIcon,
    Loader2,
    AlertTriangle,
    Check,
} from 'lucide-react'

interface RegistrationFormData {
    fullName: string
    email: string
    phone: string
    organization: string
    category: string
    additionalInfo: string
}

const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface RegistrationFormProps {
    onSuccess?: (registrationId: string) => void
}

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
    const { user, profile } = useAuth()
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<RegistrationFormData>({
        defaultValues: {
            email: profile?.email || '',
            fullName: profile?.display_name || '',
        },
    })

    const validateFile = (file: File): string | null => {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return `${file.name}: Invalid file type. Only PDF, PNG, JPG allowed.`
        }
        if (file.size > MAX_FILE_SIZE) {
            return `${file.name}: File too large. Maximum size is 10MB.`
        }
        return null
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        const validFiles: File[] = []
        const errors: string[] = []

        selectedFiles.forEach((file) => {
            const error = validateFile(file)
            if (error) {
                errors.push(error)
            } else {
                validFiles.push(file)
            }
        })

        if (errors.length > 0) {
            setSubmitError(errors.join('\n'))
        }

        setFiles((prev) => [...prev, ...validFiles])

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const uploadFile = async (file: File, registrationId: string): Promise<Media | null> => {
        if (!user) return null

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${user.id}/${registrationId}/${fileName}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('user-docs')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            throw new Error(`Failed to upload ${file.name}`)
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('user-docs')
            .getPublicUrl(filePath)

        // Create media record
        const { data: mediaRecord, error: mediaError } = await supabase
            .from('media')
            .insert({
                path: filePath,
                bucket: 'user-docs',
                filename: file.name,
                url: urlData.publicUrl,
                uploader_id: user.id,
                registration_id: registrationId,
                content_type: file.type,
                size: file.size,
            })
            .select()
            .single()

        if (mediaError) {
            console.error('Media record error:', mediaError)
            throw new Error(`Failed to save ${file.name} metadata`)
        }

        return mediaRecord as Media
    }

    const onSubmit = async (data: RegistrationFormData) => {
        if (!user) return

        setSubmitError(null)
        setUploading(true)

        try {
            // Create registration record
            const { data: registration, error: regError } = await supabase
                .from('registrations')
                .insert({
                    user_id: user.id,
                    data: {
                        fullName: data.fullName,
                        email: data.email,
                        phone: data.phone,
                        organization: data.organization,
                        category: data.category,
                        additionalInfo: data.additionalInfo,
                    },
                    status: 'pending',
                })
                .select()
                .single()

            if (regError) {
                throw new Error('Failed to create registration')
            }

            // Upload files
            const uploadPromises = files.map((file) => uploadFile(file, registration.id))
            await Promise.all(uploadPromises)

            setSubmitSuccess(true)
            reset()
            setFiles([])
            onSuccess?.(registration.id)
        } catch (err) {
            console.error('Submission error:', err)
            setSubmitError(err instanceof Error ? err.message : 'Failed to submit registration')
        } finally {
            setUploading(false)
        }
    }

    if (submitSuccess) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h2>
                <p className="text-gray-600 mb-6">
                    Your registration has been submitted and is pending review. You will be notified when there are updates.
                </p>
                <button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                >
                    Submit Another
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('fullName', { required: 'Full name is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="John Doe"
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Invalid email address',
                            },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="john@example.com"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        {...register('phone')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                    />
                </div>

                {/* Organization */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Organization
                    </label>
                    <input
                        {...register('organization')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Company or Institution"
                    />
                </div>

                {/* Category */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register('category', { required: 'Please select a category' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="">Select a category</option>
                        <option value="individual">Individual</option>
                        <option value="student">Student</option>
                        <option value="professional">Professional</option>
                        <option value="organization">Organization</option>
                    </select>
                    {errors.category && (
                        <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                </div>

                {/* Additional Info */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Information
                    </label>
                    <textarea
                        {...register('additionalInfo')}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="Any additional details you'd like to share..."
                    />
                </div>
            </div>

            {/* File Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Documents
                </label>
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        PDF, PNG, JPG up to 10MB
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <ul className="mt-3 space-y-2">
                        {files.map((file, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                            >
                                {file.type.startsWith('image/') ? (
                                    <ImageIcon className="w-5 h-5 text-blue-500" />
                                ) : (
                                    <FileText className="w-5 h-5 text-red-500" />
                                )}
                                <span className="flex-1 text-sm text-gray-700 truncate">
                                    {file.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {(file.size / 1024).toFixed(1)} KB
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="p-1 text-gray-400 hover:text-red-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Error Display */}
            {submitError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm whitespace-pre-line">{submitError}</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {(isSubmitting || uploading) && <Loader2 className="w-5 h-5 animate-spin" />}
                {uploading ? 'Uploading Files...' : isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
        </form>
    )
}

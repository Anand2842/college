"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Loader2, X, File, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
    label: string;
    value: string; // The URL
    onChange: (url: string) => void;
    className?: string;
    accept?: string;
}

export function FileUploader({ label, value, onChange, className, accept = "*/*" }: FileUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                onChange(data.url);
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            console.error(error);
            alert("Error uploading file");
        } finally {
            setUploading(false);
        }
    };

    const isImage = (url: string) => {
        return url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);
    };

    const getFileName = (url: string) => {
        return url.split('/').pop() || url;
    };

    return (
        <div className={cn("mb-4", className)}>
            <label className="block text-sm font-bold text-earth-green mb-2">
                {label}
            </label>

            <div className="border border-gray-300 rounded-lg p-3 bg-white">
                {value ? (
                    <div className="relative group">
                        {isImage(value) ? (
                            <div className="h-40 w-full bg-gray-100 rounded-md overflow-hidden relative border border-gray-200">
                                <img src={value} className="w-full h-full object-cover" alt="Preview" />
                            </div>
                        ) : (
                            <div className="h-20 w-full bg-blue-50 rounded-md flex items-center p-4 border border-blue-100">
                                <FileText size={32} className="text-blue-500 mr-3" />
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-blue-900 truncate">{getFileName(value)}</p>
                                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">View File</a>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => onChange("")}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            title="Remove File"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="h-24 w-full border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        {uploading ? (
                            <Loader2 className="animate-spin text-earth-green mb-2" />
                        ) : (
                            <Upload className="text-gray-400 mb-2" />
                        )}
                        <span className="text-xs text-gray-500 font-medium">
                            {uploading ? "Uploading..." : "Click to Upload File"}
                        </span>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept={accept}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}

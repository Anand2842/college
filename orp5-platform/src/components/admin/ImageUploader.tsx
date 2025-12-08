"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/atoms/Button";
import { Upload, Image as ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
    label: string;
    value: string; // The URL
    onChange: (url: string) => void;
    className?: string;
}

export function ImageUploader({ label, value, onChange, className }: ImageUploaderProps) {
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
            alert("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={cn("mb-4", className)}>
            <label className="block text-sm font-bold text-earth-green mb-2">
                {label}
            </label>

            <div className="border border-gray-300 rounded-lg p-3 bg-white">
                {value ? (
                    <div className="relative group">
                        <div className="h-40 w-full bg-gray-100 rounded-md overflow-hidden relative border border-gray-200">
                            <img src={value} className="w-full h-full object-cover" alt="Preview" />
                        </div>
                        <button
                            onClick={() => onChange("")}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Image"
                        >
                            <X size={14} />
                        </button>
                        <p className="mt-2 text-xs text-center text-gray-500 truncate">{value}</p>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="h-32 w-full border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        {uploading ? (
                            <Loader2 className="animate-spin text-earth-green mb-2" />
                        ) : (
                            <Upload className="text-gray-400 mb-2" />
                        )}
                        <span className="text-xs text-gray-500 font-medium">
                            {uploading ? "Uploading..." : "Click to Upload Image"}
                        </span>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}

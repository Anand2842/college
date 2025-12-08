import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    helperText?: string;
}

export function AdminInput({ label, helperText, className, ...props }: AdminInputProps) {
    return (
        <div className={cn("mb-4", className)}>
            <label className="block text-sm font-bold text-earth-green mb-1">
                {label}
            </label>
            <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sapling-green/50 transition-all text-sm"
                {...props}
            />
            {helperText && <p className="text-xs text-gray-400 mt-1">{helperText}</p>}
        </div>
    );
}

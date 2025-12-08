import { Button } from "@/components/atoms/Button";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    onSave: () => void;
    saving: boolean;
    viewLink?: string;
    className?: string;
}

export function PageHeader({ title, subtitle, onSave, saving, viewLink, className }: PageHeaderProps) {
    return (
        <div className={cn("bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm", className)}>
            <div>
                <h1 className="text-xl font-bold text-charcoal">{title}</h1>
                {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
                {viewLink && (
                    <Link href={viewLink} target="_blank">
                        <Button variant="outline" size="sm" className="hidden md:flex">
                            <ExternalLink size={16} className="mr-2" /> View Page
                        </Button>
                    </Link>
                )}
                <Button onClick={onSave} disabled={saving} className="bg-earth-green hover:bg-earth-green/90 text-white min-w-[140px]">
                    {saving ? <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</> : <><Save size={16} className="mr-2" /> Save Changes</>}
                </Button>
            </div>
        </div>
    );
}

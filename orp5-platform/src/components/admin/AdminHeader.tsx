
interface AdminHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export function AdminHeader({ title, description, children }: AdminHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-serif font-bold text-charcoal">{title}</h1>
                {description && <p className="text-gray-500 mt-1">{description}</p>}
            </div>
            {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
    );
}

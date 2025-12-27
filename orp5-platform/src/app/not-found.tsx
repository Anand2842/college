import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-2xl font-bold font-serif text-[#123125]">Page Not Found</h2>
            <p className="text-gray-600">Could not find requested resource</p>
            <Link
                href="/"
                className="text-[#DFC074] hover:underline font-bold"
            >
                Return Home
            </Link>
        </div>
    )
}

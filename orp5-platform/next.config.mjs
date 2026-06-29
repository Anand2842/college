import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        root: __dirname,
    },
    async redirects() {
        return [
            {
                source: '/admin',
                destination: '/admin/dashboard',
                permanent: true,
            },
            {
                source: '/register',
                destination: '/registration',
                permanent: true,
            },
        ];
    },
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },

            {
                protocol: 'https',
                hostname: 'vvqnxqtiwbfmipawtqet.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
};

export default nextConfig;

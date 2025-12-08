import { Metadata } from 'next';
import { Suspense } from 'react';
import RegistrationSuccessClient from './RegistrationSuccessClient';

export const metadata: Metadata = {
    title: 'Success | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function RegistrationSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-green-600"></div>
            </div>
        }>
            <RegistrationSuccessClient />
        </Suspense>
    );
}

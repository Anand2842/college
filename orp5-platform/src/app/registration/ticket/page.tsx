import { Metadata } from 'next';
import RegistrationTicketClient from './RegistrationTicketClient';

export const metadata: Metadata = {
    title: 'Ticket | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

import { Suspense } from 'react';

export default function TicketPage() {
    return (
        <Suspense fallback={<div>Loading ticket...</div>}>
            <RegistrationTicketClient />
        </Suspense>
    );
}

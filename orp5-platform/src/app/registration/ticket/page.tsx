import { Metadata } from 'next';
import RegistrationTicketClient from './RegistrationTicketClient';

export const metadata: Metadata = {
    title: 'Ticket | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function TicketPage() {
    return <RegistrationTicketClient />;
}

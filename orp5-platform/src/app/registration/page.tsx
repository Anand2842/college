import { createPageMetadata } from '@/lib/metadata';
import RegistrationContent from "./RegistrationContent";

export const metadata = createPageMetadata({
    title: 'Registration',
    description: '5th International Conference on Organic & Natural Rice Farming',
    path: '/registration',
});

export default function RegistrationPage() {
    return <RegistrationContent />;
}

import { Metadata } from 'next';
import RegistrationContent from "./RegistrationContent";

export const metadata: Metadata = {
    title: 'Registration | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function RegistrationPage() {
    return <RegistrationContent />;
}

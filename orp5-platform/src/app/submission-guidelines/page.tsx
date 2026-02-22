import { Metadata } from 'next';
import SubmissionGuidelinesClient from './SubmissionGuidelinesClient';

export const metadata: Metadata = {
    title: 'Participation Guidelines | ORP-5',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function SubmissionGuidelinesPage() {
    return <SubmissionGuidelinesClient />;
}

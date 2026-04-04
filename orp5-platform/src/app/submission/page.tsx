import { Metadata } from 'next';
import SubmissionClient from './SubmissionClient';

export const metadata: Metadata = {
    title: 'Abstract Submission | ORP-5',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function SubmissionPage() {
    return <SubmissionClient />;
}

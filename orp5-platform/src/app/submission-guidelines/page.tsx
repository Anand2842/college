import { Metadata } from 'next';
import SubmissionGuidelinesClient from './SubmissionGuidelinesClient';

export const metadata: Metadata = {
    title: 'Submission guidelines | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};

export default function SubmissionGuidelinesPage() {
    return <SubmissionGuidelinesClient />;
}

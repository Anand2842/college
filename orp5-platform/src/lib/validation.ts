import { z } from 'zod';

// Registration form validation
export const registrationSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    affiliation: z.string().min(2, 'Affiliation is required'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    designation: z.string().min(2, 'Designation is required'),
    country: z.string().min(2, 'Please select a country'),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

// Abstract submission validation
export const submissionSchema = z.object({
    fullName: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number is required'),
    institution: z.string().min(2, 'Institution is required'),
    category: z.string().min(1, 'Please select a presentation category'),
    theme: z.string().min(1, 'Please select a thematic area'),
    title: z.string().min(10, 'Title must be at least 10 characters'),
    abstract: z
        .string()
        .min(100, 'Abstract must be at least 100 characters')
        .max(3000, 'Abstract cannot exceed 3000 characters'),
    file: z.instanceof(File).optional(),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;

// Contact form validation
export const contactSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    affiliation: z.string().min(2, 'Affiliation is required'),
    country: z.string().min(2, 'Country is required'),
    category: z.string().min(1, 'Please select a category'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

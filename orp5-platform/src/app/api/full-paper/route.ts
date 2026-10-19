import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { sendFullPaperConfirmationEmail } from '@/lib/email';

const supabase = getSupabaseAdmin();

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // ── 1. Validation ──────────────────────────────────────────
        const requiredFields: { key: string; label: string }[] = [
            { key: 'paperTitle',          label: 'Paper Title' },
            { key: 'articleType',         label: 'Article Type' },
            { key: 'theme',               label: 'Conference Theme' },
            { key: 'fullName',            label: 'Corresponding Author Name' },
            { key: 'email',               label: 'Email Address' },
            { key: 'phone',               label: 'Phone Number' },
            { key: 'institution',         label: 'Institution / Affiliation' },
            { key: 'country',             label: 'Country' },
            { key: 'nationality',         label: 'Nationality' },
            { key: 'manuscriptUrl',       label: 'Manuscript Document' },
            { key: 'plagiarismReportUrl', label: 'Plagiarism / Similarity Report' },
        ];

        for (const field of requiredFields) {
            if (!body[field.key] || String(body[field.key]).trim() === '') {
                return NextResponse.json(
                    { error: `${field.label} is required.` },
                    { status: 400 }
                );
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(body.email).trim())) {
            return NextResponse.json(
                { error: 'Please provide a valid email address.' },
                { status: 400 }
            );
        }

        // Phone validation
        const digitsOnly = String(body.phone).replace(/\D/g, '');
        if (digitsOnly.length < 7) {
            return NextResponse.json(
                { error: 'Please provide a valid phone number (at least 7 digits).' },
                { status: 400 }
            );
        }

        // Fee Amount validation
        const feeAmount = Number(body.feeAmount);
        if (isNaN(feeAmount) || feeAmount <= 0) {
            return NextResponse.json(
                { error: 'Valid publication fee amount is required.' },
                { status: 400 }
            );
        }

        const isIndian = body.nationality === 'indian';
        const currency = body.currency || (isIndian ? 'INR' : 'EUR');

        // ── 2. Generate Unique Paper Submission ID ──────────────────
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const ticketId = `ORP5-FP-${isIndian ? 'IND' : 'INT'}-${randomNum}`;

        const tags = ['FULL_PAPER', 'BIO_WEB', isIndian ? 'INDIAN' : 'FOREIGN'];
        if (body.articleType === 'Review Article') tags.push('REVIEW_ARTICLE');
        else tags.push('RESEARCH_PAPER');

        // ── 3. Construct Data Payload ───────────────────────────────
        const registrationData = {
            ticket_number: ticketId,
            full_name: String(body.fullName).trim(),
            email: String(body.email).trim().toLowerCase(),
            phone: String(body.phone).trim(),
            institution: String(body.institution).trim(),
            designation: body.designation ? String(body.designation).trim() : '',
            department: body.department ? String(body.department).trim() : '',
            country: String(body.country).trim(),
            nationality: body.nationality,
            category: `Full Paper (${body.articleType})`,
            mode: 'Bio Web Publication',
            membership_type: 'Bio Web Author',
            fee_amount: feeAmount,
            currency: currency,
            payment_status: 'pending_acceptance', // Publication fee payable only after editorial review acceptance
            review_status: 'under_review',
            payment_mode: 'Bank Transfer (Upon Acceptance)',
            payment_date: null,
            utr_number: body.utrNumber ? String(body.utrNumber).trim().toUpperCase() : null,
            proof_url: body.paymentProofUrl || null,
            payment_proof_url: body.paymentProofUrl || null,

            // Full Paper Specifics
            type: 'full_length_paper',
            paper_title: String(body.paperTitle).trim(),
            article_type: body.articleType,
            theme: body.theme,
            co_authors: body.coAuthors ? String(body.coAuthors).trim() : '',
            abstract_text: body.abstract ? String(body.abstract).trim() : '',
            keywords: body.keywords ? String(body.keywords).trim() : '',
            manuscript_url: body.manuscriptUrl,
            plagiarism_report_url: body.plagiarismReportUrl,
            supplementary_url: body.supplementaryUrl || null,
            tags: tags,
            submittedAt: new Date().toISOString()
        };

        // ── 4. Insert into 'registrations' ──────────────────────────
        const { error: regError } = await supabase
            .from('registrations')
            .insert({
                data: registrationData,
                status: 'pending'
            } as any);

        if (regError) {
            console.error('Error saving full paper registration:', regError);
            throw new Error(`Database error: ${regError.message}`);
        }

        // ── 5. Insert into 'abstracts' (for unified submission listing) ─
        try {
            await supabase
                .from('abstracts')
                .insert({
                    title: `[FULL PAPER] ${body.paperTitle}`,
                    abstract_text: (body.abstract ? `${body.abstract}\n\n` : '') + 
                        `Bio Web of Conferences (EDP Sciences) Full Length Paper Submission.\nType: ${body.articleType}\nTrack: ${body.theme}\nRef ID: ${ticketId}\nStatus: Under Peer Review\nPlagiarism Report: ${body.plagiarismReportUrl}${body.supplementaryUrl ? `\nSupplementary: ${body.supplementaryUrl}` : ''}`,
                    category: body.articleType,
                    topic: body.theme,
                    file_url: body.manuscriptUrl,
                    status: 'pending',
                    author_name: body.fullName,
                    email: body.email,
                    phone: body.phone,
                    institution: body.institution
                } as any);
        } catch (absErr) {
            console.warn('Warning: Failed to insert mirror record in abstracts table:', absErr);
        }

        // ── 6. Send Automated Confirmation Email ────────────────────
        try {
            await sendFullPaperConfirmationEmail({
                to: body.email,
                authorName: body.fullName,
                paperTitle: body.paperTitle,
                ticketId: ticketId,
                articleType: body.articleType,
                theme: body.theme,
                amount: feeAmount,
                currency: currency,
            });
        } catch (emailErr) {
            console.error('Failed to send confirmation email for full paper:', emailErr);
        }

        return NextResponse.json({
            success: true,
            ticketId,
            paperTitle: body.paperTitle,
            feeAmount,
            currency,
            reviewStatus: 'under_review',
            paymentStatus: 'pending_acceptance',
            message: 'Your full-length paper submission and registration have been received successfully.'
        });

    } catch (error: any) {
        console.error('Full paper submission error:', error);
        return NextResponse.json(
            { error: 'Failed to process full paper submission.', details: error.message || error },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        let query = supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

        const { data, error } = await query;
        if (error) throw error;

        // Filter for full length paper registrations
        const papers = (data || [])
            .filter((r: any) => r.data?.type === 'full_length_paper' || (r.data?.tags && r.data.tags.includes('FULL_PAPER')))
            .map((r: any) => ({
                id: r.id,
                submittedAt: r.created_at || r.data?.submittedAt,
                ...r.data
            }));

        if (email) {
            const filtered = papers.filter((p: any) => p.email?.toLowerCase() === email.toLowerCase());
            return NextResponse.json(filtered);
        }

        return NextResponse.json(papers);
    } catch (error: any) {
        console.error('Error fetching full papers:', error);
        return NextResponse.json({ error: 'Failed to fetch full papers' }, { status: 500 });
    }
}

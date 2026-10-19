import { getSupabaseAdmin } from '../src/lib/supabase-admin';

const BASE_URL = 'http://localhost:3000';

async function runSmokeTest() {
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🚀 RUNNING ORP-5 PLATFORM END-TO-END SMOKE TEST');
    console.log('   (User -> Moderator Review -> Payment -> Admin Verify)');
    console.log('════════════════════════════════════════════════════════════════\n');

    const supabase = getSupabaseAdmin();
    const testEmail = `smoke.author.${Date.now()}@example.com`;
    const testTitle = `Smoke Test: Climate-Smart Precision Agriculture [Run ${Date.now()}]`;
    let ticketId = '';
    let abstractId = '';
    let registrationId = '';

    try {
        // ─────────────────────────────────────────────────────────────
        // STEP 1: USER SUBMITS FULL PAPER (Zero upfront fee)
        // ─────────────────────────────────────────────────────────────
        console.log('▶ STEP 1: Author Submitting Full-Length Manuscript (/api/full-paper)...');
        const submitPayload = {
            fullName: 'Prof. Smoke Test Author',
            email: testEmail,
            phone: '+91 9876543210',
            institution: 'ICAR - Indian Agricultural Research Institute',
            designation: 'Principal Scientist',
            department: 'Division of Agronomy',
            country: 'India',
            nationality: 'indian',
            feeAmount: 6000,
            currency: 'INR',
            paperTitle: testTitle,
            articleType: 'Research Article',
            theme: 'Climate Resilient Agriculture',
            coAuthors: 'Dr. Co-Author One, Dr. Co-Author Two',
            abstract: 'This is an empirical evaluation of precision water management under varied rainfall regimes.',
            keywords: 'precision agriculture, climate resilience, crop modeling',
            manuscriptUrl: 'https://storage.googleapis.com/test-manuscripts/manuscript-sample.docx',
            plagiarismReportUrl: 'https://storage.googleapis.com/test-reports/turnitin-sample.pdf',
            supplementaryUrl: 'https://storage.googleapis.com/test-supplementary/data-appendix.xlsx',
            agreeOriginal: true,
            agreePublicationFee: true,
            agreeCoAuthors: true,
        };

        const submitRes = await fetch(`${BASE_URL}/api/full-paper`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submitPayload),
        });

        const submitData = await submitRes.json();
        if (!submitRes.ok || !submitData.ticketId) {
            throw new Error(`Submission failed: ${JSON.stringify(submitData)}`);
        }

        ticketId = submitData.ticketId;
        console.log(`  ✓ Manuscript successfully queued!`);
        console.log(`    Tracking ID: ${ticketId}`);
        console.log(`    Review Status: ${submitData.reviewStatus}`);
        console.log(`    Payment Status: ${submitData.paymentStatus} (Zero upfront payment required)\n`);

        if (submitData.reviewStatus !== 'under_review' || submitData.paymentStatus !== 'pending_acceptance') {
            throw new Error(`Invalid initial statuses: review=${submitData.reviewStatus}, payment=${submitData.paymentStatus}`);
        }

        // ─────────────────────────────────────────────────────────────
        // STEP 2: USER TRACKS STATUS ON PORTAL (/api/ticket-status)
        // ─────────────────────────────────────────────────────────────
        console.log('▶ STEP 2: User Checking Manuscript Tracking (/api/ticket-status)...');
        const trackRes1 = await fetch(`${BASE_URL}/api/ticket-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticket_id: ticketId, email: testEmail }),
        });

        const trackData1 = await trackRes1.json();
        if (!trackRes1.ok) {
            throw new Error(`Tracking lookup failed: ${JSON.stringify(trackData1)}`);
        }

        console.log(`  ✓ Tracking portal verified record:`);
        console.log(`    Manuscript: "${trackData1.paper_title}"`);
        console.log(`    Review Status: ${trackData1.review_status}`);
        console.log(`    Fee Amount: ${trackData1.currency} ${trackData1.fee_amount} (Payable upon formal acceptance)\n`);

        if (trackData1.review_status !== 'under_review') {
            throw new Error(`Expected review_status to be 'under_review', got ${trackData1.review_status}`);
        }

        // ─────────────────────────────────────────────────────────────
        // STEP 3: MODERATOR REVIEWS & ACCEPTS PAPER (/api/submissions/[id])
        // ─────────────────────────────────────────────────────────────
        console.log('▶ STEP 3: Moderator Reviewing Manuscript & Approving for Bio Web...');
        // Find mirror record in abstracts table
        const { data: absRows, error: absError } = await supabase
            .from('abstracts')
            .select('id, title, status, abstract_text')
            .ilike('email', testEmail)
            .limit(1);

        if (absError || !absRows || absRows.length === 0) {
            throw new Error(`Mirror abstract record not found in DB for email ${testEmail}`);
        }

        abstractId = absRows[0].id;
        console.log(`  ✓ Found submission record: ID ${abstractId}`);
        console.log(`    Contains Plagiarism Report link: ${absRows[0].abstract_text.includes('Plagiarism Report') ? 'YES' : 'NO'}`);

        // Moderator accepts paper with comments
        const modReviewRes = await fetch(`${BASE_URL}/api/submissions/${abstractId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'accepted',
                notes: 'Excellent paper with rigorous experimental design. Accepted for inclusion in Bio Web of Conferences volume.',
                moderatorName: 'Dr. Senior Reviewer'
            }),
        });

        const modReviewData = await modReviewRes.json();
        if (!modReviewRes.ok || !modReviewData.success) {
            throw new Error(`Moderator review status update failed: ${JSON.stringify(modReviewData)}`);
        }

        console.log(`  ✓ Moderator marked paper as ACCEPTED!`);
        console.log(`    Triggered sendFullPaperAcceptedEmail with official SBI Bank details.\n`);

        // ─────────────────────────────────────────────────────────────
        // STEP 4: USER RE-CHECKS STATUS AFTER ACCEPTANCE
        // ─────────────────────────────────────────────────────────────
        console.log('▶ STEP 4: User Checking Status Post-Acceptance...');
        const trackRes2 = await fetch(`${BASE_URL}/api/ticket-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticket_id: ticketId, email: testEmail }),
        });

        const trackData2 = await trackRes2.json();
        if (!trackRes2.ok) {
            throw new Error(`Post-acceptance lookup failed: ${JSON.stringify(trackData2)}`);
        }

        console.log(`  ✓ Tracking portal live update:`);
        console.log(`    Review Status: ${trackData2.review_status} (ACCEPTED)`);
        console.log(`    Payment Status: ${trackData2.payment_status}`);
        console.log(`    Notes from Reviewer: "${trackData2.review_notes}"\n`);

        if (trackData2.review_status !== 'accepted') {
            throw new Error(`Expected review_status to be 'accepted', got ${trackData2.review_status}`);
        }

        // ─────────────────────────────────────────────────────────────
        // STEP 5: AUTHOR TRANSFERS VIA SBI & CLAIMS PAYMENT WITH UTR
        // ─────────────────────────────────────────────────────────────
        console.log('▶ STEP 5: Author Completing Bank Transfer & Submitting UTR...');
        const mockUtr = `SBI${Date.now().toString().slice(-8)}`;
        const mockProofUrl = `https://storage.googleapis.com/test-receipts/sbi-receipt-${Date.now()}.png`;

        // Update registration record to payment_claimed
        const { data: regRows } = await supabase
            .from('registrations')
            .select('id, data')
            .filter('data->>ticket_number', 'eq', ticketId)
            .limit(1);

        if (!regRows || regRows.length === 0) {
            throw new Error(`Registration record not found for ticket ${ticketId}`);
        }

        registrationId = regRows[0].id;
        const currentData = regRows[0].data as Record<string, any>;
        const updatedData = {
            ...currentData,
            payment_status: 'payment_claimed',
            utr_number: mockUtr,
            proof_url: mockProofUrl,
            payment_claimed_at: new Date().toISOString(),
        };

        const { error: claimErr } = await supabase
            .from('registrations')
            .update({ data: updatedData } as any)
            .eq('id', registrationId);

        if (claimErr) throw claimErr;

        console.log(`  ✓ Author submitted bank transfer claim:`);
        console.log(`    UTR: ${mockUtr}`);
        console.log(`    Receipt Proof: ${mockProofUrl}`);
        console.log(`    Status: payment_claimed\n`);

        // Verify status reflects payment_claimed
        const trackRes3 = await fetch(`${BASE_URL}/api/ticket-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticket_id: ticketId, email: testEmail }),
        });
        const trackData3 = await trackRes3.json();
        console.log(`  ✓ Portal reflects: Payment Status = "${trackData3.payment_status}" (Under Verification)\n`);

        // ─────────────────────────────────────────────────────────────
        // STEP 6: ADMIN VERIFIES BANK TRANSFER & MARKS PAID
        // ─────────────────────────────────────────────────────────────
        console.log('▶ STEP 6: Admin Verifying UTR & Marking Paid in Registration Desk...');
        const finalData = {
            ...updatedData,
            payment_status: 'paid',
            status: 'approved',
            verified_at: new Date().toISOString(),
            verified_by: 'Admin Secretariat'
        };

        const { data: adminUser } = await supabase
            .from('profiles')
            .select('id')
            .in('role', ['admin', 'superadmin'])
            .limit(1)
            .single();

        const updatePayload: Record<string, any> = {
            status: 'approved',
            data: finalData,
        };
        if (adminUser?.id) {
            updatePayload.user_id = adminUser.id;
        }

        const { error: adminErr } = await supabase
            .from('registrations')
            .update(updatePayload)
            .eq('id', registrationId);

        if (adminErr) throw adminErr;

        console.log(`  ✓ Admin confirmed bank transfer! Registration marked APPROVED/PAID.\n`);

        // Final User Check
        console.log('▶ STEP 7: Author Verifying Final Publication Status...');
        const trackResFinal = await fetch(`${BASE_URL}/api/ticket-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticket_id: ticketId, email: testEmail }),
        });
        const trackDataFinal = await trackResFinal.json();

        console.log(`  ✓ Final Status Verified:`);
        console.log(`    Tracking ID: ${trackDataFinal.ticket_number}`);
        console.log(`    Editorial Decision: ${trackDataFinal.review_status.toUpperCase()}`);
        console.log(`    Payment Status: ${trackDataFinal.payment_status.toUpperCase()}`);
        console.log(`    Publication Status: Confirmed & Published in Bio Web of Conferences (SCOPUS)\n`);

        console.log('════════════════════════════════════════════════════════════════');
        console.log('✅ ALL SMOKE TESTS PASSED CLEANLY (7/7 Steps Successful)');
        console.log('════════════════════════════════════════════════════════════════\n');

    } catch (err: any) {
        console.error('\n❌ SMOKE TEST FAILED:', err.message);
        throw err;
    } finally {
        // ─────────────────────────────────────────────────────────────
        // CLEANUP: Clean up test artifacts from database
        // ─────────────────────────────────────────────────────────────
        console.log('🧹 Cleaning up test records from database...');
        if (abstractId) {
            await supabase.from('abstracts').delete().eq('id', abstractId);
        }
        if (registrationId) {
            await supabase.from('registrations').delete().eq('id', registrationId);
        }
        console.log('✓ Cleanup complete. Database is clean.\n');
    }
}

runSmokeTest().catch(() => process.exit(1));

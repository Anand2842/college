const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

// Load environment variables
let env = {};
try {
    const envContent = fs.readFileSync('.env.local', 'utf-8');
    envContent.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts[0] && parts.length > 1) {
            env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        }
    });
} catch(e) {}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || 'https://jnvqjfnqlyrsklytfgqw.supabase.co';
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const resendApiKey = env.RESEND_API_KEY;

if (!resendApiKey) {
    console.error('❌ RESEND_API_KEY is not configured.');
    process.exit(1);
}

const resend = new Resend(resendApiKey);
const FROM_EMAIL = 'ORP-5 Conference <info@orp5ic.com>';
const SITE_URL = 'https://www.orp5ic.com';

// Read the official bank PDF attachment for foreign delegates
const pdfPath = path.join(process.cwd(), 'public/documents/ORP5_International_Bank_Transfer_Details.pdf');
let pdfAttachment = null;
if (fs.existsSync(pdfPath)) {
    const pdfBuffer = fs.readFileSync(pdfPath);
    pdfAttachment = {
        filename: 'ORP5_International_Bank_Wire_Transfer_Details.pdf',
        content: pdfBuffer
    };
    console.log(`📄 Loaded attachment: ${pdfAttachment.filename} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
} else {
    console.warn(`⚠️ Warning: PDF not found at ${pdfPath}`);
}

/**
 * Mobile-responsive Email Template for Indian Registrants (INR)
 */
function getIndianReminderHtml(reg) {
    const payUrl = `${SITE_URL}/registration/pay?id=${encodeURIComponent(reg.ticketNumber)}`;
    const feeFormatted = `₹${(reg.feeAmount || 0).toLocaleString('en-IN')}`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>ORP-5 Registration Payment Reminder</title>
    <style>
        body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #F4F6F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        table { border-collapse: collapse; }
        img { border: 0; outline: none; text-decoration: none; }
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; padding: 12px !important; }
            .content-box { padding: 20px 16px !important; }
            .btn-cta { width: 100% !important; display: block !important; box-sizing: border-box !important; text-align: center !important; }
            .responsive-col { width: 100% !important; display: block !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #F4F6F4;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center">
                <table role="presentation" class="email-container" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E2E8E2;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #0C513A; padding: 28px 24px; text-align: center;">
                            <div style="font-size: 11px; font-weight: 800; color: #DFC074; text-transform: uppercase; letter-spacing: 2.5px; margin-bottom: 4px;">5th International Conference</div>
                            <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px;">ORP-5 NEW DELHI</h1>
                            <p style="margin: 6px 0 0; font-size: 12px; color: #CDE3D8; line-height: 1.4;">21 – 25 September 2026 • NASC Complex, Pusa, New Delhi</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td class="content-box" style="padding: 32px 28px; background-color: #ffffff;">
                            
                            <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.5; color: #1F2937;">
                                Dear <strong>${reg.name}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #4B5563;">
                                This is a friendly reminder to complete the registration fee payment for the <strong>5th International Conference on Organic and Natural Rice Production Systems (ORP-5)</strong> to confirm your delegate attendance.
                            </p>

                            <!-- Ticket Card -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #F8FAF8; border: 2px dashed #0C513A; border-radius: 12px;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <span style="font-size: 11px; font-weight: 800; color: #0C513A; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 6px;">Your Registration / Ticket ID</span>
                                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: 900; color: #0C513A; letter-spacing: 2px; display: block;">${reg.ticketNumber}</span>
                                        <span style="font-size: 11px; color: #6B7280; display: block; margin-top: 6px;">Category: <strong>${reg.category}</strong> (${reg.mode === 'virtual' ? 'Virtual Attendance' : 'In-Person'})</span>
                                    </td>
                                </tr>
                            </table>

                            <!-- Summary Table -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #FFFDF7; border: 1px solid #EAE4D2; border-radius: 10px;">
                                <tr>
                                    <td style="padding: 14px 18px; font-size: 13px; color: #6B7280; border-bottom: 1px solid #F0EAD8;">Registration Fee:</td>
                                    <td align="right" style="padding: 14px 18px; font-size: 13px; color: #1F2937; font-weight: 600; border-bottom: 1px solid #F0EAD8;">${feeFormatted}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 14px 18px; font-size: 14px; font-weight: 700; color: #0C513A;">Total Amount Due:</td>
                                    <td align="right" style="padding: 14px 18px; font-size: 20px; font-weight: 900; color: #0C513A;">${feeFormatted}</td>
                                </tr>
                            </table>

                            <!-- Payment Instructions -->
                            <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 0.8px;">Quick Payment Steps:</h3>
                            <ol style="margin: 0 0 28px; padding-left: 20px; font-size: 13px; line-height: 1.7; color: #374151;">
                                <li style="margin-bottom: 6px;">Click the <strong>Complete Payment & Submit Proof</strong> button below.</li>
                                <li style="margin-bottom: 6px;">Pay via <strong>SBI Collect</strong> (UPI / QR Code, Net Banking, or Debit/Credit Card).</li>
                                <li style="margin-bottom: 6px;">Enter your Ticket ID <strong>${reg.ticketNumber}</strong> in the reference field.</li>
                                <li style="margin-bottom: 6px;">Upload your payment transaction receipt / UTR for instant verification.</li>
                            </ol>

                            <!-- CTA Button -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 28px;">
                                <tr>
                                    <td align="center">
                                        <a href="${payUrl}" class="btn-cta" style="background-color: #0C513A; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 800; padding: 16px 36px; border-radius: 10px; display: inline-block; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(12,81,58,0.25);">Complete Payment & Submit Proof →</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #6B7280; text-align: center;">
                                Once verified, your official delegate conference pass and barcode ID card will be activated immediately.
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F8FAF8; padding: 20px 24px; border-top: 1px solid #E5E7EB; text-align: center;">
                            <p style="margin: 0 0 6px; font-size: 12px; font-weight: 700; color: #374151;">ORP-5 Conference Secretariat</p>
                            <p style="margin: 0; font-size: 11px; color: #6B7280;">Organized by AIASA, UAS Raichur &amp; IPB University</p>
                            <p style="margin: 8px 0 0; font-size: 11px; color: #9CA3AF;">Need assistance? Contact <a href="mailto:info@orp5ic.com" style="color: #0C513A; text-decoration: underline;">info@orp5ic.com</a> • <a href="${SITE_URL}" style="color: #0C513A; text-decoration: underline;">www.orp5ic.com</a></p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

/**
 * Mobile-responsive Email Template for Foreign Delegates (USD + Bank Details + Attached PDF)
 */
function getForeignReminderHtml(reg) {
    const payUrl = `${SITE_URL}/registration/pay?id=${encodeURIComponent(reg.ticketNumber)}`;
    const feeFormatted = `US$ ${reg.feeAmount || 0}`;
    const pdfDirectUrl = `${SITE_URL}/documents/ORP5_International_Bank_Transfer_Details.pdf`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>ORP-5 International Delegate Payment & Bank Wire Transfer Details</title>
    <style>
        body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #F4F6F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        table { border-collapse: collapse; }
        img { border: 0; outline: none; text-decoration: none; }
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; padding: 12px !important; }
            .content-box { padding: 20px 16px !important; }
            .btn-cta { width: 100% !important; display: block !important; box-sizing: border-box !important; text-align: center !important; }
            .bank-table td { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: left !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #F4F6F4;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center">
                <table role="presentation" class="email-container" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E2E8E2;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #0C513A; padding: 28px 24px; text-align: center;">
                            <div style="font-size: 11px; font-weight: 800; color: #DFC074; text-transform: uppercase; letter-spacing: 2.5px; margin-bottom: 4px;">International Delegate Portal</div>
                            <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px;">ORP-5 CONFERENCE</h1>
                            <p style="margin: 6px 0 0; font-size: 12px; color: #CDE3D8; line-height: 1.4;">21 – 25 September 2026 • NASC Complex, New Delhi, India</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td class="content-box" style="padding: 32px 28px; background-color: #ffffff;">
                            
                            <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.5; color: #1F2937;">
                                Dear <strong>${reg.name}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #4B5563;">
                                Greetings from the Secretariat of the <strong>5th International Conference on Organic &amp; Natural Rice Production Systems (ORP-5)</strong>.
                            </p>

                            <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #4B5563;">
                                Please find below the official bank account details and international wire transfer instructions (SWIFT) to finalize your registration fee.
                            </p>

                            <!-- Ticket Card -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background-color: #F8FAF8; border: 2px dashed #0C513A; border-radius: 12px;">
                                <tr>
                                    <td style="padding: 18px; text-align: center;">
                                        <span style="font-size: 11px; font-weight: 800; color: #0C513A; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 4px;">International Ticket ID</span>
                                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: 900; color: #0C513A; letter-spacing: 2px; display: block;">${reg.ticketNumber}</span>
                                        <span style="font-size: 12px; color: #4B5563; display: block; margin-top: 6px;">
                                            Category: <strong>${reg.category}</strong> (${reg.mode === 'virtual' ? 'Virtual Live Stream' : 'Physical In-Person'})
                                        </span>
                                        <span style="font-size: 14px; font-weight: 800; color: #B45309; display: block; margin-top: 4px;">
                                            Amount Due: ${feeFormatted}
                                        </span>
                                    </td>
                                </tr>
                            </table>

                            <!-- Official Bank Details Card -->
                            <div style="background-color: #F9FAF9; border: 1.5px solid #0C513A; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                                <div style="background-color: #0C513A; color: #ffffff; padding: 12px 18px; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                                    🏦 Official Wire Transfer / Bank Details (SWIFT)
                                </div>
                                <table role="presentation" class="bank-table" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; line-height: 1.5;">
                                    <tr>
                                        <td style="padding: 10px 16px; color: #6B7280; font-weight: 600; width: 40%; border-bottom: 1px solid #E5E7EB;">Beneficiary Name:</td>
                                        <td style="padding: 10px 16px; color: #111827; font-weight: 800; border-bottom: 1px solid #E5E7EB;">All India Agricultural Students Association</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 16px; color: #6B7280; font-weight: 600; border-bottom: 1px solid #E5E7EB;">Account Number:</td>
                                        <td style="padding: 10px 16px; color: #0C513A; font-weight: 900; font-family: monospace; font-size: 15px; border-bottom: 1px solid #E5E7EB;">44767771724</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 16px; color: #6B7280; font-weight: 600; border-bottom: 1px solid #E5E7EB;">Bank Name:</td>
                                        <td style="padding: 10px 16px; color: #111827; font-weight: 700; border-bottom: 1px solid #E5E7EB;">State Bank of India</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 16px; color: #6B7280; font-weight: 600; border-bottom: 1px solid #E5E7EB;">SWIFT Code:</td>
                                        <td style="padding: 10px 16px; color: #0C513A; font-weight: 900; font-family: monospace; font-size: 15px; border-bottom: 1px solid #E5E7EB;">SBININBB550</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 16px; color: #6B7280; font-weight: 600; border-bottom: 1px solid #E5E7EB;">IFSC Code:</td>
                                        <td style="padding: 10px 16px; color: #111827; font-weight: 700; font-family: monospace; border-bottom: 1px solid #E5E7EB;">SBIN0005389</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 16px; color: #6B7280; font-weight: 600;">Branch / Address:</td>
                                        <td style="padding: 10px 16px; color: #374151;">NSC BEEJ BHAWAN, PUSA Complex, New Delhi - 110012, India</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Wire Instructions Box -->
                            <div style="background-color: #FFFBEB; border: 1px solid #FCD34D; border-radius: 10px; padding: 16px 18px; margin-bottom: 26px;">
                                <h4 style="margin: 0 0 8px; font-size: 13px; font-weight: 800; color: #92400E; text-transform: uppercase;">📌 Important Wire Transfer Notes:</h4>
                                <ul style="margin: 0; padding-left: 18px; font-size: 12.5px; line-height: 1.6; color: #78350F;">
                                    <li>Please mention your <strong>Ticket ID (${reg.ticketNumber})</strong> and Full Name in the wire transfer description/remarks.</li>
                                    <li>Ensure intermediary/wire transfer charges are covered (OUR/sender pays).</li>
                                    <li>The official signed bank authorization document is <strong>attached to this email as a PDF</strong>.</li>
                                </ul>
                            </div>

                            <!-- CTA Button -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
                                <tr>
                                    <td align="center">
                                        <a href="${payUrl}" class="btn-cta" style="background-color: #0C513A; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 800; padding: 16px 36px; border-radius: 10px; display: inline-block; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(12,81,58,0.25);">Upload Wire Transfer Receipt →</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="text-align: center; font-size: 12px; color: #6B7280; margin: 0 0 8px;">
                                Alternatively, you can reply directly to this email with your wire transfer receipt attached.
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F8FAF8; padding: 20px 24px; border-top: 1px solid #E5E7EB; text-align: center;">
                            <p style="margin: 0 0 6px; font-size: 12px; font-weight: 700; color: #374151;">ORP-5 International Secretariat</p>
                            <p style="margin: 0; font-size: 11px; color: #6B7280;">Dr. Sahadeva Singh, Conference Chair • Chief Policy Advisor, AIASA</p>
                            <p style="margin: 8px 0 0; font-size: 11px; color: #9CA3AF;">Email: <a href="mailto:info@orp5ic.com" style="color: #0C513A; text-decoration: underline;">info@orp5ic.com</a> • <a href="${SITE_URL}" style="color: #0C513A; text-decoration: underline;">www.orp5ic.com</a></p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

async function sendReminders() {
    console.log('🔍 Fetching pending registrations from Supabase...');

    const res = await fetch(`${supabaseUrl}/rest/v1/registrations?select=*&order=created_at.desc`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });

    if (!res.ok) {
        console.error('Failed to query registrations:', res.status, await res.text());
        return;
    }

    const rows = await res.json();

    // Filter strictly active pending / awaiting_payment
    const pendingList = rows.filter(r => {
        const d = r.data || {};
        const status = d.payment_status || r.status;
        return status === 'pending' || status === 'awaiting_payment';
    }).map(r => {
        const d = r.data || {};
        return {
            id: r.id,
            ticketNumber: d.ticket_number || d.ticket_id || d.ticketId || r.id,
            name: d.full_name || d.fullName || 'Registered Delegate',
            email: (d.email || '').trim().toLowerCase(),
            category: d.category || 'Delegate',
            mode: d.mode || 'physical',
            nationality: d.nationality || (d.currency === 'USD' ? 'foreign' : 'indian'),
            currency: d.currency || (d.nationality === 'foreign' ? 'USD' : 'INR'),
            feeAmount: d.fee_amount || d.feeAmount || 0,
            rawData: d
        };
    });

    console.log(`\n📋 Found ${pendingList.length} active pending registrants.`);
    const indianList = pendingList.filter(p => p.currency === 'INR' && p.nationality !== 'foreign');
    const foreignList = pendingList.filter(p => p.currency === 'USD' || p.nationality === 'foreign');

    console.log(`🇮🇳 Indian Delegates (SBI Collect): ${indianList.length}`);
    console.log(`🌍 Foreign Delegates (SWIFT + PDF Attached): ${foreignList.length}`);

    let sentCount = 0;
    let failedCount = 0;

    // 1. Process Foreign Delegates First (with Attachment)
    console.log('\n======================================================');
    console.log('🚀 Sending International Reminders (SWIFT Wire Details + PDF Attachment)');
    console.log('======================================================');

    for (const [idx, reg] of foreignList.entries()) {
        console.log(`[${idx + 1}/${foreignList.length}] Sending to ${reg.name} <${reg.email}> (${reg.ticketNumber})...`);
        const html = getForeignReminderHtml(reg);

        try {
            const sendPayload = {
                from: FROM_EMAIL,
                to: reg.email,
                subject: `Payment & Wire Transfer Details: ORP-5 Conference (Ticket ID: ${reg.ticketNumber})`,
                html,
                ...(pdfAttachment ? { attachments: [pdfAttachment] } : {})
            };

            const sendRes = await resend.emails.send(sendPayload);

            if (sendRes.error) {
                console.error(`  ❌ Resend error for ${reg.email}:`, sendRes.error);
                failedCount++;
            } else {
                console.log(`  ✅ Delivered successfully! (ID: ${sendRes.data?.id})`);
                sentCount++;

                // Record audit timestamp in Supabase
                const updatedData = {
                    ...reg.rawData,
                    payment_reminder_sent_at: new Date().toISOString(),
                    payment_reminder_resend_id: sendRes.data?.id,
                    payment_reminder_type: 'foreign_swift'
                };

                await fetch(`${supabaseUrl}/rest/v1/registrations?id=eq.${reg.id}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: updatedData })
                });
            }
        } catch (err) {
            console.error(`  ❌ Exception sending to ${reg.email}:`, err.message);
            failedCount++;
        }

        // 600ms rate limit gap
        await new Promise(resolve => setTimeout(resolve, 600));
    }

    // 2. Process Indian Delegates (SBI Collect)
    console.log('\n======================================================');
    console.log('🚀 Sending Domestic Reminders (SBI Collect / UPI Link)');
    console.log('======================================================');

    for (const [idx, reg] of indianList.entries()) {
        console.log(`[${idx + 1}/${indianList.length}] Sending to ${reg.name} <${reg.email}> (${reg.ticketNumber})...`);
        const html = getIndianReminderHtml(reg);

        try {
            const sendPayload = {
                from: FROM_EMAIL,
                to: reg.email,
                subject: `Reminder: Complete Your ORP-5 Registration (Ticket ID: ${reg.ticketNumber})`,
                html
            };

            const sendRes = await resend.emails.send(sendPayload);

            if (sendRes.error) {
                console.error(`  ❌ Resend error for ${reg.email}:`, sendRes.error);
                failedCount++;
            } else {
                console.log(`  ✅ Delivered successfully! (ID: ${sendRes.data?.id})`);
                sentCount++;

                // Record audit timestamp in Supabase
                const updatedData = {
                    ...reg.rawData,
                    payment_reminder_sent_at: new Date().toISOString(),
                    payment_reminder_resend_id: sendRes.data?.id,
                    payment_reminder_type: 'indian_sbicollect'
                };

                await fetch(`${supabaseUrl}/rest/v1/registrations?id=eq.${reg.id}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: updatedData })
                });
            }
        } catch (err) {
            console.error(`  ❌ Exception sending to ${reg.email}:`, err.message);
            failedCount++;
        }

        // 600ms rate limit gap
        await new Promise(resolve => setTimeout(resolve, 600));
    }

    console.log('\n======================================================');
    console.log(`🏁 BATCH COMPLETE: ${sentCount} Delivered, ${failedCount} Failed.`);
    console.log('======================================================');
}

sendReminders();

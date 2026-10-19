import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = 'ORP-5 Conference <info@orp5ic.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.orp5ic.com';

/**
 * Universal Resend Dispatcher with explicit error checking and logging
 */
async function sendEmailViaResend(options: {
    from?: string;
    to: string | string[];
    subject: string;
    html: string;
    attachments?: Array<{
        filename: string;
        content?: Buffer | string;
        path?: string;
    }>;
}): Promise<{ success: boolean; data?: any; error?: any }> {
    const toAddress = Array.isArray(options.to) ? options.to.join(', ') : options.to;

    if (!resend) {
        console.log(`[Dev Email] No RESEND_API_KEY configured. Mock send to: ${toAddress} | Subject: ${options.subject}`);
        return { success: true, data: { mock: true } };
    }

    try {
        const result = await resend.emails.send({
            from: options.from || FROM_EMAIL,
            to: options.to,
            subject: options.subject,
            html: options.html,
            ...(options.attachments ? { attachments: options.attachments } : {}),
        });

        if (result.error) {
            console.error(`[Resend Error] Failed to send email to ${toAddress}:`, result.error);
            return { success: false, error: result.error };
        }

        console.log(`[Resend Success] Email successfully delivered to ${toAddress} (ID: ${result.data?.id})`);
        return { success: true, data: result.data };
    } catch (err: any) {
        console.error(`[Resend Exception] Unexpected error sending email to ${toAddress}:`, err);
        return { success: false, error: err?.message || err };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Newsletter Confirmation Email
// ─────────────────────────────────────────────────────────────────────────────
export async function sendConfirmationEmail(email: string, token: string) {
    const confirmUrl = `${SITE_URL}/api/newsletter/verify?token=${token}`;

    const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background: #123125; color: white; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">ORP-5 CONFERENCE</h1>
            <p style="margin: 4px 0 0; font-size: 12px; color: #a3d9b1; text-transform: uppercase;">Newsletter Subscription</p>
        </div>
        <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="font-size: 18px; color: #123125; margin-top: 0;">Confirm your subscription to ORP-5 Updates</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">You requested to receive official updates for the 5ᵗʰ International Conference on Organic and Natural Rice Production Systems (21–25 September 2026, New Delhi).</p>
            <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">Please click the button below to confirm your email address:</p>
            <div style="text-align: center; margin: 28px 0;">
                <a href="${confirmUrl}" style="display: inline-block; background-color: #123125; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">Confirm Subscription →</a>
            </div>
            <p style="margin-top: 24px; font-size: 12px; color: #9ca3af; text-align: center;">If you did not request this, you can safely ignore this email.</p>
        </div>
    </div>
    `;

    return sendEmailViaResend({
        to: email,
        subject: 'Confirm your subscription | ORP-5',
        html,
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Newsletter Broadcast
// ─────────────────────────────────────────────────────────────────────────────
export async function sendNewsletterBroadcast(recipients: string[], subject: string, contentHtml: string) {
    if (recipients.length === 0) return 0;

    let sentCount = 0;
    const BATCH_SIZE = 25;

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
        const batch = recipients.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (email) => {
            const html = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #123125; margin: 0;">ORP-5</h1>
                    <p style="font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Official Conference Update</p>
                </div>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <div style="padding: 20px 0;">
                    ${contentHtml}
                </div>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <div style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
                    <p>You are receiving this because you subscribed to updates for ORP-5.</p>
                    <p><a href="${SITE_URL}/privacy" style="color: #666;">Conference Information & Privacy</a></p>
                </div>
            </div>
            `;

            const res = await sendEmailViaResend({ to: email, subject, html });
            if (res.success) sentCount++;
        }));

        if (i + BATCH_SIZE < recipients.length) await new Promise(r => setTimeout(r, 600));
    }

    return sentCount;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Abstract Submission Status Update
// ─────────────────────────────────────────────────────────────────────────────
export async function sendSubmissionStatusEmail(
    email: string,
    name: string,
    title: string,
    status: 'accepted' | 'rejected' | 'revision',
    notes?: string
) {
    const subject = status === 'accepted'
        ? `🎉 Abstract Accepted: ${title} | ORP-5`
        : status === 'revision'
            ? `Action Required: Revision Requested for "${title}" | ORP-5`
            : `Update regarding your submission "${title}" | ORP-5`;

    const statusColor = status === 'accepted' ? '#166534' : status === 'revision' ? '#ca8a04' : '#991b1b';
    const statusText = status === 'accepted' ? 'Accepted' : status === 'revision' ? 'Revision Requested' : 'Not Accepted';

    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #f9f9f7; padding: 20px; border-radius: 8px;">
        <div style="background: #123125; color: white; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">ORP-5 CONFERENCE</h1>
            <p style="margin: 4px 0 0; font-size: 12px; color: #a3d9b1; text-transform: uppercase; letter-spacing: 2px;">Submission Status Update</p>
        </div>
        
        <div style="background: white; padding: 32px; border: 1px solid #e8e8e4; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #555; margin: 0 0 20px;">Dear <strong>${name}</strong>,</p>
            <p style="color: #555; margin: 0 0 24px;">The status of your abstract submission for <strong>ORP-5</strong> has been updated.</p>
            
            <div style="background: #f9f9f7; padding: 15px; margin: 20px 0 28px; border-left: 4px solid ${statusColor}; border-radius: 0 4px 4px 0;">
                <p style="margin: 0 0 8px;"><strong>Title:</strong> ${title}</p>
                <p style="margin: 0 0 8px;"><strong>New Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
                ${notes ? `<p style="margin: 0; font-size: 13px; color: #555;"><strong>Reviewer / Admin Notes:</strong><br/>${notes}</p>` : ''}
            </div>

            ${status === 'accepted' ? `
                <p style="color: #166534; font-weight: bold;">🎉 Congratulations!</p>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">We are excited to have you present at the conference. Further details regarding the presentation schedule and guidelines will be shared shortly.</p>
            ` : status === 'revision' ? `
                <p style="color: #ca8a04; font-weight: bold;">✏️ Action Required</p>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">Please review the reviewer comments and submit your revised abstract.</p>
                <div style="text-align: center; margin: 24px 0;">
                    <a href="${SITE_URL}/ticket-status" style="background: #1a5c26; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Check Submission Status →</a>
                </div>
            ` : `
                <p style="color: #555; font-size: 14px; line-height: 1.6;">Thank you for your interest in ORP-5. Due to the high volume of submissions, we are unable to accept your abstract at this time.</p>
            `}
        </div>
        <p style="text-align: center; font-size: 11px; color: #999; margin: 16px 0 0;">ORP-5 International Conference &nbsp;|&nbsp; <a href="mailto:info@orp5ic.com" style="color: #999;">info@orp5ic.com</a></p>
    </div>
    `;

    return sendEmailViaResend({ to: email, subject, html });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Registration Pending Payment Notification
// ─────────────────────────────────────────────────────────────────────────────
export async function sendRegistrationPendingEmail(
    email: string,
    name: string,
    ticketId: string,
    feeAmount: number,
    currency: string,
    category: string,
    mode: string
) {
    const payUrl = `${SITE_URL}/registration/pay?id=${ticketId}`;
    const ticketStatusUrl = `${SITE_URL}/ticket-status`;
    const currencySymbol = currency === 'USD' ? '$' : '₹';
    const formattedFee = `${currencySymbol}${feeAmount.toLocaleString()}`;
    const safeName = name || 'Participant';
    const safeCategory = category || 'Delegate';
    const safeMode = mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : 'Physical';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Complete Your ORP-5 Registration</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f3ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f4f3ed">
        <tr>
            <td align="center" style="padding: 24px 12px 40px 12px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e3d8; border-radius: 16px; overflow: hidden;">
                    <tr>
                        <td bgcolor="#123125" style="background-color: #123125; padding: 28px 24px 24px 24px; text-align: center;">
                            <span style="font-size: 11px; font-weight: 800; color: #DFC074; text-transform: uppercase; letter-spacing: 3px; display: block; margin-bottom: 6px;">5ᵗʰ INTERNATIONAL CONFERENCE</span>
                            <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 1px;">ORP-5 NEW DELHI</h1>
                            <p style="margin: 6px 0 0 0; font-size: 12px; color: #a3d9b1;">21–25 September 2026 &nbsp;|&nbsp; PHD Chamber of Commerce & Industry, New Delhi</p>
                        </td>
                    </tr>
                    <tr><td height="4" bgcolor="#DFC074" style="background-color: #DFC074; line-height: 4px; font-size: 4px;">&nbsp;</td></tr>
                    <tr>
                        <td style="padding: 32px 36px 24px 36px;">
                            <p style="margin: 0 0 16px 0; font-size: 16px; color: #2b2b2b;">Dear <strong>${safeName}</strong>,</p>
                            <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #4a4a4a;">Your registration details for <strong>ORP-5</strong> have been recorded. Please complete your registration fee payment to confirm your delegate pass.</p>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 24px 0;">
                                <tr>
                                    <td bgcolor="#f0fdf4" style="background-color: #f0fdf4; border: 2px dashed #86efac; border-radius: 12px; padding: 20px; text-align: center;">
                                        <span style="font-size: 11px; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 6px;">Your Registration Ticket ID</span>
                                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 26px; font-weight: bold; color: #123125; letter-spacing: 2px; display: block; margin: 4px 0;">${ticketId}</span>
                                        <span style="font-size: 11px; color: #15803d; display: block; margin-top: 4px;">Use this Ticket ID for fee submission & verification</span>
                                    </td>
                                </tr>
                            </table>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fbfaf4" style="background-color: #fbfaf4; border: 1px solid #e9e6d7; border-radius: 10px; margin: 0 0 28px 0;">
                                <tr>
                                    <td style="padding: 16px 20px; font-size: 13px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr><td style="padding: 6px 0; color: #6b7280;">Participant:</td><td style="padding: 6px 0; color: #111827; font-weight: bold; text-align: right;">${safeName}</td></tr>
                                            <tr><td style="padding: 6px 0; color: #6b7280;">Category:</td><td style="padding: 6px 0; color: #111827; font-weight: bold; text-align: right;">${safeCategory}</td></tr>
                                            <tr><td style="padding: 6px 0; color: #6b7280;">Mode:</td><td style="padding: 6px 0; color: #111827; font-weight: bold; text-align: right;">${safeMode}</td></tr>
                                            <tr><td colspan="2" height="1" bgcolor="#e5e7eb" style="line-height: 1px; font-size: 1px;">&nbsp;</td></tr>
                                            <tr><td style="padding: 10px 0 4px 0; color: #123125; font-weight: bold; font-size: 14px;">Total Fee Due:</td><td style="padding: 10px 0 4px 0; color: #123125; font-weight: 800; font-size: 22px; text-align: right;">${formattedFee}</td></tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <div style="text-align: center; margin: 0 0 28px 0;">
                                <a href="${payUrl}" target="_blank" style="background-color: #123125; color: #ffffff !important; display: inline-block; font-weight: bold; font-size: 15px; text-align: center; text-decoration: none; padding: 16px 36px; border-radius: 8px;">
                                    Complete Registration & Payment &rarr;
                                </a>
                            </div>

                            <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center;">
                                Real-time status: <a href="${ticketStatusUrl}" style="color: #123125; font-weight: bold; text-decoration: underline;">Ticket Status Portal</a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" bgcolor="#f9fafb" style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px; font-size: 12px; color: #6b7280;">
                            <strong>ORP-5 Organizing Secretariat</strong> &nbsp;|&nbsp; <a href="mailto:info@orp5ic.com" style="color: #123125; text-decoration: none;">info@orp5ic.com</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    return sendEmailViaResend({
        to: email,
        subject: `Complete your ORP-5 Registration: ${ticketId}`,
        html,
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Registration Initial Acknowledgement Email (How to Pay via Direct Bank Transfer)
// ─────────────────────────────────────────────────────────────────────────────
export async function sendRegistrationAcknowledgementEmail(
    email: string,
    name: string,
    ticketId: string,
    feeAmount: number,
    currency: string,
    category: string,
    mode: string
) {
    const payUrl = `${SITE_URL}/registration/pay?id=${ticketId}`;
    const currencySymbol = currency === 'USD' ? '$' : '₹';
    const formattedFee = `${currencySymbol}${feeAmount.toLocaleString()}`;

    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #f9f9f7; padding: 20px; border-radius: 8px;">
        <div style="background: #123125; color: white; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">ORP-5 CONFERENCE</h1>
            <p style="margin: 4px 0 0; font-size: 12px; color: #a3d9b1; text-transform: uppercase; letter-spacing: 2px;">5th International Conference on Organic and Natural Rice</p>
        </div>

        <div style="background: white; padding: 32px; border: 1px solid #e8e8e4; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #555; margin: 0 0 20px;">Dear <strong>${name}</strong>,</p>
            <p style="color: #555; margin: 0 0 24px;">Your registration has been saved! Please complete your bank transfer payment to confirm your spot at ORP-5.</p>

            <div style="background: #f0fdf4; border: 2px dashed #86efac; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 28px;">
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #166534;">Your Ticket ID</p>
                <p style="margin: 0; font-size: 28px; font-weight: bold; font-family: monospace; color: #123125; letter-spacing: 2px;">${ticketId}</p>
                <p style="margin: 8px 0 0; font-size: 12px; color: #555;">⚠️ Mention this Ticket ID in your bank transfer narration / remarks</p>
            </div>

            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px 20px; margin: 0 0 24px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr><td style="color: #666; padding: 4px 0;">Category</td><td style="text-align: right; font-weight: bold; color: #333;">${category}</td></tr>
                    <tr><td style="color: #666; padding: 4px 0;">Mode</td><td style="text-align: right; font-weight: bold; color: #333; text-transform: capitalize;">${mode}</td></tr>
                    <tr style="border-top: 1px solid #fde68a;">
                        <td style="color: #666; padding: 8px 0 4px; font-weight: bold;">Amount Due</td>
                        <td style="text-align: right; font-size: 22px; font-weight: bold; color: #123125;">${formattedFee}</td>
                    </tr>
                </table>
            </div>

            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px 20px; margin: 0 0 24px;">
                <h3 style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #1e293b; margin: 0 0 12px;">Official Bank Transfer Details:</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <tr><td style="color: #64748b; padding: 4px 0; width: 40%;">Beneficiary Name</td><td style="font-weight: bold; color: #0f172a;">All India Agricultural Students Association</td></tr>
                    <tr><td style="color: #64748b; padding: 4px 0;">Bank & Branch</td><td style="color: #0f172a;">State Bank of India (SBI), NSC Beej Bhawan, Pusa, New Delhi</td></tr>
                    <tr><td style="color: #64748b; padding: 4px 0;">Account Number</td><td style="font-family: monospace; font-size: 14px; font-weight: bold; color: #0f172a;">44767771724</td></tr>
                    <tr><td style="color: #64748b; padding: 4px 0;">IFSC Code (Domestic)</td><td style="font-family: monospace; font-weight: bold; color: #0f172a;">SBIN0005389</td></tr>
                    <tr><td style="color: #64748b; padding: 4px 0;">SWIFT Code (Foreign)</td><td style="font-family: monospace; font-weight: bold; color: #0f172a;">SBININBB550</td></tr>
                </table>
            </div>

            <h3 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #333; margin: 0 0 16px;">Next Steps:</h3>
            <ol style="color: #555; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0 0 24px 0;">
                <li>Transfer <strong>${formattedFee}</strong> via NEFT / RTGS / IMPS (or SWIFT for foreign delegates) to the bank details above.</li>
                <li>Add your Ticket ID: <strong style="font-family: monospace;">${ticketId}</strong> in the bank transfer remarks / narration.</li>
                <li>Save your debit confirmation receipt and note down the <strong>UTR / Reference Number</strong>.</li>
                <li>Click the button below to submit your UTR and upload your payment slip for verification.</li>
            </ol>

            <div style="text-align: center; margin: 28px 0 24px;">
                <a href="${payUrl}" style="background: #123125; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block;">Submit UTR & Upload Receipt →</a>
            </div>

            <div style="background: #f0fdf4; border-radius: 6px; padding: 12px 16px; font-size: 12px; color: #166534; text-align: center;">
                ✔ Direct Bank Transfer &nbsp;|&nbsp; ✔ State Bank of India &nbsp;|&nbsp; ✔ Official Verification
            </div>
        </div>

        <p style="text-align: center; font-size: 11px; color: #999; margin: 16px 0 0;">ORP-5 International Conference &nbsp;|&nbsp; <a href="mailto:info@orp5ic.com" style="color: #999;">info@orp5ic.com</a></p>
    </div>
    `;

    return sendEmailViaResend({
        to: email,
        subject: `Your ORP-5 Registration ID: ${ticketId} — Complete Payment Now`,
        html,
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Confirmed Payment & Official Ticket Email (When Payment is Confirmed)
// ─────────────────────────────────────────────────────────────────────────────
export async function sendRegistrationStatusEmail(
    email: string,
    name: string,
    ticketId: string,
    status: 'paid' | 'pending'
) {
    if (status !== 'paid') return { success: true };

    const receiptUrl = `${SITE_URL}/registration/success?id=${ticketId}`;
    const ticketUrl = `${SITE_URL}/registration/ticket?id=${ticketId}`;

    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #f9f9f7; padding: 20px; border-radius: 8px;">
        <div style="background: #123125; color: white; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">ORP-5 CONFERENCE</h1>
            <p style="margin: 4px 0 0; font-size: 12px; color: #a3d9b1; text-transform: uppercase; letter-spacing: 2px;">Official Registration Confirmed</p>
        </div>
        
        <div style="background: white; padding: 32px; border: 1px solid #e8e8e4; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #555; margin: 0 0 20px;">Dear <strong>${name}</strong>,</p>
            <p style="color: #555; margin: 0 0 24px; line-height: 1.6;">We are pleased to confirm your registration and payment for the <strong>5th International Conference on Organic and Natural Rice Production Systems (ORP-5)</strong>.</p>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 0 0 28px; border: 1px dashed #4ade80; text-align: center;">
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #166534;">Payment Confirmed ✅</p>
                <p style="margin: 0; font-size: 28px; font-weight: bold; font-family: monospace; color: #123125; letter-spacing: 2px;">${ticketId}</p>
                <p style="margin: 8px 0 0; font-size: 13px; color: #166534;">Please save this Ticket ID for your check-in and delegate kit collection at the venue.</p>
            </div>

            <div style="text-align: center; margin: 32px 0 24px;">
                <a href="${ticketUrl}" style="background: #123125; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; margin-right: 12px;">View Official Ticket Pass →</a>
                <a href="${receiptUrl}" style="background: #f3f4f6; color: #123125; border: 1px solid #d1d5db; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Download Receipt</a>
            </div>

            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 24px 0; font-size: 13px; color: #4b5563;">
                <p style="margin: 0 0 6px 0;"><strong>Event Dates:</strong> 21 – 25 September 2026</p>
                <p style="margin: 0 0 6px 0;"><strong>Venue:</strong> PHD Chamber of Commerce and Industry, PHD House, 4/2 August Kranti Marg, Hauz Khas, New Delhi 110016</p>
                <p style="margin: 0;"><strong>Organizers:</strong> AIASA, UAS Raichur &amp; IPB University</p>
            </div>

            <p style="color: #555; font-size: 14px; text-align: center; margin-bottom: 0;">We look forward to welcoming you to New Delhi!</p>
        </div>
        <p style="text-align: center; font-size: 11px; color: #999; margin: 16px 0 0;">ORP-5 International Conference &nbsp;|&nbsp; <a href="mailto:info@orp5ic.com" style="color: #999;">info@orp5ic.com</a></p>
    </div>
    `;

    return sendEmailViaResend({
        to: email,
        subject: `Official Registration Confirmed: ${ticketId} | ORP-5`,
        html,
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Payment Claim Received (Sent to Attendee after submitting proof)
// ─────────────────────────────────────────────────────────────────────────────
export async function sendPaymentClaimReceivedEmail(
    email: string,
    name: string,
    ticketId: string,
    utrNumber: string,
    amount: number,
    currency: string
) {
    const ticketStatusUrl = `${SITE_URL}/ticket-status`;
    const currencySymbol = currency === 'USD' ? '$' : '₹';

    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #f9f9f7; padding: 20px; border-radius: 8px;">
        <div style="background: #123125; color: white; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">ORP-5 CONFERENCE</h1>
            <p style="margin: 4px 0 0; font-size: 12px; color: #a3d9b1; text-transform: uppercase; letter-spacing: 2px;">Payment Proof Received</p>
        </div>

        <div style="background: white; padding: 32px; border: 1px solid #e8e8e4; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #555; margin: 0 0 20px;">Dear <strong>${name}</strong>,</p>
            <p style="color: #555; margin: 0 0 24px; line-height: 1.6;">We have received your payment claim for ORP-5. Our finance desk is verifying your transaction reference against bank records.</p>

            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 0 0 24px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr><td style="padding: 6px 0; color: #666;">Ticket ID:</td><td style="padding: 6px 0; font-weight: bold; font-family: monospace; text-align: right;">${ticketId}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;">Transaction Ref / UTR:</td><td style="padding: 6px 0; font-weight: bold; font-family: monospace; text-align: right;">${utrNumber}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;">Claimed Amount:</td><td style="padding: 6px 0; font-weight: bold; color: #123125; text-align: right;">${currencySymbol}${amount.toLocaleString()}</td></tr>
                    <tr><td style="padding: 6px 0; color: #666;">Status:</td><td style="padding: 6px 0; font-weight: bold; color: #d97706; text-align: right;">Pending Verification ⏳</td></tr>
                </table>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #555;">
                Verification typically takes <strong>24 to 48 hours</strong>. Once verified, your final confirmed pass and receipt will be issued automatically to this email address.
            </p>

            <div style="text-align: center; margin: 28px 0 20px;">
                <a href="${ticketStatusUrl}" style="background: #123125; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                    Check Live Status on Portal →
                </a>
            </div>
        </div>
        <p style="text-align: center; font-size: 11px; color: #999; margin: 16px 0 0;">ORP-5 International Conference &nbsp;|&nbsp; <a href="mailto:info@orp5ic.com" style="color: #999;">info@orp5ic.com</a></p>
    </div>
    `;

    return sendEmailViaResend({
        to: email,
        subject: `Payment Proof Received: ${ticketId} (Pending Verification) | ORP-5`,
        html,
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Claim Verification OTP (Sent when user starts payment claim)
// ─────────────────────────────────────────────────────────────────────────────
export async function sendClaimOtpEmail(email: string, otp: string, ticketId: string) {
    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px; border-radius: 12px;">
        <div style="background: #123125; color: white; padding: 20px 24px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 20px;">Payment Verification Code</h2>
            <p style="margin: 6px 0 0; opacity: 0.8; font-size: 13px;">ORP-5 Registration Desk</p>
        </div>
        <div style="background: white; border-radius: 8px; padding: 24px; margin-bottom: 16px; border: 1px solid #eee; text-align: center;">
            <p style="color: #666; font-size: 14px; margin-bottom: 16px;">Use the 6-digit verification code below to confirm your payment claim for Ticket ID <strong>${ticketId}</strong>.</p>
            <div style="background: #f0fdf4; border: 1px dashed #22c55e; border-radius: 8px; padding: 16px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #15803d; font-family: monospace;">
                ${otp}
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 16px;">This code expires in 15 minutes.</p>
        </div>
        <p style="font-size: 12px; color: #666; text-align: center;">If you did not initiate this request, you can safely disregard this email.</p>
    </div>
    `;

    return sendEmailViaResend({
        to: email,
        subject: `${otp} is your ORP-5 Payment Verification Code`,
        html,
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. Payment Claim Rejected
// ─────────────────────────────────────────────────────────────────────────────
export async function sendPaymentRejectedEmail(
    email: string,
    name: string,
    ticketId: string,
    reason?: string
) {
    const payUrl = `${SITE_URL}/registration/pay?id=${ticketId}`;

    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #f9f9f7; padding: 20px; border-radius: 8px;">
        <div style="background: #7f1d1d; color: white; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">ORP-5 CONFERENCE</h1>
            <p style="margin: 4px 0 0; font-size: 12px; color: #fca5a5; text-transform: uppercase; letter-spacing: 2px;">Payment Verification Notice</p>
        </div>
        
        <div style="background: white; padding: 32px; border: 1px solid #e8e8e4; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #555; margin: 0 0 20px;">Dear <strong>${name}</strong>,</p>
            <p style="color: #555; margin: 0 0 24px; line-height: 1.6;">We were unable to verify your recent payment claim for Ticket ID <strong>${ticketId}</strong>.</p>
            
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 0 0 24px; border: 1px dashed #ef4444;">
                <p style="margin: 0 0 8px; font-weight: bold; color: #991b1b;">Reason for Rejection:</p>
                <p style="margin: 0; color: #7f1d1d; font-size: 14px;">${reason || 'The transaction reference (UTR) or screenshot provided did not match our bank records, or the amount was incorrect.'}</p>
            </div>

            <p style="color: #555; font-size: 14px; margin-bottom: 20px; line-height: 1.6;">
                Your registration is still active, but payment remains unconfirmed. Please review your bank transfer receipt / debit confirmation and submit the correct proof, or reply to this email with your transaction receipt.
            </p>

            <div style="text-align: center; margin: 0 0 24px;">
                <a href="${payUrl}" style="background: #123125; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                    Submit Payment Proof Again →
                </a>
            </div>
        </div>
        <p style="text-align: center; font-size: 11px; color: #999; margin: 16px 0 0;">ORP-5 International Conference &nbsp;|&nbsp; <a href="mailto:info@orp5ic.com" style="color: #999;">info@orp5ic.com</a></p>
    </div>
    `;

    return sendEmailViaResend({
        to: email,
        subject: `Action Required: Payment Verification Notice - ${ticketId} | ORP-5`,
        html,
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. Reviewer / Author Comment Notification
// ─────────────────────────────────────────────────────────────────────────────
export async function sendCommentNotificationEmail(
    toEmail: string,
    toName: string,
    submissionTitle: string,
    commenterRole: string,
    message: string,
    submissionId: string
) {
    const isAuthorRecipient = commenterRole === 'moderator' || commenterRole === 'admin' || commenterRole === 'superadmin';
    const dashboardUrl = isAuthorRecipient ? `${SITE_URL}/dashboard` : `${SITE_URL}/moderator/dashboard`;
    const commenterLabel = commenterRole === 'author' ? 'the Author' : 'the Review Committee';

    const subject = isAuthorRecipient
        ? `New Review Comment on Your Submission | ORP-5`
        : `Author Reply on Submission | ORP-5`;

    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #123125; color: white; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">ORP-5 CONFERENCE</h1>
            <p style="margin: 4px 0 0; font-size: 12px; color: #a3d9b1; text-transform: uppercase; letter-spacing: 2px;">Reviewer Communication</p>
        </div>
        <div style="background: white; padding: 32px; border: 1px solid #e8e8e4; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #555; margin: 0 0 20px;">Dear <strong>${toName}</strong>,</p>
            <p style="color: #555; margin: 0 0 16px;">You have received a new message from <strong>${commenterLabel}</strong> regarding abstract submission:</p>

            <div style="background: #f9f9f7; border-left: 4px solid #123125; border-radius: 4px; padding: 16px 20px; margin: 0 0 20px;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Submission</p>
                <p style="margin: 0; font-weight: bold; color: #333;">${submissionTitle}</p>
            </div>

            <div style="background: #f0f4f8; border-radius: 8px; padding: 20px; margin: 0 0 28px;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Message</p>
                <p style="margin: 0; color: #333; line-height: 1.7; white-space: pre-wrap;">${message}</p>
            </div>

            <div style="text-align: center; margin: 0 0 24px;">
                <a href="${dashboardUrl}" style="background: #123125; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                    ${isAuthorRecipient ? 'View & Reply in Dashboard →' : 'View in Reviewer Portal →'}
                </a>
            </div>

            <p style="text-align: center; font-size: 12px; color: #999; margin: 0;">
                ORP-5 International Conference &nbsp;|&nbsp; <a href="mailto:info@orp5ic.com" style="color: #999;">info@orp5ic.com</a>
            </p>
        </div>
    </div>
    `;

    return sendEmailViaResend({ to: toEmail, subject, html });
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. Admin Notification: User submitted a payment claim
// ─────────────────────────────────────────────────────────────────────────────
export async function sendAdminPaymentClaimEmail(
    adminEmail: string,
    ticketId: string,
    name: string,
    phone: string,
    expectedAmount: number,
    paidAmount: number,
    currency: string,
    hasProof: boolean
) {
    const currencySymbol = currency === 'USD' ? '$' : '₹';
    const isMismatch = expectedAmount > 0 && paidAmount !== expectedAmount;

    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px; border-radius: 12px;">
        <div style="background: #123125; color: white; padding: 20px 24px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0;">⚠️ New Payment Claim — Action Required</h2>
            <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">ORP-5 Registration System</p>
        </div>
        <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 16px; border: 1px solid #eee;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;">Ticket ID</td><td style="padding: 8px 0; font-weight: bold; font-family: monospace;">${ticketId}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Name</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Expected</td><td style="padding: 8px 0; font-weight: bold;">${currencySymbol}${expectedAmount.toLocaleString()}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">User Claimed</td><td style="padding: 8px 0; font-weight: bold; color: ${isMismatch ? '#dc2626' : '#16a34a'}">${currencySymbol}${paidAmount.toLocaleString()}${isMismatch ? ' ⚠️ MISMATCH' : ''}</td></tr>
                <tr><td style="padding: 8px 0; color: #666; font-size: 14px;">Proof</td><td style="padding: 8px 0;">${hasProof ? '✅ Screenshot uploaded' : '❌ No screenshot'}</td></tr>
            </table>
        </div>
        <p style="font-size: 14px; color: #444;">Please verify this payment against SBI MIS records before approving.</p>
        <a href="${SITE_URL}/admin/registrations" style="display: inline-block; background: #123125; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 8px;">
            Open Admin Panel →
        </a>
    </div>
    `;

    return sendEmailViaResend({
        to: adminEmail,
        subject: `[ACTION NEEDED] Payment Claim: ${ticketId} — ${name}`,
        html,
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. Admin Notification: Urgent Alert (Claim expiring tomorrow)
// ─────────────────────────────────────────────────────────────────────────────
export async function sendAdminClaimUrgentEmail(
    adminEmail: string,
    ticketId: string,
    name: string,
    email: string,
    amount: number,
    currency: string,
    ageDays: number
) {
    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fff3cd; padding: 24px; border-radius: 12px; border: 2px solid #ffc107;">
        <h2 style="color: #856404; margin-top: 0;">🚨 URGENT: Unverified Claim Expiring Tomorrow</h2>
        <p style="color: #444;">The following payment claim is <strong>${ageDays} days old</strong> and will be auto-expired tomorrow if not verified.</p>
        <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <strong>Ticket:</strong> ${ticketId}<br>
            <strong>Name:</strong> ${name}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Amount:</strong> ${currency === 'USD' ? '$' : '₹'}${amount.toLocaleString()}<br>
            <strong>Claim Age:</strong> ${ageDays} days
        </div>
        <p style="color: #444;">Please run the SBI MIS import or manually verify this claim in the admin panel.</p>
        <a href="${SITE_URL}/admin/registrations" style="display: inline-block; background: #856404; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Verify Now →
        </a>
    </div>
    `;

    return sendEmailViaResend({
        to: adminEmail,
        subject: `🚨 URGENT: Claim expiring tomorrow — ${ticketId}`,
        html,
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. Admin Notification: Claim Auto-Expired
// ─────────────────────────────────────────────────────────────────────────────
export async function sendAdminClaimExpiryEmail(
    adminEmail: string,
    ticketId: string,
    name: string,
    email: string,
    amount: number,
    currency: string,
    ageDays: number
) {
    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fee2e2; padding: 24px; border-radius: 12px; border: 2px solid #dc2626;">
        <h2 style="color: #991b1b; margin-top: 0;">💀 Claim Auto-Expired: ${ticketId}</h2>
        <p style="color: #444;">This payment claim was <strong>${ageDays} days old</strong> without SBI verification and has been auto-marked as <strong>claim_expired</strong>.</p>
        <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <strong>Ticket:</strong> ${ticketId}<br>
            <strong>Name:</strong> ${name}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Amount:</strong> ${currency === 'USD' ? '$' : '₹'}${amount.toLocaleString()}<br>
            <strong>Expired After:</strong> ${ageDays} days
        </div>
        <p style="color: #444;"><strong>Note:</strong> You can still manually approve this registration in the admin panel if the payment is later verified.</p>
        <a href="${SITE_URL}/admin/registrations" style="display: inline-block; background: #991b1b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Review in Admin Panel →
        </a>
    </div>
    `;

    return sendEmailViaResend({
        to: adminEmail,
        subject: `💀 Claim Expired: ${ticketId} — ${name}`,
        html,
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. Full-Length Paper Manuscript Submission Received (Under Editorial Review)
// ─────────────────────────────────────────────────────────────────────────────
export async function sendFullPaperConfirmationEmail(options: {
    to: string;
    authorName: string;
    paperTitle: string;
    ticketId: string;
    articleType: string;
    theme: string;
    amount: number;
    currency: string;
}) {
    const { to, authorName, paperTitle, ticketId, articleType, theme, amount, currency } = options;
    const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '₹';

    const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; color: #222; background: #faf9f5; padding: 24px; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #0F2D21 0%, #174232 100%); color: white; padding: 32px 28px; border-radius: 10px 10px 0 0; text-align: center;">
            <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #dfc074; font-weight: bold;">Bio Web of Conferences • EDP Sciences</p>
            <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">Manuscript Received for Editorial Review</h1>
            <p style="margin: 8px 0 0; font-size: 13px; color: #d4ebd9;">ORP-5 Full-Length Paper Proceedings (SCOPUS Indexed)</p>
        </div>

        <div style="background: white; padding: 32px; border: 1px solid #e7e5dc; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 15px; margin: 0 0 16px;">Dear <strong>${authorName}</strong>,</p>
            <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                Thank you for submitting your full-length manuscript for consideration in <strong>Bio Web of Conferences</strong> (EDP Sciences, France, SCOPUS Indexed) in connection with the 5th International Conference on Organic and Natural Rice Production Systems (ORP-5).
            </p>

            <div style="background: #f0fdf4; border: 2px dashed #86efac; border-radius: 10px; padding: 20px; text-align: center; margin: 0 0 24px;">
                <p style="margin: 0 0 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: #166534;">Your Paper Tracking ID</p>
                <p style="margin: 0; font-size: 26px; font-weight: bold; font-family: monospace; color: #0F2D21; letter-spacing: 1px;">${ticketId}</p>
                <p style="margin: 6px 0 0; font-size: 12px; color: #15803d;">Status: <strong>Under Peer Review & Editorial Evaluation</strong></p>
            </div>

            <div style="background: #fdfbf7; border: 1px solid #eee8d5; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                <h4 style="margin: 0 0 12px; font-size: 13px; color: #0F2D21; text-transform: uppercase; letter-spacing: 1px;">Submission Summary</h4>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <tr>
                        <td style="padding: 6px 0; color: #666; width: 35%;">Paper Title:</td>
                        <td style="padding: 6px 0; font-weight: 600; color: #222;">${paperTitle}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #666;">Article Type:</td>
                        <td style="padding: 6px 0; font-weight: 600; color: #222;">${articleType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #666;">Conference Track:</td>
                        <td style="padding: 6px 0; color: #444;">${theme}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #666;">Publication Charge:</td>
                        <td style="padding: 6px 0; font-weight: 700; color: #0F2D21;">${currencySymbol}${amount.toLocaleString()} ${currency} (Payable ONLY if accepted)</td>
                    </tr>
                </table>
            </div>

            <h4 style="margin: 0 0 10px; font-size: 14px; color: #222;">Publication Process & Next Steps:</h4>
            <ol style="color: #555; font-size: 13px; line-height: 1.7; padding-left: 20px; margin: 0 0 24px;">
                <li><strong>Editorial & Peer Review:</strong> The distinguished international editorial board from India, Italy, and Japan is evaluating your manuscript.</li>
                <li><strong>Selection Notification:</strong> If your article is accepted for the selected 50-article proceedings volume, you will receive an official Acceptance Letter.</li>
                <li><strong>Bank Transfer Payment:</strong> Upon acceptance, you will be invited to remit the publication fee (${currencySymbol}${amount.toLocaleString()}) via Direct Bank Transfer to State Bank of India.</li>
                <li><strong>Publication:</strong> Following payment confirmation and camera-ready formatting, your article will be published open-access and indexed in SCOPUS.</li>
            </ol>

            <div style="text-align: center; margin: 0 0 24px;">
                <a href="${SITE_URL}/ticket-status" 
                   style="background-color: #0F2D21; color: white; padding: 13px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                    Track Manuscript Status Online →
                </a>
            </div>

            <p style="color: #777; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                For editorial queries, contact Managing Secretary Prof. Y.V. Singh at <a href="mailto:organizingsecretary@orp5ic.com" style="color: #0F2D21; font-weight: bold;">organizingsecretary@orp5ic.com</a>.
            </p>
        </div>

        <p style="text-align: center; font-size: 11px; color: #888; margin: 16px 0 0;">
            5th International Conference on Organic and Natural Rice Production Systems (ORP-5)<br>
            ICAR-IARI, New Delhi, India &nbsp;|&nbsp; <a href="${SITE_URL}" style="color: #666;">${SITE_URL}</a>
        </p>
    </div>
    `;

    return sendEmailViaResend({
        to,
        subject: `✓ Manuscript Received: ${ticketId} — ORP-5 Bio Web Proceedings`,
        html,
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. Full Paper Accepted Notification (Request for Bank Transfer Payment)
// ─────────────────────────────────────────────────────────────────────────────
export async function sendFullPaperAcceptedEmail(options: {
    to: string;
    authorName: string;
    paperTitle: string;
    ticketId: string;
    amount: number;
    currency: string;
}) {
    const { to, authorName, paperTitle, ticketId, amount, currency } = options;
    const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '₹';
    const payUrl = `${SITE_URL}/registration/pay?id=${ticketId}`;

    const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; color: #222; background: #faf9f5; padding: 24px; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #0F2D21 0%, #174232 100%); color: white; padding: 32px 28px; border-radius: 10px 10px 0 0; text-align: center;">
            <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #dfc074; font-weight: bold;">Acceptance & Payment Notification</p>
            <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">Congratulations! Your Manuscript is Selected</h1>
            <p style="margin: 8px 0 0; font-size: 13px; color: #d4ebd9;">Bio Web of Conferences (EDP Sciences, SCOPUS Indexed)</p>
        </div>

        <div style="background: white; padding: 32px; border: 1px solid #e7e5dc; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 15px; margin: 0 0 16px;">Dear <strong>${authorName}</strong>,</p>
            <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                We are delighted to inform you that your manuscript <strong>"${paperTitle}"</strong> (Tracking ID: <strong>${ticketId}</strong>) has been <strong>accepted for publication</strong> in the conference proceedings volume by the Editorial Committee.
            </p>

            <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
                To finalize publication in Bio Web of Conferences, please complete the contributory publication charge of <strong>${currencySymbol}${amount.toLocaleString()} ${currency}</strong> via Direct Bank Transfer:
            </p>

            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 18px 20px; margin: 0 0 24px;">
                <h3 style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #1e293b; margin: 0 0 12px;">Official Bank Transfer Details:</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <tr><td style="color: #64748b; padding: 4px 0; width: 40%;">Beneficiary Name</td><td style="font-weight: bold; color: #0f172a;">All India Agricultural Students Association</td></tr>
                    <tr><td style="color: #64748b; padding: 4px 0;">Bank & Branch</td><td style="color: #0f172a;">State Bank of India (SBI), NSC Beej Bhawan, New Delhi</td></tr>
                    <tr><td style="color: #64748b; padding: 4px 0;">Account Number</td><td style="font-family: monospace; font-size: 14px; font-weight: bold; color: #0f172a;">44767771724</td></tr>
                    <tr><td style="color: #64748b; padding: 4px 0;">IFSC Code (Domestic)</td><td style="font-family: monospace; font-weight: bold; color: #0f172a;">SBIN0005389</td></tr>
                    <tr><td style="color: #64748b; padding: 4px 0;">SWIFT Code (Foreign)</td><td style="font-family: monospace; font-weight: bold; color: #0f172a;">SBININBB550</td></tr>
                </table>
            </div>

            <div style="text-align: center; margin: 28px 0 24px;">
                <a href="${payUrl}" style="background: #0F2D21; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block;">
                    Submit UTR & Upload Bank Slip →
                </a>
            </div>

            <p style="color: #777; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                For assistance, contact the Editorial Office at <a href="mailto:info@orp5ic.com" style="color: #0F2D21; font-weight: bold;">info@orp5ic.com</a>.
            </p>
        </div>
    </div>
    `;

    return sendEmailViaResend({
        to,
        subject: `🎉 Congratulations! Paper Accepted for Publication: ${ticketId} | ORP-5 Bio Web`,
        html,
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 16. Full Paper Publication Fee Verified & Confirmed
// ─────────────────────────────────────────────────────────────────────────────
export async function sendFullPaperPaymentConfirmedEmail(options: {
    to: string;
    authorName: string;
    paperTitle: string;
    ticketId: string;
    amount: number;
    currency: string;
    utrNumber?: string;
}) {
    const { to, authorName, paperTitle, ticketId, amount, currency, utrNumber } = options;
    const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '₹';
    const statusUrl = `${SITE_URL}/ticket-status`;
    const receiptUrl = `${SITE_URL}/registration/success?id=${ticketId}`;

    const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; color: #222; background: #faf9f5; padding: 24px; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #0F2D21 0%, #174232 100%); color: white; padding: 32px 28px; border-radius: 10px 10px 0 0; text-align: center;">
            <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #dfc074; font-weight: bold;">Official Publication & Payment Confirmation</p>
            <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">Payment Confirmed for Bio Web Publication</h1>
            <p style="margin: 8px 0 0; font-size: 13px; color: #d4ebd9;">EDP Sciences, France • SCOPUS Indexed Proceedings</p>
        </div>

        <div style="background: white; padding: 32px; border: 1px solid #e7e5dc; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 15px; margin: 0 0 16px;">Dear <strong>${authorName}</strong>,</p>
            <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                We are pleased to inform you that your contributory publication fee for the full-length paper <strong>"${paperTitle}"</strong> has been successfully verified and confirmed against State Bank of India bank records.
            </p>

            <div style="background: #f0fdf4; border: 2px dashed #86efac; border-radius: 10px; padding: 22px; text-align: center; margin: 0 0 24px;">
                <p style="margin: 0 0 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: #166534;">Payment Status: Verified & Paid ✅</p>
                <p style="margin: 0; font-size: 26px; font-weight: bold; font-family: monospace; color: #0F2D21; letter-spacing: 1px;">${ticketId}</p>
                <p style="margin: 6px 0 0; font-size: 13px; color: #15803d; font-weight: 600;">Confirmed for Bio Web Proceedings Volume</p>
            </div>

            <div style="background: #fdfbf7; border: 1px solid #eee8d5; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                <h4 style="margin: 0 0 12px; font-size: 13px; color: #0F2D21; text-transform: uppercase; letter-spacing: 1px;">Transaction & Publication Details</h4>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <tr>
                        <td style="padding: 6px 0; color: #666; width: 38%;">Paper Title:</td>
                        <td style="padding: 6px 0; font-weight: 600; color: #222;">${paperTitle}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; color: #666;">Amount Verified:</td>
                        <td style="padding: 6px 0; font-weight: 700; color: #0F2D21;">${currencySymbol}${amount.toLocaleString()} ${currency}</td>
                    </tr>
                    ${utrNumber ? `
                    <tr>
                        <td style="padding: 6px 0; color: #666;">Bank Ref / UTR:</td>
                        <td style="padding: 6px 0; font-family: monospace; font-weight: 600; color: #333;">${utrNumber}</td>
                    </tr>` : ''}
                    <tr>
                        <td style="padding: 6px 0; color: #666;">Indexed Target:</td>
                        <td style="padding: 6px 0; color: #222; font-weight: 600;">Bio Web of Conferences (SCOPUS)</td>
                    </tr>
                </table>
            </div>

            <h4 style="margin: 0 0 10px; font-size: 14px; color: #222;">Next Production Steps:</h4>
            <ol style="color: #555; font-size: 13px; line-height: 1.7; padding-left: 20px; margin: 0 0 28px;">
                <li><strong>Copyediting & Formatting:</strong> The EDP Sciences editorial desk will format your manuscript into the official Bio Web camera-ready layout.</li>
                <li><strong>Galley Proofs:</strong> You will receive a PDF proof by email to verify final layout before volume publishing.</li>
                <li><strong>Open Access DOI & Indexing:</strong> Upon publication, your paper will receive a permanent CrossRef DOI and be submitted for SCOPUS indexing.</li>
            </ol>

            <div style="text-align: center; margin: 0 0 24px;">
                <a href="${statusUrl}" 
                   style="background-color: #0F2D21; color: white; padding: 13px 26px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; margin-right: 10px;">
                    Track Manuscript Live →
                </a>
                <a href="${receiptUrl}" 
                   style="background-color: #f3f4f6; color: #0F2D21; border: 1px solid #d1d5db; padding: 13px 26px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                    Official Receipt
                </a>
            </div>

            <p style="color: #777; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                For any inquiries regarding proofing or publication, reach out to <a href="mailto:organizingsecretary@orp5ic.com" style="color: #0F2D21; font-weight: bold;">organizingsecretary@orp5ic.com</a>.
            </p>
        </div>

        <p style="text-align: center; font-size: 11px; color: #888; margin: 16px 0 0;">
            5th International Conference on Organic and Natural Rice Production Systems (ORP-5)<br>
            ICAR-IARI, New Delhi, India &nbsp;|&nbsp; <a href="${SITE_URL}" style="color: #666;">${SITE_URL}</a>
        </p>
    </div>
    `;

    return sendEmailViaResend({
        to,
        subject: `🎉 Payment Confirmed: ${ticketId} — Bio Web of Conferences Publication`,
        html,
    });
}



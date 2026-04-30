
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = 'ORP-5 Conference <info@orp5ic.com>'; // Configure this in Resend dashboard

export async function sendConfirmationEmail(email: string, token: string) {
    const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/newsletter/verify?token=${token}`;

    // HTML Template for Confirmation
    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Confirm your subscription to ORP-5 Updates</h2>
        <p>You requested to receive official updates for the 5ᵗʰ International Conference on Organic and Natural Rice Production Systems.</p>
        <p>Please click the button below to confirm your email address:</p>
        <a href="${confirmUrl}" style="display: inline-block; background-color: #123125; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Confirm Subscription</a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
    </div>
    `;

    if (resend) {
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: email,
                subject: 'Confirm your subscription | ORP-5',
                html: html
            });
            console.log(`[Email] Confirmation sent to ${email}`);
        } catch (error) {
            console.error('[Email] Failed to send confirmation:', error);
            throw error;
        }
    } else {
        console.log(`[Dev Email] To: ${email} | Subject: Confirm Subscription | Link: ${confirmUrl}`);
    }
}

export async function sendNewsletterBroadcast(recipients: string[], subject: string, contentHtml: string) {
    if (recipients.length === 0) return 0;

    // Resend supports batching, but for simplicity/safety with limits, we'll loop or batch small groups.
    // For free tier/start, send individually or bcc (bcc is bad for deliverability usually).
    // Better: Send individually in parallel (careful with rate limits). 
    // Optimization: Use Resend Broadcasts/Audiences if available, but here we do transactional loop for simplicity.

    let sentCount = 0;

    if (resend) {
        // Send in batches of 50 to avoid hitting rapid rate limits immediately
        const BATCH_SIZE = 50;
        for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
            const batch = recipients.slice(i, i + BATCH_SIZE);
            await Promise.all(batch.map(async (email) => {
                try {
                    await resend.emails.send({
                        from: FROM_EMAIL,
                        to: email,
                        subject: subject,
                        html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
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
                                <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe" style="color: #666;">Unsubscribe</a></p>
                            </div>
                        </div>
                        `
                    });
                    sentCount++;
                } catch (err) {
                    console.error(`Failed to send to ${email}`, err);
                }
            }));
            // Small delay between batches
            if (i + BATCH_SIZE < recipients.length) await new Promise(r => setTimeout(r, 1000));
        }
    } else {
        console.log(`[Dev Email Broadcast] Subject: ${subject}`);
        console.log(`[Dev Email Broadcast] Recipients (${recipients.length}): ${recipients.join(', ')}`);
        sentCount = recipients.length;
    }

    return sentCount;
}

export async function sendSubmissionStatusEmail(
    email: string,
    name: string,
    title: string,
    status: 'accepted' | 'rejected' | 'revision',
    notes?: string
) {
    if (!resend) {
        console.log(`[Dev Email] To: ${email} | Subject: Submission Update: ${status} | Title: ${title}`);
        return;
    }

    const subject = status === 'accepted'
        ? `🎉 Abstract Accepted: ${title} | ORP-5`
        : status === 'revision'
            ? `Action Required: Revision Requested for "${title}" | ORP-5`
            : `Update regarding your submission "${title}" | ORP-5`;

    const statusColor = status === 'accepted' ? '#166534' : status === 'revision' ? '#ca8a04' : '#991b1b';
    const statusText = status === 'accepted' ? 'Accepted' : status === 'revision' ? 'Revision Requested' : 'Not Accepted';

    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #123125;">Submission Status Update</h2>
        <p>Dear ${name},</p>
        <p>The status of your abstract submission for <strong>ORP-5</strong> has been updated.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid ${statusColor};">
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>New Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
            ${notes ? `<p><strong>Admin Notes:</strong><br/>${notes}</p>` : ''}
        </div>

        ${status === 'accepted' ? `
            <p>Congratulations! We are excited to have you present at the conference. Further details regarding the presentation schedule and guidelines will be shared shortly.</p>
        ` : status === 'revision' ? `
            <p>Please review the comments above and resubmit your abstract with the necessary changes.</p>
        ` : `
            <p>Thank you for your interest in ORP-5. Due to the high volume of submissions, we are unable to accept your abstract at this time.</p>
        `}

        <p>Best regards,<br/>The ORP-5 Organizing Committee</p>
    </div>
    `;

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: subject,
            html: html
        });
        console.log(`[Email] Status update sent to ${email}`);
    } catch (error) {
        console.error('[Email] Failed to send status update:', error);
    }
}

export async function sendRegistrationAcknowledgementEmail(
    email: string,
    name: string,
    ticketId: string,
    feeAmount: number,
    currency: string,
    category: string,
    mode: string
) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orp5ic.com';
    const payUrl = `${siteUrl}/registration/pay?id=${ticketId}`;
    const currencySymbol = currency === 'USD' ? '$' : '₹';
    const formattedFee = `${currencySymbol}${feeAmount.toLocaleString()}`;

    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #f9f9f7; padding: 20px; border-radius: 8px;">
        
        <div style="background: #123125; color: white; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">ORP-5 CONFERENCE</h1>
            <p style="margin: 4px 0 0; font-size: 12px; color: #a3d9b1; text-transform: uppercase; letter-spacing: 2px;">5th International Conference on Organic Rice Production</p>
        </div>

        <div style="background: white; padding: 32px; border: 1px solid #e8e8e4; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #555; margin: 0 0 20px;">Dear <strong>${name}</strong>,</p>
            <p style="color: #555; margin: 0 0 24px;">Your registration has been saved! Please complete your payment to confirm your spot at ORP-5.</p>

            <!-- Ticket ID Box -->
            <div style="background: #f0fdf4; border: 2px dashed #86efac; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 28px;">
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #166534;">Your Ticket ID</p>
                <p style="margin: 0; font-size: 28px; font-weight: bold; font-family: monospace; color: #123125; letter-spacing: 2px;">${ticketId}</p>
                <p style="margin: 8px 0 0; font-size: 12px; color: #555;">⚠️ Use this EXACT ID while making payment on SBI Collect</p>
            </div>

            <!-- Fee Box -->
            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px 20px; margin: 0 0 28px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr><td style="color: #666; padding: 4px 0;">Category</td><td style="text-align: right; font-weight: bold; color: #333;">${category}</td></tr>
                    <tr><td style="color: #666; padding: 4px 0;">Mode</td><td style="text-align: right; font-weight: bold; color: #333; text-transform: capitalize;">${mode}</td></tr>
                    <tr style="border-top: 1px solid #fde68a;">
                        <td style="color: #666; padding: 8px 0 4px; font-weight: bold;">Amount Due</td>
                        <td style="text-align: right; font-size: 22px; font-weight: bold; color: #123125;">${formattedFee}</td>
                    </tr>
                </table>
            </div>

            <!-- Steps -->
            <h3 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #333; margin: 0 0 16px;">How to Pay</h3>
            <div style="space-y: 12px;">
                <div style="display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-start;">
                    <div style="background: #123125; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">1</div>
                    <p style="margin: 0; font-size: 14px; color: #555; padding-top: 2px;">Copy your Ticket ID: <strong style="font-family: monospace;">${ticketId}</strong></p>
                </div>
                <div style="display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-start;">
                    <div style="background: #123125; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">2</div>
                    <p style="margin: 0; font-size: 14px; color: #555; padding-top: 2px;">Click "Pay Now" below to go to SBI Collect</p>
                </div>
                <div style="display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-start;">
                    <div style="background: #123125; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">3</div>
                    <p style="margin: 0; font-size: 14px; color: #555; padding-top: 2px;">On SBI page: Enter Ticket ID → Mobile (same as registration) → Name → Amount <strong>${formattedFee}</strong></p>
                </div>
                <div style="display: flex; gap: 12px; align-items: flex-start;">
                    <div style="background: #123125; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">4</div>
                    <p style="margin: 0; font-size: 14px; color: #555; padding-top: 2px;">After payment, click "I have paid" on our website to notify us</p>
                </div>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin: 32px 0 24px;">
                <a href="${payUrl}" style="background: #123125; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block;">Continue to Payment →</a>
            </div>

            <!-- Trust -->
            <div style="background: #f0fdf4; border-radius: 6px; padding: 12px 16px; font-size: 12px; color: #166534; text-align: center;">
                ✔ Safe Payment via SBI &nbsp;|&nbsp; ✔ Govt. Authorized System &nbsp;|&nbsp; ✔ Receipt generated after verification
            </div>
        </div>

        <p style="text-align: center; font-size: 11px; color: #999; margin: 16px 0 0;">ORP-5 International Conference &nbsp;|&nbsp; <a href="mailto:info@orp5ic.com" style="color: #999;">info@orp5ic.com</a></p>
    </div>
    `;

    if (resend) {
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: email,
                subject: `Your ORP-5 Registration ID: ${ticketId} — Complete Payment Now`,
                html
            });
            console.log(`[Email] Acknowledgement sent to ${email}`);
        } catch (error) {
            console.error('[Email] Failed to send acknowledgement:', error);
        }
    } else {
        console.log(`[Dev Email] To: ${email} | Subject: Registration Acknowledgement | Ticket: ${ticketId} | Fee: ${formattedFee} | Pay: ${payUrl}`);
    }
}

export async function sendAdminPaymentClaimEmail(
    adminEmail: string,
    ticketId: string,
    name: string,
    mobile: string,
    amountExpected: number,
    amountPaid: number,
    currency: string,
    hasProof: boolean
) {
    const currencySymbol = currency === 'USD' ? '$' : '₹';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orp5ic.com';
    const adminUrl = `${siteUrl}/admin/registrations`;
    const isMismatch = amountExpected > 0 && amountPaid !== amountExpected;

    const statusColor = isMismatch ? '#dc2626' : '#166534';
    const statusBg = isMismatch ? '#fef2f2' : '#f0fdf4';
    const statusBorder = isMismatch ? '#fecaca' : '#bbf7d0';
    const statusLabel = isMismatch
        ? `⚠️ AMOUNT MISMATCH: User entered ${currencySymbol}${amountPaid}, expected ${currencySymbol}${amountExpected}`
        : `✅ Amount matches (${currencySymbol}${amountPaid})`;

    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #1e293b; color: white; padding: 20px 28px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-size: 18px;">💰 Payment Claimed — Action Required</h2>
            <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">ORP-5 Admin Notification</p>
        </div>
        <div style="background: white; padding: 28px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="background: ${statusBg}; border: 1px solid ${statusBorder}; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-weight: bold; color: ${statusColor}; font-size: 13px;">
                ${statusLabel}
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #666;">Ticket ID</td><td style="padding: 8px 0; font-weight: bold; font-family: monospace;">${ticketId}</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #666;">Name</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #666;">Mobile</td><td style="padding: 8px 0; font-weight: bold;">${mobile}</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #666;">Amount (User Entered)</td><td style="padding: 8px 0; font-weight: bold; font-size: 18px;">${currencySymbol}${amountPaid}</td></tr>
                <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #666;">Amount (Expected)</td><td style="padding: 8px 0; font-weight: bold;">${currencySymbol}${amountExpected}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Payment Proof</td><td style="padding: 8px 0; font-weight: bold;">${hasProof ? '📎 Uploaded (view in admin)' : 'Not uploaded'}</td></tr>
            </table>
            <div style="text-align: center; margin-top: 24px;">
                <a href="${adminUrl}" style="background: #1e293b; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">View in Admin Dashboard →</a>
            </div>
        </div>
    </div>
    `;

    if (resend) {
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: adminEmail,
                subject: `[ORP-5] Payment Claimed: ${ticketId}${isMismatch ? ' ⚠️ MISMATCH' : ''}`,
                html
            });
            console.log(`[Email] Admin payment claim notification sent for ${ticketId}`);
        } catch (error) {
            console.error('[Email] Failed to send admin notification:', error);
        }
    } else {
        console.log(`[Dev Email] Admin notification | Ticket: ${ticketId} | Amount: ${currencySymbol}${amountPaid} | Mismatch: ${isMismatch}`);
    }
}

export async function sendRegistrationStatusEmail(
    email: string,
    name: string,
    ticketId: string,
    status: 'paid' | 'pending'
) {
    // Only send email for confirmed payment
    if (status !== 'paid') return;

    if (!resend) {
        console.log(`[Dev Email] To: ${email} | Subject: Registration Confirmed | Ticket: ${ticketId}`);
        return;
    }

    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #123125;">Registration Confirmed! 🎉</h2>
        <p>Dear ${name},</p>
        <p>We are pleased to confirm your registration for the <strong>5th International Conference on Organic and Natural Rice Production Systems (ORP-5)</strong>.</p>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0; text-align: center;">
            <p style="margin: 0; color: #166534; font-weight: bold;">Payment Successful</p>
            <h3 style="margin: 10px 0; font-size: 24px;">Ticket ID: ${ticketId}</h3>
            <p style="margin: 0; font-size: 14px; color: #666;">Please save this ID for future reference.</p>
        </div>

        <p>We look forward to welcoming you to the conference!</p>

        <p>Best regards,<br/>The ORP-5 Organizing Committee</p>
    </div>
    `;

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `Registration Confirmed: ${ticketId} | ORP-5`,
            html: html
        });
        console.log(`[Email] Registration confirmation sent to ${email}`);
    } catch (error) {
        console.error('[Email] Failed to send registration confirmation:', error);
    }
}


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
                ${notes ? `<p style="margin: 0; font-size: 13px; color: #555;"><strong>Admin Notes:</strong><br/>${notes}</p>` : ''}
            </div>

            ${status === 'accepted' ? `
                <p style="color: #166534; font-weight: bold;">🎉 Congratulations!</p>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">We are excited to have you present at the conference. Further details regarding the presentation schedule and guidelines will be shared shortly.</p>
            ` : status === 'revision' ? `
                <p style="color: #ca8a04; font-weight: bold;">✏️ Action Required</p>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">Please log into your dashboard to review the detailed comments and resubmit your abstract with the necessary changes.</p>
                <div style="text-align: center; margin: 24px 0;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background: #1a5c26; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Go to Dashboard →</a>
                </div>
            ` : `
                <p style="color: #555; font-size: 14px; line-height: 1.6;">Thank you for your interest in ORP-5. Due to the high volume of submissions, we are unable to accept your abstract at this time.</p>
            `}
        </div>
        <p style="text-align: center; font-size: 11px; color: #999; margin: 16px 0 0;">ORP-5 International Conference &nbsp;|&nbsp; <a href="mailto:info@orp5ic.com" style="color: #999;">info@orp5ic.com</a></p>
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

export async function sendRegistrationPendingEmail(
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
    const ticketStatusUrl = `${siteUrl}/ticket-status`;
    const currencySymbol = currency === 'USD' ? '$' : '₹';
    const formattedFee = `${currencySymbol}${feeAmount.toLocaleString()}`;
    const safeName = name || 'Participant';
    const safeCategory = category || 'Delegate';
    const safeMode = mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : 'Physical';

    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Complete Your ORP-5 Registration</title>
    <style type="text/css">
        body { margin: 0; padding: 0; background-color: #f4f3ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2b2b2b; }
        table { border-spacing: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        td { padding: 0; }
        .container-table { width: 100% !important; max-width: 600px !important; margin: 0 auto; }
        .btn-primary { background-color: #123125; color: #ffffff !important; display: inline-block; font-weight: bold; font-size: 15px; text-align: center; text-decoration: none; padding: 16px 36px; border-radius: 8px; }
        @media only screen and (max-width: 600px) {
            .mobile-p-20 { padding: 20px !important; }
            .mobile-p-15 { padding: 15px !important; }
            .mobile-btn { display: block !important; width: 100% !important; padding: 14px 20px !important; box-sizing: border-box !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f3ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f4f3ed">
        <tr>
            <td align="center" style="padding: 24px 12px 40px 12px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="container-table" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e3d8; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <tr>
                        <td bgcolor="#123125" style="background-color: #123125; padding: 28px 24px 24px 24px; text-align: center;">
                            <span style="font-size: 11px; font-weight: 800; color: #DFC074; text-transform: uppercase; letter-spacing: 3px; display: block; margin-bottom: 6px;">5ᵗʰ INTERNATIONAL CONFERENCE</span>
                            <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 1px;">ORP-5 NEW DELHI</h1>
                            <p style="margin: 6px 0 0 0; font-size: 12px; color: #a3d9b1;">21–25 September 2026 &nbsp;|&nbsp; NASC Complex, New Delhi</p>
                        </td>
                    </tr>
                    <tr><td height="4" bgcolor="#DFC074" style="background-color: #DFC074; line-height: 4px; font-size: 4px;">&nbsp;</td></tr>
                    <tr>
                        <td class="mobile-p-20" style="padding: 32px 36px 24px 36px;">
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

                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 28px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${payUrl}" target="_blank" class="btn-primary mobile-btn" style="background-color: #123125; color: #ffffff !important; display: inline-block; font-weight: bold; font-size: 15px; text-align: center; text-decoration: none; padding: 16px 36px; border-radius: 8px; letter-spacing: 0.5px; box-shadow: 0 4px 8px rgba(18, 49, 37, 0.25);">
                                            Complete Registration & Payment &rarr;
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fffbeb" style="background-color: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #d97706; border-radius: 8px; margin: 0 0 24px 0;">
                                <tr>
                                    <td class="mobile-p-15" style="padding: 16px 20px;">
                                        <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #92400e;">📌 Already Paid?</p>
                                        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #78350f;">
                                            If you have already made the payment and your confirmation email hasn't reached you yet, please reply to this email or reach out to <a href="mailto:info@orp5ic.com?subject=Payment%20Screenshot%20-%20Ticket%20${ticketId}" style="color: #92400e; font-weight: bold; text-decoration: underline;">info@orp5ic.com</a> with your <strong>payment screenshot</strong> and <strong>transaction reference (UTR)</strong>. Our team will verify and issue your confirmed ticket immediately.
                                        </p>
                                    </td>
                                </tr>
                            </table>

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

    if (resend) {
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: email,
                subject: `Complete your ORP-5 Registration: ${ticketId}`,
                html
            });
            console.log(`[Email] Pending registration sent to ${email}`);
        } catch (error) {
            console.error('[Email] Failed to send pending registration:', error);
        }
    } else {
        console.log(`[Dev Email] To: ${email} | Subject: Complete Registration | Ticket: ${ticketId}`);
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


export async function sendCommentNotificationEmail(
    toEmail: string,
    toName: string,
    submissionTitle: string,
    commenterRole: string,
    message: string,
    submissionId: string
) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orp5ic.com';
    const isAuthorRecipient = commenterRole === 'moderator' || commenterRole === 'admin' || commenterRole === 'superadmin';
    const dashboardUrl = isAuthorRecipient ? `${siteUrl}/dashboard` : `${siteUrl}/moderator/dashboard`;
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
            <p style="color: #555; margin: 0 0 16px;">You have received a new message from <strong>${commenterLabel}</strong> regarding your abstract submission:</p>

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

    if (resend) {
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: toEmail,
                subject,
                html
            });
            console.log(`[Email] Comment notification sent to ${toEmail}`);
        } catch (error) {
            console.error('[Email] Failed to send comment notification:', error);
            throw error;
        }
    } else {
        console.log(`[Dev Email] Comment notification to: ${toEmail} | Title: ${submissionTitle}`);
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
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #f9f9f7; padding: 20px; border-radius: 8px;">
        <div style="background: #123125; color: white; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">ORP-5 CONFERENCE</h1>
            <p style="margin: 4px 0 0; font-size: 12px; color: #a3d9b1; text-transform: uppercase; letter-spacing: 2px;">Registration Confirmed</p>
        </div>
        
        <div style="background: white; padding: 32px; border: 1px solid #e8e8e4; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #555; margin: 0 0 20px;">Dear <strong>${name}</strong>,</p>
            <p style="color: #555; margin: 0 0 24px; line-height: 1.6;">We are pleased to confirm your registration and payment for the <strong>5th International Conference on Organic and Natural Rice Production Systems (ORP-5)</strong>.</p>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 0 0 28px; border: 1px dashed #4ade80; text-align: center;">
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #166534;">Payment Successful ✅</p>
                <p style="margin: 0; font-size: 28px; font-weight: bold; font-family: monospace; color: #123125; letter-spacing: 2px;">${ticketId}</p>
                <p style="margin: 8px 0 0; font-size: 13px; color: #166534;">Please save this Ticket ID for your records and check-in at the venue.</p>
            </div>

            <div style="text-align: center; margin: 32px 0 24px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://orp5ic.com'}/registration/success?id=${ticketId}" style="background: #123125; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block;">Download Receipt →</a>
            </div>

            <p style="color: #555; font-size: 14px; text-align: center; margin-bottom: 0;">We look forward to welcoming you to the conference!</p>
        </div>
        <p style="text-align: center; font-size: 11px; color: #999; margin: 16px 0 0;">ORP-5 International Conference &nbsp;|&nbsp; <a href="mailto:info@orp5ic.com" style="color: #999;">info@orp5ic.com</a></p>
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

// ─────────────────────────────────────────────────────────────────────────────
// Admin Notification: User submitted a payment claim
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
        <p style="font-size: 14px; color: #444;">Please verify this payment against SBI MIS records before approving. Run the <strong>SBI MIS Import</strong> in the admin panel to auto-match.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://orp5ic.com'}/admin/registrations" style="display: inline-block; background: #123125; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 8px;">
            Open Admin Panel →
        </a>
    </div>
    `;

    if (resend) {
        try {
            await resend.emails.send({ from: FROM_EMAIL, to: adminEmail, subject: `[ACTION NEEDED] Payment Claim: ${ticketId} — ${name}`, html });
            console.log(`[Email] Admin claim notification sent for ${ticketId}`);
        } catch (e) { console.error('[Email] Admin claim notification failed:', e); }
    } else {
        console.log(`[Dev Email] Admin payment claim for ticket: ${ticketId}, name: ${name}`);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Notification: Urgent — claim 4+ days old, expiring tomorrow
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
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://orp5ic.com'}/admin/registrations" style="display: inline-block; background: #856404; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Verify Now →
        </a>
    </div>
    `;
    if (resend) {
        try {
            await resend.emails.send({ from: FROM_EMAIL, to: adminEmail, subject: `🚨 URGENT: Claim expiring tomorrow — ${ticketId}`, html });
        } catch (e) { console.error('[Email] Urgent claim alert failed:', e); }
    } else {
        console.log(`[Dev Email] Urgent claim alert for ${ticketId}`);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Notification: Claim auto-expired (5+ days old, no verification)
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
        <p style="color: #444;"><strong>Note:</strong> You can still manually approve this registration in the admin panel if the payment is later verified. The registration data has NOT been deleted.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://orp5ic.com'}/admin/registrations" style="display: inline-block; background: #991b1b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Review in Admin Panel →
        </a>
    </div>
    `;
    if (resend) {
        try {
            await resend.emails.send({ from: FROM_EMAIL, to: adminEmail, subject: `💀 Claim Expired: ${ticketId} — ${name}`, html });
        } catch (e) { console.error('[Email] Expiry notification failed:', e); }
    } else {
        console.log(`[Dev Email] Claim expiry for ${ticketId}`);
    }
}
// ─────────────────────────────────────────────────────────────────────────────
// User Notification: Claim Verification OTP
// ─────────────────────────────────────────────────────────────────────────────
export async function sendClaimOtpEmail(email: string, otp: string, ticketId: string) {
    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px; border-radius: 12px;">
        <div style="background: #123125; color: white; padding: 20px 24px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0;">Payment Verification Code</h2>
            <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">ORP-5 Registration System</p>
        </div>
        <div style="background: white; border-radius: 8px; padding: 24px; margin-bottom: 16px; border: 1px solid #eee; text-align: center;">
            <p style="color: #666; font-size: 14px; margin-bottom: 16px;">Use the verification code below to confirm your payment claim for Ticket ID <strong>${ticketId}</strong>.</p>
            <div style="background: #f0fdf4; border: 1px dashed #22c55e; border-radius: 8px; padding: 16px; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #15803d; font-family: monospace;">
                ${otp}
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 16px;">This code is valid for 15 minutes.</p>
        </div>
        <p style="font-size: 12px; color: #666; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
    </div>
    `;

    if (resend) {
        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: email,
                subject: `${otp} is your verification code for ORP-5`,
                html: html
            });
            console.log(`[Email] OTP sent to ${email} for ticket ${ticketId}`);
        } catch (error) {
            console.error('[Email] Failed to send OTP:', error);
        }
    } else {
        console.log(`[Dev Email] OTP ${otp} for ticket ${ticketId} to ${email}`);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// User Notification: Payment Claim Rejected
// ─────────────────────────────────────────────────────────────────────────────
export async function sendPaymentRejectedEmail(
    email: string,
    name: string,
    ticketId: string,
    reason?: string
) {
    if (!resend) {
        console.log(`[Dev Email] Payment Rejected | To: ${email} | Ticket: ${ticketId}`);
        return;
    }

    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #f9f9f7; padding: 20px; border-radius: 8px;">
        <div style="background: #7f1d1d; color: white; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">ORP-5 CONFERENCE</h1>
            <p style="margin: 4px 0 0; font-size: 12px; color: #fca5a5; text-transform: uppercase; letter-spacing: 2px;">Payment Verification Failed</p>
        </div>
        
        <div style="background: white; padding: 32px; border: 1px solid #e8e8e4; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #555; margin: 0 0 20px;">Dear <strong>${name}</strong>,</p>
            <p style="color: #555; margin: 0 0 24px; line-height: 1.6;">We could not verify your recent payment claim for Ticket ID <strong>${ticketId}</strong>.</p>
            
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 0 0 24px; border: 1px dashed #ef4444;">
                <p style="margin: 0 0 8px; font-weight: bold; color: #991b1b;">Reason for Rejection:</p>
                <p style="margin: 0; color: #7f1d1d; font-size: 14px;">${reason || 'The transaction reference (UTR) or screenshot provided did not match our bank records, or the amount was incorrect.'}</p>
            </div>

            <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
                Your registration is still active, but payment is pending. Please log back into the portal and submit a valid payment proof, or contact the organizers if you believe this is an error.
            </p>

            <div style="text-align: center; margin: 0 0 24px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://orp5ic.com'}/registration/pay?ticket=${ticketId}" style="background: #123125; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                    Submit Payment Again →
                </a>
            </div>
            
            <p style="color: #555; font-size: 14px; text-align: center; margin-bottom: 0;">If you need assistance, please reply to this email.</p>
        </div>
        <p style="text-align: center; font-size: 11px; color: #999; margin: 16px 0 0;">ORP-5 International Conference &nbsp;|&nbsp; <a href="mailto:info@orp5ic.com" style="color: #999;">info@orp5ic.com</a></p>
    </div>
    `;

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `Action Required: Payment Verification Failed - ${ticketId} | ORP-5`,
            html: html
        });
        console.log(`[Email] Payment rejection sent to ${email}`);
    } catch (error) {
        console.error('[Email] Failed to send payment rejection:', error);
    }
}

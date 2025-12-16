
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = 'ORP-5 Conference <updates@orp5.org>'; // Configure this in Resend dashboard

export async function sendConfirmationEmail(email: string, token: string) {
    const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/newsletter/verify?token=${token}`;

    // HTML Template for Confirmation
    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Confirm your subscription to ORP-5 Updates</h2>
        <p>You requested to receive official updates for the 5th International Conference on Organic and Natural Rice Production Systems.</p>
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

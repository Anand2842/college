import { Resend } from 'resend';
import { getSupabaseAdmin } from '../src/lib/supabase-admin';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = 'ORP-5 Conference <info@orp5ic.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://orp5ic.com';

export function buildMobileResponsiveReminderHtml({
    name,
    ticketId,
    feeAmount,
    currency,
    category,
    mode,
    payUrl,
    ticketStatusUrl
}: {
    name: string;
    ticketId: string;
    feeAmount: number;
    currency: string;
    category: string;
    mode: string;
    payUrl: string;
    ticketStatusUrl: string;
}): string {
    const currencySymbol = currency === 'USD' ? '$' : '₹';
    const formattedFee = `${currencySymbol}${Number(feeAmount || 0).toLocaleString()}`;
    const safeName = name || 'Valued Participant';
    const safeCategory = category || 'Delegate';
    const safeMode = mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : 'Physical';

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Action Required: Complete Your ORP-5 Registration</title>
    <!--[if mso]>
    <style type="text/css">
        table {border-collapse:collapse;border-spacing:0;margin:0;}
        div, td {padding:0;}
        div {margin:0 !important;}
    </style>
    <![endif]-->
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #f4f3ed;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #2b2b2b;
        }
        table {
            border-spacing: 0;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        td {
            padding: 0;
        }
        img {
            border: 0;
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
        }
        .container-table {
            width: 100% !important;
            max-width: 600px !important;
            margin: 0 auto;
        }
        .main-card {
            background-color: #ffffff;
            border: 1px solid #e5e3d8;
            border-radius: 16px;
            overflow: hidden;
        }
        .btn-primary {
            background-color: #123125;
            color: #ffffff !important;
            display: inline-block;
            font-weight: bold;
            font-size: 15px;
            text-align: center;
            text-decoration: none;
            padding: 16px 36px;
            border-radius: 8px;
            letter-spacing: 0.5px;
        }
        @media only screen and (max-width: 600px) {
            .mobile-p-20 {
                padding: 20px !important;
            }
            .mobile-p-15 {
                padding: 15px !important;
            }
            .mobile-title {
                font-size: 20px !important;
            }
            .mobile-ticket {
                font-size: 22px !important;
            }
            .mobile-fee {
                font-size: 20px !important;
            }
            .mobile-btn {
                display: block !important;
                width: 100% !important;
                padding: 14px 20px !important;
                box-sizing: border-box !important;
            }
            .mobile-stack {
                display: block !important;
                width: 100% !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f3ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

    <!-- Wrapper Table -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f4f3ed" style="table-layout: fixed;">
        <tr>
            <td align="center" style="padding: 24px 12px 40px 12px;">

                <!-- Main Container (Max 600px) -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="container-table" style="max-width: 600px; margin: 0 auto;">
                    
                    <!-- Preheader text (Invisible in body, visible in preview) -->
                    <tr>
                        <td style="display: none; font-size: 1px; color: #f4f3ed; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
                            Action required: Your registration ticket ${ticketId} is awaiting payment. Complete your registration for ORP-5 Conference.
                        </td>
                    </tr>

                    <!-- Header with Logo / Brand -->
                    <tr>
                        <td class="main-card" style="background-color: #ffffff; border: 1px solid #e5e3d8; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                            
                            <!-- Dark Green Top Header -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#123125" style="background-color: #123125;">
                                <tr>
                                    <td align="center" style="padding: 28px 24px 24px 24px;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center">
                                                    <span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 800; color: #DFC074; text-transform: uppercase; letter-spacing: 3px; display: block; margin-bottom: 6px;">5ᵗʰ INTERNATIONAL CONFERENCE</span>
                                                    <h1 class="mobile-title" style="margin: 0; font-family: 'Georgia', serif; font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 1px; line-height: 1.3;">ORP-5 NEW DELHI</h1>
                                                    <p style="margin: 6px 0 0 0; font-size: 12px; color: #a3d9b1; letter-spacing: 0.5px;">21–25 September 2026 &nbsp;|&nbsp; NASC Complex, New Delhi</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Gold Divider Line -->
                                <tr>
                                    <td height="4" bgcolor="#DFC074" style="background-color: #DFC074; line-height: 4px; font-size: 4px;">&nbsp;</td>
                                </tr>
                            </table>

                            <!-- Main Content Body -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td class="mobile-p-20" style="padding: 32px 36px 24px 36px;">
                                        
                                        <!-- Greeting -->
                                        <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #2b2b2b;">
                                            Dear <strong>${safeName}</strong>,
                                        </p>

                                        <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #4a4a4a;">
                                            Thank you for initiating your registration for the <strong>5ᵗʰ International Conference on Organic and Natural Rice Production Systems (ORP-5)</strong>.
                                        </p>

                                        <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #4a4a4a;">
                                            Our records indicate that your registration is currently in the <strong style="color: #b45309; background-color: #fef3c7; padding: 2px 8px; border-radius: 4px;">Awaiting Payment</strong> stage. Please complete your fee payment to lock in your delegate pass and conference kit.
                                        </p>

                                        <!-- Ticket ID Highlight Card -->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 24px 0;">
                                            <tr>
                                                <td bgcolor="#f0fdf4" style="background-color: #f0fdf4; border: 2px dashed #86efac; border-radius: 12px; padding: 20px; text-align: center;">
                                                    <span style="font-size: 11px; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 6px;">Your Registration Ticket ID</span>
                                                    <span class="mobile-ticket" style="font-family: 'Courier New', Courier, monospace; font-size: 26px; font-weight: bold; color: #123125; letter-spacing: 2px; display: block; margin: 4px 0;">${ticketId}</span>
                                                    <span style="font-size: 11px; color: #15803d; display: block; margin-top: 4px;">Please keep this Ticket ID handy for reference</span>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Registration Summary Table -->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fbfaf4" style="background-color: #fbfaf4; border: 1px solid #e9e6d7; border-radius: 10px; margin: 0 0 28px 0; overflow: hidden;">
                                            <tr>
                                                <td style="padding: 16px 20px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
                                                        <tr>
                                                            <td style="padding: 6px 0; color: #6b7280; width: 40%;">Participant:</td>
                                                            <td style="padding: 6px 0; color: #111827; font-weight: bold; text-align: right;">${safeName}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 6px 0; color: #6b7280;">Category:</td>
                                                            <td style="padding: 6px 0; color: #111827; font-weight: bold; text-align: right;">${safeCategory}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 6px 0; color: #6b7280;">Attendance Mode:</td>
                                                            <td style="padding: 6px 0; color: #111827; font-weight: bold; text-align: right;">${safeMode}</td>
                                                        </tr>
                                                        <tr>
                                                            <td colspan="2" height="1" bgcolor="#e5e7eb" style="line-height: 1px; font-size: 1px; padding: 0; margin: 8px 0;">&nbsp;</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 10px 0 4px 0; color: #123125; font-weight: bold; font-size: 14px;">Total Fee Due:</td>
                                                            <td class="mobile-fee" style="padding: 10px 0 4px 0; color: #123125; font-weight: 800; font-size: 22px; text-align: right;">${formattedFee}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Payment Steps (Using Bulletproof Nested Tables instead of Flexbox) -->
                                        <h3 style="margin: 0 0 16px 0; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #123125;">
                                            Quick Steps to Complete Payment
                                        </h3>

                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 28px 0;">
                                            <!-- Step 1 -->
                                            <tr>
                                                <td width="32" valign="top" style="padding-bottom: 14px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="24" height="24" bgcolor="#123125" style="background-color: #123125; border-radius: 50%; text-align: center;">
                                                        <tr>
                                                            <td align="center" valign="middle" style="color: #ffffff; font-size: 12px; font-weight: bold; line-height: 24px;">1</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td valign="top" style="padding-bottom: 14px; padding-left: 8px; font-size: 13px; color: #374151; line-height: 1.5;">
                                                    Click the <strong>Complete Registration & Payment</strong> button below to open your personalized checkout page.
                                                </td>
                                            </tr>
                                            <!-- Step 2 -->
                                            <tr>
                                                <td width="32" valign="top" style="padding-bottom: 14px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="24" height="24" bgcolor="#123125" style="background-color: #123125; border-radius: 50%; text-align: center;">
                                                        <tr>
                                                            <td align="center" valign="middle" style="color: #ffffff; font-size: 12px; font-weight: bold; line-height: 24px;">2</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td valign="top" style="padding-bottom: 14px; padding-left: 8px; font-size: 13px; color: #374151; line-height: 1.5;">
                                                    Pay securely via the government-authorized <strong>SBI Collect</strong> portal using UPI, NetBanking, Debit/Credit Card, or NEFT.
                                                </td>
                                            </tr>
                                            <!-- Step 3 -->
                                            <tr>
                                                <td width="32" valign="top" style="padding-bottom: 14px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="24" height="24" bgcolor="#123125" style="background-color: #123125; border-radius: 50%; text-align: center;">
                                                        <tr>
                                                            <td align="center" valign="middle" style="color: #ffffff; font-size: 12px; font-weight: bold; line-height: 24px;">3</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td valign="top" style="padding-bottom: 14px; padding-left: 8px; font-size: 13px; color: #374151; line-height: 1.5;">
                                                    After payment, submit your transaction reference (UTR) on the portal to instantly request confirmation.
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Primary Call to Action Button -->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 28px 0;">
                                            <tr>
                                                <td align="center">
                                                    <!--[if mso]>
                                                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${payUrl}" style="height:50px;v-text-anchor:middle;width:280px;" arcsize="16%" stroke="f" fillcolor="#123125">
                                                    <w:anchorlock/>
                                                    <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">Complete Registration & Payment →</center>
                                                    </v:roundrect>
                                                    <![endif]-->
                                                    <!--[if !mso]><!-->
                                                    <a href="${payUrl}" target="_blank" class="btn-primary mobile-btn" style="background-color: #123125; color: #ffffff !important; display: inline-block; font-weight: bold; font-size: 15px; text-align: center; text-decoration: none; padding: 16px 36px; border-radius: 8px; letter-spacing: 0.5px; box-shadow: 0 4px 8px rgba(18, 49, 37, 0.25);">
                                                        Complete Registration & Payment &rarr;
                                                    </a>
                                                    <!--<![endif]-->
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="padding-top: 12px;">
                                                    <span style="font-size: 12px; color: #6b7280;">
                                                        Direct Link: <a href="${payUrl}" style="color: #123125; text-decoration: underline; word-break: break-all;">${payUrl}</a>
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- IMPORTANT NOTE BOX (Requested by User) -->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fffbeb" style="background-color: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #d97706; border-radius: 8px; margin: 0 0 24px 0;">
                                            <tr>
                                                <td class="mobile-p-15" style="padding: 16px 20px;">
                                                    <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #92400e;">
                                                        📌 Already Paid?
                                                    </p>
                                                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #78350f;">
                                                        If you have already made the fee payment and your confirmation email / ticket badge has not reached you yet, please reply directly to this email or write to <a href="mailto:info@orp5ic.com?subject=Payment%20Screenshot%20-%20Ticket%20${ticketId}" style="color: #92400e; font-weight: bold; text-decoration: underline;">info@orp5ic.com</a> attaching your <strong>payment screenshot</strong> and <strong>UTR / Transaction Reference Number</strong>. Our secretariat will verify and issue your confirmed delegate badge immediately.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Check Status Link -->
                                        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #6b7280; text-align: center;">
                                            You can also check real-time registration status anytime on our <a href="${ticketStatusUrl}" style="color: #123125; font-weight: bold; text-decoration: underline;">Ticket Status Portal</a>.
                                        </p>

                                    </td>
                                </tr>
                            </table>

                            <!-- Footer Section -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f9fafb" style="background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                                <tr>
                                    <td align="center" style="padding: 24px 20px; font-size: 12px; color: #6b7280; line-height: 1.6;">
                                        <strong style="color: #123125;">ORP-5 Organizing Secretariat</strong><br />
                                        5ᵗʰ International Conference on Organic and Natural Rice Production Systems<br />
                                        Helpline: <a href="mailto:info@orp5ic.com" style="color: #123125; font-weight: bold; text-decoration: none;">info@orp5ic.com</a> &nbsp;|&nbsp; Official Website: <a href="${SITE_URL}" style="color: #123125; font-weight: bold; text-decoration: none;">orp5ic.com</a>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Unsubscribe / Security Note -->
                    <tr>
                        <td align="center" style="padding-top: 16px; font-size: 11px; color: #9ca3af; line-height: 1.4;">
                            This is an automated communication regarding your ORP-5 Conference registration (${ticketId}).<br />
                            &copy; 2026 ORP-5 Conference Secretariat. All rights reserved.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>`;
}

// Function to send reminder to one registration
export async function sendAwaitingReminderEmail(registration: any): Promise<{ success: boolean; error?: string }> {
    if (!resend) {
        throw new Error('RESEND_API_KEY is not configured.');
    }

    const d = registration.data || {};
    const email = (d.email || registration.email || '').trim();
    const name = d.full_name || d.fullName || registration.full_name || 'Participant';
    const ticketId = d.ticket_number || registration.ticket_number || 'ORP5IC-REG';
    const feeAmount = Number(d.fee_amount || d.feeAmount || 0);
    const currency = d.currency || 'INR';
    const category = d.category || 'Delegate';
    const mode = d.mode || 'physical';

    if (!email || !email.includes('@')) {
        return { success: false, error: 'Invalid email address' };
    }

    const payUrl = `${SITE_URL}/registration/pay?id=${ticketId}`;
    const ticketStatusUrl = `${SITE_URL}/ticket-status`;

    const html = buildMobileResponsiveReminderHtml({
        name,
        ticketId,
        feeAmount,
        currency,
        category,
        mode,
        payUrl,
        ticketStatusUrl
    });

    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `Action Required: Complete Your Registration for ORP-5 Conference (Ticket: ${ticketId})`,
            html
        });
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Send error' };
    }
}

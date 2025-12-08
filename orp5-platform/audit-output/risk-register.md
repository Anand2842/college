# Risk Register: Shipping Without Payment Gateway

## Overview
This release intentionally excludes payment gateway integration. The following risks and mitigations apply.

---

## Functional Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Users attempt to pay online | High | Medium | Show clear "Payment Coming Soon" message |
| Confusion about registration status | Medium | High | Provide manual payment instructions clearly |
| Incomplete registration flow | Medium | Medium | Allow form submission, send confirmation email |

---

## UX Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| User abandons after seeing no payment | High | High | Clear messaging about alternative payment methods |
| Expectation of online receipt/invoice | Medium | Medium | Generate PDF receipts server-side after manual verification |

---

## Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Delayed revenue collection | High | Medium | Offer bank transfer details immediately |
| Manual reconciliation overhead | High | Low | Provide admin dashboard for tracking |

---

## Mitigation Implementation

### Registration Page
Add banner: "Online payment coming soon. Submit your registration now and complete payment via bank transfer."

### Success Page
Update to show: "Your registration is pending payment. Please complete payment using the bank details below within 7 days."

### Admin Dashboard
Add section to mark registrations as "Paid" manually.

---

## Client Communication Template

> **Subject: ORP-5 Platform - Payment Gateway Timeline**
>
> Dear [Client],
>
> The ORP-5 conference website is ready for deployment with full content management, registration forms, and speaker profiles. 
>
> **Payment gateway integration** is scheduled for the next release (target: [DATE]). In the meantime:
>
> - Registrations can be submitted and stored in the database
> - Delegates will receive bank transfer instructions for payment
> - Admin panel allows marking registrations as "Paid"
>
> Current build supports:
> - ✅ Full CMS for all pages
> - ✅ Registration form submission
> - ✅ Speaker and theme management
> - ✅ File uploads
> - ⏳ Online payment (next release)
>
> Please let us know if you have questions.

# Risk Register (Payment Gateway Excluded)

## Risks of Shipping Without Payments
1. **User Confusion**: Users expecting to complete registration might be confused if the "Register" flow ends without payment.
2. **Data Orphanage**: Registrations might be created in DB without "Paid" status, complicating reconciliation later.
3. **Manual Overhead**: Client may need to manually collect payments or invoice users, creating operational burden.

## Mitigation
- **Communication**: Update UI to explicitly state "Payment will be collected later" or "Pre-registration only".
- **Email Trigger**: Send automated email upon registration with payment instructions (bank transfer/UPI).
- **Admin Flag**: Ensure Admin panel shows "Payment Pending" for these users.

## Client Communication
"The current release supports full user registration and content browsing. Payment gateway integration is scheduled for the next sprint. For now, users will be marked as 'Pending Payment', and we have added a message instructing them on offline payment methods."

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
  const emails: Set<string> = new Set();

  // 1. Check Registrations table (JSONB data field)
  const { data: regs, error: regError } = await supabase.from('registrations').select('data');
  if (regError) console.error('Reg Error:', regError);
  else {
    regs.forEach((r: any) => {
      if (r.data?.email && (r.data.email.endsWith('@orp') || r.data.email.includes('@orp5.org'))) {
        emails.add(r.data.email);
      }
    });
  }

  // 2. Check Subscriber table
  const { data: subs, error: subError } = await supabase.from('Subscriber').select('email');
  if (subError) console.error('Sub Error:', subError);
  else {
    subs.forEach((s: any) => {
      if (s.email && (s.email.endsWith('@orp') || s.email.includes('@orp5.org'))) {
        emails.add(s.email);
      }
    });
  }

  // 3. Check Inquiry table
  const { data: inqs, error: inqError } = await supabase.from('Inquiry').select('email');
  if (inqError) console.error('Inq Error:', inqError);
  else {
    inqs.forEach((i: any) => {
      if (i.email && (i.email.endsWith('@orp') || i.email.includes('@orp5.org'))) {
        emails.add(i.email);
      }
    });
  }

  console.log('--- Emails ending with @orp or @orp5.org ---');
  Array.from(emails).forEach(email => console.log(email));
}

run();

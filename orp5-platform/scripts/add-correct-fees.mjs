import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vvqnxqtiwbfmipawtqet.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA5Njg2MiwiZXhwIjoyMDgwNjcyODYyfQ.gdpzx7F9gVi_MtSYG9UJVJzP7tUn9o3IzXAaqCAaUf0'
);

const correctFeesHTML = `
<h2>Registration Fees</h2>

<h3>Physical Mode — Indian Delegates</h3>
<ul>
<li><strong>UG Students (AIASA Members):</strong> INR 2,500</li>
<li><strong>PG Students/Research Scholars (AIASA Members):</strong> INR 3,000</li>
<li><strong>UG Students (Non-Members):</strong> INR 3,500</li>
<li><strong>PG Students/Research Scholars (Non-Members):</strong> INR 4,000</li>
<li><strong>Scientists/Professionals (AIASA Members):</strong> INR 8,000</li>
<li><strong>Scientists/Professionals (Non-Members):</strong> INR 10,000</li>
<li><strong>Innovative Farmers (KKM/AIASA Members):</strong> INR 2,700</li>
<li><strong>Innovative Farmers (Non-Members):</strong> INR 3,700</li>
</ul>

<h3>Virtual/Online Mode — Indian Delegates</h3>
<ul>
<li><strong>UG Students (AIASA Members):</strong> INR 1,000</li>
<li><strong>PG Students/Research Scholars (AIASA Members):</strong> INR 1,500</li>
<li><strong>UG Students (Non-Members):</strong> INR 1,300</li>
<li><strong>PG Students/Research Scholars (Non-Members):</strong> INR 1,700</li>
<li><strong>Scientists/Professionals (AIASA Members):</strong> INR 2,800</li>
<li><strong>Scientists/Professionals (Non-Members):</strong> INR 3,600</li>
<li><strong>Innovative Farmers (KKM/AIASA Members):</strong> INR 900</li>
<li><strong>Innovative Farmers (Non-Members):</strong> INR 1,300</li>
</ul>

<h3>Foreign Delegates — Physical Mode</h3>
<ul>
<li><strong>UG Students:</strong> $250</li>
<li><strong>PG Students/Research Scholars:</strong> $300</li>
<li><strong>Scientists/Professionals:</strong> $500</li>
</ul>

<h3>Foreign Delegates — Virtual/Online Mode</h3>
<ul>
<li><strong>UG Students:</strong> $25</li>
<li><strong>PG Students/Research Scholars:</strong> $35</li>
<li><strong>Scientists/Professionals:</strong> $50</li>
</ul>

<blockquote>
<p><strong>Note:</strong> Late fee of INR 1,000 or $20 will be charged per person after the registration deadline of 01 August 2026. The registration fee does not include accommodation charges.</p>
</blockquote>

<h3>Registration Includes</h3>
<ul>
<li>Participation in all scientific/technical sessions</li>
<li>Proceedings and other soft copy and printed materials</li>
<li>Welcome reception, refreshments, and lunches during conference days</li>
<li>Registration kit for virtual candidates includes passes to conference day events</li>
</ul>

<h3>Bank Details for Payment</h3>
<ul>
<li><strong>Account Name:</strong> All India Agricultural Students Association</li>
<li><strong>Account Number:</strong> 44767771724</li>
<li><strong>Account Type:</strong> Current</li>
<li><strong>IFSC:</strong> SBIN0005389</li>
<li><strong>Bank:</strong> State Bank of India, NSC Beej Bhawan, Pusa Complex, New Delhi-110012</li>
</ul>
`;

async function fix() {
  const { data } = await supabase
    .from('blog_posts')
    .select('id, content')
    .eq('slug', 'how-to-register-orp5-international-rice-conference')
    .single();

  if (!data) { console.log('Post not found'); return; }

  // Insert correct fees before FAQ section
  let content = data.content;
  const faqIdx = content.indexOf('<h2>Frequently Asked');
  
  if (faqIdx > -1) {
    content = content.substring(0, faqIdx) + correctFeesHTML + '\n' + content.substring(faqIdx);
  } else {
    content = content + correctFeesHTML;
  }

  const { error } = await supabase
    .from('blog_posts')
    .update({ content })
    .eq('id', data.id);

  if (error) {
    console.log('FAILED:', error.message);
  } else {
    console.log('Added correct registration fees');
  }
}

fix();

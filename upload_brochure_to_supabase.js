const { createClient } = require('./orp5-platform/node_modules/@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://vvqnxqtiwbfmipawtqet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA5Njg2MiwiZXhwIjoyMDgwNjcyODYyfQ.gdpzx7F9gVi_MtSYG9UJVJzP7tUn9o3IzXAaqCAaUf0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const pdfBuffer = fs.readFileSync(path.join(__dirname, '5th circular orp5ic.pdf'));
  
  console.log('Uploading 5th circular orp5ic.pdf to Supabase Storage...');
  
  const uploadFileName = `documents/5th_circular_orp5ic_${Date.now()}.pdf`;
  const staticUploadFileName = `documents/ORP5_5th_Circular_Brochure.pdf`;
  
  // Try uploads bucket
  const { data: uploadData1, error: err1 } = await supabase.storage
    .from('uploads')
    .upload(staticUploadFileName, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });
    
  if (err1) {
    console.warn('Upload to uploads bucket warning:', err1.message);
  }

  const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(staticUploadFileName);
  const publicPdfUrl = publicUrlData ? publicUrlData.publicUrl : '/documents/ORP5_Conference_Brochure.pdf';
  console.log('Supabase Public URL:', publicPdfUrl);

  // Update Page table for 'brochure'
  const { data: brochurePage } = await supabase.from('Page').select('*').eq('slug', 'brochure').single();
  
  if (brochurePage) {
    const content = brochurePage.content || {};
    
    // Update hero & downloadSection
    content.hero = {
      ...content.hero,
      headline: "5ᵗʰ Circular & Official Brochure",
      subheadline: "Official 5ᵗʰ Circular and Comprehensive Prospectus for the 5ᵗʰ International Conference on Organic and Natural Rice Production Systems (ORP-5).",
    };
    
    content.downloadSection = {
      title: "Download the Official 5ᵗʰ Circular & Brochure",
      description: "Access the updated official 5ᵗʰ circular of the 5ᵗʰ International Conference on Organic and Natural Rice Production Systems. Provides full details on conference schedule, themes, venue (PHD House), committees, and guidelines.",
      buttons: [
        {
          icon: "Download",
          link: "/documents/ORP5_Conference_Brochure.pdf",
          label: "Download 5th Circular (PDF)",
          variant: "primary"
        },
        {
          icon: "FileText",
          link: publicPdfUrl,
          label: "Cloud Mirror (PDF)",
          variant: "outline"
        }
      ],
      footerText: "Official 5th Circular • PHD Chamber of Commerce & Industry, New Delhi (21–25 September 2026)"
    };
    
    const { error: updateErr } = await supabase.from('Page').update({
      content: content,
      updatedAt: new Date().toISOString()
    }).eq('id', brochurePage.id);
    
    if (updateErr) {
      console.error('Error updating brochure page:', updateErr);
    } else {
      console.log('Successfully updated brochure page in Supabase Page table!');
    }
  }

  // Also check if 'sponsorship' page needs prospectus update
  const { data: sponsorPage } = await supabase.from('Page').select('*').eq('slug', 'sponsorship').single();
  if (sponsorPage && sponsorPage.content) {
    const sContent = sponsorPage.content;
    let modified = false;
    const str = JSON.stringify(sContent);
    if (str.includes('/downloads/prospectus.pdf')) {
      const updatedStr = str.replace(/\/downloads\/prospectus\.pdf/g, '/documents/ORP5_Conference_Brochure.pdf');
      const newContent = JSON.parse(updatedStr);
      await supabase.from('Page').update({
        content: newContent,
        updatedAt: new Date().toISOString()
      }).eq('id', sponsorPage.id);
      console.log('Updated prospectus links in sponsorship page!');
    }
  }

  console.log('All brochure references updated successfully!');
}

main().catch(console.error);

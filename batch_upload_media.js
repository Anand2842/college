/**
 * CLI Batch Media & Video Uploader for ORP-5
 * Usage: node batch_upload_media.js /path/to/photos_folder
 */

const { createClient } = require('./orp5-platform/node_modules/@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://vvqnxqtiwbfmipawtqet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA5Njg2MiwiZXhwIjoyMDgwNjcyODYyfQ.gdpzx7F9gVi_MtSYG9UJVJzP7tUn9o3IzXAaqCAaUf0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadFolder(folderPath) {
  if (!folderPath || !fs.existsSync(folderPath)) {
    console.error('Usage: node batch_upload_media.js <folder_path>');
    process.exit(1);
  }

  const files = fs.readdirSync(folderPath).filter(f => !f.startsWith('.'));
  console.log(`Found ${files.length} files in ${folderPath}. Starting direct cloud upload...\n`);

  const uploadedUrls = [];

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const filePath = path.join(folderPath, filename);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) continue;

    const ext = path.extname(filename).toLowerCase();
    const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    const isVideo = ['.mp4', '.mov', '.webm', '.mkv', '.m4v'].includes(ext);

    if (!isImage && !isVideo) {
      console.log(`Skipping non-media file: ${filename}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const cloudPath = `media/${Date.now()}_${cleanName}`;

    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.mov') contentType = 'video/quicktime';
    else if (ext === '.webm') contentType = 'video/webm';

    process.stdout.write(`[${i+1}/${files.length}] Uploading ${filename} (${(stat.size / (1024*1024)).toFixed(2)} MB)... `);

    const { data, error } = await supabase.storage.from('uploads').upload(cloudPath, fileBuffer, {
      contentType,
      upsert: true
    });

    if (error) {
      console.log(`❌ Failed: ${error.message}`);
    } else {
      const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(cloudPath);
      console.log(`✅ Done!`);
      uploadedUrls.push({
        name: filename,
        url: publicData.publicUrl,
        type: isVideo ? 'video' : 'image'
      });
    }
  }

  console.log(`\n🎉 Uploaded ${uploadedUrls.length} media items directly to Supabase Storage.`);

  // Save list of uploaded URLs to a JSON file
  fs.writeFileSync('uploaded_media_urls.json', JSON.stringify(uploadedUrls, null, 2));
  console.log('Saved all public URLs to uploaded_media_urls.json\n');
}

const targetFolder = process.argv[2] || process.cwd();
uploadFolder(targetFolder).catch(console.error);

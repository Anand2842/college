import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import fs from 'fs';

// Disable the default body parser to handle file uploads
export const config = {
    api: {
        bodyParser: false,
        sizeLimit: '10mb', // Set a higher limit (though irrelevant if bodyParser is false, but good for doc)
    },
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // No auth required — file upload is allowed for guests submitting abstracts.
        // Storage upload uses the admin service role key which bypasses all RLS.

        // 2. Parse Form
        const form = new IncomingForm({
            maxFileSize: 10 * 1024 * 1024, // 10MB
            keepExtensions: true,
        });

        const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve([fields, files]);
            });
        });

        const uploadedFile = files.file?.[0] || files.file; // formidable v3 can return array or single

        if (!uploadedFile) {
            return res.status(400).json({ error: 'No file received.' });
        }

        const fileObj = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

        // Validate Type
        const allowedTypes = [
            'image/jpeg', 
            'image/png', 
            'image/webp', 
            'application/pdf',
            'application/msword', // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
        ];
        if (!allowedTypes.includes(fileObj.mimetype || '')) {
            return res.status(400).json({ error: 'Invalid file type. Only Images, PDFs, and Word Documents (.doc, .docx) are allowed.' });
        }

        // 3. Upload to Supabase
        const fileContent = fs.readFileSync(fileObj.filepath);
        const filename = `${Date.now()}_${(fileObj.originalFilename || 'upload.bin').replace(/\s/g, '_')}`;

        const { data, error } = await getSupabaseAdmin()
            .storage
            .from('uploads')
            .upload(filename, fileContent, {
                contentType: fileObj.mimetype || undefined,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error("Supabase Upload error:", error);
            return res.status(500).json({ error: "Failed to upload file to storage." });
        }

        // 4. Get Public URL
        const { data: publicUrlData } = getSupabaseAdmin()
            .storage
            .from('uploads')
            .getPublicUrl(filename);

        return res.status(200).json({
            success: true,
            url: publicUrlData.publicUrl
        });

    } catch (error: any) {
        console.error("Upload handler error:", error);
        // Catch formidable errors specially if needed
        if (error?.message?.includes('maxFileSize')) {
            return res.status(413).json({ error: "File too large (Max 10MB)." });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default POST;

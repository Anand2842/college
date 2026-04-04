import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import { createServerClient } from '@supabase/ssr';
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
        // 1. Auth Check
        // createServerClient for Pages Router
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return Object.keys(req.cookies).map((name) => ({
                            name,
                            value: req.cookies[name] || '',
                        }));
                    },
                    setAll(cookiesToSet) {
                        // Basic implementation - we might not need to write back strictly for just an upload check
                        // providing empty implementation to satisfy type if strictly needed, or basic header set
                        const cookieHeaders = cookiesToSet.map(({ name, value, options }) => {
                            // simplistic serialize, ideally use a library but for now we trust existing session
                            return `${name}=${value}; Path=${options.path || '/'}; SameSite=${options.sameSite || 'Lax'}`; // simplified
                        });
                        res.setHeader('Set-Cookie', cookieHeaders);
                    },
                },
            }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

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
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(fileObj.mimetype || '')) {
            return res.status(400).json({ error: 'Invalid file type. Only Images and PDFs allowed.' });
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

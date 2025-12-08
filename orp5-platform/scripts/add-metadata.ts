
import fs from 'fs';
import path from 'path';

// List of files from grep (simplified for this script, I'll paste the output or run it dynamically, but here I'll just walk)

function walk(dir: string, fileList: string[] = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walk(filePath, fileList);
        } else {
            if (file === 'page.tsx' && !filePath.includes('/admin/') && !filePath.includes('/api/')) {
                fileList.push(filePath);
            }
        }
    }
    return fileList;
}

const files = walk(path.join(process.cwd(), 'src/app'));

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    if (!content.includes('export const metadata')) {
        console.log(`Adding metadata to ${file}`);

        // Infer title from path
        const parts = file.split('/');
        const parentDir = parts[parts.length - 2];
        const title = parentDir === 'app' ? 'Home' : parentDir.charAt(0).toUpperCase() + parentDir.slice(1).replace(/-/g, ' ');

        const metadataBlock = `
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '${title} | ORP-5 Conference',
    description: '5th International Conference on Organic & Natural Rice Farming',
};
`;
        // Insert after imports if possible, or at top
        // Simple heuristic: prepend to file? Or append if standard.
        // Ideally put after imports. Let's put it before 'export default function'.

        if (content.includes('export default function')) {
            const newContent = content.replace('export default function', `${metadataBlock}\nexport default function`);
            fs.writeFileSync(file, newContent);
        } else if (content.includes('const ')) {
            const newContent = `${metadataBlock}\n${content}`;
            fs.writeFileSync(file, newContent);
        }
    }
});

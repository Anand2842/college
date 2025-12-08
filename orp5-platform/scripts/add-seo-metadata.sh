#!/bin/bash
# Script to generate metadata.ts files for all app routes
# Run from project root: bash scripts/add-seo-metadata.sh

PAGES=(
  "accommodation:Hotel and accommodation options"
  "awards:Conference awards and recognitions"
  "brochure:Download conference brochure"
  "committees:Organizing committees"
  "contact:Contact information"
  "exhibition:Exhibition details"
  "gallery:Photo gallery"
  "how-to-reach:Travel and directions"
  "important-dates:Key conference dates"
  "programme:Conference programme"
  "speakers:Keynote speakers"
  "sponsorship:Become a sponsor"  
  "submission-guidelines:Abstract submission guidelines"
  "themes:Conference themes"
  "venue:Venue information"
)

for page_info in "${PAGES[@]}"; do
  IFS=':' read -r page desc <<< "$page_info"
  
  echo "Creating metadata for /$page..."
  
  cat > "src/app/$page/metadata.ts" << EOF
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: '${page^}',
  description: '$desc for ORP-5 Conference',
  path: '/$page',
});

export { default } from './page';
EOF

done

echo ""
echo "✅ Created metadata files for ${#PAGES[@]} pages"
echo ""
echo "To use these, update each page.tsx to import from metadata.ts"

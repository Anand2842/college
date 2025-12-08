#!/bin/bash
# Script to help identify and update useState<any> instances
# Run from project root: bash scripts/bulk-update-types.sh

echo "=== Finding all useState<any> instances ==="
echo ""

# Find all files with useState<any>
grep -r "useState<any>" src/ --include="*.tsx" -l | sort

echo ""
echo "=== Total count ==="
grep -r "useState<any>" src/ --include="*.tsx" | wc -l

echo ""
echo "=== Files by directory ==="
echo "Public pages:"
grep -r "useState<any>" src/app --include="*.tsx" --exclude-dir=admin -l | wc -l

echo "Admin pages:"
grep -r "useState<any>" src/app/admin --include="*.tsx" -l | wc -l

echo ""
echo "=== To update a file ==="
echo "1. Identify the data type from src/types/pages.ts"
echo "2. Replace: useState<any>(null) -> useState<PageData | null>(null)"
echo "3. Add error state: const [error, setError] = useState<string | null>(null);"
echo "4. Update fetch to use fetchJSON wrapper"
echo "5. Add null check: if (!data) return <Loading />;"

import urllib.request
import re

url = "http://localhost:3000/themes"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
        # In Next.js App router, initial data might be in script tags, or just in HTML
        # Look for theme titles: <h3 class="...text-2xl font-serif...">Title</h3>
        matches = re.findall(r'<h3[^>]*text-2xl font-serif[^>]*>([^<]+)</h3>', html)
        for i, m in enumerate(matches):
            print(f"Theme {i+1}: {m}")
except Exception as e:
    print(e)

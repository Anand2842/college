import urllib.request
import json
import os

url = "https://vvqnxqtiwbfmipawtqet.supabase.co/rest/v1/Theme?select=id,title,icon"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cW54cXRpd2JmbWlwYXd0cWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwOTY4NjIsImV4cCI6MjA4MDY3Mjg2Mn0.p1ZT0lUN0PIAEXbSphB44g3Nv-YJ5G5oqDRBPU99V5I"

req = urllib.request.Request(url, headers={
    'apikey': key,
    'Authorization': 'Bearer ' + key
})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print(json.dumps(data, indent=2))
except Exception as e:
    print(e)

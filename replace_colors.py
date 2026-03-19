import os
import re

files = [
    '/Users/aifaz/Desktop/aifaz portfolio/style.css',
    '/Users/aifaz/Desktop/aifaz portfolio/script.js',
    '/Users/aifaz/Desktop/aifaz portfolio/index.html'
]

mapping = {
    '#064e3b': '#4c1d95',
    '#042f24': '#3b0764',
    '#0d7056': '#6d28d9',
    '#022c22': '#2e1065',
    '#0f2b19': '#3b0764',
    '#0b1a16': '#1e1b4b',
    '-emerald-': '-purple-',
    '0x064e3b': '0x4c1d95',
    'bg-[#064e3b]': 'bg-[#4c1d95]',
}

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in mapping.items():
        # Case insensitive replace for hex codes
        if old.startswith('#'):
            content = re.sub(old, new, content, flags=re.IGNORECASE)
        else:
            content = content.replace(old, new)
            
    with open(filepath, 'w') as f:
        f.write(content)

print("Colors replaced successfully.")

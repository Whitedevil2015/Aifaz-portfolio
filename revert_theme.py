import re
import os

files = [
    '/Users/aifaz/Desktop/aifaz portfolio/style.css',
    '/Users/aifaz/Desktop/aifaz portfolio/script.js',
    '/Users/aifaz/Desktop/aifaz portfolio/index.html'
]

mapping = {
    '#4c1d95': '#064e3b',
    '#3b0764': '#042f24',
    '#6d28d9': '#0d7056',
    '#2e1065': '#022c22',
    '#1e1b4b': '#0b1a16', # We'll accept that any existing 1e1b4b might turn into 0b1a16. They're both dark backgrounds.
    '-purple-': '-emerald-',
    '0x4c1d95': '0x064e3b',
    'bg-[#4c1d95]': 'bg-[#064e3b]',
    'text-gradient-purple': 'text-gradient-emerald',
    '#8b5cf6': '#10b981',
    '#7c3aed': '#059669',
    'text-purple': 'text-emerald',
    'bg-purple': 'bg-emerald',
    'border-purple': 'border-emerald',
    'ring-purple': 'ring-emerald',
    'from-purple': 'from-emerald',
    'to-purple': 'to-emerald',
    'via-purple': 'via-emerald',
    '--purple-light': '--emerald-light',
    '--purple': '--emerald',
}

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()

        # Handle user's un-reversed hexes
        # User left `--emerald: #4c1d95;` which will be fixed by the hex replacement.
        
        # Sort mapping by length (descending) to avoid partial replacements issues
        sorted_mapping = dict(sorted(mapping.items(), key=lambda item: len(item[0]), reverse=True))
        
        for old, new in sorted_mapping.items():
            if old.startswith('#'):
                content = re.sub(old, new, content, flags=re.IGNORECASE)
            else:
                content = content.replace(old, new)
        
        # Finally, fix any double emeralds if they accidentally occurred
        content = content.replace('--emerald-light-light', '--emerald-light')
        content = content.replace('text-emerald-emerald', 'text-emerald')

        with open(filepath, 'w') as f:
            f.write(content)

print("Reverted to emerald theme successfully.")

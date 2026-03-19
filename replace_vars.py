import re

files = [
    '/Users/aifaz/Desktop/aifaz portfolio/style.css',
    '/Users/aifaz/Desktop/aifaz portfolio/script.js',
    '/Users/aifaz/Desktop/aifaz portfolio/index.html'
]

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # replace --emerald with --purple
    content = content.replace('--emerald', '--purple')
    content = content.replace('--emerald-light', '--purple-light')
    
    # replace text-gradient-emerald with text-gradient-purple
    content = content.replace('text-gradient-emerald', 'text-gradient-purple')
    
    with open(filepath, 'w') as f:
        f.write(content)

print("Vars replaced.")

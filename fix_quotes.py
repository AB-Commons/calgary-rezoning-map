#!/usr/bin/env python3
import re

# Read the file
with open('/Users/Sarah/Desktop/calgary-rezoning-map/src/App.jsx', 'r') as f:
    content = f.read()

# Fix unescaped quotes within text fields
# This regex finds text: "..." patterns and escapes quotes inside them
def fix_quotes_in_text(match):
    text_content = match.group(1)
    # Escape any unescaped quotes inside the text
    text_content = re.sub(r'(?<!\\)"', r'\\"', text_content)
    return f'text: "{text_content}"'

# Apply the fix
content = re.sub(r'text: "([^"]*(?:\\"[^"]*)*)"', fix_quotes_in_text, content)

# Write back
with open('/Users/Sarah/Desktop/calgary-rezoning-map/src/App.jsx', 'w') as f:
    f.write(content)

print("Fixed quote escaping in App.jsx")

#!/usr/bin/env python3
import re

with open('/Users/Sarah/Desktop/calgary-rezoning-map/src/App.jsx', 'r') as f:
    content = f.read()

# Find all comment lines and fix them
lines = content.split('\n')
fixed_lines = []

for i, line in enumerate(lines):
    if 'text: "' in line and 'cluster:' in line:
        # This is a comment line - check and fix quotes
        # Pattern: text: "...", cluster: N, x: ..., y: ...
        match = re.match(r'^(\s*\{ id: \d+, text: ")(.+?)(", cluster: \d+, x: [-\d.]+, y: [-\d.]+ \},?)', line)
        if match:
            prefix = match.group(1)
            text = match.group(2)
            suffix = match.group(3)
            
            # Escape any unescaped quotes in the text
            # Replace " with \\" but not \\"
            new_text = re.sub(r'(?<!\\)"', r'\\"', text)
            
            if new_text != text:
                print(f"Fixed line {i+1}")
                line = prefix + new_text + suffix
    
    fixed_lines.append(line)

# Write back
new_content = '\n'.join(fixed_lines)
with open('/Users/Sarah/Desktop/calgary-rezoning-map/src/App.jsx', 'w') as f:
    f.write(new_content)

print("Done! Fixed all quote issues.")

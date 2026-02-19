#!/usr/bin/env python3
import re

# Read the file
with open('/Users/Sarah/Desktop/calgary-rezoning-map/src/App.jsx', 'r') as f:
    content = f.read()

# Find lines with id: 4864 and fix the string
# The issue is likely a quote not being escaped properly
lines = content.split('\n')
fixed_lines = []

for i, line in enumerate(lines):
    # Check if this line has a text field with potential issues
    if 'text: "' in line and line.count('"') % 2 != 0:
        # Try to fix by escaping any unescaped quotes inside the text
        # Find the text field and fix it
        match = re.search(r'text: "(.+?)"[^"]*$', line)
        if not match:
            # The string doesn't end properly - find the last quote
            # and check if it's followed by , cluster
            parts = line.split('text: "')
            if len(parts) == 2:
                before = parts[0]
                rest = parts[1]
                # Find where the text should end (before , cluster)
                cluster_idx = rest.find('", cluster')
                if cluster_idx > 0:
                    text_content = rest[:cluster_idx]
                    after = rest[cluster_idx:]
                    # Escape any unescaped quotes in the text
                    text_content = text_content.replace('"', '\\"')
                    # But we need to be careful not to double-escape
                    # The pattern is: text: "...", cluster
                    line = before + 'text: "' + text_content + after
                    print(f"Fixed line {i+1}")
    fixed_lines.append(line)

# Write back
new_content = '\n'.join(fixed_lines)
with open('/Users/Sarah/Desktop/calgary-rezoning-map/src/App.jsx', 'w') as f:
    f.write(new_content)

print("File fixed!")

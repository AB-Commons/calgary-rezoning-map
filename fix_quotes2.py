#!/usr/bin/env python3
"""Fix quote escaping in App.jsx comment data"""
import re

def fix_quotes(content):
    lines = content.split('\n')
    new_lines = []
    
    for i, line in enumerate(lines):
        # Check if this is a comment line with text field
        if 'text: "' in line and 'cluster:' in line and 'x:' in line and 'y:' in line:
            # Find the text field boundaries
            # Format: { id: N, text: "...", cluster: N, x: ..., y: ... }
            
            # Use regex to extract parts
            match = re.match(
                r'^(\s*\{ id: \d+, text: ")(.+?)(", cluster: (\d+), x: ([-\d.]+), y: ([-\d.]+)( \},?))$',
                line
            )
            
            if match:
                prefix = match.group(1)
                text = match.group(2)
                suffix = match.group(3)  # Everything after text including cluster, x, y
                
                # Count quotes in text
                quote_count = text.count('"')
                
                if quote_count > 0:
                    # Escape unescaped quotes
                    # Replace " with \\" but not \\"
                    new_text = re.sub(r'(?<!\\)"', r'\\"', text)
                    new_line = prefix + new_text + suffix
                    
                    if new_text != text:
                        print(f"Fixed line {i+1}: escaped {quote_count} quotes")
                    new_lines.append(new_line)
                else:
                    new_lines.append(line)
            else:
                # Couldn't parse - might have odd quotes breaking the regex
                # Try to fix by escaping all quotes after text: "
                if line.count('"') % 2 != 0:
                    # Find text: " and escape everything until the last ", cluster
                    parts = line.split('text: "', 1)
                    if len(parts) == 2:
                        before = parts[0] + 'text: "'
                        rest = parts[1]
                        # Find ", cluster
                        end_match = re.search(r'", cluster: \d+', rest)
                        if end_match:
                            text_part = rest[:end_match.start()]
                            after = rest[end_match.start():]
                            # Escape quotes in text
                            new_text = text_part.replace('"', '\\"')
                            new_line = before + new_text + after
                            print(f"Fixed line {i+1} (fallback)")
                            new_lines.append(new_line)
                        else:
                            new_lines.append(line)
                    else:
                        new_lines.append(line)
                else:
                    new_lines.append(line)
        else:
            new_lines.append(line)
    
    return '\n'.join(new_lines)

# Read file
with open('/Users/Sarah/Desktop/calgary-rezoning-map/src/App.jsx', 'r') as f:
    content = f.read()

# Fix quotes
new_content = fix_quotes(content)

# Write back
with open('/Users/Sarah/Desktop/calgary-rezoning-map/src/App.jsx', 'w') as f:
    f.write(new_content)

print("\nDone!")

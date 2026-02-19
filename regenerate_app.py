#!/usr/bin/env python3
"""Regenerate App.jsx with properly escaped data from CSV"""
import csv
import re

# Read CSV
comments = []
clusters = {}
stances = {}

with open('/Users/Sarah/Desktop/calgary-rezoning-map/verbatim_comments_all(1).csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        clean_row = {k.lstrip('\ufeff'): v for k, v in row.items()}
        comments.append({
            'id': int(clean_row['id']),
            'text': clean_row['text'],
            'cluster': int(clean_row['cluster']),
            'x': float(clean_row['x']),
            'y': float(clean_row['y'])
        })
        cid = int(clean_row['cluster'])
        if cid not in clusters:
            clusters[cid] = clean_row['cluster_label']
        stance = clean_row['stance']
        stances[stance] = stances.get(stance, 0) + 1

print(f"Loaded {len(comments)} comments")
print(f"Stances: {stances}")

# Read current App.jsx to preserve the React code
with open('/Users/Sarah/Desktop/calgary-rezoning-map/src/App.jsx', 'r', encoding='utf-8') as f:
    original = f.read()

# Find where clusterData starts and export default function App() starts
cluster_start = original.find('const clusterData = {')
app_start = original.find('export default function App()', cluster_start)

if cluster_start == -1 or app_start == -1:
    print("ERROR: Could not find markers in file")
    exit(1)

# Get the code before clusterData (imports, etc.)
before_data = original[:cluster_start]

# Get the code after clusterData starts (the App function and rest)
after_marker = original[app_start:]

# Build new clusterData with proper escaping
def escape_js(s):
    """Escape string for JavaScript"""
    s = s.replace('\\', '\\\\')
    s = s.replace('"', '\\"')  # Straight double quote
    s = s.replace('"', '\\"')  # Left curly quote
    s = s.replace('"', '\\"')  # Right curly quote
    s = s.replace("'", "\\'")   # Single quote
    s = s.replace('\n', '\\n')
    s = s.replace('\r', '\\r')
    s = s.replace('\t', '\\t')
    return s

# Build cluster definitions
cluster_colors = {
    1: '#ef4444', 2: '#dc2626', 3: '#f97316', 4: '#a855f7',
    5: '#3b82f6', 6: '#22c55e', 7: '#64748b',
}

clusters_js = "  clusters: [\n"
for cid in sorted(clusters.keys()):
    label = clusters[cid]
    color = cluster_colors.get(cid, '#64748b')
    short = label.split(' – ')[-1] if ' – ' in label else label.split(' / ')[-1]
    if len(short) > 18:
        short = short[:15] + '...'
    clusters_js += f'    {{ id: {cid}, name: "{escape_js(label)}", shortName: "{escape_js(short)}", color: "{color}" }},\n'
clusters_js += "  ],\n"

# Build comments
comments_js = "  comments: [\n"
for c in comments:
    text = escape_js(c['text'][:500])  # Limit length
    comments_js += f'    {{ id: {c["id"]}, text: "{text}", cluster: {c["cluster"]}, x: {c["x"]:.4f}, y: {c["y"]:.4f} }},\n'
comments_js += "  ]\n};\n\n"

# Assemble new file
new_content = before_data + 'const clusterData = {\n' + clusters_js + comments_js + after_marker

# Write
with open('/Users/Sarah/Desktop/calgary-rezoning-map/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Wrote {len(new_content)} bytes to App.jsx")
print("Done!")

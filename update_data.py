#!/usr/bin/env python3
import csv
import re
import json

# Read CSV data
comments = []
clusters = {}
with open('/Users/Sarah/Desktop/calgary-rezoning-map/verbatim_comments_all(1).csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        comments.append({
            'id': int(row['id']),
            'text': row['text'],
            'cluster': int(row['cluster']),
            'x': float(row['x']),
            'y': float(row['y'])
        })
        cid = int(row['cluster'])
        if cid not in clusters:
            clusters[cid] = row['cluster_label']

# Define cluster colors (mapping to existing color scheme)
cluster_colors = {
    1: '#ef4444',  # Red - Strong Opposition
    2: '#dc2626',  # Dark Red - Strong Opposition Process
    3: '#f97316',  # Orange - Infrastructure Concerns
    4: '#a855f7',  # Purple - Conditional/Nuanced
    5: '#3b82f6',  # Blue - Support Housing
    6: '#22c55e',  # Green - Support Environmental
    7: '#64748b',  # Gray - Other/Unclear
}

# Generate cluster definitions
cluster_defs = []
for cid in sorted(clusters.keys()):
    label = clusters[cid]
    color = cluster_colors.get(cid, '#64748b')
    short = label.split(' – ')[-1] if ' – ' in label else label.split(' / ')[-1]
    if len(short) > 15:
        short = short[:12] + '...'
    cluster_defs.append({
        'id': cid,
        'name': label,
        'shortName': short,
        'color': color
    })

# Read App.jsx
with open('/Users/Sarah/Desktop/calgary-rezoning-map/src/App.jsx', 'r') as f:
    content = f.read()

# Replace cluster definitions
# Find the clusters array and replace it
new_clusters = json.dumps(cluster_defs, indent=2)
# Wrap in proper JS format
new_clusters_js = 'const clusters = ' + new_clusters.replace('"', "'") + ';'

# Find and replace the clusters definition (this is tricky, let's do it step by step)
# First, let's just generate the comments array
comments_js = '[\n'
for i, c in enumerate(comments[:100]):  # First 100 for testing
    text_escaped = c['text'].replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
    if len(text_escaped) > 300:
        text_escaped = text_escaped[:297] + '...'
    comments_js += f'  {{"id": {c["id"]}, "text": "{text_escaped}", "cluster": {c["cluster"]}, "x": {c["x"]:.4f}, "y": {c["y"]:.4f}}},\n'
comments_js += '  // ... more comments\n]'

print(f"Total comments in CSV: {len(comments)}")
print(f"Cluster definitions:")
for c in cluster_defs:
    print(f"  {c['id']}: {c['name']} (short: {c['shortName']}, color: {c['color']})")

print(f"\nSample comments (first 3):")
for c in comments[:3]:
    print(f"  {c['id']}: cluster={c['cluster']}, x={c['x']:.4f}, y={c['y']:.4f}")

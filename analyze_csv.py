#!/usr/bin/env python3
import csv
import re

# Read CSV data with proper encoding to handle BOM
comments = []
clusters = {}
stances = {}

with open('/Users/Sarah/Desktop/calgary-rezoning-map/verbatim_comments_all(1).csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Clean up keys (remove BOM if present)
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

total = len(comments)
print(f"Total comments: {total}")
print(f"\nCluster definitions from CSV:")
for cid in sorted(clusters.keys()):
    print(f"  Cluster {cid}: {clusters[cid]}")

print(f"\nStance breakdown:")
for stance, count in stances.items():
    print(f"  {stance}: {count} ({count/total*100:.1f}%)")

# Define colors matching the existing scheme
cluster_colors = {
    1: '#ef4444',  # Red - Strong Opposition
    2: '#dc2626',  # Darker Red
    3: '#f97316',  # Orange - Infrastructure
    4: '#a855f7',  # Purple - Conditional/Nuanced
    5: '#3b82f6',  # Blue - Support Housing
    6: '#22c55e',  # Green - Environmental
    7: '#64748b',  # Gray - Other/Unclear
}

# Build cluster definitions
cluster_defs = []
for cid in sorted(clusters.keys()):
    label = clusters[cid]
    color = cluster_colors.get(cid, '#64748b')
    # Create short name (last part after dash or slash)
    if ' – ' in label:
        short = label.split(' – ')[-1]
    elif ' / ' in label:
        short = label.split(' / ')[-1]
    else:
        short = label
    if len(short) > 18:
        short = short[:15] + '...'
    cluster_defs.append({
        'id': cid,
        'name': label,
        'shortName': short,
        'color': color
    })

print(f"\nGenerated cluster definitions:")
for c in cluster_defs:
    print(f"  {c}")

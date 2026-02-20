#!/usr/bin/env python3
"""
Update App.jsx with correct cluster data and coordinates from CSV
"""
import csv
import re
import json

def escape_js_string(s):
    """Escape a string for JavaScript"""
    s = s.replace('\\', '\\\\')
    s = s.replace('"', '\\"')
    s = s.replace("'", "\\'")  # Add this line to handle single quotes
    s = s.replace('\n', '\\n')
    s = s.replace('\r', '\\r')
    s = s.replace('\t', '\\t')
    return s

def main():
    # Read CSV data
    print("Reading CSV...")
    comments = []
    clusters = {}
    stances = {}
    
    csv_path = 'data/verbatim_comments_all.csv'
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
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
    print(f"Loaded {total} comments")
    
    # Calculate stance percentages
    oppose_pct = round(stances.get('oppose', 0) / total * 100)
    support_pct = round(stances.get('support', 0) / total * 100)
    unclear_pct = round(stances.get('unclear', 0) / total * 100)  # Use actual unclear count
    
    print(f"Stances: oppose={oppose_pct}%, support={support_pct}%, mixed={unclear_pct}%")
    
    # Cluster colors (preserve existing scheme)
    cluster_colors = {
        1: '#ef4444',  # Red
        2: '#dc2626',  # Dark red
        3: '#f97316',  # Orange
        4: '#a855f7',  # Purple (Conditional/Nuanced)
        5: '#3b82f6',  # Blue
        6: '#22c55e',  # Green
        7: '#64748b',  # Gray
    }
    
    # Build cluster definitions
    cluster_defs = []
    for cid in sorted(clusters.keys()):
        label = clusters[cid]
        color = cluster_colors.get(cid, '#64748b')
        # Create short name
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
    
    print(f"Cluster definitions:")
    for c in cluster_defs:
        print(f"  {c['id']}: {c['name']} -> {c['shortName']}")
    
    # Read App.jsx
    print("\nReading App.jsx...")
    with open('/Users/Sarah/Desktop/calgary-rezoning-map/src/App.jsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Generate new cluster definitions JavaScript
    clusters_js = "const clusterData = {\n  clusters: [\n"
    for c in cluster_defs:
        clusters_js += f"    {{ id: {c['id']}, name: \"{escape_js_string(c['name'])}\", shortName: \"{escape_js_string(c['shortName'])}\", color: \"{c['color']}\" }},\n"
    clusters_js += "  ],\n  comments: [\n"
    
    # Add all comments with new coordinates
    print(f"Adding {len(comments)} comments...")
    for i, c in enumerate(comments):
        text = escape_js_string(c['text'][:500])  # Limit text length
        clusters_js += f"    {{ id: {c['id']}, text: \"{text}\", cluster: {c['cluster']}, x: {c['x']:.4f}, y: {c['y']:.4f} }},\n"
        if (i + 1) % 500 == 0:
            print(f"  Processed {i + 1}/{len(comments)} comments...")
    
    clusters_js += "  ]\n};\n\nexport default function App() {"
    
    # Find and replace the clusterData definition in App.jsx
    # The pattern starts with "const clusterData = {" and ends before "export default function App()"
    pattern = r'const clusterData = \{[\s\S]*?\};\s*\n\s*export default function App\(\)'
    replacement = clusters_js
    
    new_content = re.sub(pattern, replacement, content)
    
    if new_content == content:
        print("WARNING: Pattern not found, trying alternative...")
        # Try alternative pattern
        pattern2 = r'const clusterData = \{[\s\S]*?comments: \[[\s\S]*?\]\s*\};'
        if re.search(pattern2, content):
            new_content = re.sub(pattern2, clusters_js.rstrip().replace('export default function App() {', ''), content)
    
    # Update stance percentages in the header
    # Find pattern like: Oppose ~15% | Support ~10% | Mixed / Conditional ~75%
    stance_pattern = r'Oppose ~\d+%.*?Support ~\d+%.*?Mixed / Conditional ~\d+%'
    stance_replacement = f'Oppose ~{oppose_pct}% · Support ~{support_pct}% · Mixed / Conditional ~{unclear_pct}%'
    new_content = re.sub(stance_pattern, stance_replacement, new_content)
    
    # Write updated file
    print("\nWriting updated App.jsx...")
    with open('/Users/Sarah/Desktop/calgary-rezoning-map/src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Done!")
    print(f"Updated {len(comments)} comments with new coordinates")
    print(f"Updated cluster labels to match CSV")
    print(f"Updated stance percentages: {oppose_pct}% oppose, {support_pct}% support, {unclear_pct}% mixed")

if __name__ == '__main__':
    main()

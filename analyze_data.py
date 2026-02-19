#!/usr/bin/env python3
import csv
import json

# Read the CSV file
comments = []
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

# Build clusters from unique cluster IDs with their labels from CSV
clusters = {}
with open('/Users/Sarah/Desktop/calgary-rezoning-map/verbatim_comments_all(1).csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        cid = int(row['cluster'])
        if cid not in clusters:
            clusters[cid] = row['cluster_label']

print("Clusters found:")
for cid, label in sorted(clusters.items()):
    print(f"  {cid}: {label}")

# Count comments per cluster
cluster_counts = {}
for c in comments:
    cid = c['cluster']
    cluster_counts[cid] = cluster_counts.get(cid, 0) + 1

print("\nComment counts per cluster:")
for cid, count in sorted(cluster_counts.items()):
    print(f"  Cluster {cid}: {count} comments")

# Calculate stance percentages
stances = {}
with open('/Users/Sarah/Desktop/calgary-rezoning-map/verbatim_comments_all(1).csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        stance = row['stance']
        stances[stance] = stances.get(stance, 0) + 1

total = sum(stances.values())
print(f"\nStance breakdown (total: {total}):")
for stance, count in stances.items():
    pct = count / total * 100
    print(f"  {stance}: {count} ({pct:.1f}%)")

#!/bin/bash
# Build and prepare for GitHub Pages deployment

echo "Building for GitHub Pages..."
npm run build

echo "Creating nojekyll file..."
touch dist/.nojekyll

echo "Build complete! Upload contents of 'dist' folder to GitHub Pages."
echo "Or enable GitHub Pages in repository settings to deploy from 'main' branch '/dist' folder."

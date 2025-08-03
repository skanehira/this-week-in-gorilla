# OGP Generation Details

## Overview
The site automatically generates Open Graph Protocol (OGP) images for social media sharing during the build process.

## Key Components

### ogp-generator.ts
- Main generation logic using Satori (JSX to SVG) and resvg (SVG to PNG)
- Zenn-style design with light blue background (#E6F2FF) and white card
- Loads Noto Sans JP font dynamically
- Supports book cover images from URLs

### Configuration in config.mts
- `buildEnd` hook: Generates all OGP images after build
- `transformHead` hook: Adds OGP meta tags dynamically
- Content-based hashing for cache invalidation
- Regenerates images when content changes

## Image Generation Flow
1. Scans all markdown files (excluding index.md)
2. Extracts title from frontmatter or first # header
3. Generates hash from filepath + content
4. Checks if image already exists with same hash
5. If changed, deletes old image and generates new one
6. Saves to `.vitepress/cache/ogp/[hash].png`
7. Copies to `.vitepress/dist/ogp/` during build

## Book Image Support
- Detects books by:
  - Location in `/books/` directory
  - Presence of bookUrl, isbn, bookTitle in frontmatter
- Fetches external images as data URLs to avoid CORS
- Uses profile.jpg for author avatar

## Cache Strategy
- GitHub Actions caches entire `.vitepress/cache` directory
- Cache key: `${{ runner.os }}-vitepress-cache-v1`
- Persistent across commits since content changes trigger regeneration
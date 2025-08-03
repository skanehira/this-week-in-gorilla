# Project Overview

## Project Name
This Week in Gorilla

## Purpose
A VitePress-based personal knowledge repository and documentation site that stores information about topics of personal interest. The site is deployed to GitHub Pages and contains:
- Technical articles
- Weekly notes organized by year
- Book reviews and reading notes
- Development camp summaries
- Personal reflections/thoughts

## Tech Stack
- **Static Site Generator**: VitePress 1.5.0
- **Language**: TypeScript (strict mode enabled)
- **Package Manager**: pnpm 9.14.4
- **Testing Framework**: Vitest 3.2.4
- **Build Tools**: Vite
- **Key Libraries**:
  - markdown-it-footnote (footnote support)
  - satori, sharp, @resvg/resvg-js (OGP image generation)
  - gray-matter (frontmatter parsing)

## Development Environment
- Platform: Darwin (macOS)
- Node.js with TypeScript
- Git for version control

## Deployment
- GitHub Pages via GitHub Actions
- Automatic deployment on push to main branch
- Build output: `.vitepress/dist/`
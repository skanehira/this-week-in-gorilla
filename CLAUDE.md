# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
This is a VitePress-based documentation site called "This Week in Gorilla" that serves as a personal knowledge repository. The site is deployed to GitHub Pages and contains articles, notes, book reviews, and development camp summaries.

## Development Commands

### Running the development server
```bash
pnpm docs:dev
```

### Building the site for production
```bash
pnpm docs:build
```

### Previewing the production build locally
```bash
pnpm docs:preview
```

### Installing dependencies
```bash
pnpm install
```

## Architecture

### VitePress Configuration
The site configuration is in `.vitepress/config.mts`. Key features:
- Custom sidebar generation that automatically discovers markdown files in subdirectories
- Japanese UI customization (lastUpdatedText, navigation)
- Markdown footnote support via `markdown-it-footnote` plugin
- Local search provider
- GitHub edit links for all pages

### Content Structure
- `/articles/` - Technical articles
- `/notes/YYYY/` - Monthly notes organized by year and week
- `/books/` - Book reviews and reading notes
- `/camps/` - Development camp summaries
- `/thoughts/` - Personal reflections

### Deployment
- GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically deploys to GitHub Pages on push to main branch
- Uses pnpm for dependency management
- Build output goes to `.vitepress/dist/`

### Key Dependencies
- VitePress 1.5.0 - Static site generator
- markdown-it-footnote - Adds footnote support to markdown
- pnpm - Package manager (version specified in package.json)
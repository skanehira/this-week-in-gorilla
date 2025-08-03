# Project Structure

## Directory Layout
```
.
├── .vitepress/         # VitePress configuration and custom code
│   ├── config.mts      # Main VitePress configuration
│   ├── ogp-generator.ts # OGP image generation logic
│   ├── ogp-generator.test.ts # Tests for OGP generator
│   └── profile.jpg     # User avatar for OGP images
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions deployment workflow
├── articles/           # Technical articles
├── books/             # Book reviews and reading notes
├── camps/             # Development camp summaries
├── notes/             # Weekly notes organized by year
│   └── YYYY/          # Year subdirectories
│       └── MMDD.md    # Week notes (month + week number)
├── thoughts/          # Personal reflections
├── assets/            # Static assets and images
├── public/            # Public files served directly
├── package.json       # Project dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── vitest.config.ts   # Vitest test configuration
├── CLAUDE.md          # Instructions for Claude AI
└── index.md           # Site homepage

## Key Features

### Automatic Sidebar Generation
- Config automatically discovers markdown files in subdirectories
- Creates hierarchical navigation structure

### OGP Image Generation
- Automatically generates Open Graph images during build
- Uses content-based hashing for cache invalidation
- Fetches book covers from URLs or APIs
- Caches generated images in `.vitepress/cache/ogp/`
- Copies to `.vitepress/dist/ogp/` during build

### Content Organization
- Markdown files with optional frontmatter
- Japanese UI localization
- GitHub edit links for all pages
- Local search functionality
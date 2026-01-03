<template>
  <div class="article-card">
    <div class="card-image">
      <img 
        :src="article.ogpImage || '/this-week-in-gorilla/logo.png'" 
        :alt="article.title"
        loading="lazy"
      />
    </div>
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">{{ article.title }}</h3>
        <div class="card-meta">
          <span class="card-date">{{ formatDate(article.date) }}</span>
        </div>
      </div>
      <p class="card-description">{{ article.description || extractDescription(article.content) }}</p>
      <div class="card-footer">
        <a :href="article.link" class="read-more-button">
          もっと読む
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.44 8.5H2.75a.75.75 0 0 1 0-1.5h8.69L8.22 4.03a.75.75 0 0 1 0-1.06Z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Article {
  title: string
  link: string
  date: string
  description?: string
  content?: string
  ogpImage?: string
}

defineProps<{
  article: Article
}>()

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function extractDescription(content?: string): string {
  if (!content) return ''
  
  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---/, '')
  
  // Remove markdown headers
  const withoutHeaders = withoutFrontmatter.replace(/^#+\s+.*/gm, '')
  
  // Remove markdown formatting
  const plainText = withoutHeaders
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
  
  // Get first paragraph
  const firstParagraph = plainText.split('\n\n')[0]
  
  // Limit to 120 characters
  return firstParagraph.length > 120 
    ? firstParagraph.substring(0, 120) + '...'
    : firstParagraph
}
</script>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--vp-c-bg-alt);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-header {
  margin-bottom: 12px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 8px 0;
  color: var(--vp-c-text-1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.card-date {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}


.card-description {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0 0 20px 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
}

.read-more-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-brand);
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid var(--vp-c-brand);
  border-radius: 6px;
  transition: all 0.2s ease;
  background: transparent;
}

.read-more-button:hover {
  background: var(--vp-c-brand);
  color: var(--vp-c-bg);
  transform: translateX(2px);
}

.read-more-button svg {
  transition: transform 0.2s ease;
}

.read-more-button:hover svg {
  transform: translateX(2px);
}

/* Dark mode optimizations */
.dark .article-card {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

.dark .card-image {
  background: var(--vp-c-bg-alt);
}

/* Responsive design */
@media (max-width: 768px) {
  .card-content {
    padding: 16px;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .card-image {
    height: 160px;
  }
  
  .card-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
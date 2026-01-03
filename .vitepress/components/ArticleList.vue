<template>
  <div class="article-list">
    <!-- Header section -->
    <div class="list-header">
      <h1 class="list-title">{{ title }}</h1>
      <p v-if="description" class="list-description">{{ description }}</p>
    </div>

    <div v-if="filteredArticles.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>記事が見つかりません</h3>
      <p>選択したフィルタに一致する記事がありません。</p>
    </div>

    <div v-else class="articles-grid">
      <ArticleCard 
        v-for="article in paginatedArticles" 
        :key="article.link" 
        :article="article"
      />
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="currentPage = Math.max(1, currentPage - 1)"
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        ← 前へ
      </button>
      
      <div class="pagination-info">
        {{ currentPage }} / {{ totalPages }}
      </div>
      
      <button 
        @click="currentPage = Math.min(totalPages, currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="pagination-button"
      >
        次へ →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ArticleCard from './ArticleCard.vue'

interface Article {
  title: string
  link: string
  date: string
  description?: string
  content?: string
  ogpImage?: string
}

const props = defineProps<{
  title: string
  description?: string
  articles: Article[]
  itemsPerPage?: number
}>()

// Reactive data
const sortOrder = ref<'asc' | 'desc'>('desc')
const currentPage = ref(1)
const itemsPerPage = props.itemsPerPage || 12

// Computed properties
const filteredArticles = computed(() => {
  let filtered = [...props.articles]
  
  // Sort by date
  filtered.sort((a, b) => {
    const dateA = new Date(a.date || '1970-01-01').getTime()
    const dateB = new Date(b.date || '1970-01-01').getTime()
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
  })
  
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / itemsPerPage)
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredArticles.value.slice(start, end)
})

// Watch for filter changes to reset page
watch([sortOrder], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.article-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.list-header {
  margin-bottom: 40px;
  text-align: center;
}

.list-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--vp-c-text-1);
  background: linear-gradient(135deg, var(--vp-c-brand), var(--vp-c-brand-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.list-description {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 24px;
  line-height: 1.6;
}

.list-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 20px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
}

.article-count {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.category-filter,
.sort-filter {
  padding: 6px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.category-filter:hover,
.sort-filter:hover {
  border-color: var(--vp-c-brand);
}

.category-filter:focus,
.sort-filter:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--vp-c-text-2);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.pagination-button {
  padding: 10px 20px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.pagination-button:hover:not(:disabled) {
  background: var(--vp-c-brand);
  color: var(--vp-c-bg);
  border-color: var(--vp-c-brand);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

/* Responsive design */
@media (max-width: 768px) {
  .article-list {
    padding: 16px;
  }
  
  .list-title {
    font-size: 2rem;
  }
  
  .list-stats {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .filter-controls {
    justify-content: center;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 12px;
  }
  
  .pagination-button {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .list-title {
    font-size: 1.75rem;
  }
  
  .filter-controls {
    flex-direction: column;
    width: 100%;
  }
  
  .category-filter,
  .sort-filter {
    width: 100%;
  }
}

/* Animation for grid items */
.articles-grid > * {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

.articles-grid > *:nth-child(1) { animation-delay: 0.1s; }
.articles-grid > *:nth-child(2) { animation-delay: 0.2s; }
.articles-grid > *:nth-child(3) { animation-delay: 0.3s; }
.articles-grid > *:nth-child(4) { animation-delay: 0.4s; }
.articles-grid > *:nth-child(5) { animation-delay: 0.5s; }
.articles-grid > *:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

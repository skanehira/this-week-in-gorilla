---
title: 技術記事
layout: page
---

<script setup>
import ArticleList from '../.vitepress/components/ArticleList.vue'
import articles from './articles-data.json'

</script>

<ArticleList 
  title="技術記事" 
  description="プログラミングや技術に関する記事を書いています。"
  :articles="articles" 
  :items-per-page="12" 
/>

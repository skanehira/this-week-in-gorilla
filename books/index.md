---
title: 読んだ本
layout: page
---

<script setup>
import ArticleList from '../.vitepress/components/ArticleList.vue'
import articles from './books-data.json'

</script>

<ArticleList 
  title="読んだ本" 
  description="読んだ本の感想やレビューをまとめています。"
  :articles="articles" 
  :items-per-page="12" 
/>

---
title: メモ
layout: page
---

<script setup>
import ArticleList from '../.vitepress/components/ArticleList.vue'

const articles = []
</script>

<ArticleList 
  title="メモ" 
  description="日々の学習メモや気づきを残しています。"
  :articles="articles" 
  :items-per-page="12" 
/>

<script setup>
import ArticlDetail from '@/components/ArticlDetail.vue'

const width = 400
const title = '快拿去骚扰你朋友哈哈哈'
const contentDetail = '3.26有病表情包'
const labels = ['#适合发给男朋友的表情包', '#奇奇怪怪表情包', '#搞笑表情包分享', '#有趣的表情包']
const date = '12-2'
const location = '北极'
</script>

<template>
  <div id="app">
    <ArticlDetail :detail="{
      width,
      title,
      contentDetail,
      labels,
      date,
      location
    }" />
  </div>
</template>

<style scoped>
</style>

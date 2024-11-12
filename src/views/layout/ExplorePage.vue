<script setup>
import ArticleItem  from '@/components/ArticleItem.vue'
import {ref} from 'vue'
const item= ref({
  cover: 'https://sns-webpic-qc.xhscdn.com/202411120903/e887c7f50f43d71abfeaead743b63305/1040g0083194nee4154005o9j8tenvbs4bo9kq0g!nc_n_webp_mw_1',
  title: '西安这个叫什么？？好吃死了他马的。。。',
  avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/6710e4dcc91bf9b208a86138.jpg?imageView2/2/w/60/format/webp|imageMogr2/strip',
  id: 'Max',
  loves: 289
})
</script>

<template>
  <ArticleItem :item="item"></ArticleItem>
</template>

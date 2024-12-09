<script setup>
import Carousel from '@/components/SlideShow.vue'
const imgUrl = ['http://gips3.baidu.com/it/u=1821127123,1149655687&fm=3028&app=3028&f=JPEG&fmt=auto?w=720&h=1280', 'http://gips0.baidu.com/it/u=3602773692,1512483864&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280', 'http://gips1.baidu.com/it/u=3874647369,3220417986&fm=3028&app=3028&f=JPEG&fmt=auto?w=720&h=1280']
</script>

<template>
  <div id="app">
    <Carousel
      :detail="{
        height: 300,
        width: 300,
        imgUrl
      }"
    />
  </div>
</template>

<style scoped></style>

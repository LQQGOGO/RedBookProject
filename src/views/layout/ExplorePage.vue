<script setup>
import { ref } from 'vue'
import RedBookWaterfall from './RedBookWaterfall.vue'
import ArticleItem from '@/components/ArticleItem.vue'
import { getItemList } from '@/api/itemList'
import { useItemStore } from '@/stores/itemList'

const itemStore = useItemStore()
// const fContainerRef = ref(null)
const column = ref(5)

//调用接口获得新数据
const getData = async (page, pageSize) => {
  const response = await getItemList(page, pageSize)
  if (!response || !response.data) {
    throw new Error('接口返回的数据格式错误')
  }
  const newData = response.data.map(i => ({
    id: i.note_id,
    url: i.cover,
    width: i.width,
    height: i.height,
    title: i.title,
    author: i.nickname,
    likes: i.liked_count,
    avatar: i.avatar
  }))

  itemStore.appendNotes(newData) // 追加到全局状态
  return newData
}

//定义导航栏数据
const navs = [
  '推荐',
  '穿搭',
  '美食',
  '彩妆',
  '影视',
  '职场',
  '情感',
  '家居',
  '游戏',
  '旅行',
  '健身'
]
</script>

<template>
  <div class="app">
    <div class="nav">
      <button
        v-for="nav in navs"
        :key="nav"
        :class="{ active: nav === '推荐' }"
      >
        {{ nav }}
      </button>
    </div>
    <div class="container">
      <KeepAlive>
        <RedBookWaterfall
          :bottom="20"
          :column="column"
          :gap="20"
          :page-size="20"
          :request="getData"
          :enter-size="column * 2"
          ref="flistRef"
        >
          <template #item="{ item, imageHeight, width }">
            <ArticleItem
              :detail="{
                imageHeight,
                width,
                title: item.title,
                author: item.author,
                likes: item.likes,
                cover: item.url,
                avatar: item.avatar
              }"
            >
            </ArticleItem>
          </template>
        </RedBookWaterfall>
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
button {
  font-size: 15px;
  height: 40px;
  padding: 10px 20px;
  margin-bottom: 15px;
  cursor: pointer;
  border-radius: 20px;
  background-color: #fff;
}
button:hover {
  background-color: #f7f7f7;
}
.active {
  background-color: #f7f7f7;
  font-weight: bold;
}
</style>

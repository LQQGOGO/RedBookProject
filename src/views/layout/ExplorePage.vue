<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import RedBookWaterfall from './RedBookWaterfall.vue'
import ArticleItem from '@/components/ArticleItem.vue'
import { getItemList } from '@/api/itemList'
import { useItemStore } from '@/stores/itemList'

const itemStore = useItemStore()
const fContainerRef = ref(null)
const column = ref(5)

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

// 恢复滚动位置
onMounted(() => {
  if (fContainerRef.value) {
    fContainerRef.value.scrollTop = itemStore.scrollTop // 恢复滚动位置
  }
})

// 保存滚动位置
const saveScrollPosition = () => {
  if (fContainerRef.value) {
    itemStore.saveScrollTop(fContainerRef.value.scrollTop)
  }
}

// 页面卸载时保存状态
onBeforeUnmount(() => {
  saveScrollPosition()
})

</script>

<template>
  <div class="app">
    <div class="container" ref="fContainerRef">
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
                avatar: item.avatar,
              }"
            >
            </ArticleItem>
          </template>
        </RedBookWaterfall>
      </KeepAlive>
    </div>
  </div>
</template>

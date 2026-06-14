<script setup>
import { computed, ref, onBeforeMount, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import RedBookWaterfall from '@/views/layout/RedBookWaterfall.vue'
import ArticleItem from '@/components/ArticleItem.vue'
import { getItemList } from '@/api/itemList'
import { useItemStore } from '@/stores/itemList'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const searchInput = ref(route.query.q || '')
const column = ref(5)
const flistRef = ref(null)
const itemStore = useItemStore()
const userStore = useUserStore()
const searchKey = computed(() => `search-${searchInput.value}`)

const getData = async (page, pageSize) => {
  console.log('searchInput', searchInput.value)
  const response = await getItemList({
    title: searchInput.value,
    page,
    pageSize,
    userId: userStore.userId
  })
  if (!response || !response.data) {
    throw new Error('接口返回的数据格式错误')
  }

  const newData = response.data.map(i => ({
    id: i.id,
    url: i.cover,
    width: i.cover_width,
    height: i.cover_height,
    title: i.title,
    author: i.nickname,
    likes: i.like_count,
    isLiked: i.liked,
    avatar: i.avatar
  }))
  console.log('newData', newData)

  itemStore.appendNotes(newData) // 追加到全局状态
  return newData
}

onBeforeMount(() => {
  itemStore.clearData()
})

onUnmounted(() => {
  itemStore.clearData()
})

watch(
  () => route.query.q,
  q => {
    searchInput.value = q || ''
    itemStore.clearData()
  }
)

</script>

<template>
  <div class="search-container">
    <KeepAlive>
      <RedBookWaterfall
        :column="column"
        :gap="20"
        :page-size="20"
        :request="getData"
        :enter-size="column * 2"
        :channel="searchKey"
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
              isLiked: item.isLiked,
              cover: item.url,
              avatar: item.avatar,
              id: item.id
            }"
          >
          </ArticleItem>
        </template>
      </RedBookWaterfall>
    </KeepAlive>
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
  height: 100%;
}
</style>

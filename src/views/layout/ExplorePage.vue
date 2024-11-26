<script setup>
import { ref, onMounted } from 'vue'
import RedBookWaterfall from './RedBookWaterfall.vue'
import ArticleItem from '@/components/ArticleItem.vue'
import { getItemList } from '@/api/itemList'
// import data1 from "@/config/data1.json"
// import data2 from "@/config/data2.json"

const colorArr = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399']
const fContainerRef = ref(null)
const column = ref(4)

// const list1 = data1.data.items.map((i) => ({
//   id: i.id,
//   url: i.note_card.cover.url_pre,
//   width: i.note_card.cover.width,
//   height: i.note_card.cover.height,
//   title: i.note_card.display_title,
//   author: i.note_card.user.nickname,
//   likes: i.note_card.interact_info.liked_count,
//   avatar: i.note_card.user.avatar,
// }));

// const list2 = data2.data.items.map((i) => ({
//   id: i.id,
//   url: i.note_card.cover.url_pre,
//   width: i.note_card.cover.width,
//   height: i.note_card.cover.height,
//   title: i.note_card.display_title,
//   author: i.note_card.user.nickname,
//   likes: i.note_card.interact_info.liked_count,
//   avatar: i.note_card.user.avatar,
// }));
// const list = [...list1, ...list2]

//调用接口，获得数据
const list = ref([])
onMounted(async () => {
  const response = await getItemList()
  if (!response || !response.data) {
    throw new Error('接口返回的数据格式错误')
  }

  list.value = response.data.map(i => ({
    id: i.note_id,
    url: i.cover,
    width: i.width,
    height: i.height,
    title: i.title,
    author: i.nickname,
    likes: i.liked_count,
    avatar: i.avatar
  }))
})

//将数据进行分页处理
const getData = (page, pageSize) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        list.value.slice(
          (page - 1) * pageSize,
          (page - 1) * pageSize + pageSize
        )
      )
    }, 1000)
  })
}
</script>

<template>
  <div class="app">
    <div class="container" ref="fContainerRef">
      <RedBookWaterfall
        :bottom="20"
        :column="column"
        :gap="10"
        :page-size="20"
        :request="getData"
      >
        <template #item="{ item, index, imageHeight }">
          <ArticleItem
            :detail="{
              imageHeight,
              title: item.title,
              author: item.author,
              likes: item.likes,
              cover: item.url,
              avatar: item.avatar,
              //这里使用颜色盒子代替图片
              bgColor: colorArr[index % (colorArr.length - 1)]
            }"
          >
          </ArticleItem>
        </template>
      </RedBookWaterfall>
    </div>
  </div>
</template>

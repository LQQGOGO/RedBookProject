<script setup>
import { ref } from 'vue'
import LoveWaterfall from './LoveWaterfall.vue'
import ArticleItem from '@/components/ArticleItem.vue'
import { getLoveList } from '@/api/loveList'

const column = ref(5)

//调用接口获得新数据
const getData = async () => {
  const response = await getLoveList()

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
    isLiked: i.liked,
    avatar: i.avatar
  }))
  return newData
}
</script>

<template>
  <div class="userinfo-container">
    <img src="../../assets/avatar.jpg" class="avatar" />
    <div class="container">
      <div class="nickname">带钱跑路</div>
      <div class="userid">小红书号：3421788149322</div>
      <div class="readme">还没有简介</div>
      <div class="loveinfo">
        <span class="num">2</span>关注 <span class="num">1</span>粉丝
        <span class="num">0</span>获赞与收藏
      </div>
    </div>
  </div>

  <div class="title">点赞内容</div>
  <div class="love-container">
    <LoveWaterfall
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
            isLiked: item.isLiked,
            cover: item.url,
            avatar: item.avatar,
            id: item.id
          }"
        >
        </ArticleItem>
      </template>
    </LoveWaterfall>
  </div>
</template>

<style scoped>
.userinfo-container {
  margin: 0 auto;
  height: 200px;
  width: 600px;
  transform: translate(-200px);
}
.avatar {
  height: 200px;
  width: 200px;
  border-radius: 50%;
}
.container {
  float: right;
  width: 350px;
}
.nickname {
  font-size: 30px;
  color: black;
  font-weight: bold;
  padding: 5px;
}
.userid {
  font-size: 15px;
  padding: 5px;
}
.readme {
  font-size: 20px;
  color: black;
  padding: 15px 5px 15px 5px;
}
.loveinfo {
  font-size: 20px;
  padding: 5px;
}
.num {
  padding: 5px;
  color: black;
}
.title {
  margin: 30px auto;
  text-align: center;
  height: 40px;
  width: 80px;
  line-height: 40px;
  background-color: #f7f7f7;
  font-size: 15px;
  font-weight: bold;
  color: black;
  border-radius: 20px;
  transform: translate(-200px);
}
.love-container {
  border-top: 2px solid #f7f7f7;
  padding-top: 20px;
}
</style>

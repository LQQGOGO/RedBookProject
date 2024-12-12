<script setup>
import { ref } from 'vue'
//定义导航栏数据
const channels = [
  '评论和@',
  '赞和收藏',
  '新增关注'
]
const currentChannel = ref('评论和@')

//切换channel方法
const switchChannel = (nav) => {
  currentChannel.value = nav
}

</script>

<template>
  <div>
    <div class="channel">
      <button
        v-for="(channel, index) in channels"
        :key="index"
        :class="{ active: currentChannel === channel }"
        @click="switchChannel(channel)"
      >
        {{ channel }}
      </button>
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

<script setup>
import {defineProps} from 'vue'
const props = defineProps({
  item: Object
})
console.log(props.item);

</script>
<template>
  <div class="article">
    <div class="cover">
      <img :src="item.cover" alt="">
    </div>
    <div class="footer">
      <div class="title">{{ item.title }}</div>
      <div>
        <div class="user">
          <img :src="item.avatar" alt="">
          {{ item.id }}
        </div>
        <div class="loves">
          <svg t="1731402492092" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4561" width="200" height="200"><path d="M171.712 571.648l0.352 0.32 287.904 252.8a64 64 0 0 0 82.912 1.344l296.832-244.544a215.584 215.584 0 1 0-301.824-300.576L512 316.672l-25.888-35.616a215.584 215.584 0 1 0-314.4 290.624zM32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512l-295.36 243.392a128 128 0 0 1-165.888-2.592L129.984 620.16A278.976 278.976 0 0 1 32 407.584z" fill="#000000" p-id="4562"></path></svg>
          {{ item.loves }}
        </div>
      </div>
    </div>

</div>
</template>

<style scoped>
.cover img {
  width: 300px;
  height: auto;
  border-radius: 20px;
}
.title {
  width: 300px;
  font-size: 18px;
  padding: 10px;
  color: black;
}
.footer {
  width: 300px;
}
.user {
  float: left;
  font-size: 18px;
  padding: 10px;
}
.user img {
  height: 25px;
  width: 25px;
  border-radius: 50%;
}
.loves {
  float: right;
  font-size: 18px;
  line-height: 50px;
}
.loves svg {
  width: 18px;
  height: 18px;
}
.loves svg path {
  fill: #626262;
}
</style>

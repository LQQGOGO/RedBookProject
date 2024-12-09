<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const props = defineProps({
  detail: {
    type: Object,
    required: true
  }
})
console.log(props.detail)
</script>

<template>
  <div class="app">
    <div class="swiper-container">
      <swiper :slides-per-view="1" loop>
        <swiper-slide v-for="(item, index) in detail.imgUrl" :key="index">
          <img
            :src="item"
          />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<style scoped>
.app {
  height: v-bind("`${props.detail.height}px`");
  width: v-bind("`${props.detail.width}px`");
  background-color: pink;
}
img {
  height: v-bind("`${props.detail.height}px`");
  width: v-bind("`${props.detail.width}px`");
}
</style>



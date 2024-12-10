<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const props = defineProps({
  detail: {
    type: Object,
    required: true
  }
})

const modules = [Navigation, Pagination]
</script>

<template>
  <div class="app">
    <div class="swiper-container">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        loop
        navigation
        :pagination="{ clickable: true }"
      >
        <!-- Slide 内容 -->
        <swiper-slide v-for="(item, index) in detail.imgUrl" :key="index">
          <img :src="item" />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<style scoped>
.app {
  height: v-bind('`${props.detail.height}px`');
  width: v-bind('`${props.detail.width}px`');
}
img {
  height: v-bind('`${props.detail.height}px`');
  width: v-bind('`${props.detail.width}px`');
  transition: all 0.2s;
}
/* 修改分页器样式 */
:deep(.swiper-pagination) {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 10;
}

:deep(.swiper-pagination-bullet) {
  background: black;
  opacity: 0.6;
  width: 8px;
  height: 8px;
  margin: 0 5px;
  border-radius: 50%;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
}

/* 修改导航按钮样式 */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  color: black;
  width: 40px;
  height: 40px;
  top: 50%;
  transform: translateY(-50%);
}

:deep(.swiper-button-prev) {
  left: 10px;
}

:deep(.swiper-button-next) {
  right: 10px;
}
</style>

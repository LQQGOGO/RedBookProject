<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import { ref } from 'vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const props = defineProps({
  detail: {
    type: Object,
    required: true
  }
})

// 定义当前图片索引
const currentSlide = ref(0)

const swiperOptions = {
  modules: [Navigation, Pagination],
  slidesPerView: 1,
  loop: true,
  navigation: true,
  pagination: { clickable: true },
  onSlideChange: swiper => {
    currentSlide.value = swiper.realIndex // 更新当前幻灯片索引
  }
}
</script>

<template>
  <div class="app">
    <div v-if="detail.mediaType === 1" class="video-container">
      <video 
        :src="detail.imgUrl[0]" 
        controls 
        class="video"
      ></video>
    </div>
    <div v-else class="swiper-container">
      <swiper v-bind="swiperOptions">
        <!-- Slide 内容 -->
        <swiper-slide v-for="(item, index) in detail.imgUrl" :key="index">
          <img :src="item" />
        </swiper-slide>

        <!-- 图片进度显示 -->
        <div class="swiper-fraction">
          {{ currentSlide + 1 }} / {{ detail.imgUrl.length }}
        </div>
      </swiper>
    </div>
  </div>
</template>

<style scoped>
.app {
  height: v-bind('`${props.detail.height}px`');
  width: v-bind('`${props.detail.width}px`');
}

/* 视频容器样式 */
.video-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}

video {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

img {
  height: v-bind('`${props.detail.height}px`');
  width: v-bind('`${props.detail.width}px`');
  transition: all 0.2s;
}

/* 修改分页器样式 */
:deep(.swiper-pagination),
:deep(.swiper-button-prev),
:deep(.swiper-button-next),
.swiper-fraction {
  opacity: 0; /* 初始隐藏 */
  transition: opacity 0.3s ease;
}

.swiper-container:hover :deep(.swiper-pagination),
.swiper-container:hover :deep(.swiper-button-prev),
.swiper-container:hover :deep(.swiper-button-next),
.swiper-container:hover .swiper-fraction {
  opacity: 1; /* 鼠标经过时显示 */
}

/* 修改分页器具体样式 */
:deep(.swiper-pagination) {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 10;
}

:deep(.swiper-pagination-bullet) {
  background: white;
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
  color: transparent; /* 隐藏默认箭头颜色 */
  width: 40px;
  height: 40px;
  background-color: rgba(128, 128, 128, 0.5); /* 灰色背景，50%透明度 */
  border-radius: 20px;
  top: 50%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-50%) scale(0.8); /* 初始缩小效果 */
  transition:
    transform 0.5s ease,
    opacity 0.3s ease; /* 添加动画效果 */
}

/* 动画：按钮从两侧移动到中间位置 */
.swiper-container:hover :deep(.swiper-button-prev) {
  transform: translateY(-50%) translateX(0) scale(1); /* 回到原位并放大到正常大小 */
  left: 10px;
}

.swiper-container:hover :deep(.swiper-button-next) {
  transform: translateY(-50%) translateX(0) scale(1); /* 回到原位并放大到正常大小 */
  right: 10px;
}

/* 初始状态：按钮隐藏在两侧 */
:deep(.swiper-button-prev) {
  transform: translateY(-50%) translateX(-50px) scale(0.8); /* 左侧隐藏并缩小 */
}

:deep(.swiper-button-next) {
  transform: translateY(-50%) translateX(50px) scale(0.8); /* 右侧隐藏并缩小 */
}

/* 修改按钮中箭头样式 */
:deep(.swiper-button-prev)::after,
:deep(.swiper-button-next)::after {
  font-size: 18px; /* 修改箭头大小 */
  color: white; /* 箭头颜色 */
}

/* 右上角分数样式 */
.swiper-fraction {
  position: absolute;
  top: 15px;
  right: 20px;
  background-color: rgba(128, 128, 128, 0.5); /* 半透明背景 */
  color: white; /* 字体颜色 */
  padding: 5px 10px;
  border-radius: 17px;
  font-size: 14px;
  z-index: 100;
}
</style>

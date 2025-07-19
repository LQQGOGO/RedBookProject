<script setup>
import { defineProps, ref } from 'vue'
import { useRouter } from 'vue-router'
// import { addLike, removeLike } from '@/api/addLike'

const props = defineProps({
  detail: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const articleDetail = () => {
  router.push(`/explore/${props.detail.id}`)
}

// const isLoved = ref(props.detail.isLiked)
const loveCount = ref(props.detail.likes)
//改变点赞状态
// const addLikeStatus = async id => {
//   if (isLoved.value == 0) {
//     isLoved.value = 1
//     loveCount.value += 1
//     await addLike(id)
//   } else {
//     isLoved.value = 0
//     loveCount.value = Math.max(0, loveCount.value - 1)
//     await addLike(id)
//   }
// }
</script>
<template>
  <div class="article">
    <div class="cover" @click="articleDetail()">
      <img
        :src="detail.cover"
        :style="{ height: `${detail.imageHeight}px` }"
        alt=""
      />
    </div>
    <div class="footer">
      <div class="title" @click="articleDetail()">{{ detail.title }}</div>
      <div class="nickname">
        <div class="user">
          <img :src="detail.avatar" alt="" />
          {{ detail.author }}
        </div>
        <div class="loves">
          <!-- <svg
            v-if="isLoved"
            t="1733319880680"
            class="icon loved"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4699"
            width="200"
            height="200"
          >
            <path
              d="M512 901.746939c-13.583673 0-26.122449-4.179592-37.093878-13.061225-8.881633-7.314286-225.697959-175.020408-312.424489-311.379592C133.746939 532.37551 94.040816 471.24898 94.040816 384.522449c0-144.718367 108.146939-262.269388 240.326531-262.269388 67.395918 0 131.657143 30.82449 177.632653 84.636735 45.453061-54.334694 109.191837-84.636735 177.110204-84.636735 132.702041 0 240.326531 117.55102 240.326531 262.269388 0 85.159184-37.093878 143.673469-67.395919 191.216327l-1.044898 1.567346c-86.726531 136.359184-303.542857 304.587755-312.424489 311.379592-10.44898 8.359184-22.987755 13.061224-36.571429 13.061225z"
              fill="#f7f7f7"
              p-id="4700"
            ></path>
          </svg> -->
          <svg
            t="1733319850928"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4551"
            width="200"
            height="200"
          >
            <path
              d="M707.392 93.355c-77.264 0-149.104 38.759-196.389 102.673-47.258-63.929-119.083-102.673-196.389-102.673-139.281 0-252.596 123.888-252.596 276.181 0 90.853 40.585 154.588 73.209 205.797 94.816 148.743 333.217 333.849 343.314 341.653 9.727 7.52 21.1 11.282 32.447 11.282 11.373 0 22.73-3.761 32.447-11.282 10.11-7.804 248.524-192.91 343.313-341.653 32.64-51.209 73.238-114.944 73.238-205.797-0.001-152.292-113.316-276.181-252.596-276.181zM840.628 540.182c-90.254 141.629-329.64 326.614-329.64 326.614s-239.359-184.986-329.641-326.614c-33.296-52.287-63.11-101.983-63.11-170.647 0-118.568 87.912-214.725 196.376-214.725 80.155 0 148.967 52.588 179.494 127.875l0-0.375 0.082 0c2.274 7.851 8.905 13.575 16.798 13.575 7.921 0 14.552-5.723 16.812-13.575l0.232 0c30.597-75.062 99.313-127.499 179.359-127.499 108.438 0 196.376 96.157 196.376 214.725 0 68.663-29.816 118.359-63.14 170.647z"
              fill="#A9B7B7"
              p-id="4552"
            ></path>
          </svg>
          {{ loveCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cover {
  position: relative;
  display: inline-block;
  width: 100%; /* 根据需求调整 */
  border-radius: 20px;
  overflow: hidden;
}

.cover img {
  width: 100%;
  border-radius: 20px; /* 图片圆角 */
  transition: transform 0.3s ease; /* 悬停时图片缩放效果 */
}

.cover::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 20px;
  transition: background-color 0.3s ease;
}

.cover:hover::after {
  background-color: rgba(0, 0, 0, 0.3);
}
.title {
  width: 100%;
  font-size: 18px;
  padding: 10px;
  color: black;
}
.nickname {
  height: 30px;
}
.footer {
  width: 100%;
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
.icon {
  width: 18px;
  height: 18px;
}
.icon path {
  fill: #626262;
}
.loved path {
  fill: red;
}
</style>

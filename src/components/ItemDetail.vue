<script setup>
import { ref, onMounted, onUnmounted} from 'vue'
import { useRoute } from 'vue-router'
import SlideShow from './SlideShow.vue'
import ArticlDetail from './ArticlDetail.vue'
import CommentContainer from '@/components/CommentContainer.vue'
import { debounce } from '@/utils/tools'
import { getItemDetail } from '@/api/itemDetail'
import { addLike, removeLike, addCollect, removeCollect } from '@/api/addLike'
import { didLiked, didCollected} from '@/api/user'
import CommentInput from '@/components/CommentInput.vue'
// import { getCommentList } from '@/api/comment'

//通过路径获得笔记id
const route = useRoute()
const articleId = route.params.id
// console.log(articleId)

//笔记数据
const imgUrl = ref([])
const mediaType = ref(0)
const title = ref('')
const contentDetail = ref('')
const labels = [
  '#适合发给男朋友的表情包',
  '#奇奇怪怪表情包',
  '#搞笑表情包分享',
  '#有趣的表情包'
]
const avatar = ref('')
const author = ref('')
const date = '12-2'
const location = '北极'
const detailWidth = ref()

const slideShow = ref(null)
const slideHeight = ref()
const slideWidth = ref()

const commentHeight = ref()
const commentContainer = ref(null)
const articlDetail = ref(null)
const detailContainer = ref(null)

const isLoved = ref(false)
const loveCount = ref()
const isCollected = ref(false)
const collectCount = ref(0)

//通过笔记id获得笔记详情
const getDetail = async id => {
  const response = await getItemDetail(id)
  const didLikedResponse = await didLiked(id)
  const didCollectedResponse = await didCollected(id)
  console.log('response', response)
  const media_urls = JSON.parse(response.data.data.media_urls).map(item => item.url)
  // console.log(media_urls)
  isLoved.value = didLikedResponse.data
  isCollected.value = didCollectedResponse.data

  //笔记数据
  imgUrl.value = media_urls
  mediaType.value = response.data.data.media_type
  title.value = response.data.data.title
  contentDetail.value = response.data.data.content
  avatar.value = response.data.data.avatar
  author.value = response.data.data.nickname
  loveCount.value = response.data.data.like_count
  collectCount.value = response.data.data.collect_count
}

//通过笔记id获取评论
// const getComment = async id => {
//   const response = await getCommentList(id)
//   console.log('response', response)
//   // commentList.value = response.data.data
// }

//改变点赞状态
const changeLoveStatus = async id => {
  try {
    if (isLoved.value == 0) {
    isLoved.value = 1
    loveCount.value += 1
    await addLike(id)
  } else {
    isLoved.value = 0
    loveCount.value = Math.max(0, loveCount.value - 1)
    await removeLike(id)
  }
  } catch (error) {
    console.error('点赞失败:', error)
    throw error
  }
}

//改变收藏状态
const changeCollectStatus = async (id) => {
  try {
    if (isCollected.value == 0) {
      isCollected.value = 1
      collectCount.value += 1
    await addCollect(id)
  } else {
    isCollected.value = 0
      collectCount.value = Math.max(0, collectCount.value - 1)
      await removeCollect(id)
    }
  } catch (error) {
    console.error('收藏失败:', error)
    throw error
  }
}

//监听视口大小的变化，随时更新图片大小
const resizeObserver = new ResizeObserver(() => {
  if (slideShow.value) {
    handleResize()
  }
})

//同步图片大小和轮播图大小
const handleResize = debounce(() => {
  slideHeight.value = slideShow.value.clientHeight
  slideWidth.value = slideShow.value.clientWidth
  commentHeight.value =
    detailContainer.value.clientHeight - articlDetail.value.clientHeight
})

// onBeforeMount(async () => {
//   const didLikedResponse = await didLiked(articleId)
//   const didCollectedResponse = await didCollected(articleId)
//   isLoved.value = didLikedResponse.data
//   isCollected.value = didCollectedResponse.data
//   console.log(isLoved.value, isCollected.value)
// })

onMounted(() => {
  //调用笔记详情接口，获得笔记详情
  getDetail(articleId)

  //在挂载的时候记录轮播图的宽高
  slideHeight.value = slideShow.value.clientHeight
  slideWidth.value = slideShow.value.clientWidth
  commentHeight.value =
    detailContainer.value.clientHeight - articlDetail.value.clientHeight

  //对轮播图大小变化添加监听器
  resizeObserver.observe(slideShow.value)
})

onUnmounted(() => {
  if (slideShow.value) {
    resizeObserver.unobserve(slideShow.value)
  }
})
</script>

<template>
  <div class="app">
    <div class="item-container">
      <div class="slide-show" ref="slideShow">
        <SlideShow
          :detail="{
            height: slideHeight,
            width: slideWidth,
            imgUrl,
            mediaType
          }"
        />
      </div>
      <div class="detail">
        <div class="detail-header">
          <div class="user">
            <img class="avatar" :src="avatar" />
            {{ author }}
          </div>
          <button class="subscribe">关注</button>
        </div>
        <div class="detail-container" ref="detailContainer">
          <div class="articl-detail" ref="articlDetail">
            <ArticlDetail
              :detail="{
                width: detailWidth,
                title,
                contentDetail,
                labels,
                date,
                location
              }"
            />
          </div>
          <div class="comment-container" ref="commentContainer">
            <CommentContainer :height="commentHeight" :id="articleId" />
          </div>
        </div>
        <div class="detail-footer">
          <CommentInput :articleId="articleId" :isLoved="isLoved" :isCollected="isCollected" :loveCount="loveCount" :collectCount="collectCount" :changeLoveStatus="changeLoveStatus" :changeCollectStatus="changeCollectStatus" />
          <!-- <img src="../assets/avatar.jpg" alt="" class="comment-avatar" /> -->
          <!-- <input class="comment-box" placeholder="说点什么..." />
          <div class="love-count" @click="changeLoveStatus(articleId)">
            <svg
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
            </svg>
            <svg
              v-else
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
            <span class="numbers">{{ loveCount }}</span>
          </div>
          <div class="collect-count" @click="changeCollectStatus(articleId)">
            <svg
              v-if="isCollected"
              t="1733319987018"
              class="icon collected"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7552"
              width="200"
              height="200"
            >
              <path
                d="M313.991837 914.285714c-20.37551 0-40.228571-6.269388-56.946939-18.808163-30.302041-21.942857-44.930612-58.514286-38.661225-95.085714l24.032654-141.061225c3.134694-18.285714-3.134694-36.571429-16.195919-49.110204L123.297959 509.910204c-26.644898-26.122449-36.04898-64.261224-24.555102-99.787755 11.493878-35.526531 41.795918-61.126531 78.889796-66.35102l141.583674-20.375511c18.285714-2.612245 33.959184-14.106122 41.795918-30.30204l63.216326-128.522449C440.946939 130.612245 474.383673 109.714286 512 109.714286s71.053061 20.897959 87.24898 54.334694L662.987755 292.571429c8.359184 16.195918 24.032653 27.689796 41.795918 30.30204l141.583674 20.375511c37.093878 5.22449 67.395918 30.82449 78.889796 66.35102 11.493878 35.526531 2.089796 73.665306-24.555102 99.787755l-102.4 99.787755c-13.061224 12.538776-19.330612 31.346939-16.195919 49.110204l24.032654 141.061225c6.269388 37.093878-8.359184 73.142857-38.661225 95.085714-30.302041 21.942857-69.485714 24.555102-102.4 7.314286L538.122449 836.440816c-16.195918-8.359184-35.526531-8.359184-51.722449 0l-126.955102 66.87347c-14.628571 7.314286-30.302041 10.971429-45.453061 10.971428z m162.481632-96.653061z"
                fill="#F2CB51"
                p-id="7553"
              ></path>
            </svg>
            <svg
              v-else
              t="1733320332650"
              class="icon"
              viewBox="0 0 1059 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="9606"
              width="200"
              height="200"
            >
              <path
                d="M253.488042 1024c-16.9 0-33.2875-5.1125-47.6125-15.3625-26.625-18.425-39.425-49.6625-34.3125-81.925l40.9625-251.9c1.5375-10.2375-1.5375-20.475-8.7-27.65L28.213042 466.4375c-22.0125-22.525-29.1875-55.3-19.45-84.9875 9.725-29.7 35.325-51.2 66.05-55.8125l237.575-36.35c10.75-1.5375 19.4625-8.1875 24.0625-17.925L441.388042 48.125c13.825-29.7 42.5-48.125 75.2625-48.125s61.4375 18.4375 75.2625 48.125l104.45 223.2375c4.6125 9.725 13.825 16.375 24.0625 17.925L958.000542 325.625a82.355 82.355 0 0 1 66.05 55.8125c10.2375 29.7 2.5625 62.4625-19.45 84.9875l-175.625 180.7375c-7.1625 7.175-10.2375 17.925-8.7 27.65l40.9625 251.9c5.125 31.75-8.1875 63.4875-34.3 81.925-26.1125 18.4375-59.9 20.4875-88.0625 4.6125l-206.85-114.6875c-9.725-5.1125-20.9875-5.1125-30.7125 0l-207.3625 115.2c-12.8125 6.65-26.6375 10.2375-40.4625 10.2375zM516.650542 51.2c-12.8 0-23.55 7.1625-29.1875 18.4375L383.525542 292.875c-11.775 25.0875-35.325 43.0125-62.975 47.1l-237.575 36.35c-12.2875 2.05-21.5 9.7375-25.6 21.5-4.1 11.775-1.025 24.0625 7.675 32.775L240.688042 611.325c18.4375 18.95 26.625 45.5625 22.525 71.675L222.250542 934.9125c-2.05 12.8 3.075 24.575 13.3125 31.7375 10.2375 7.175 23.0375 7.6875 33.7875 1.5375l207.3625-115.2c25.0875-13.825 55.3-13.825 80.3875 0l207.3625 115.2c10.75 6.1375 23.55 5.625 33.8-1.5375 10.2375-7.1625 15.3625-18.95 13.3125-31.7375L770.625542 683.0125c-4.1-26.1125 4.1-52.7375 22.525-71.675l175.625-180.7375c8.7-8.7 11.2625-20.9875 7.675-32.775-4.0875-11.775-13.3125-19.9625-25.6-21.5l-237.5625-36.35c-27.65-4.0875-51.2-22.0125-62.975-47.1L545.838042 69.6375c-5.625-11.2625-16.375-18.4375-29.1875-18.4375z m0 0"
                p-id="9607"
              ></path>
            </svg>
            <span class="numbers">{{collectCount}}</span>
          </div>
          <div class="comment-count">
            <svg
              t="1733320061676"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="8630"
              width="200"
              height="200"
            >
              <path
                d="M157.568 751.296c-11.008-18.688-18.218667-31.221333-21.802667-37.909333A424.885333 424.885333 0 0 1 85.333333 512C85.333333 276.362667 276.362667 85.333333 512 85.333333s426.666667 191.029333 426.666667 426.666667-191.029333 426.666667-426.666667 426.666667a424.778667 424.778667 0 0 1-219.125333-60.501334 2786.56 2786.56 0 0 0-20.053334-11.765333l-104.405333 28.48c-23.893333 6.506667-45.802667-15.413333-39.285333-39.296l28.437333-104.288z m65.301333 3.786667l-17.258666 63.306666 63.306666-17.258666a32 32 0 0 1 24.522667 3.210666 4515.84 4515.84 0 0 1 32.352 18.944A360.789333 360.789333 0 0 0 512 874.666667c200.298667 0 362.666667-162.368 362.666667-362.666667S712.298667 149.333333 512 149.333333 149.333333 311.701333 149.333333 512c0 60.586667 14.848 118.954667 42.826667 171.136 3.712 6.912 12.928 22.826667 27.370667 47.232a32 32 0 0 1 3.338666 24.714667z m145.994667-70.773334a32 32 0 1 1 40.917333-49.205333A159.189333 159.189333 0 0 0 512 672c37.888 0 73.674667-13.173333 102.186667-36.885333a32 32 0 0 1 40.917333 49.216A223.178667 223.178667 0 0 1 512 736a223.178667 223.178667 0 0 1-143.136-51.690667z"
                fill="#000000"
                p-id="8631"
              ></path>
            </svg>
            <span class="numbers">2233</span>
          </div>
          <div class="share">
            <svg
              t="1733321051404"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="10787"
              width="200"
              height="200"
            >
              <path
                d="M544.768 116.736c18.944 0 34.816 15.36 34.816 34.816 0 18.944-15.36 34.816-34.816 34.816-186.88 0-338.432 151.552-338.432 338.432 0 186.88 151.552 338.432 338.432 338.432 186.88 0 338.432-151.552 338.432-338.432 0-18.944 15.36-34.816 34.816-34.816 18.944 0 34.816 15.36 34.816 34.816 0 225.28-182.272 407.552-407.552 407.552-225.28 0-407.552-182.272-407.552-407.552-0.512-225.792 181.76-408.064 407.04-408.064z m209.92 173.056c-12.8-13.312-12.8-34.816 0.512-47.616 13.312-13.312 34.304-13.312 48.128 0L862.72 302.08c17.92 17.92 17.92 47.104 0 65.024l-59.904 59.904a33.9968 33.9968 0 0 1-48.128 0 33.9968 33.9968 0 0 1 0-48.128l10.24-10.24h-44.032c-119.296 0-160.256 50.688-160.256 204.8 0 18.944-15.36 33.792-33.792 33.792-18.944 0-33.792-15.36-33.792-33.792 0-190.464 69.632-272.896 227.84-272.896h44.032l-10.24-10.752z m0 0"
                p-id="10788"
              ></path>
            </svg>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-container {
  display: flex;
  margin: 0 auto;
  width: 60vw;
  height: 80vh;
  border-radius: 20px;
  border: 1px solid gainsboro;
  overflow: hidden;
}
.slide-show {
  width: 60%;
  height: 100%;
  border-right: 1px solid gainsboro;
}
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.detail {
  width: 40%;
  height: 100%;
}
.detail-header {
  display: flex;
  width: 100%;
  height: 10%;
  justify-content: space-between;
  align-items: center;
}
.user {
  font-size: 16px;
  margin-left: 20px;
}
.user .avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}
.subscribe {
  height: 40px;
  width: 90px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  border-radius: 20px;
  margin-right: 20px;
  background-color: red;
}
.detail-container {
  width: 100%;
  height: 80%;
  border-top: 1px solid gainsboro;
  border-bottom: 1px solid gainsboro;
}
.comment-container {
  width: 100%;
  border-top: 1px solid gainsboro;
}
.detail-footer {
  padding: 15px;
}
.comment-avatar {
  position: absolute;
  left: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.comment-box {
  background-color: #f7f7f7;
  padding: 10px;
  height: 40px;
  border-radius: calc(20px);
}
.icon {
  height: 25px;
  width: 25px;
  margin-right: 6px;
}
.icon path {
  fill: black;
}
.loved path {
  fill: red;
}
.collected path {
  fill: rgba(255, 208, 0, 0.861);
}
.love-count {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.collect-count {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.comment-count {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.share {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
</style>

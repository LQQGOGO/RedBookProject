<script setup>
import { ref, onMounted } from 'vue'
import { getCommentList } from '@/api/comment'
import { useCommentListStore } from '@/stores/commentList'

const commentListStore = useCommentListStore()

const props = defineProps({
  height: {
    required: true
  },
  id: {
    required: true
  }
})

// const commentList = ref([])

onMounted(async () => {
  const articleId = parseInt(props.id)
  // const response = await getCommentList(articleId)
  // console.log('response', response.data.data)
  // commentListStore.setCommentList(response.data.data)
  await commentListStore.setNewCommentList(articleId)

  // console.log('commentList', commentList.value)
})

</script>

<template>
  <div id="app">
    <div class="comment-container">
      <div class="comment-number">共 {{ commentListStore.commentList.length }} 条评论</div>
      <div class="comment-detail" v-for="item in commentListStore.commentList" :key="item.id">
        <img :src="item.user.avatar" class="avatar" />
        <div class="user-info">
          <div class="nickname">{{ item.user.nickname }}</div>
          <div class="content">
            {{ item.content }}
          </div>
          <div class="time">{{ item.created_at.split('T')[0] }} 贵州</div>
          <div class="footer">
            <div class="love">
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
              3
            </div>
            <div class="reply">
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
              10
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.comment-container {
  padding: 10px;
  font-size: 15px;
  height: v-bind('`${props.height}px`');
  overflow-y: scroll;
}
.comment-container::-webkit-scrollbar {
  display: none;
}
.comment-number {
  font-size: 15px;
  padding-bottom: 15px;
}
.comment-detail {
  position: relative;
  padding-left: 50px;
  margin-bottom: 10px;
}
.avatar {
  position: absolute;
  left: 0px;
  height: 40px;
  width: 40px;
  border-radius: 20px;
}
.nickname {
  font-size: 15px;
  padding: 3px;
}
.content {
  font-size: 15px;
  color: black;
  padding: 3px;
}
.time {
  font-size: 12px;
  padding: 3px;
}
.footer {
  display: flex;
  padding: 3px;
}
.icon {
  height: 15px;
  width: 15px;
  margin-right: 6px;
}
.icon path {
  fill: black;
}
.love {
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.reply {
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-right: 10px;
}
</style>

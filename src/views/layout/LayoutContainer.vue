<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
const moreDetails = ref(false)
const more = ref()
const handleHide = event => {
  if (more.value && more.value.contains(event.target)) {
    moreDetails.value = true
  }else {
    moreDetails.value = false
  }
}
const handleShow = () => {
  moreDetails.value = true
}
onMounted(() => {
  document.addEventListener('click', handleHide)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleHide)
})
</script>

<template>
  <div>
    <HeaderComponent class="top"></HeaderComponent>
    <div class="sideNav">
      <router-link class="sidelinks" to="/explore" active-class="active">
        <svg
          t="1731323786741"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4583"
          width="200"
          height="200"
        >
          <path
            d="M947 426.9L569.3 128.3c-32.5-25.8-83.5-25.8-116 0L75.8 426.9c-13 10.3-15.1 29-5 41.8s28.5 15.1 41.5 5l11.7-9.6V825c0 51.1 54 89.4 101.2 89.4h595.9c46.8 0 77.5-35.9 77.5-89.4V465.4l10.9 8.3c5.4 4.3 12.2 6.4 18.7 6.4 8.8 0 17.6-3.8 23.5-11.4 10.3-12.8 8.2-31.5-4.7-41.8zM481.5 854.7V689.4c0-8.2 14.9-12.3 29.8-12.3s29.8 4.2 29.8 12.3v165.1l-59.6 0.2z m357.7-29.8c0 19.7-5.4 29.8-17.9 29.8h-220c0-0.5-0.6-0.8-0.6-1.3v-164c0-34.6-27.9-71.9-89.4-71.9s-89.4 37.3-89.4 71.9v164c0 0.5 0.8 0.8 0.8 1.3H225.4c-18.7 0-41.6-16.2-41.6-29.8V416.8l306.1-241.7c11.1-8.6 30.9-8.6 41.8 0L839 418.3V825h0.2z"
            p-id="4584"
          ></path>
        </svg>
        发现
      </router-link>
      <router-link class="sidelinks" to="/publish" active-class="active"
      >
        <svg
          t="1731324557365"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="7453"
          width="200"
          height="200"
        >
          <path
            d="M836 476H548V188c0-19.8-16.2-36-36-36s-36 16.2-36 36v288H188c-19.8 0-36 16.2-36 36s16.2 36 36 36h288v288c0 19.8 16.2 36 36 36s36-16.2 36-36V548h288c19.8 0 36-16.2 36-36s-16.2-36-36-36z"
            fill="#333333"
            p-id="7454"
          ></path>
        </svg>
        发布
      </router-link>
      <router-link class="sidelinks" to="/notification" active-class="active">
        <svg
          t="1731324594476"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="8526"
          width="200"
          height="200"
        >
          <path
            d="M924.964959 660.871515h-40.82604l-9.568603-280.679022C874.570316 177.976016 717.326273 0 513.196075 0A370.304937 370.304937 0 0 0 142.572185 367.434356v293.437159H95.68603a95.68603 95.68603 0 0 0-95.68603 95.686031 95.68603 95.68603 0 0 0 95.68603 95.68603h243.680424v2.232674a169.364273 169.364273 0 0 0 339.0475 0v-2.232674H924.964959a95.68603 95.68603 0 0 0 95.68603-95.68603 95.68603 95.68603 0 0 0-95.68603-95.686031z m-310.660645 191.372061a105.573587 105.573587 0 0 1-211.466127 0v-2.232674h210.82822s0.637907 1.913721 0.637907 2.551627zM924.964959 787.177075H95.68603a31.895343 31.895343 0 1 1 0-63.790687h78.781498a31.895343 31.895343 0 0 0 31.895344-31.895343v-312.574365A314.169133 314.169133 0 0 1 446.534808 70.807662C647.475471 25.197321 810.779629 191.37206 810.779629 380.192493l9.568603 280.679022v31.895344a31.895343 31.895343 0 0 0 31.895344 31.895343H924.964959a31.895343 31.895343 0 1 1 0 63.790687z"
            fill=""
            p-id="8527"
          ></path>
        </svg>
        通知
      </router-link>
      <router-link class="sidelinks" to="/user" active-class="active">
        <img class="avatar" src="@/assets/avatar.png" alt="" />
        我
      </router-link>
    </div>
    <div class="container">
      <router-view></router-view>

    </div>
    <div ref="more" class="footer">
      <div class="moreDetails" v-show="moreDetails">
        <div class="groupWarper">
          <div class="pass">关于小红书</div>
          <div class="pass">隐私，协议</div>
          <div class="pass">帮助与客服</div>
        </div>
        <div class="groupWarper">
          <div class="warpHeader">访问方式</div>
          <div class="pass">键盘快捷键</div>
          <div class="pass">添加小红书到桌面</div>
          <div class="pass">打开小窗模式</div>
        </div>
        <div class="groupWarper">
          <div class="warpHeader">设置</div>
          <div>深色模式</div>
          <div class="pass">退出登录</div>
        </div>
      </div>
      <div class="more" @click="handleShow">
        <svg
          t="1731328814610"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="9545"
          width="200"
          height="200"
        >
          <path
            d="M138.5 261.4h749c22.4 0 40.5-18.1 40.5-40.5s-18.1-40.5-40.5-40.5h-749c-22.4 0-40.5 18.1-40.5 40.5s18.1 40.5 40.5 40.5zM887.5 470.4h-749c-22.4 0-40.5 18.1-40.5 40.5s18.1 40.5 40.5 40.5h749c22.4 0 40.5-18.1 40.5-40.5s-18.1-40.5-40.5-40.5zM887.5 760.4h-749c-22.4 0-40.5 18.1-40.5 40.5s18.1 40.5 40.5 40.5h749c22.4 0 40.5-18.1 40.5-40.5s-18.1-40.5-40.5-40.5z"
            p-id="9546"
          ></path>
        </svg>
        更多
      </div>
    </div>
  </div>
</template>

<style scoped>
.top {
  position: fixed;
  top: 0; /* 距视口顶部的距离 */
  left: 50%; /* 设置 left 为50%将元素的起点移到视口中心 */
  transform: translateX(-50%); /* 使用 translateX 将元素居中到容器 */
  width: calc(100% - 40px); /* 假设左右间距为20px，避免宽度超出容器 */
  max-width: 1750px; /* 限制最大宽度为版心的宽度 */
  background-color: #fff;
  z-index: 101;
}
.active {
  background-color: #f7f7f7;
}
.sideNav {
  position: fixed;
  top: 125px; /* 距视口顶部的距离 */
  left: 50%; /* 设置 left 为50%将元素的起点移到视口中心 */
  transform: translateX(-300%); /* 使用 translateX 将元素居中到容器 */
  width: calc(100% - 40px); /* 假设左右间距为20px，避免宽度超出容器 */
  max-width: 1750px; /* 限制最大宽度为版心的宽度 */
  display: flex;
  width: 280px;
  flex-wrap: wrap;
  z-index: 100;
}
.sidelinks {
  font-size: 15px;
  font-weight: bold;
  height: 50px;
  width: 100%;
  text-indent: 20px;
  margin: 5px;
  border-radius: 20px;
  line-height: 50px;
  color: #333;
}
.sidelinks:hover {
  background-color: #f7f7f7;
}
svg {
  float: left;
  margin-left: 20px;
  height: 50px;
  width: 28px;
}
.avatar {
  float: left;
  margin-left: 20px;
  margin-top: 10px;
  height: 28px;
  width: 28px;
  border-radius: 50%;
}
svg path {
  fill: #333;
}
.footer {
  position: fixed;
  bottom: 0; /* 距视口顶部的距离 */
  left: 50%; /* 设置 left 为50%将元素的起点移到视口中心 */
  transform: translateX(-300%); /* 使用 translateX 将元素居中到容器 */
  width: calc(100% - 40px); /* 假设左右间距为20px，避免宽度超出容器 */
  max-width: 1750px; /* 限制最大宽度为版心的宽度 */
  width: 280px;
  z-index: 100;
}
.moreDetails {
  background-color: #fff;
  padding: 5px;
  border-radius: 15px;
  box-shadow: 0 0 5px rgb(168, 165, 165);
}
.groupWarper div {
  height: 37px;
  border-radius: 10px;
  line-height: 37px;
  text-indent: 15px;
  font-size: 16px;
}
.groupWarper .warpHeader {
  border-top: 1px solid #f7f7f7;
  font-size: 12px;
  color: #b2b2b2;
}
.pass:hover {
  background-color: #f7f7f7;
}

.more {
  font-size: 15px;
  font-weight: bold;
  height: 50px;
  width: 100%;
  text-indent: 20px;
  margin: 5px;
  border-radius: 20px;
  line-height: 50px;
  color: #333;
}
.more:hover {
  background-color: #f7f7f7;
}

.container {
  margin-top: 125px;
  width: 1300px;
  left: 50%; /* 设置 left 为50%将元素的起点移到视口中心 */
  transform: translateX(30%); /* 使用 translateX 将元素居中到容器 */
  max-width: 1750px; /* 限制最大宽度为版心的宽度 */
  z-index: 100;
}
</style>

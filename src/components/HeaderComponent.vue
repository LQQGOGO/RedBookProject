<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
//实现点击li跳转链接
const navigateToLink = event => {
  // 判断点击的是 li 或 li 内部的元素
  const targetLi = event.target.closest('li')
  if (targetLi) {
    const link = targetLi.querySelector('a')
    if (link) {
      const url = link.href
      window.open(url, '_blank') // 打开链接
    }
  }
}

//实现搜索跳转
const searchInput = ref('')
const search = () => {
  // console.log(searchInput.value)
  router.push(`/search?q=${searchInput.value}`)
  searchInput.value = ''
}
</script>

<template>
  <div>
    <div class="header">
      <a href="/explore">
        <img class="logo" src="@/assets/logo.png" alt="" />
      </a>
      <div class="search">
        <input type="text" v-model="searchInput" placeholder="搜索小红书" />
        <svg
          t="1731068684182"
          class="icon"
          viewBox="0 0 1025 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2387"
          width="200"
          height="200"
          @click="search"
        >
          <path
            d="M401.271618 64.685719a335.31276 335.31276 0 1 1-126.692351 24.641081A335.55533 335.55533 0 0 1 401.271618 64.685719m0-64.685365a399.967803 399.967803 0 0 0-283.736289 117.535329c-156.659868 156.659868-156.659868 410.772281 0 567.472577a401.251404 401.251404 0 0 0 567.472577 0c156.659868-156.659868 156.659868-410.772281 0-567.472577A399.988018 399.988018 0 0 0 401.271618 0.000354z"
            fill="#333333"
            p-id="2388"
          ></path>
          <path
            d="M625.598272 670.114812m7.14679-7.14679l31.445879-31.445879q7.146791-7.146791 14.293581 0l343.789217 343.789217q7.146791 7.146791 0 14.293581l-31.445878 31.445879q-7.146791 7.146791-14.293582 0l-343.789217-343.789217q-7.146791-7.146791 0-14.293581Z"
            fill="#333333"
            p-id="2389"
          ></path>
        </svg>
      </div>
      <div class="exlinks">
        <span class="fcreate">创作中心</span>
        <ul class="create" @click="navigateToLink">
          <li>
            <a href="https://creator.xiaohongshu.com/?source=official">
              创作服务
              <svg
                t="1731130093408"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3508"
                width="200"
                height="200"
              >
                <path
                  d="M608.682667 355.882667L286.165333 678.4a42.666667 42.666667 0 0 0 60.330667 60.330667l322.517333-322.517334a8.533333 8.533333 0 0 1 14.549334 6.058667V682.666667a42.666667 42.666667 0 0 0 85.333333 0V341.333333a85.333333 85.333333 0 0 0-85.333333-85.333333h-341.333334a42.666667 42.666667 0 0 0 0 85.333333h260.394667a8.533333 8.533333 0 0 1 6.058667 14.549334z"
                  fill="#5D6E7F"
                  p-id="3509"
                ></path></svg
            ></a>
          </li>
          <li>
            <a href="https://redlive.xiaohongshu.com/?source=official">
              直播管理
              <svg
                t="1731130093408"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3508"
                width="200"
                height="200"
              >
                <path
                  d="M608.682667 355.882667L286.165333 678.4a42.666667 42.666667 0 0 0 60.330667 60.330667l322.517333-322.517334a8.533333 8.533333 0 0 1 14.549334 6.058667V682.666667a42.666667 42.666667 0 0 0 85.333333 0V341.333333a85.333333 85.333333 0 0 0-85.333333-85.333333h-341.333334a42.666667 42.666667 0 0 0 0 85.333333h260.394667a8.533333 8.533333 0 0 1 6.058667 14.549334z"
                  fill="#5D6E7F"
                  p-id="3509"
                ></path></svg
            ></a>
          </li>
          <li>
            <a href="https://www.xiaohongshu.com/zhibo/robs?source=official"
              >电脑直播助手
              <svg
                t="1731130093408"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3508"
                width="200"
                height="200"
              >
                <path
                  d="M608.682667 355.882667L286.165333 678.4a42.666667 42.666667 0 0 0 60.330667 60.330667l322.517333-322.517334a8.533333 8.533333 0 0 1 14.549334 6.058667V682.666667a42.666667 42.666667 0 0 0 85.333333 0V341.333333a85.333333 85.333333 0 0 0-85.333333-85.333333h-341.333334a42.666667 42.666667 0 0 0 0 85.333333h260.394667a8.533333 8.533333 0 0 1 6.058667 14.549334z"
                  fill="#5D6E7F"
                  p-id="3509"
                ></path></svg
            ></a>
          </li>
        </ul>
        <span class="fbusiness">业务合作</span>
        <ul class="business" @click="navigateToLink">
          <li>
            <a href="https://pro.xiaohongshu.com/"
              >专业号<svg
                t="1731130093408"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3508"
                width="200"
                height="200"
              >
                <path
                  d="M608.682667 355.882667L286.165333 678.4a42.666667 42.666667 0 0 0 60.330667 60.330667l322.517333-322.517334a8.533333 8.533333 0 0 1 14.549334 6.058667V682.666667a42.666667 42.666667 0 0 0 85.333333 0V341.333333a85.333333 85.333333 0 0 0-85.333333-85.333333h-341.333334a42.666667 42.666667 0 0 0 0 85.333333h260.394667a8.533333 8.533333 0 0 1 6.058667 14.549334z"
                  fill="#5D6E7F"
                  p-id="3509"
                ></path></svg
            ></a>
          </li>
          <li>
            <a href="https://www.xiaohongshu.com/brand"
              >推广合作<svg
                t="1731130093408"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3508"
                width="200"
                height="200"
              >
                <path
                  d="M608.682667 355.882667L286.165333 678.4a42.666667 42.666667 0 0 0 60.330667 60.330667l322.517333-322.517334a8.533333 8.533333 0 0 1 14.549334 6.058667V682.666667a42.666667 42.666667 0 0 0 85.333333 0V341.333333a85.333333 85.333333 0 0 0-85.333333-85.333333h-341.333334a42.666667 42.666667 0 0 0 0 85.333333h260.394667a8.533333 8.533333 0 0 1 6.058667 14.549334z"
                  fill="#5D6E7F"
                  p-id="3509"
                ></path></svg
            ></a>
          </li>
          <li>
            <a
              href="https://pgy.xiaohongshu.com/solar/to-home?source=official&type=0"
              >蒲公英<svg
                t="1731130093408"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3508"
                width="200"
                height="200"
              >
                <path
                  d="M608.682667 355.882667L286.165333 678.4a42.666667 42.666667 0 0 0 60.330667 60.330667l322.517333-322.517334a8.533333 8.533333 0 0 1 14.549334 6.058667V682.666667a42.666667 42.666667 0 0 0 85.333333 0V341.333333a85.333333 85.333333 0 0 0-85.333333-85.333333h-341.333334a42.666667 42.666667 0 0 0 0 85.333333h260.394667a8.533333 8.533333 0 0 1 6.058667 14.549334z"
                  fill="#5D6E7F"
                  p-id="3509"
                ></path></svg
            ></a>
          </li>
          <li>
            <a
              href="https://zhaoshang.xiaohongshu.com/merchant/login?from=xhsweb"
              >商家入驻<svg
                t="1731130093408"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3508"
                width="200"
                height="200"
              >
                <path
                  d="M608.682667 355.882667L286.165333 678.4a42.666667 42.666667 0 0 0 60.330667 60.330667l322.517333-322.517334a8.533333 8.533333 0 0 1 14.549334 6.058667V682.666667a42.666667 42.666667 0 0 0 85.333333 0V341.333333a85.333333 85.333333 0 0 0-85.333333-85.333333h-341.333334a42.666667 42.666667 0 0 0 0 85.333333h260.394667a8.533333 8.533333 0 0 1 6.058667 14.549334z"
                  fill="#5D6E7F"
                  p-id="3509"
                ></path></svg
            ></a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  height: 100px;
  width: 100%;
  padding: 30px 50px 0px 50px;
}
.logo {
  width: auto;
  height: 40px;
}
.search {
  position: relative;
  height: 60%;
  width: 40%;
}
.search input {
  height: 50px;
  width: 100%;
  background-color: #f7f7f7;
  border-radius: 25px;
  font-size: 20px;
  text-indent: 22px;
  color: #7f7878;
}
.search svg {
  position: absolute;
  height: 25px;
  width: 25px;
  top: 15px;
  right: 20px;
}
.search svg path {
  fill: #5c5c5c;
}
.search svg:hover path {
  fill: #333333;
}
.exlinks {
  position: relative;
  font-size: 20px;
}
.exlinks span {
  vertical-align: middle;
  height: 50px;
  padding: 15px 20px;
  border-radius: 25px;
}
.exlinks ul {
  position: absolute;
  padding: 3px;
  border-radius: 15px;
  box-shadow: 0px 0px 6px;
  background-color: #fff;
  display: none;
}

.exlinks ul:hover {
  display: block;
}
.exlinks ul a {
  color: #bbbbbb;
  transition: all 0.3s;
}
.exlinks ul a svg {
  float: right;
  height: 35px;
  width: 35px;
}
.exlinks ul a svg path {
  fill: transparent;
  transition: all 0.3s;
}
.exlinks ul li {
  height: 60px;
  width: 260px;
  padding: 15px 20px;
  border-radius: 15px;
}

.exlinks ul li:hover {
  background-color: #f7f7f7;
}

.exlinks ul li:hover a {
  color: #333333;
}

.exlinks ul li:hover a svg path {
  fill: #bbbbbb;
}

.exlinks .create {
  top: 46px;
  left: -29px;
}

.exlinks .business {
  top: 46px;
  right: -9px;
}
.fcreate:hover + .create {
  display: block;
}

.fbusiness:hover + .business {
  display: block;
}
</style>

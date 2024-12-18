<script setup></script>

<template>
  <div class="userinfo-container">
    <img src="../../assets/avatar.jpg" class="avatar" />
    <div class="container">
      <div class="nickname">带钱跑路</div>
      <div class="userid">小红书号：3421788149322</div>
      <div class="readme">还没有简介</div>
      <div class="loveinfo">
        <span class="num">2</span>关注 <span class="num">1</span>粉丝
        <span class="num">0</span>获赞与收藏
      </div>
    </div>
  </div>

  <div class="title">点赞内容</div>
  <div class="love-container"></div>
</template>

<style scoped>
.userinfo-container {
  margin: 0 auto;
  height: 200px;
  width: 600px;
  transform: translate(-200px);
}
.avatar {
  height: 200px;
  width: 200px;
  border-radius: 50%;
}
.container {
  float: right;
  width: 350px;
}
.nickname {
  font-size: 30px;
  color: black;
  font-weight: bold;
  padding: 5px;
}
.userid {
  font-size: 15px;
  padding: 5px;
}
.readme {
  font-size: 20px;
  color: black;
  padding: 15px 5px 15px 5px;
}
.loveinfo {
  font-size: 20px;
  padding: 5px;
}
.num {
  padding: 5px;
  color: black;
}
.title {
  margin: 50px auto;
  text-align: center;
  height: 40px;
  width: 80px;
  line-height: 40px;
  background-color: #f7f7f7;
  font-size: 15px;
  font-weight: bold;
  color: black;
  border-radius: 20px;
  transform: translate(-200px);
}
.love-container {
  border-top: 2px solid #f7f7f7;
}
</style>

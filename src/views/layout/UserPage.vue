<script setup>

</script>

<template>
  <div class="userinfo-container">
    <img src="../../assets/avatar.jpg" class="avatar">
    <div class="container">
      <div class="nickname">带钱跑路</div>
      <div class="userid">小红书号：3421788149322</div>
      <div class="readme">还没有简介</div>
      <div class="loveinfo">
        <span class="num">2</span>关注
        <span class="num">1</span>粉丝
        <span class="num">0</span>获赞与收藏
      </div>
    </div>
  </div>
</template>

<style scoped>
.userinfo-container {
  margin: 0 auto;
  height: 250px;
  width: 650px;
  transform: translate(-200px);
}
.avatar {
  height: 250px;
  width: 250px;
  border-radius: 50%;
}
.container {
  float:right;
  width: 320px;
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
</style>

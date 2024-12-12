<script setup>
const props = defineProps({
  detail: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <div id="app">
    <div class="container">
      <div class="title">{{ detail.title}}</div>
      <div class="content">
        <span class="content-detail">{{ detail.contentDetail}}</span>
        <a class="label" v-for="(item, index) in detail.labels" :key="index"> {{ item }}</a>
      </div>
      <div class="time">{{ detail.date }} {{ detail.location }}</div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: v-bind('`${props.detail.width}px`');
  padding: 20px;
}
.title {
  font-size: 20px;
  color: black;
  font-weight: bold;
}
.content {
  padding: 10px 0 10px 0;
}
.content-detail{
  font-size: 15px;
  color: black;
}
.label {
  font-size: 15px;
  margin: 0 10px;
  color: #1b3f71;
}
.time {
  font-size: 15px;
}
</style>

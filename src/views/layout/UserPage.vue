<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const tabs = ['Tab1', 'Tab2', 'Tab3']; // 定义 Tab 列表
const currentTab = ref(route.query.tab || 'Tab1'); // 根据路由初始化当前 Tab

// 切换 Tab 方法
const switchTab = (tab) => {
  currentTab.value = tab;
  router.push({ query: { tab } }); // 更新查询参数
};

// 监听路由变化，同步更新 Tab
watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab) {
      currentTab.value = newTab;
    }
  }
);
</script>

<template>
  <div>
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="{ active: currentTab === tab }"
        @click="switchTab(tab)"
      >
        {{ tab }}
      </button>
    </div>
    <div class="tab-content" style="font-size: 100px;">
      <p>当前内容：{{ currentTab }}</p>
      <p v-if="currentTab === 'Tab1'">Tab 1 的内容</p>
      <p v-else-if="currentTab === 'Tab2'">Tab 2 的内容</p>
      <p v-else>Tab 3 的内容</p>
    </div>
  </div>
</template>

<style scoped>
.tab-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
button {
  padding: 10px 20px;
  cursor: pointer;
}
button.active {
  background-color: #007bff;
  color: white;
}
.tab-content {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>

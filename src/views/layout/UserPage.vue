<template>
  <div
    ref="scrollContainer"
    class="scroll-container"
    @scroll="onScroll"
    :style="{ height: containerHeight + 'px', overflowY: 'auto' }"
  >
    <div :style="{ position: 'relative' }">
      <div
        v-for="(item, index) in visibleData"
        :key="item.id"
        :style="getItemStyle(index)"
        class="item"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: Array.from({ length: 10000 }).map((_, index) => ({
        id: index,
        text: `Item ${index + 1}`,
        height: Math.floor(Math.random() * 50) + 50, // 每个item的高度随机（50px到100px之间）
      })), // 模拟不等高数据
      containerHeight: 500, // 容器高度
      buffer: 5, // 缓存区大小
      startIndex: 0,
      endIndex: 0,
    };
  },
  computed: {
    visibleData() {
      return this.items.slice(this.startIndex, this.endIndex);
    },
    totalHeight() {
      // 计算所有项目的总高度
      return this.items.reduce((total, item) => total + item.height, 0);
    },
  },
  mounted() {
    this.updateVisibleItems();
  },
  methods: {
    onScroll() {
      this.updateVisibleItems();
    },
    updateVisibleItems() {
      const scrollTop = this.$refs.scrollContainer.scrollTop;
      let accumulatedHeight = 0;
      let startIdx = 0;

      // 计算可见的起始索引和结束索引
      while (startIdx < this.items.length && accumulatedHeight + this.items[startIdx].height < scrollTop) {
        accumulatedHeight += this.items[startIdx].height;
        startIdx++;
      }

      let endIdx = startIdx;
      accumulatedHeight = 0;
      while (endIdx < this.items.length && accumulatedHeight + this.items[endIdx].height < this.containerHeight + scrollTop) {
        accumulatedHeight += this.items[endIdx].height;
        endIdx++;
      }

      this.startIndex = Math.max(0, startIdx - this.buffer);
      this.endIndex = Math.min(this.items.length, endIdx + this.buffer);
      console.log('Start Index:', this.startIndex);
      console.log('End Index:', this.endIndex);
    },
    getItemStyle(index) {
      let topOffset = 0;
      // 计算当前项的 top offset
      for (let i = 0; i < index; i++) {
        topOffset += this.items[i].height;
      }

      return {
        position: 'absolute',
        top: `${topOffset}px`, // 根据每个 item 的实际高度来定位
        width: '100%',
      };
    },
  },
};
</script>

<style>
.scroll-container {
  border: 1px solid #ddd;
}
.item {
  padding: 16px;
  border-bottom: 1px solid #ddd;
  font-size: 20px;
}
</style>

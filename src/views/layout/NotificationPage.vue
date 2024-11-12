<template>
  <div
    ref="scrollContainer"
    class="scroll-container"
    @scroll="onScroll"
    :style="{ height: containerHeight + 'px', overflowY: 'auto' }"
  >
    <div :style="{ height: totalHeight + 'px', position: 'relative' }">
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
      items: Array.from({ length: 100 }).map((_, index) => ({
        id: index,
        text: `Item ${index + 1}`,
      })), // 模拟大量数据
      itemHeight: 60, // 每个元素的高度
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
      return this.items.length * this.itemHeight;
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
      const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);

      this.startIndex = Math.max(
        0,
        Math.floor(scrollTop / this.itemHeight) - this.buffer
      );
      this.endIndex = Math.min(
        this.items.length,
        this.startIndex + visibleCount + this.buffer * 2
      );
    },
    getItemStyle(index) {
      return {
        position: 'absolute',
        top: `${(this.startIndex + index) * this.itemHeight}px`,
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

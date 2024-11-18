<template>
  <div class="waterfall-container">
    <div class="column" v-for="(col, colIndex) in columns" :key="colIndex">
      <div class="item" v-for="item in col" :key="item.id">
        <img :src="item.url" :alt="item.title" class="item-image" />
        <div class="item-title">{{ item.title }}</div>
      </div>
    </div>
    <div v-if="loading" class="loading">加载中...</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [], // 数据列表
      columns: [], // 瀑布流列数据
      columnCount: 3, // 列数
      gap: 16, // 列间距
      pageSize: 20, // 每次加载的数据量
      currentPage: 1, // 当前页数
      loading: false // 是否正在加载数据
    }
  },
  mounted() {
    this.initializeColumns()
    this.loadMore() // 初始化时加载数据
    window.addEventListener('scroll', this.onScroll) // 监听滚动事件
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    // 初始化列结构
    initializeColumns() {
      this.columns = Array.from({ length: this.columnCount }, () => [])
    },
    // 加载更多数据
    async loadMore() {
      if (this.loading) return
      this.loading = true

      // 模拟获取数据
      const newItems = await this.fetchData(this.currentPage, this.pageSize)
      this.currentPage++

      // 将新数据分配到列
      newItems.forEach(item => {
        const shortestColumn = this.getShortestColumn()
        shortestColumn.push(item)
      })

      this.loading = false
    },
    // 模拟异步请求数据
    async fetchData(page, pageSize) {
      return new Promise(resolve => {
        setTimeout(() => {
          const data = Array.from({ length: pageSize }).map((_, index) => ({
            id: page * pageSize + index,
            title: `标题 ${page * pageSize + index + 1}`,
            url: `https://picsum.photos/id/${page * pageSize + index}/300/${200 + (index % 5) * 30}`
          }))
          resolve(data)
        }, 1000)
      })
    },
    // 获取最短列
    getShortestColumn() {
      return this.columns.reduce((shortest, current) =>
        this.getColumnHeight(shortest) < this.getColumnHeight(current)
          ? shortest
          : current
      )
    },
    // 计算列高度
    getColumnHeight(column) {
      return column.reduce((total, item) => total + item.height || 200, 0) // 假设图片默认高度 200
    },
    // 滚动事件处理
    onScroll() {
      const scrollBottom =
        document.documentElement.scrollHeight -
        (window.innerHeight + window.scrollY)
      if (scrollBottom < 100 && !this.loading) {
        this.loadMore()
      }
    }
  }
}
</script>

<style scoped>
.waterfall-container {
  display: flex;
  gap: 16px; /* 列间距 */
  padding: 16px;
}
.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px; /* 元素间距 */
}
.item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.item-image {
  width: 100%;
  display: block;
  object-fit: cover;
}
.item-title {
  padding: 8px;
  text-align: center;
  font-size: 14px;
  color: #333;
}
.loading {
  text-align: center;
  margin: 16px 0;
  font-size: 16px;
  color: #666;
}
</style>

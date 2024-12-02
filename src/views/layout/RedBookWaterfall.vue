<script setup>
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
  onActivated
} from 'vue'
import { debounce, rafThrottle } from '@/utils/tools'
import { useItemStore } from '@/stores/itemList';

// 定义组件的 props 属性
const props = defineProps({
  column: { type: Number, default: 4 }, // 瀑布流的列数
  gap: { type: Number, default: 10 }, // 每列之间的间距
  pageSize: { type: Number, default: 20 }, // 每页请求的数据量
  enterSize: { type: Number, default: 20 }, // 每次加载的条目数量
  request: { type: Function, required: true }, // 请求数据的函数
  initialState: {
    type: Object,
    default: () => ({
      currentPage: 1,
      list: [],
      scrollTop: 0
    })
  }
})

//定义初始化状态
const itemStore = useItemStore()

// DOM 引用
const containerRef = ref(null)

// 监听容器大小变化
const resizeObserver = new ResizeObserver(() => {
  if (containerRef.value) {
    handleResize()
  }
})

// 组件状态管理
const dataState = reactive({
  loading: false,
  isFinish: false,
  currentPage: 1,
  list: [] // 存储所有数据项
})

const scrollState = reactive({
  viewWidth: 0,
  viewHeight: 0,
  start: 0 // 当前滚动位置
})

// 队列状态，用于管理每列的数据
const queueState = reactive({
  queue: new Array(props.column).fill(0).map(() => ({ list: [], height: 0 })),
  len: 0
})

// 是否有更多数据
const hasMoreData = computed(() => queueState.len < dataState.list.length)

// 临时存储正在计算尺寸的项
const temporaryList = ref([])

// 控制渲染的显示
const isShow = ref(false)

// 存储每个项目的尺寸信息
const itemSizeInfo = ref(new Map())

// 计算可见区域的结束位置
const end = computed(() => scrollState.viewHeight + scrollState.start)

// 合并所有列的项目
const cardList = computed(() =>
  queueState.queue.reduce((pre, { list }) => pre.concat(list), [])
)

// 计算要渲染的列表，过滤掉不可见的项
const renderList = computed(() =>
  cardList.value.filter(i => i.h + i.y > scrollState.start && i.y < end.value)
)

// 计算队列的最小高度和最大高度，用来调整容器高度
const computedHeight = computed(() => {
  let minIndex = 0,
    minHeight = Infinity,
    maxHeight = -Infinity
  queueState.queue.forEach(({ height }, index) => {
    if (height < minHeight) {
      minHeight = height
      minIndex = index
    }
    if (height > maxHeight) {
      maxHeight = height
    }
  })
  return { minIndex, minHeight, maxHeight }
})

// 控制容器高度
const listStyle = computed(() => ({
  height: `${computedHeight.value.maxHeight}px`
}))

// 监听列数的变化，重新计算
watch(
  () => props.column,
  () => {
    handleResize()
  }
)

// 设置每个项目的尺寸
const setItemSize = () => {
  itemSizeInfo.value = dataState.list.reduce((pre, current) => {
    const itemWidth = Math.floor(
      (scrollState.viewWidth - (props.column - 1) * props.gap) / props.column
    )
    const rect = itemSizeInfo.value.get(current.id)
    pre.set(current.id, {
      width: itemWidth,
      height: rect ? rect.height : itemWidth * 0.75,
      imageHeight: Math.floor((itemWidth * current.height) / current.width)
    })
    return pre
  }, new Map())
}

// 更新临时列表的尺寸
const updateItemSize = () => {
  temporaryList.value.forEach(({ item, h }) => {
    const rect = itemSizeInfo.value.get(item.id)
    itemSizeInfo.value.set(item.id, { ...rect, height: h })
  })
}

// 将新项目添加到队列中
const addInQueue = (size = props.enterSize) => {
  for (let i = 0; i < size; i++) {
    const minIndex = computedHeight.value.minIndex
    const currentColumn = queueState.queue[minIndex]
    const before = currentColumn.list[currentColumn.list.length - 1] || null
    const dataItem = dataState.list[queueState.len]
    const item = generatorItem(dataItem, before, minIndex)
    currentColumn.list.push(item)
    currentColumn.height = item.y
    queueState.len++
  }
}

// 生成每个项目的渲染数据
const generatorItem = (item, before, index) => {
  const rect = itemSizeInfo.value.get(item.id)
  const width = rect.width
  const height = rect.height
  const imageHeight = rect.imageHeight
  let y = 0
  if (before) y = before.y + before.h + props.gap
  return {
    item,
    y,
    h: height,
    imageHeight,
    style: {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate3d(${
        index === 0 ? 0 : (width + props.gap) * index
      }px, ${y}px, 0)`
    }
  }
}

// 请求数据并加载更多
const loadDataList = async () => {
  if (dataState.isFinish) return
  dataState.loading = true
  const list = await props.request(dataState.currentPage++, props.pageSize)
  if (!list.length) {
    dataState.isFinish = true
    return
  }
  // 去重操作
  const existingIds = new Set(dataState.list.map(item => item.id))
  // 过滤掉已经存在的项
  const uniqueList = list.filter(newItem => !existingIds.has(newItem.id))
  dataState.list.push(...uniqueList)
  dataState.loading = false
  return uniqueList.length
}

// 滚动事件处理，加载更多内容
const handleScroll = rafThrottle(() => {
  const { scrollTop, clientHeight } = containerRef.value
  scrollState.start = scrollTop

  // 将滚动位置存入仓库
  itemStore.saveScrollTop(scrollTop ? scrollTop : 0)

  if (!dataState.loading && !hasMoreData.value) {
    loadDataList().then(len => {
      len && setItemSize()
      len && mountTemporaryList()
    })
    return
  }

  if (scrollTop + clientHeight > computedHeight.value.minHeight) {
    mountTemporaryList()
  }
})

// 监听窗口大小变化
const handleResize = debounce(() => {
  initScrollState()
  reComputedQueue()
}, 300)

// 重新计算队列
const reComputedQueue = () => {
  setItemSize()
  queueState.queue = new Array(props.column)
    .fill(0)
    .map(() => ({ list: [], height: 0 }))
  queueState.len = 0
  containerRef.value.scrollTop = 0
  mountTemporaryList(props.pageSize)
}

// 渲染临时列表
const mountTemporaryList = (size = props.enterSize) => {
  if (!hasMoreData.value) return
  isShow.value = false
  for (let i = 0; i < size; i++) {
    const item = dataState.list[queueState.len + i]
    if (!item) break
    const rect = itemSizeInfo.value.get(item.id)
    temporaryList.value.push({
      item,
      y: 0,
      h: 0,
      imageHeight: rect.imageHeight,
      style: {
        width: `${rect.width}px`
      }
    })
  }

  nextTick(() => {
    const list = document.querySelector('#temporary-list')
    ;[...list.children].forEach((item, index) => {
      const rect = item.getBoundingClientRect()
      temporaryList.value[index].h = rect.height
    })
    isShow.value = true
    updateItemSize()
    addInQueue(temporaryList.value.length)
    temporaryList.value = []
  })
}

// 初始化滚动状态
const initScrollState = () => {
  if (!containerRef.value) return
  scrollState.viewWidth = containerRef.value.clientWidth
  scrollState.viewHeight = containerRef.value.clientHeight
  scrollState.start = containerRef.value.scrollTop || 0
}

//设置全局滚动状态
// const handleGlobalWheel = rafThrottle((event) => {
//   if (!containerRef.value) return

//   const container = containerRef.value
//   const scrollAmount = event.deltaY

//   // 修改容器的 scrollTop 来控制滚动
//   container.scrollTop += scrollAmount
// })

// 初始化组件
const init = async () => {
  await nextTick() // 等待 DOM 完全挂载
  if (!containerRef.value) {
    console.error('获取容器失败')
    return
  }
  initScrollState()

  if (dataState.list.length > 0) {
    // 恢复状态
    setItemSize()
    mountTemporaryList(dataState.list.length)
  } else {
    // 正常加载逻辑
    resizeObserver.observe(containerRef.value)
    const len = await loadDataList()
    if (len) {
      setItemSize()
      mountTemporaryList(len)
    }
  }
  // 恢复滚动位置，确保在DOM渲染之后执行
  nextTick(() => {
    if (itemStore.scrollTop) {
      containerRef.value.scrollTop = itemStore.scrollTop
    }
  })

}

// 在组件挂载时初始化
onMounted(async () => {
  if (itemStore.notes.length == 0) {
    init()
  }
  // 监听全局的 wheel 事件
  // window.addEventListener('wheel', handleGlobalWheel)
})

// 在组件卸载时清理
onUnmounted(() => {
  if (containerRef.value) {
    resizeObserver.unobserve(containerRef.value)
  }

  // 清除仓库状态
  // itemStore.clearData()

  // 移除事件监听
  // window.removeEventListener('wheel', handleGlobalWheel)
})

onActivated(async () => {
  await nextTick() // 等待 DOM 完全挂载

  // 恢复列表数据
  if (itemStore.notes.length > 0) {
    dataState.list = itemStore.notes
    init()
  }
});


</script>

<template>
  <div
    class="fs-virtual-waterfall-container"
    ref="containerRef"
    @scroll="handleScroll"
  >
    <div class="fs-virtual-waterfall-list" :style="listStyle">
      <div v-if="isShow">
        <div
          class="fs-virtual-waterfall-item"
          v-for="{ item, style, imageHeight, width } in renderList"
          :key="item.id"
          :style="style"
        >
          <slot
            name="item"
            :item="item"
            :imageHeight="imageHeight"
            :width="width"
          ></slot>
        </div>
      </div>

      <div id="temporary-list" v-else>
        <div
          v-for="{ item, style, imageHeight, width } in temporaryList"
          :key="item.id"
          :style="style"
        >
          <slot
            name="item"
            :item="item"
            :imageHeight="imageHeight"
            :width="width"
          ></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fs-virtual-waterfall-container {
  width: 100%;
  height: 90vh;
  overflow: scroll;
}
/* 隐藏滚动条 */
.fs-virtual-waterfall-container::-webkit-scrollbar {
  display: none;
}
.fs-virtual-waterfall-list {
  width: 100%;
  position: relative;
}
.fs-virtual-waterfall-item {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
}
</style>

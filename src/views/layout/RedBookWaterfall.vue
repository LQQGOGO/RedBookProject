<script setup>
import {
  ref,
  nextTick,
  computed,
  onMounted,
  onUnmounted,
  defineProps
} from 'vue'
import { debounce, rafThrottle } from '@/utils/tools'
const props = defineProps()
defineSlots()
const containerRef = ref(null)
const listRef = ref(null)
const state = ref({
  isFinish: false,
  loading: false,
  page: 1, //数据的页码
  cardWidth: 0, //卡片的宽度
  cardList: [], //数据源
  cardPos: [], //卡片的位置信息
  columnHeight: new Array(props.column).fill(0), //列高度信息
  preLen: 0
})
const resizeObserver = new ResizeObserver(() => {
  handleResize()
})

//计算出高度最小的那一列的索引和高度
const minColumn = computed(() => {
  let minIndex = -1,
    minHeight = Infinity
  state.value.columnHeight.forEach((item, index) => {
    if (item < minHeight) {
      minHeight = item
      minIndex = index
    }
  })
  return {
    minIndex,
    minHeight
  }
})

//根据页码得到数据
const getCardList = async (page, pageSize) => {
  if (state.value.isFinish) {
    return
  }
  state.value.loading = true
  const list = await props.request(page, pageSize)
  state.value.page++
  if (!list.length) {
    state.value.isFinish = true
    return
  }
  state.value.cardList = [...state.value.cardList, ...list]
  computedCardPos(list)
  state.value.loading = false
}

//计算每个卡片的位置
const computedCardPos = async list => {
  computedImageHeight(list)
  await nextTick()
  computedRealDomPos(list)
}

//计算卡片的图片的高度
const computedImageHeight = list => {
  list.forEach(item => {
    const imageHeight = Math.floor(
      (item.height * state.value.cardWidth) / item.width
    )
    state.value.cardPos.push({
      width: state.value.cardWidth,
      imageHeight: imageHeight,
      cardHeight: 0,
      x: 0,
      y: 0
    })
  })
}

//根据真实dom计算出卡片的具体位置
const computedRealDomPos = list => {
  const children = listRef.value.children
  list.forEach((item, index) => {
    const nextIndex = state.value.preLen + index
    const cardHeight = children[nextIndex].getBoundingClientRect().height
    if (index < props.column && state.value.cardList.length <= props.pageSize) {
      state.value.cardPos[nextIndex] = {
        ...state.value.cardPos[nextIndex],
        cardHeight: cardHeight,
        x:
          nextIndex % props.column !== 0
            ? nextIndex * (state.value.cardWidth + props.gap)
            : 0,
        y: 0
      }
      state.value.columnHeight[nextIndex] = cardHeight + props.gap
    } else {
      const { minIndex, minHeight } = minColumn.value
      state.value.cardPos[nextIndex] = {
        ...state.value.cardPos[nextIndex],
        cardHeight: cardHeight,
        x: minIndex ? minIndex * (state.value.cardWidth + props.gap) : 0,
        y: minHeight
      }
      state.value.columnHeight[minIndex] += cardHeight + props.gap
    }
  })
  state.value.preLen = state.value.cardPos.length
}

//初始化，根据列数计算每列卡片的宽度
const init = () => {
  if (containerRef.value) {
    const containerWidth = containerRef.value.clientWidth
    state.value.cardWidth =
      (containerWidth - props.gap * (props.column - 1)) / props.column
    getCardList(state.value.page, props.pageSize)
    resizeObserver.observe(containerRef.value)
  }
}

const handleScroll = rafThrottle(() => {
  const { scrollTop, clientHeight, scrollHeight } = containerRef.value
  const bottom = scrollHeight - clientHeight - scrollTop
  if (bottom <= props.bottom) {
    !state.value.loading && getCardList(state.value.page, props.pageSize)
  }
})

const handleResize = debounce(() => {
  const containerWidth = containerRef.value.clientWidth
  state.value.cardWidth =
    (containerWidth - props.gap * (props.column - 1)) / props.column
  state.value.columnHeight = new Array(props.column).fill(0)
  state.value.cardPos = []
  state.value.preLen = 0
  computedCardPos(state.value.cardList)
})

onMounted(() => {
  init()
})

onUnmounted(() => {
  if (containerRef.value) {
    resizeObserver.unobserve(containerRef.value)
  }
})
</script>

<template>
  <div class="waterfall-container" ref="containerRef" @scroll="handleScroll">
    <div class="waterfall-list" ref="listRef">
      <div class="waterfall-item">
        <slot name="item" :item="item" :index="index"></slot>
      </div>
    </div>
  </div>
</template>

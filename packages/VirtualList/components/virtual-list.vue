<template>
  <div class="viewport" ref="viewport" @scroll="handleScroll">
    <!-- 滚动条 -->
    <div class="scroll-bar" ref="scrollBar"></div>
    <!-- 渲染的数据 -->
    <div class="scroll-list" :style="{transform:`translate3d(0,${offset}px,0)`}">
        <slot :visibleData="visibleData"></slot>
    </div>
  </div>
</template>

<script>
import throttle from "./";
export default {
  props: {
    size: Number, // 行高
    remain: Number, // 渲染个数
    items: Array, // 渲染数据
    variable: Boolean // 不定高度
  },
  data() {
    return {
      start: 0,
      end: this.remain,
      offset: 0,
      positions: []
    };
  },
  computed: {
    // 可见数据
    visibleData() {
      let start = this.start - this.prevCount;
      let end = this.end + this.nextCount;
      return this.items.slice(start, end);
    },
    // 前面预留几个 （渲染三屏）
    prevCount() {
      return Math.min(this.start, this.remain);
    },
    // 后面预留几个
    nextCount() {
      return Math.min(this.items.length - this.end, this.remain);
    }
  },
  created() {
    this.scrollFn = throttle(this.handleScroll, 200, { leading: false });
  },
  mounted() {
    this.$refs.viewport.style.height = this.size * this.remain + "px";
    this.$refs.scrollBar.style.height = this.items.length * this.size + "px";
    // 缓存每一项高度
    this.cacheList(); // 滚动时获取真实高度更新滚动条高度
  },
  updated() {
    this.$nextTick(() => {
      // 根据加载的DOM 更新缓存中的height\bottom\top
      let nodes = this.$refs.items; // 获取真实节点
      if (!(nodes && nodes.length > 0)) {
        return;
      }
      nodes.forEach(node => {
        let { height } = node.getBoundingClientRect();
        let id = node.getAttribute("vid") - 0;
        let oldHeight = this.positions[id].height;
        let val = oldHeight - height;
        if (val) {
          this.positions[id].height = height;
          this.positions[id].bottom = this.positions[id].bottom - val;
          // 后续元素都要后移
          for (let i = id + 1; i < this.positions.length; i++) {
            this.positions[i].top = this.positions[i - 1].bottom;
            this.positions[i].bottom = this.positions[i].bottom - val;
          }
        }
      });
      // DOM滚动后更新滚动条高度
      this.$refs.scrollBar.style.height =
        this.positions[this.positions.length - 1].bottom + "px";
    });
  },
  methods: {
    cacheList() {
      // 缓存当前项的高度 和 top值、bottom值
      this.positions = this.items.map((item, index) => ({
        height: this.size,
        top: index * this.size,
        bottom: (index + 1) * this.size
      }));
    },
    getStartIndex(value) {
      // 查找当前滚动需要找到的值
      let start = 0;
      let end = this.positions.length - 1;
      let temp = null;
      while (start <= end) {
        let middleIndex = parseInt((start + end) / 2);
        let middleValue = this.positions[middleIndex].bottom;
        if (middleValue == value) {
          return middleIndex + 1;
        } else if (middleValue < value) {
          start = middleIndex + 1;
        } else {
          if (temp == null || temp > middleIndex) {
            temp = middleIndex; // 找到范围
          }
          end = middleIndex - 1;
        }
      }
      return temp;
    },
    handleScroll() {
      this.$emit('scrollEvent',this.$refs.viewport.scrollLeft)
      // 当前滚动多少行，从第几行显示
      let scrollTop = this.$refs.viewport.scrollTop;
      if (this.variable) {
        // 二分查找对应记录
        this.start = this.getStartIndex(scrollTop);
        this.end = this.start + this.remain;
        this.offset = this.positions[this.start - this.prevCount]
          ? this.positions[this.start - this.prevCount].top
          : 0;
      } else {
        this.start = Math.floor(scrollTop / this.size);
        this.end = this.start + this.remain;
        // 定位当前可视区域
        this.offset = (this.start - this.prevCount) * this.size;
      }
    }
  }
};
</script>

<style scoped>
.viewport {
  overflow-y: scroll;
  position: relative;
  width:100%;
}
.scroll-list {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
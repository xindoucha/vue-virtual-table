<template>
  <div class="viewport" ref="viewport" @scroll="handleScroll">
    <!-- scrollBar -->
    <div class="scroll-bar" ref="scrollBar"></div>
    <!-- rendering Data -->
    <div class="scroll-list" :style="{transform:`translate3d(0,${offset}px,0)`}" >
      <slot :visibleData="visibleData" ></slot>
    </div>
  </div>
</template>

<script>
import {throttle} from "./utils.js";
export default {
  name:"virtual-list",
  props: {
    size: Number, // Row height
    remain: Number, // Number of renderings
    items: Array, // Rendering data
    variable: {
      type:Boolean,
      default:false
    } // Variable height
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
    visibleData() {
      let start = this.start - this.prevCount;
      let end = this.end + this.nextCount;
      return this.items.slice(start, end);
    },
    // Render three screens
    prevCount() {
      return Math.min(this.start, this.remain);
    },
    nextCount() {
      return Math.min(this.items.length - this.end, this.remain);
    }
  },
  created() {
    this.scrollFn = throttle(this.handleScroll, 200);
  },
  mounted() {
    this.$refs.viewport.style.height = this.size * this.remain + "px";
    this.$refs.scrollBar.style.height = this.items.length * this.size + "px";
    this.cacheList();
  },
  watch:{
    items:{
      handler(){
        this.$refs.scrollBar.style.height = this.items.length * this.size + "px";
        this.cacheList();
      },
      immediate:true
    }
  },
  updated() {
    this.$nextTick(() => {
      // Update the height\bottom\top in the cache according to the loaded DOM
      let nodes = this.$parent.$refs.items;
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
          // Subsequent elements must be moved back
          for (let i = id + 1; i < this.positions.length; i++) {
            this.positions[i].top = this.positions[i - 1].bottom;
            this.positions[i].bottom = this.positions[i].bottom - val;
          }
        }
      });
      // Update scrollbar's height after DOM scrolling
      this.$refs.scrollBar.style.height =
        this.positions[this.positions.length - 1].bottom + "px";
    });
  },
  methods: {
    // Cache each item's height
    cacheList() {
      this.positions = this.items.map((item, index) => ({
        height: this.size,
        top: index * this.size,
        bottom: (index + 1) * this.size
      }));
    },
    getStartIndex(value) {
      // Find the item index for the current scrollTop value
      if (value <= this.positions[0].bottom) {
        return 0;
      }
      let start = 0;
      let end = this.positions.length - 1;
      while (start <= end) {
        let middleIndex = parseInt((start + end) / 2);
        let middleValue = this.positions[middleIndex].bottom;
        if (middleValue>value && this.positions[middleIndex-1] && this.positions[middleIndex-1].bottom<value) {
          return middleIndex;
        }
        if (middleValue == value) {
          return middleIndex + 1;
        } else if (middleValue < value) {
          start = middleIndex + 1;
        } else {
          end = middleIndex - 1;
        }
      }
    },
    handleScroll() {
      let scrollTop = this.$refs.viewport.scrollTop;
      if (this.variable) {
        this.start = this.getStartIndex(scrollTop);
        this.end = this.start + this.remain;
        this.offset = this.positions[this.start - this.prevCount]
          ? this.positions[this.start - this.prevCount].top
          : 0;
      } else {
        this.start = Math.floor(scrollTop / this.size);
        this.end = this.start + this.remain;
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
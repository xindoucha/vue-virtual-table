<template>
  <div>
    <virtual-list :remain="16" :size="20" :items="arr" :variable="true">
      <div slot-scope="{visibleData}">
        <div v-for="(item) in visibleData" :key="item.id"  ref="items" :vid="item.id">
            {{item.id}}-{{item.age}}-{{item.name}}
        </div>
      </div>
    </virtual-list>
  </div>
</template>

<script>
export default {
  name:'example',
  data(){
    return {
      arr:[]
    }
  },
  created() {
    this.genData();
  },
  methods:{
    genData() {
      for (let i = 0; i < 100; i++) {
        this.arr.push({
          id:i,
          name:"titile"+i,
          age:20 + i
        })
      }
    }
  }
}
</script>
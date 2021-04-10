# vue2-virtual-table
## Introduction
This is a table plugin based on vue2.x. Realize the table display of a large amount of data through the virtual list.

## Installation
```sh
npm install vue2-virtual-table -S
```

## Usage
```js
import virtualTable from 'vue2-virtual-table'
import "vue2-virtual-table/lib/virtualList.css"
 
Vue.use(virtualTable);
```

## Example
```vue
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
```

## Options
### remain
+ Type: Number
+ Required: True
>Number of items to display.
### size
+ Type: Number
+ Required: True
>Estimated height of each row.

### items
+ Type: Array
+ Required: True
> Data to be displayed.

### variable 
+ Type: Boolean
+ Required: False
+ default: False
> Whether to adjust the scroll bar position according to the actual height, the default is false.

## Keywords
vue virtual table scroller


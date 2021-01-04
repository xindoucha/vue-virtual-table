// 导入组件
import VirtualList from './VirtualList/index'

// 定义 install 方法
const install = function (Vue) {
  if (install.installed) return
  install.installed = true
  // 注册全局组件
  Vue.component(VirtualList.name, VirtualList)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  // 导出的对象必须具备一个 install 方法
  install
}
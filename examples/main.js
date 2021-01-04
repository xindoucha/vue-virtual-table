import Vue from 'vue'
import App from './App.vue'
import VirtualList from '../packages/index'
Vue.use(VirtualList)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

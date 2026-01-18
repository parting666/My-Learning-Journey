// src/main.js
import Vue from 'vue';
import App from './App.vue';

// 引入 Element UI 及其样式
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 全局注册 Element UI
Vue.use(ElementUI);

// 创建 Vue 实例并挂载
new Vue({
  render: h => h(App)
}).$mount('#app');
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import { handleResponse } from './utils/commonService/handleResponse';
import ElementUI from 'element-ui';
import component from './components/index';
import moment from 'moment';
import api from './api/index';

import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/base.scss'; // 全局自定义的css样式
import './assets/css/element-reset.scss';
import './assets/fontIcon/iconfont.css'; // 自定义图标


Vue.use(api)
Vue.use(ElementUI);
Vue.filter('dateFilter', function (value, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(value).format(format)
})

Vue.config.productionTip = false;
Vue.prototype.$handleResponse = handleResponse;
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()

// 注册全局组件
Object.keys(component).forEach(key => {
  var name = key.replace(/(\w)/, (v) => v.toUpperCase()); // 首字母大写
  Vue.component(`${name}`, component[key]);
});

router.beforeResolve((to, from, next) => { // 全局路由钩子
  if (to.path == '/login') {
    localStorage.removeItem('userInfo');
    store.dispatch('saveUser', '');
  } else {
    let userInfo = store.getters.userInfo;
    if (!userInfo.token){
      let user_info = localStorage.getItem('userInfo');
       user_info = JSON.parse(user_info);
       store.dispatch('saveUser', user_info)
    }
  }
  next()
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import { handleResponse } from './utils/commonService/handleResponse';
import ElementUI from 'element-ui';
// import GeminiScrollbar from 'vue-gemini-scrollbar'
import component from './components/index';
import moment from 'moment';
import api from './api/index';

import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/base.scss'; // 全局自定义的css样式
import './assets/css/element-reset.scss';
import './assets/fontIcon/iconfont.css'; // 自定义图标


// 引入Ueidtor
import '../static/scripts/cropper/cropper.css'; // 裁剪功能
import '../static/scripts/ueditor/themes/default/css/ueditor.css'; // 编辑器的样式

import '../static/scripts/ueditor/ueditor.config';
import '../static/scripts/ueditor/ueditor.all';
import '../static/scripts/ueditor/lang/zh-cn/zh-cn';
import '../static/scripts/ueditor/third-party/codemirror/codemirror.js'
import '../static/scripts/ueditor/third-party/zeroclipboard/ZeroClipboard.js'


Vue.use(api)
Vue.use(ElementUI);
// Vue.use(GeminiScrollbar);
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

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})

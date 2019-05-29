import Vue from 'vue'
import Router from 'vue-router'

//引入子路由
import Login from './login'
import Home from './home'
import NotFound from '../pages/error/404'
import Layout from '../pages/layout/Layout'

Vue.use(Router)
const baseRouter = [{path: '/', redirect:"/login"}];
const ErrorPage = [{  path: '*', component: Layout, children: [{ path: '', component: NotFound, name: '未知页面',}]}];

let router = new Router({
  // mode: 'history',
  routes: baseRouter.concat(Login, Home, ErrorPage)
})

router.beforeEach(function (to, from, next) {
  document.title = '安全管理后台';
  let login = localStorage.getItem('userInfo');
  let path = to.path;
  if (path === '/login') {
    next();
    return;
  }
  if (login) { // 判断是否登录，防止未登录时浏览器后退回到上一个页面
      next()
  } else {
    next({
      path: '/login'
    })
  }
})

export default router

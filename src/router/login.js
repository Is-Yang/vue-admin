//const Login = r => require.ensure([], () => r(require('../components/Login')), 'login')
// 懒加载暂时兼容不了IE 11 先不用

import Login from '../pages/login/Login';

export default [{
  path: '/login',
  component: Login,
  name : '登录'
}]
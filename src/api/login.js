import http from '@/utils/request';

// 登录接口
export function login(params){
  return http.postAjax('/manager_login', params);
}

// 退出接口
export function logout() {
  return http.postAjax('/site/logout', {});
}

// 获取菜单接口
export function getMenu(){
  return http.getAjax('/menu/auth-nodes', {})
}

// 用户--密码设置
export function editAccount(params) {
  return http.postAjax('/user/pwd', params);
}
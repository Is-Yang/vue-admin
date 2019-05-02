import axios from 'axios';
import qs from 'qs';
import * as userInfo from './commonService/getUserInfo';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.timeout = 120000; // 设置两份钟
axios.defaults.baseURL = process.env.API;
window.scrmApi = process.env.API; // 全局的调用后台接口，不直接用process.env.API是考虑到 API中有些没有协议的配置，可以在这里全局配上http等协议

window.UEDITOR_SERVER_URL = process.env.oldHost; // Ueditor后端的接口

const http = axios.create();

// 添加一个请求拦截器
http.interceptors.request.use(
  config => {
    config.headers['Authorization'] = userInfo.getAuthorization() || '';
    return config;
  },
  error => {
    // 请求出错
    console.log('发送错误', error);
  }
);

// 添加一个响应拦截器
http.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

// get请求
http.getAjax = function(url, params) {
  return http.get(url, { params: params });
 }
// post 请求
http.postAjax = function (url, params, options, isJson=false) {
  return isJson ? http.post(url, params, options) : http.post(url, qs.stringify(params), options);
}
// 更新接口 参数为 form-data形式传
http.updateAjax = function (url, params) {
  return http.put(url, qs.stringify(params));
}
// 删除接口
http.deleteAjax = function (url) {
  return http.delete(url);
}
// get方式请求下载
http.getDownAjax = function(url, params) {
  return http.get(url,  {params: params, responseType: 'blob'});
}

// 上传 formData格式
http.uploadPhoto = function(url, formData) { 
  return http.post(url, formData);
}


export default http;

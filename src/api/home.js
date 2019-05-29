import http from '@/utils/request';
import * as userInfo from "@/utils/commonService/getUserInfo";
import store from '../store';

let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());

export function getIndexPage(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.getAjax('/manager_first_page?token=' + token, params)
}

// 获取已管控的任务列表
export function getCheckList(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.getAjax('/manager_check_list?token=' + token, params)
}

// 获取未管控的列表
export function getUCheckList(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.getAjax('/manager_ucheck_list?token=' + token, params)
}

// app账号列表
export function getAccountList(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.getAjax('/manager_account_list?token=' + token, params)
}

// app用户账号添加
export function addAccount(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  let header = {'Content-Type': 'application/json'};
  return http.postAjax('/manager_account_add?token=' + token, params, header, true)
}

// app用户账号修改
export function updateAccount(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  let header = {'Content-Type': 'application/json'};
  return http.postAjax('/manager_account_change?token=' + token, params, header, true)
}

// 根据user_id获取账号详情
export function getAccountById(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.getAjax('/manager_account_get?token=' + token, params)
}

// app用户账号删除
export function delAccount(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.postAjax('/manager_account_delete?token=' + token, params)
}

// 获取公司列表
export function getCompanyList(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.getAjax('/manager_company_list?token=' + token, params)
}

// 创建公司信息
export function addCompany(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  let header = {'Content-Type': 'application/json'};
  return http.postAjax('/manager_company_add?token=' + token, params, header, true)
}

// 修改公司信息
export function updateCompany(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  let header = {'Content-Type': 'application/json'};
  return http.postAjax('/manager_company_change?token=' + token, params, header, true)
}

// 删除公司信息
export function delCompany(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.getAjax('/manager_company_delete?token=' + token, params)
}

// 部门信息列表
export function getDepartmentList(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.getAjax('/manager_department_list?token=' + token, params)
}

// 部门信息添加
export function addDepartment(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.postAjax('/manager_department_add?token=' + token, params)
}

// 修改部门信息
export function updateDepartment(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.postAjax('/manager_department_change?token=' + token, params)
}

// 删除部门信息
export function delDepartment(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.postAjax('/manager_department_delete?token=' + token, params)
}

// 应急信息发送
export function genMessage(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  let header = {'Content-Type': 'application/json'};
  return http.postAjax('/manager_gen_message?token=' + token, params, header, true)
}

// 获取应急消息列表
export function getMessageList(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.getAjax('/manager_message_list?token=' + token, params)
}

// 删除应急消息
export function delMessage(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.postAjax('/manager_delete_message?token=' + token, params);
}

// 获取任务详细信息
export function getTaskDesc(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.postAjax('/manager_get_task_desc?token=' + token, params)
}

// 任务详细解释添加
export function addTaskDesc(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  let header = {'Content-Type': 'application/json'};
  return http.postAjax('/manager_task_desc_add?token=' + token, params, header, true)
}

// 任务详细更新
export function updateTaskDesc(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  let header = {'Content-Type': 'application/json'};
  return http.postAjax('/manager_task_desc_update?token=' + token, params, header, true)
}

// 删除任务详细信息
export function delTaskDesc(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.postAjax('/manage_delete_task_desc?token=' + token, params)
}

// 所有公司的所有部门
export function getCompanyDepartment() {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.getAjax('/manager_company_department?token=' + token)
}

// 文件列表
export function getFileList(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.getAjax('/manager_file_list?token=' + token, params)
}

// 上传文件
export function uploadFile(params) {
  return http.postAjax('/manager_file_upload', params)
}

// 下载文件
export function downloadFile(params) {
  return http.getAjax('/manager_file_download', params);
}

// 删除文件
export function delFile(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.postAjax('/manager_file_delete?token=' + token, params)
}

// 宣传图片列表
export function getImgList(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.getAjax('/manager_get_upload_img?token=' + token, params)
}

// 上传图片
export function uploadImg(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.postAjax('/manager_upload_img?token=' + token, params)
}

// 下载图片
export function getImg(params) {
  return http.getAjax('/manager_get_img'+ params.img);
}

// 删除图片
export function delImg(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.postAjax('/manager_img_delete?token=' + token, params)
}

// 更新图片标题
export function updateManageImg(params) {
  let token = user_info.token ? user_info.token : store.getters.userInfo.token;
  return http.postAjax('/manager_update_img_title?token=' + token, params)
}
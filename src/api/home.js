import http from '@/utils/request';
import * as userInfo from "@/utils/commonService/getUserInfo";

let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());

// 统计-搜索选项
export function getIndexOption(params) {
  return http.getAjax('/manager_first_page?token=' + user_info.token, params)
}

// 获取已管控的任务列表
export function getCheckList(params) {
  return http.getAjax('/manager_check_list?token=' + user_info.token, params)
}

// 获取未管控的列表
export function getUCheckList(params) {
  return http.getAjax('/manager_ucheck_list?token=' + user_info.token, params)
}

// app账号列表
export function getAccountList(params) {
  return http.getAjax('/manager_account_list?token=' + user_info.token, params)
}

// app用户账号添加
export function addAccount(params) {
  let header = {'Content-Type': 'application/json'};
  return http.postAjax('/manager_account_add?token=' + user_info.token, params, header, true)
}

// app用户账号修改
export function updateAccount(params) {
  let header = {'Content-Type': 'application/json'};
  return http.postAjax('/manager_account_change?token=' + user_info.token, params, header, true)
}

// 根据user_id获取账号详情
export function getAccountById(params) {
  return http.getAjax('/manager_account_get?token=' + user_info.token, params)
}

// app用户账号删除
export function delAccount(params) {
  return http.postAjax('/manager_account_delete?token=' + user_info.token, params)
}

// 获取公司列表
export function getCompanyList(params) {
  return http.getAjax('/manager_company_list?token=' + user_info.token, params)
}

// 创建公司信息
export function addCompany(params) {
  let header = {'Content-Type': 'application/json'};
  return http.postAjax('/manager_company_add?token=' + user_info.token, params, header, true)
}

// 修改公司信息
export function updateCompany(params) {
  let header = {'Content-Type': 'application/json'};
  return http.postAjax('/manager_company_change?token=' + user_info.token, params, header, true)
}

// 删除公司信息
export function delCompany(params) {
  return http.getAjax('/manager_company_delete?token=' + user_info.token, params)
}

// 部门信息列表
export function getDepartmentList(params) {
  return http.getAjax('/manager_department_list?token=' + user_info.token, params)
}

// 部门信息添加
export function addDepartment(params) {
  return http.postAjax('/manager_department_add?token=' + user_info.token, params)
}

// 修改部门信息
export function updateDepartment(params) {
  return http.postAjax('/manager_department_change?token=' + user_info.token, params)
}

// 获取一个公司下面的所有部门
export function companyDepartment(params) {
  return http.getAjax('/manager_department_company_delete?token=' + user_info.token, params)
}

// 删除部门信息
export function delDepartment(params) {
  return http.postAjax('/manager_department_delete?token=' + user_info.token, params)
}

// 应急信息发送
export function genMessage(params) {
  return http.postAjax('/manager_gen_message?token=' + user_info.token, params)
}

// 获取应急消息列表
export function getMessageList(params) {
  return http.postAjax('/manager_message_list?token=' + user_info.token, params)
}

// 获取任务详细信息
export function getTaskDesc(params) {
  return http.postAjax('/manager_get_task_desc?token=' + user_info.token, params)
}

// 任务详细解释添加
export function addTaskDesc(params) {
  let header = {'Content-Type': 'application/json'};
  return http.postAjax('/manager_task_desc_add?token=' + user_info.token, params, header, true)
}

// 任务详细更新
export function updateTaskDesc(params) {
  let header = {'Content-Type': 'application/json'};
  return http.postAjax('/manager_task_desc_update?token=' + user_info.token, params, header, true)
}

// 删除任务详细信息
export function delTaskDesc(params) {
  return http.postAjax('/manage_delete_task_desc?token=' + user_info.token, params)
}

// 所有公司的所有部门
export function getCompanyDepartment() {
  return http.getAjax('/manager_company_department?token=' + user_info.token)
}

// 文件列表
export function getFileList(params) {
  return http.getAjax('/manager_file_list?token=' + user_info.token, params)
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
  return http.postAjax('/manager_file_delete?token=' + user_info.token, params)
}

// 获取图片
export function getImg(params) {
  return http.getAjax('/manager_get_img', params);
}
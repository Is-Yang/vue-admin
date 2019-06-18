import http from '@/utils/request';
import * as userInfo from "@/utils/commonService/getUserInfo";
import store from '../store';

let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
let token = user_info.token ? user_info.token : store.getters.userInfo.token;

export function getIndexPage(params) {
    return http.getAjax('/manager_first_page?token=' + token, params)
}

// 获取已管控的任务列表
export function getCheckList(params) {
    return http.getAjax('/manager_check_list?token=' + token, params)
}

// 获取未管控的列表
export function getUCheckList(params) {
    return http.getAjax('/manager_ucheck_list?token=' + token, params)
}

// app账号列表
export function getAccountList(params) {
    return http.getAjax('/manager_account_list?token=' + token, params)
}

// app用户账号添加
export function addAccount(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_account_add?token=' + token, params, header, true)
}

// app用户账号修改
export function updateAccount(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_account_change?token=' + token, params, header, true)
}

// 根据user_id获取账号详情
export function getAccountById(params) {
    return http.getAjax('/manager_account_get?token=' + token, params)
}

// app用户账号删除
export function delAccount(params) {
    return http.postAjax('/manager_account_delete?token=' + token, params)
}

// 获取公司列表
export function getCompanyList(params) {
    return http.getAjax('/manager_company_list?token=' + token, params)
}

// 创建公司信息
export function addCompany(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_company_add?token=' + token, params, header, true)
}

// 修改公司信息
export function updateCompany(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_company_change?token=' + token, params, header, true)
}

// 删除公司信息
export function delCompany(params) {
    return http.getAjax('/manager_company_delete?token=' + token, params)
}

// 部门信息列表
export function getDepartmentList(params) {
    return http.getAjax('/manager_department_list?token=' + token, params)
}

// 部门信息添加
export function addDepartment(params) {
    return http.postAjax('/manager_department_add?token=' + token, params)
}

// 修改部门信息
export function updateDepartment(params) {
    return http.postAjax('/manager_department_change?token=' + token, params)
}

// 删除部门信息
export function delDepartment(params) {
    return http.postAjax('/manager_department_delete?token=' + token, params)
}

// 应急信息发送
export function genMessage(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_gen_message?token=' + token, params, header, true)
}

// 获取应急消息列表
export function getMessageList(params) {
    return http.getAjax('/manager_message_list?token=' + token, params)
}

// 删除应急消息
export function delMessage(params) {
    return http.postAjax('/manager_delete_message?token=' + token, params);
}

// 获取任务详细信息
export function getTaskDesc(params) {
    // return http.getAjax('/manager_get_task_desc?token=' + token, params)
    return http.getAjax('/manager_task_list?token=' + token, params)
}

// 任务详细解释添加
export function addTaskDesc(params) {
    let header = { 'Content-Type': 'application/json' };
    // return http.postAjax('/manager_task_desc_add?token=' + token, params, header, true)
    return http.postAjax('/manager_task_add?token=' + token, params, header, true)
}

// 任务详细更新
export function updateTaskDesc(params) {
    let header = { 'Content-Type': 'application/json' };
    // return http.postAjax('/manager_task_desc_update?token=' + token, params, header, true)
    return http.postAjax('/manager_task_total_update?token=' + token, params, header, true)
}

// 删除任务详细信息
export function delTaskDesc(params) {
    // return http.postAjax('/manage_delete_task_desc?token=' + token, params)
    return http.postAjax('/manager_delete_task?token=' + token, params)
}

// 所有公司的所有部门
export function getCompanyDepartment() {
    return http.getAjax('/manager_company_department?token=' + token)
}

// 文件列表
export function getFileList(params) {
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
    return http.postAjax('/manager_file_delete?token=' + token, params)
}

// 宣传图片列表
export function getImgList(params) {
    return http.getAjax('/manager_get_upload_img?token=' + token, params)
}

// 上传图片
export function uploadImg(params) {
    return http.postAjax('/manager_upload_img?token=' + token, params)
}

// 下载图片
export function getImg(params) {
    return http.getAjax('/manager_get_img' + params.img);
}

// 删除图片
export function delImg(params) {
    return http.postAjax('/manager_img_delete?token=' + token, params)
}

// 更新图片标题
export function updateManageImg(params) {
    return http.postAjax('/manager_update_img_title?token=' + token, params)
}

// 根据管理风险等级获取公司类型 ?token=f918e561892d4fc587bd628f8484d03f&risk_level=2&type=0
export function companyByType(params) {
    return http.getAjax('/manager_company_by_type?token=' + token, params)
}

// 未监控管理列表信息 manager_company_uncheck?token=5e0929a65c364432b1cfe86903f713d7&page=0&company_id=1
export function companyUncheck(params) {
    return http.getAjax('/manager_company_uncheck?token=' + token, params)
}

// 任务详情 get_check_desc?token=a09ed7d940204e259c5110959dc69f21&task_id=1
export function getCheckDesc(params) {
    return http.getAjax('/get_check_desc?token=' + token, params);
}

// 获取上报隐患 /get_check_info?task_id=11&type=0&token=a09ed7d940204e259c5110959dc69f21
export function getCheckInfo(params) {
    return http.getAjax('/get_check_info?token=' + token, params);
}

// 隐患处理 get_check_config?task_id=16&token=a09ed7d940204e259c5110959dc69f21
export function getCheckConfig(params) {
    return http.getAjax('/get_check_config?token=' + token, params);
}

// 整改隐患 manager_check_submit?task_id=16&token=a09ed7d940204e259c5110959dc69f21
export function getCheckSubmit(params) {
    return http.getAjax('/manager_check_submit?token=' + token, params);
}

// 大分类位置数据
export function getPositionList(params) {
    return http.getAjax('/manager_position_list?token=' + token, params);
}

// 小分类位置数据
export function getPositionDetailList(params) {
    return http.getAjax('/manager_position_detail_list?token=' + token, params);
}

// 大分类数据删除
export function delPosition(params) {
    return http.postAjax('/manager_position_delete?token=' + token, params)
}

// 小分类数据删除
export function delPositionDetail(params) {
    return http.postAjax('/manager_position_detail_delete?token=' + token, params)
}

// 大分类数据添加
export function addPosition(params) {
    return http.postAjax('/manager_position_add?token=' + token, params)
}

// 小分类数据添加
export function addPositionDetail(params) {
    return http.postAjax('/manager_position_detail_add?token=' + token, params)
}

// 大分类数据更新
export function uploadPosition(params) {
    return http.postAjax('/manager_position_update?token=' + token, params)
}

// 小分类数据更新
export function uploadPositionDetail(params) {
    return http.postAjax('/manager_position_detail_update?token=' + token, params)
}

// 用户列表
export function checkTask() {
    return http.getAjax('/manager_check_task_request?token=' + token);
}

import http from '@/utils/request';
import * as userInfo from "@/utils/commonService/getUserInfo";
import store from '../store';

export function getToken() {
    var user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
    var token = store.getters.userInfo.token ? store.getters.userInfo.token : user_info.token;
    return token;
}

export function getIndexPage(params) {
    return http.getAjax('/manager_first_page', params)
}

// 获取已管控的任务列表
export function getCheckList(params) {
    return http.getAjax('/manager_check_list?token=' + getToken(), params)
}

// 获取未管控的列表
export function getUCheckList(params) {
    return http.getAjax('/manager_ucheck_list?token=' + getToken(), params)
}

// app账号列表
export function getAccountList(params) {
    return http.getAjax('/manager_account_list?token=' + getToken(), params)
}

// app用户账号添加
export function addAccount(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_account_add?token=' + getToken(), params, header, true)
}

// app用户账号修改
export function updateAccount(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_account_change?token=' + getToken(), params, header, true)
}

// 根据user_id获取账号详情
export function getAccountById(params) {
    return http.getAjax('/manager_account_get?token=' + getToken(), params)
}

// app用户账号删除
export function delAccount(params) {
    return http.postAjax('/manager_account_delete?token=' + getToken(), params)
}

// 获取公司列表
export function getCompanyList(params) {
    return http.getAjax('/manager_company_list?token=' + getToken(), params)
}

// 获取所有公司
export function getAllCompanyList(params) {
    return http.getAjax('/manager_company_list_total?token=' + getToken(), params)
}

// 创建公司信息
export function addCompany(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_company_add?token=' + getToken(), params, header, true)
}

// 修改公司信息
export function updateCompany(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_company_change?token=' + getToken(), params, header, true)
}

// 删除公司信息
export function delCompany(params) {
    return http.getAjax('/manager_company_delete?token=' + getToken(), params)
}

// 部门信息列表
export function getDepartmentList(params) {
    return http.getAjax('/manager_department_list?token=' + getToken(), params)
}

// 部门信息添加
export function addDepartment(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_department_add?token=' + getToken(), params, header, true)
}

// 修改部门信息
export function updateDepartment(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_department_change?token=' + getToken(), params, header, true)
}

// 删除部门信息
export function delDepartment(params) {
    return http.postAjax('/manager_department_delete?token=' + getToken(), params)
}

// 应急信息发送
export function genMessage(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_gen_message?token=' + getToken(), params, header, true)
}

// 获取应急消息列表
export function getMessageList(params) {
    return http.getAjax('/manager_message_list?token=' + getToken(), params)
}

// 删除应急消息
export function delMessage(params) {
    return http.postAjax('/manager_delete_message?token=' + getToken(), params);
}

// 获取任务详细信息
export function getTaskDesc(params) {
    // return http.getAjax('/manager_get_task_desc?token=' + getToken(), params)
    return http.getAjax('/manager_task_list?token=' + getToken(), params)
}

// 任务详细解释添加
export function addTaskDesc(params) {
    let header = { 'Content-Type': 'application/json' };
    // return http.postAjax('/manager_task_desc_add?token=' + getToken(), params, header, true)
    return http.postAjax('/manager_task_add?token=' + getToken(), params, header, true)
}

// 任务详细更新
export function updateTaskDesc(params) {
    let header = { 'Content-Type': 'application/json' };
    // return http.postAjax('/manager_task_desc_update?token=' + getToken(), params, header, true)
    return http.postAjax('/manager_task_total_update?token=' + getToken(), params, header, true)
}

// 删除任务详细信息
export function delTaskDesc(params) {
    // return http.postAjax('/manage_delete_task_desc?token=' + getToken(), params)
    return http.postAjax('/manager_delete_task?token=' + getToken(), params)
}

// 所有公司的所有部门
export function getCompanyDepartment() {
    return http.getAjax('/manager_company_department?token=' + getToken())
}

// 文件列表
export function getFileList(params) {
    return http.getAjax('/manager_file_list?token=' + getToken(), params)
}

// 上传文件
export function uploadFile(params) {
    return http.uploadForm('/manager_file_upload?token=' + getToken(), params)
}

// 下载文件
export function downloadFile(params) {
    return http.getAjax('/manager_file_download', params);
}

// 删除文件
export function delFile(params) {
    return http.postAjax('/manager_file_delete?token=' + getToken(), params)
}

// 宣传图片列表
export function getImgList(params) {
    return http.getAjax('/manager_get_upload_img?token=' + getToken(), params)
}

// 上传图片
export function uploadImg(params) {
    return http.postAjax('/manager_upload_img?token=' + getToken(), params)
}

// 下载图片
export function getImg(params) {
    return http.getAjax('/manager_get_img' + params.img);
}

// 删除图片
export function delImg(params) {
    return http.postAjax('/manager_img_delete?token=' + getToken(), params)
}

// 更新图片标题
export function updateManageImg(params) {
    return http.postAjax('/manager_update_img_title?token=' + getToken(), params)
}

// 根据管理风险等级获取公司类型 ?token=f918e561892d4fc587bd628f8484d03f&risk_level=2&type=0
export function companyByType(params) {
    return http.getAjax('/manager_company_by_type', params)
}

// 未监控管理列表信息 manager_company_uncheck?token=5e0929a65c364432b1cfe86903f713d7&page=0&company_id=1
export function companyUncheck(params) {
    return http.getAjax('/manager_company_uncheck?token=' + getToken(), params)
}

// 任务详情 get_check_desc?token=a09ed7d940204e259c5110959dc69f21&task_id=1
export function getCheckDesc(params) {
    return http.getAjax('/get_check_desc?token=' + getToken(), params);
}

// 获取上报隐患 /get_check_info?task_id=11&type=0&token=a09ed7d940204e259c5110959dc69f21
export function getCheckInfo(params) {
    return http.getAjax('/get_check_info?token=' + getToken(), params);
}

// 隐患处理 get_check_config?task_id=16&token=a09ed7d940204e259c5110959dc69f21
export function getCheckConfig(params) {
    return http.getAjax('/get_check_config?token=' + getToken(), params);
}

// 整改隐患 manager_check_submit?task_id=16&token=a09ed7d940204e259c5110959dc69f21
export function getCheckSubmit(params) {
    return http.getAjax('/manager_check_submit?token=' + getToken(), params);
}

// 大分类位置数据
export function getPositionList(params) {
    return http.getAjax('/manager_position_list?token=' + getToken(), params);
}

// 小分类位置数据
export function getPositionDetailList(params) {
    return http.getAjax('/manager_position_detail_list?token=' + getToken(), params);
}

// 大分类数据删除
export function delPosition(params) {
    return http.postAjax('/manager_position_delete?token=' + getToken(), params)
}

// 小分类数据删除
export function delPositionDetail(params) {
    return http.postAjax('/manager_position_detail_delete?token=' + getToken(), params)
}

// 大分类数据添加
export function addPosition(params) {
    return http.postAjax('/manager_position_add?token=' + getToken(), params)
}

// 小分类数据添加
export function addPositionDetail(params) {
    return http.postAjax('/manager_position_detail_add?token=' + getToken(), params)
}

// 大分类数据更新
export function uploadPosition(params) {
    return http.postAjax('/manager_position_update?token=' + getToken(), params)
}

// 小分类数据更新
export function uploadPositionDetail(params) {
    return http.postAjax('/manager_position_detail_update?token=' + getToken(), params)
}

// 用户列表
export function checkTask(params) {
    return http.getAjax('/manager_check_task_request?token=' + getToken(), params);
}

/**
 * 2019-07-19
 * is-yang
 **/
// 添加企业账号接口
export function addCompanyAccount(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_add_company_account?token=' + getToken(), params, header, true)
}

// 获取企业账号列表
export function getCompanyAccount(params) {
    return http.getAjax('/manager_get_company_account_list?token=' + getToken(), params);
}

// 添加企业账户所需下拉框信息
export function getSelectInfo() {
    return http.getAjax('/manager_company_add_info?token=' + getToken());
}

// 地理信息列表（所属区域）
export function getAreaList(params) {
    return http.getAjax('/manager_area_list?token=' + getToken(), params);
}

// 企业监控列表
export function companyCheckList(params) {
    return http.getAjax('/manager_company_check?token=' + getToken(), params);
}

// 任务信息列表  创建任务所需求请求的下拉框数据
export function requestCompanyCheckInfo(params) {
    return http.getAjax('/manager_request_company_check_info?token=' + getToken(), params);
}

// 任务信息列表 
export function companyTaskList(params) {
    return http.getAjax('/manager_company_task_list?token=' + getToken(), params);
}

// 隐患整改过程导出
export function exportWord(params) {
    let header = { responseType: 'arraybuffer' }
    return http.postAjax('/export_word?token=' + getToken(), params, header, true);
}

// 添加企业管理端账号
export function addAccountM(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_add_accuont_m?token=' + getToken(), params, header, true)
}

// 修改企业管理端账号
export function updateAccountM(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_update_accuont_m?token=' + getToken(), params, header, true)
}

// 删除企业管理端账号
export function deleteAccountM(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_delete_accuont_m?token=' + getToken() + '&user_id=' + params.user_id, header, true)
}

// 政府端发送消息
export function sendMessage(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_sent_message?token=' + getToken(), params, header, true)
}

// 企业端账户列表
export function getManagerUserList(params) {
    return http.getAjax('/manager_manager_user_list?token=' + getToken(), params);
}

// 企业端添加修改账号的下拉框数据
export function getManagerCompanyDepartMent(params) {
    return http.getAjax('/manager_company_department_info?token=' + getToken(), params);
}

// 企业端获取员工账号列表
export function getManagerAccountList(params) {
    return http.getAjax('/manager_company_account_list?token=' + getToken(), params);
}

// 平台端-政府账号根据user_id获取详情
export function getMAccountById(params) {
    return http.getAjax('/manager_get_account_m?token=' + getToken(), params);
}

// 政府端，平台端-列表消息接口
export function getCompanyMessageList(params) {
    return http.getAjax('/manager_get_company_message_list?token=' + getToken(), params);
}

// 政府端-删除消息
export function delCompanyMessage(params) {
    return http.postAjax('/manager_company_message_delete?token=' + getToken(), params);
}

// 政府端-获取公司下拉框
export function getGovCompanySelect() {
    return http.getAjax('/manager_get_gov_company?token=' + getToken());
}

// 获取企业的分类列表
export function getCompanyPostion(params) {
    return http.getAjax('/manager_get_company_position?token=' + getToken(), params);
}

// 获取友情链接接口
export function getFriendLink() {
    return http.getAjax('/manager_get_friend_link?token=' + getToken());
}

// 修改友情链接接口
export function updateFriendLink(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_update_friend_link?token=' + getToken(), params, header, true)
}

// 编辑时获取公司信息
export function getCompanyById(params) {
    return http.getAjax('/manager_get_company_by_id?token=' + getToken(), params);
}

// 企业端-获得应急人员列表
export function getCompanyContainer(params) {
    return http.getAjax('/get_company_container?token=' + getToken(), params);
}

// 企业端-添加应急人员
export function addCompanyContainer(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/add_company_container?token=' + getToken(), params, header, true)
}

// 企业端-修改应急人员
export function updateCompanyContainer(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/update_company_container?token=' + getToken(), params, header, true)
}

// 企业端-删除应急人员
export function deleteCompanyContainer(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/delete_company_container?token=' + getToken() + '&user_id=' + params.user_id, header, true)
}

// 企业端-首页
export function getCompanyShowInfo() {
    return http.getAjax('/get_company_show_info?token=' + getToken());
}

// 企业端-风险功能
export function getRiskCheckTask(params) {
    return http.getAjax('/get_risk_check_task?token=' + getToken(), params);
}

//  企业端-监控任务 
export function getTypeCheckTask(params) {
    return http.getAjax('/get_type_check_task?token=' + getToken(), params);
}

// 企业端-隐患功能 
export function getProblemCheckTask(params) {
    return http.getAjax('/get_problem_check_task?token=' + getToken(), params);
}

// 平台端-按照公司进行分类
export function getMCompanyPostionList(params) {
    return http.getAjax('/manager_company_position_list?token=' + getToken(), params);
}

// 平台端-按照大分类获取小分类
export function getMPosPostionDetailList(params) {
    return http.getAjax('/manager_pos_position_detail_list?token=' + getToken(), params);
}

// 平台端-企业地区分类搜索下拉选择
export function geAreaSelect() {
    return http.getAjax('/get_area_select?token=' + getToken());
}

// 政府端-获取相应管理地区的子账户权限
export function getTokenReload(params) {
    return http.getAjax('/token_reload?token=' + getToken(), params);
}

// 政府端-获取企业账号
export function getMGovAccountList(params) {
    return http.getAjax('/manager_gov_account_list?token=' + getToken(), params);
}

// 政府端-所有区域列表
export function mAreaListTotal() {
    return http.getAjax('/manager_area_list_total?token=' + getToken());
}

// 平台端-获得三级子项列表
export function mGetThree(params) {
    return http.getAjax('/manager_get_three?token=' + getToken(), params);
}

// 平台端-添加三级子项
export function addThree(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_insert_three?token=' + getToken(), params, header, true)
}

// 平台端-修改三级子项
export function updateThree(params) {
    let header = { 'Content-Type': 'application/json' };
    return http.postAjax('/manager_update_three?token=' + getToken(), params, header, true)
}

// 平台端-删除三级子项
export function deleteThree(params) {
    return http.postAjax('/manager_delete_three?token=' + getToken(), params)
}

// 获取消息文件
export function messageFile(params) {
    return http.postAjax('/manager_upload_message_file?token=' + getToken(), params);
}

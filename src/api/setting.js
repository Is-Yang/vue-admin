import http from '@/utils/request';

// 用户-列表
export function getUserList(params) {
  return http.getAjax('/user', params)
}

// 用户-停用
export function isBan(params) {
  return http.postAjax('/user/ban', params);
}

// 用户-新增
export function addUser(params) {
  return http.postAjax('/user', params);
}

// 用户-更新
export function updataUser(id, params) {
  return http.updateAjax('/user/' + id, params);
}

// 用户-删除
export function deleteUser(id) {
  return http.deleteAjax('/user/' + id);
}

// 用户-查看
export function viewUser(id) {
  return http.getAjax('/user/' + id);
}

// 角色-列表
export function getRoleList(params) {
  return http.getAjax('/role', params);
}

// 角色-新增
export function addRole(params) {
  return http.postAjax('/role', params);
}

// 角色-编辑
export function updataRole(name, params) {
  return http.updateAjax('/role/' + name, params);
}

// 角色-查看
export function viewRole(name) {
  return http.getAjax('/role/' + name);
}

// 角色-删除
export function deleteRole(name) {
  return http.deleteAjax('/role/' + name);
}

// 菜单-列表
export function menuList(params) {
  return http.getAjax('/menu', params);
}

// 菜单-新增
export function addMenu(params) {
  return http.postAjax('/menu', params);
}

// 菜单-更新
export function updateMenu(id, params) {
  return http.updateAjax('/menu/' + id, params);
}

// 菜单-查看
export function viewMenu(id) {
  return http.getAjax('/menu/' + id);
}

// 菜单-删除
export function deleteMenu(id) {
  return http.deleteAjax('/menu/' + id);
}

// 菜单-分类节点
export function nodesMenu() {
  return http.getAjax('/menu/nodes');
}

// 组织-级别列表
export function gerOrgNodes() {
  return http.getAjax('/org/nodes');
}

// 组织-新增
export function addOrg(params) {
  return http.postAjax('/org', params);
}

// 组织-管理品牌
export function orgBrand(params) {
  return http.getAjax('/org/brand', params);
}

// 组织-查看
export function viewOrg(id) {
  return http.getAjax('/org/' + id);
}

// 组织-编辑
export function updateOrg(id, params) {
  return http.updateAjax('/org/' + id, params);
}

// 组织-删除
export function deleteOrg(id) {
  return http.deleteAjax('/org/' + id);
}

// 考核目标-设置
export function objectiveSet(params) {
  return http.postAjax('/objective/set', params);
}

// 考核目标-查看
export function viewObjective(id) {
  return http.getAjax('/objective/' + id);
}

// 考核目标-查看集团考核目标
export function groupObjectiveInfo(group_id) {
  return http.getAjax('/objective/info', group_id);
}

// 组织-当前组织下门店列表
export function getAreaByOrg(params) {
  return http.getAjax('/org/get-area-by-org', params);
}
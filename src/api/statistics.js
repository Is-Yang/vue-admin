import http from '@/utils/request';

// 统计报表数据
export function statisticsData(type, params) {
    return http.postAjax('/report/statistics/' + type, params);
}

// 组织-获取登录用户的品牌信息
export function orgBrand() {
    return http.getAjax('/org/brand');
}

// 组织-获取登录用户的门店信息
export function orgArea() {
    return http.getAjax('/org/area');
}

// 考核目标-单店统计
export function objectiveStat(params) {
    return http.postAjax('/report/objective-stat', params);
}


/* 2019年2月27日17:20:38 联动营销项目增加接口 start */

// 统计-搜索选项
export function getIndexOption(params) {
  return http.getAjax('/index/option', params)
}

// 统计报表-微信营销统计-集团图文统计-列表
export function getGroupList(params) {
  return http.getAjax('/template/statistics', params)
}

// 统计报表-微信营销统计-集团图文统计-详情
export function getGroupDetail(id, params) {
  return http.getAjax('/template/statistics/' + id, params)
}

// 统计报表-微信营销统计-单店图文统计-列表
export function getSingleList(params) {
  return http.getAjax('/template/area-statistics', params)
}

// 统计报表-微信营销统计-单店图文统计-详情
export function getSingleDetail(id, params) {
  return http.getAjax('/template/area-statistics/' + id, params)
}

// 统计标签设置-菜单树
export function getLabelTree(params) {
  return http.getAjax('/org-label/label-tree', params)
}

// 统计标签设置-列表
export function getLabel(params) {
  return http.getAjax('/org-label', params)
}

// 统计标签设置-新增
export function addLabel(params) {
  return http.postAjax('/org-label', params)
}

// 统计标签设置-更新
export function updateLabel(id, params) {
  return http.updateAjax('/org-label/' + id, params)
}

// 统计标签设置-删除
export function deleteLabel(id, params) {
  return http.deleteAjax('/org-label/' + id, params)
}

// 统计标签设置-子标签-列表
export function getLabelChild(params) {
  return http.getAjax('/org-label-child', params)
}

// 统计标签设置-子标签-新增
export function addLabelChild(params) {
  return http.postAjax('/org-label-child', params)
}

// 统计标签设置-子标签-更新
export function updateLabelChild(id, params) {
  return http.updateAjax('/org-label-child/' + id, params)
}

// 统计标签设置-子标签-删除
export function deleteLabelChild(id, params) {
  return http.deleteAjax('/org-label-child/' + id, params)
}

// 统计标签设置-子标签-列表   获取组织下所有标签-包含分页
export function getArea(params) {
  return http.getAjax('/report/get-area', params)
}

// 组织-当前组织下门店列表    获取组织下所有标签-不包含分页
export function getAreaByOrg(params) {
  return http.getAjax('/org/get-area-by-org', params);
}

// 统计标签设置-子标签-门店列表
export function getLabelChildAreas(params) {
  return http.getAjax('/org-label-child/get-areas', params)
}

// 统计报表-获取报表数据及导出-对比表
export function contrastData(type, params) {
  return http.postAjax('/report/contrast/' + type, params);
}


/* end */

// 暂时解决报错问题
export function addOrg(id, params) {
  return http.deleteAjax('/org-label-child/' + id, params)
}

export function updateOrg(id, params) {
  return http.deleteAjax('/org-label-child/' + id, params)
}

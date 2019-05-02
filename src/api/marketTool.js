import http from '@/utils/request';

// 新增海报
export function getPosterList(params) { // 我的海报
  return http.getAjax('/template/poster', params)
}
export function getPosterCenter(params) { // 海报库
  return http.getAjax('/template/poster-center', params)
}
export function addPoster(params) {
  return http.postAjax('/template/poster', params)
}
// 海报详情
export function getPoster(id,) {
  return http.getAjax('/template/poster/' + id, {})
}
// 海报--编辑
export function updatePoster(id,params) {
  return http.updateAjax('/template/poster/' + id, params)
}
// 海报--删除
export function delePoster(id) {
  return http.deleteAjax('/template/poster/' + id)
}


// 我的图文 新增，编辑，查询，删除
export function getImgTextList(params) { // 我的图文列表
  return http.getAjax('/template/img-text', params)
}
export function getImgTextCenterList(params) { // 图文库列表
  return http.getAjax('/template/img-text-center', params)
}
export function addImgText(params) {
  return http.postAjax('/template/img-text', params)
}
export function getImgText(id,params) {
  return http.getAjax('/template/img-text/'+id, params)
}
export function updataImgText(id, params) {
  return http.updateAjax('/template/img-text/' + id, params)
}
export function deleImgText(id) {
  return http.deleteAjax('/template/img-text/'+id)
}

// 获取标签
export function getTagList(params) { // 图文库列表
  return http.getAjax('/template/tag', params)
}
export function addTag(params) {
  return http.postAjax('/template/tag', params)
}
export function updateTag(id, params) {
  return http.updateAjax('/template/tag/' + id, params)
}
export function deleTag(id) {
  return http.deleteAjax('/template/tag/' + id)
}

import http from '@/utils/request';

// 统计-搜索选项
export function getIndexOption(params) {
  return http.getAjax('/index/option', params)
}

// 首页-销售数据概览
export function getIndexOverview(params) {
  return http.postAjax('/index/overview', params)
}

// 首页-销售数据趋势
export function getIndexTrend(params) {
  return http.postAjax('/index/trend', params)
}

// 首页-4S店业绩排名
export function getIndexRanking(params) {
  return http.postAjax('/index/ranking', params)
}

// 首页-销售精英榜
export function getIndexElite(params) {
  return http.postAjax('/index/elite', params)
}

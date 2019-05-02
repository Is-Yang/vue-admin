const getters = {
    sidebar: state => state.app.sidebar, // 侧边栏状态
    org: state => state.app.org, // 组织信息
    loadingLocal: state => state.app.showLoading.local, // 局部的loading
}
export default getters
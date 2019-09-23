const getters = {
    sidebar: state => state.app.sidebar, // 侧边栏状态
    userInfo: state => state.app.userInfo,  // 用户信息
    loadingLocal: state => state.app.showLoading.local, // 局部的loading
    enterpriseInfo: state => state.app.enterpriseInfo  // 企业信息
}
export default getters
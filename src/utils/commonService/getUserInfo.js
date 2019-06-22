import store from '../../store'

// 获取用户一些方法
export function getUserInfo() {
    return localStorage.getItem("userInfo") || store.getters.userInfo;
}

export function getAuthorization() {
    var userInfo = getUserInfo();
    if (userInfo) {
        userInfo = JSON.parse(userInfo);
        return userInfo.authorization || '';
    }
    return '';
}
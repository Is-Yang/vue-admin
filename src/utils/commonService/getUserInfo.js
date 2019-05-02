// 获取用户一些方法
export function getUserInfo(){
  return localStorage.getItem("userInfo") || '';
}

export function getUserName(){
  var userInfo = getUserInfo();
  if(userInfo){
    userInfo = JSON.parse(userInfo);
    return userInfo.username || '';
  }
  return '';
}

export function getAuthorization() {
  var userInfo = getUserInfo();
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    return userInfo.authorization || '';
  }
  return '';
}


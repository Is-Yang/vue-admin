export function handleResponse(res,callback, isHandleError = false){
  let { error, token } = res.data ? res.data : {};
  if (error){
    this.$message({
      showClose: true,
      message: error,
      type: 'error'
    });
    if(typeof callback === 'function' && isHandleError){
      callback([]);
    }
  } else if (token == 'expired') {
    this.$message({
      showClose: true,
      message: '请退出后，刷新页面，重新登录',
      type: 'error'
    });
  } else {
    if(typeof callback === 'function'){
      callback(res.data);
    }
  }
}
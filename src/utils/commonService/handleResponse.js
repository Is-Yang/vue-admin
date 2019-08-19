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
      this.$confirm('用户信息未获取到，刷新页面或退出登录?', '提示', {
        confirmButtonText: '刷新页面',
        cancelButtonText: '退出登录',
        type: 'warning'
      }).then(() => {
        window.location.reload();
      }).catch(() => {
        this.$router.push({path:'/login'})
      });
      
    } else {
      if(typeof callback === 'function'){
        callback(res.data);
      }
    }
  }
export function handleResponse(res, callback, isHandleError = false) {
    let { error, token } = res.data ? res.data : {};
    if (error) {
        this.$message({
            showClose: true,
            message: error,
            type: 'error'
        });
        if (typeof callback === 'function' && isHandleError) {
            callback([]);
        }
    } else {
        if (typeof callback === 'function') {
            callback(res.data);
        }
    }
}
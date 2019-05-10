import * as home from './home'
import * as login from './login'
let apiObj={home, login};
const install = function (Vue) {
  if (install.installed) {
    return
  }
  install.installed = true;

  Object.defineProperties(Vue.prototype, {
    $fetch: {
      get() {
        return apiObj
      }
    }
  })
}

export default {
  install
}
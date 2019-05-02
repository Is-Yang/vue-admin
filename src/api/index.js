import * as home from './home'
import * as login from './login'
import * as marketTool from './marketTool'
import * as marking from './marking'
import * as setting from './setting'
import * as statistics from './statistics'
let apiObj={home,login,marketTool,marking,setting,statistics};
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
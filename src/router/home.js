import Layout from '../pages/layout/Layout'
import { Index } from '../pages/index/Index'
import {
  MonitoringList
} from '../pages/monitoring'

import {
  AccountList
} from '../pages/account'
import {
  CompanyList
} from '../pages/company'
import {
  taskList
} from '../pages/taskInfo'


/**
  * name: 标题
  * redirect : noredirect 为不重定向
  **/
export default [
  {
    path: '/',
    component: Layout,
    children: [{
      path: 'index',
      component: Index,
      name: "首页",
    }, {
      path: 'account',
      component: AccountList,
      name: '账号列表'
    }, {
      path: 'company',
      component: CompanyList,
      name: '公司列表'
    }, {
      path: 'tasks',
      component: taskList,
      name: '任务信息'
    }]
  }, {
    path: '/monitoring',
    component: Layout,
    children: [
      {
        path: 'have',
        component: MonitoringList,
        name: '已监控',
      },
      {
        path :'not',
        component: MonitoringList,
        name: '未监控'
      }
    ]
  }
]

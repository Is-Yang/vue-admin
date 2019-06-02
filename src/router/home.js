import Layout from '../pages/layout/Layout'
import { Index } from '../pages/index/Index'
import {
    MonitoringList,
    MonitoringDetails
} from '../pages/monitoring'

import {
    AccountList,
    AccountHandle
} from '../pages/account'
import {
    CompanyList
} from '../pages/company'
import {
    TaskList
} from '../pages/taskInfo'
import {
    FileList
} from '../pages/other'
import {
    ImgList
} from '../pages/pictures'
import {
    MessageList
} from '../pages/message'

/**
 * name: 标题
 * redirect : noredirect 为不重定向
 **/
export default [{
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
        path: 'account/add',
        component: AccountHandle,
        name: '新增账号'
    }, {
        path: 'account/edit',
        component: AccountHandle,
        name: '编辑账号'
    }, {
        path: 'company',
        component: CompanyList,
        name: '公司列表'
    }, {
        path: 'tasks',
        component: TaskList,
        name: '任务信息'
    }, {
        path: 'other',
        component: FileList,
        name: '文件列表'
    }, {
        path: 'pictures',
        component: ImgList,
        name: '宣传图片'
    }, {
        path: 'message',
        component: MessageList,
        name: '应急消息'
    }]
}, {
    path: '/monitoring',
    component: Layout,
    children: [{
            path: 'have',
            component: MonitoringList,
            name: '已监控',
        },
        {
            path: 'not',
            component: MonitoringList,
            name: '未监控'
        }, {
            path: 'details',
            component: MonitoringDetails,
            name: '任务详情'
        }
    ]
}]
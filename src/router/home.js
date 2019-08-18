import Layout from '../pages/layout/Layout'
import { Index } from '../pages/index/Index'
import {
    MonitoringList,
    MonitoringDetails
} from '../pages/monitoring'

import {
    AccountList,
    AccountHandle,
    CompanyAccount,
    CompanyAccountHandle
} from '../pages/account'
import {
    CompanyList,
    CompanyInfo,
    CompanyHandle
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
    MessageList,
    GovernmentMessage
} from '../pages/message'
import {
    ClassifyList
} from '../pages/classify'
import {
    DepartmentList
} from '../pages/department'
import {
    LinkList
} from '../pages/FriendLink'

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
        path: 'account/company',
        component: CompanyAccount,
        name: '企业账号'
    }, {
        path: 'account/add',
        component: AccountHandle,
        name: '创建账号'
    }, {
        path: 'account/edit',
        component: AccountHandle,
        name: '编辑账号'
    }, {
        path: 'account/addCompany',
        component: CompanyAccountHandle,
        name: '创建企业账号'
    }, {
        path: 'account/editCompany',
        component: CompanyAccountHandle,
        name: '编辑企业账号'
    }, {
        path: 'account/government',
        component: CompanyAccount,
        name: '政府账号'
    }, {
        path: 'account/addGovernment',
        component: CompanyAccountHandle,
        name: '创建政府账号'
    }, {
        path: 'account/editGovernment',
        component: CompanyAccountHandle,
        name: '编辑政府账号'
    }, {
        path: 'company',
        component: CompanyList,
        name: '公司列表'
    }, {
        path: 'company/add',
        component: CompanyHandle,
        name: '创建公司'
    }, {
        path: 'company/edit',
        component: CompanyHandle,
        name: '编辑公司'
    }, {
        path: 'company/info',
        component: CompanyInfo,
        name: '企业资料'
    }, {
        path: 'department',
        component: DepartmentList,
        name: '部门列表'
    }, {
        path: 'tasks',
        component: TaskList,
        name: '任务信息'
    }, {
        path: 'tasks/company',
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
    }, {
        path: 'message/government',
        component: GovernmentMessage,
        name: '应急消息'
    }, {
        path: '/link',
        component: LinkList,
        name: '友情链接'
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
            path: 'have/company',
            component: MonitoringList,
            name: '已监控',
        },
        {
            path: 'not/company',
            component: MonitoringList,
            name: '未监控'
        }, {
            path: 'details',
            component: MonitoringDetails,
            name: '隐患整改详情'
        }
    ]
}, {
    path: '/classify',
    component: Layout,
    children: [{
            path: 'big',
            component: ClassifyList,
            name: '大分类列表',
        },
        {
            path: 'small',
            component: ClassifyList,
            name: '小分类列表'
        }
    ]
}]
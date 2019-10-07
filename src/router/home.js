import Layout from '../pages/layout/Layout'
import { Index, CompanyIndex, IframShowPage } from '../pages/index/Index'
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
    ClassifyList,
    CompanyPoint
} from '../pages/classify'
import {
    DepartmentList
} from '../pages/department'
import {
    LinkList
} from '../pages/FriendLink'
import {
    PersonList,
    PersonHandle
} from '../pages/emerg'
import {
    CycleList
} from '../pages/cycle'

export default [{
    path: '/',
    component: Layout,
    children: [{
        path: 'index',
        component: Index,
        name: "首页",
    }, {
        path: 'araeIndex',
        component: Index,
        name: "首页",
    }, {
        path: 'companyIndex',
        component: CompanyIndex,
        name: "首页",
        meta: {
            specialModule: true,
        }
    }, {
        path: 'showPage',
        component: IframShowPage,
        meta: {
            specialModule: true,
        }
    }, {
        path: 'account',
        component: AccountList,
        name: '账号列表',
        meta: {
            specialModule: true
        }
    }, {
        path: 'account/company',
        component: CompanyAccount,
        name: '企业账号',
        meta: {
            specialModule: true
        }
    }, {
        path: 'account/add',
        component: AccountHandle,
        name: '创建账号',
        meta: {
            specialModule: true
        }
    }, {
        path: 'account/edit',
        component: AccountHandle,
        name: '编辑账号',
        meta: {
            specialModule: true
        }
    }, {
        path: 'account/addCompany',
        component: CompanyAccountHandle,
        name: '创建企业账号',
        meta: {
            specialModule: true
        }
    }, {
        path: 'account/editCompany',
        component: CompanyAccountHandle,
        name: '编辑企业账号',
        meta: {
            specialModule: true
        }
    }, {
        path: 'account/government',
        component: CompanyAccount,
        name: '政府账号'
    }, {
        path: 'account/addGovernment',
        component: CompanyAccountHandle,
        name: '创建政府账号',
        meta: {
            specialModule: true
        }
    }, {
        path: 'account/editGovernment',
        component: CompanyAccountHandle,
        name: '编辑政府账号',
        meta: {
            specialModule: true
        }
    }, {
        path: 'company',
        component: CompanyList,
        name: '公司列表'
    }, {
        path: 'company/add',
        component: CompanyHandle,
        name: '创建公司',
        meta: {
            specialModule: true
        }
    }, {
        path: 'company/edit',
        component: CompanyHandle,
        name: '编辑公司',
        meta: {
            specialModule: true
        }
    }, {
        path: 'company/zfinfo',
        component: CompanyInfo,
        name: '政府资料'
    }, {
        path: 'company/qtinfo',
        component: CompanyInfo,
        name: '其他资料'
    }, {
        path: 'department',
        component: DepartmentList,
        name: '部门列表',
        meta: {
            specialModule: true
        }
    }, {
        path: 'tasks',
        component: TaskList,
        name: '任务信息'
    }, {
        path: 'tasks/company',
        component: TaskList,
        name: '任务信息',
        meta: {
            specialModule: true
        }
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
    }, {
        path: 'emerg/person',
        component: PersonList,
        name: '应急人员列表'
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
            path: 'haveCompany',
            component: MonitoringList,
            name: '已监控',
        },
        {
            path: 'notCompany',
            component: MonitoringList,
            name: '未监控'
        }, {
            path: 'details',
            component: MonitoringDetails,
            name: '隐患整改详情',
            meta: {
                specialModule: true
            }
        }
    ]
}, {
    path: '/classify',
    component: Layout,
    children: [{
            path: 'big',
            component: ClassifyList,
            name: '风险点',
            meta: {
                specialModule: true
            }
        },
        {
            path: 'small',
            component: ClassifyList,
            name: '二级子项列表',
            meta: {
                specialModule: true
            }
        },
        {
            path: 'three',
            component: ClassifyList,
            name: '三级子项列表',
            meta: {
                specialModule: true
            }
        }, {
            path: 'point',
            component: CompanyPoint,
            name: '创建风险点'
        }, {
            path: 'taskPoint',
            component: CompanyPoint,
            name: '风险点任务创建'
        }, {
            path: 'cycle',
            component: CycleList,
            name: '管控周期'
        }
    ]
}]
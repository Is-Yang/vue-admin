import Layout from '../pages/layout/Layout'
import {
  ImageTextList,
  ImageTextHandle,
  PosterList,
  PosterHandle
} from '../pages/marketTools'

const marketTools = [
  {
    path: '/marketTool',
    component: Layout,
    children: [
      {
        path: 'template/imageText', 
        component: ImageTextList, 
        name: '图文中心',
        meta: {
          specialModule: true // 设置该值为true，可自定义右容器样式 - AppMain组件
        }
      },
      {
        path: 'template/imageText/add',
        component: ImageTextHandle,
        name: '图文新增',
        meta: {
          specialModule: true // 设置该值为true，可自定义右容器样式 - AppMain组件
        }
      },
      {
        path: 'template/imageText/edit/:id',
        component: ImageTextHandle,
        name: '图文编辑',
        meta: {
          specialModule: true // 设置该值为true，可自定义右容器样式 - AppMain组件
        }
      },
      { 
        path: 'template/poster', 
        component: PosterList, 
        name: '海报列表',
        meta: {
          specialModule: true // 设置该值为true，可自定义右容器样式 - AppMain组件
        }
      },
      { 
        path: "template/poster/add", 
        component: PosterHandle, 
        name: '新增海报', 
        meta: {
          specialModule: true // 设置该值为true，可自定义右容器样式 - AppMain组件
        }
      },
      { 
        path: 'template/poster/edit/:postId',
        component: PosterHandle, 
        name: '编辑海报', 
        meta: {
          specialModule: true // 设置该值为true，可自定义右容器样式 - AppMain组件
        }
      }
    ]
  }
]


export default marketTools
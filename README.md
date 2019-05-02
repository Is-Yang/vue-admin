## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# 打包测试环境
npm run build-test

# 打包正式环境
npm run build-prod

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


### 技术文档

- 前端框架：[vue2](https://cn.vuejs.org/v2/guide/)

- UI框架： [Element-UI](http://element-cn.eleme.io)

- 路由管理：[vue-router](https://router.vuejs.org/)

- 状态管理：[vuex](https://vuex.vuejs.org/)

- 模块打包工具：[webpack3](https://webpack.js.org/) __  [中文文档](http://www.css88.com/doc/webpack2/guides/development/)


### 项目结构

```bash
dist # 打包目录
|
src  # 开发目录
├── index.html
├── main.js    # 主配置
├── App.vue    # 入口布局
├── assets     # 静态资源
│   ├── images
│   └── css
│       ├── base.scss         # 基础样式
│       └── mixin.scss        # 常用的混合属性
│
├── utils     # 公共方法
├── api       # 接口api相关
│
├── components
│   └── ...# 公共组件
│
├── pages  # 页面
│
├── router
│   ├── index       # 路由配置
│   ├── home        # 首页模块路由
│   ├── login       # 登录模块路由
│   └── ...
│
└── store  # 全局store管理

```

### Commit Message 编写规范

```
feat: 新功能
fix: 修补bug
docs: 文档
style: 格式(不影响代码运行的变动)
test: 添加测试

```

## 关于图标

- http://element.eleme.io/#/zh-CN/component/icon

- https://fontawesome.com

```

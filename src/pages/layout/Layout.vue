<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <!-- 左侧边栏菜单 -->
    <div class="sidebar-wrapper">
      <Sidebar />
    </div>

    <!-- 右容器内容 -->
    <div class="main-container" v-loading.fullscreen.lock="loadingLocal"
      element-loading-text="请稍后，正在获取数据"
      element-loading-spinner="icon-loading">
      <!-- 导航栏 -->
      <Navbar/>
      <!-- 主内容 -->
      <App-main/>
    </div>
  </div>
</template>

<script>
  import {
    Header,
    Navbar,
    Sidebar,
    AppMain
  } from './index'
  import { mapGetters } from 'vuex';

  export default {
    name: 'layout',
    components: {
      Header,
      Navbar,
      Sidebar,
      AppMain
    },
    computed: {
      ...mapGetters(['loadingLocal']),
      sidebar() {
        return this.$store.state.app.sidebar;
      }
    },
    data() {
      return {
        isHide: false
      }
    },
    created () {
    },
    methods: {
      
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/assets/css/mixin.scss";
  .app-wrapper {
    @include relative;
    $navHeight: 55px;
    &.hideSidebar {
      .sidebar-wrapper {
        width: 64px;
        /deep/ .bar-opt {
          left: 60px;
        }

        .el-menu [class^=el-icon-] {
          margin: 0 20px 0 8px;
        }
      }


      .main-container {
        margin-left: 60px;
      }
    }
    .sidebar-wrapper {
      width: 200px;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 999;
      overflow: hidden;
      transition: all .28s ease-out;

    }

    .main-container {
      min-height: 100%;
      transition: all .28s ease-out;
      margin-left: 200px;
    }

    .hideDiv{
      display: none;
    }
  }

</style>

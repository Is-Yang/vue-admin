<template>
  <div class="sidebar-container">
    <el-menu class="el-menu-theme" router 
      :default-active="path" 
      @select="handleSelect" 
      @open="handleOpen"
      @close="handleClose" 
      :collapse="!sidebar.opened">
      <el-menu-item index="/index">
        <i class="fa fa-home"></i> 
        <span slot="title">首页</span>
      </el-menu-item>

      <el-submenu index="系统设置">
        <template slot="title">
          <i class="fa fa-cogs"></i> 
          <span slot="title">监控列表</span>
        </template>
        <el-menu-item index="/monitoring/have">
          <span slot="title">已监控</span>
        </el-menu-item>
        <el-menu-item index="/monitoring/not">
          <span slot="title">未监控</span>
        </el-menu-item>
      </el-submenu>

      <el-menu-item index="/account">
        <i class="fa fa-users"></i> 
        <span slot="title">账号列表</span>
      </el-menu-item>

      <el-menu-item index="/company">
        <i class="fa fa-building"></i> 
        <span slot="title">公司列表</span>
      </el-menu-item>

      <el-menu-item index="/branch">
        <i class="fa fa-code-branch"></i> 
        <span slot="title">部门信息列表</span>
      </el-menu-item>

      <el-menu-item index="/thumbtack">
        <i class="fa fa-thumbtack"></i> 
        <span slot="title">应急消息列表</span>
      </el-menu-item>

      <el-menu-item index="/tasks">
        <i class="fa fa-tasks"></i> 
        <span slot="title">任务信息</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex';
  export default {
    computed: {
      ...mapGetters([
        'sidebar',
      ])
    },
    data() {
      return {
        path: '',
      };
    },
    mounted() {
      this.path = this.$route.path
    },
    watch: {
      
    },
    methods: {
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleSelect(key, keyPath) {
        this.path = key; // 当前高亮
      },
    },
    destroyed() {
      this.$eventHub.$off('getNav');
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/assets/css/mixin.scss";

  .sidebar-container {
    transition: all .28s ease-out;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: -17px;
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 999;

    .el-menu {
      min-height: 100%;
      border-radius: 0px;
      border-right: none;

      /deep/ .fa {
        color: #bfcbd9;
      }
    }

    [class*="el-icon-"] {
      font-size: 18px;
      color: #fff;
    }

    .bar-opt {
      position: fixed;
      top: 45%;
      transform: translateY(-45%);
      left: 196px;
      padding: 5px 0;
      background-color: #21262b;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      cursor: pointer;
      transition: all .28s ease-out;

      i {
        font-size: 13px;
      }
    }

    .menus-tabs {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

</style>

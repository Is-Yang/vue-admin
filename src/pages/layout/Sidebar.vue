<template>
  <div class="sidebar-container">
    <el-menu class="el-menu-theme" router 
      :default-active="path" 
      @select="handleSelect" 
      @open="handleOpen"
      @close="handleClose" 
      :collapse="!sidebar.opened">
      <el-menu-item index="/index" v-if="level == 1">
        <i class="fa fa-home"></i> 
        <span slot="title">首页</span>
      </el-menu-item>

      <el-menu-item index="/department" v-if="level == 2">
        <i class="fa fa-code-branch"></i> 
        <span slot="title">部门列表</span>
      </el-menu-item>

      <el-menu-item index="/company" v-if="level == 2">
        <i class="fa fa-building"></i> 
        <span slot="title">公司列表</span>
      </el-menu-item>

      <el-menu-item index="/company" v-if="level == 1">
        <i class="fa fa-building"></i> 
        <span slot="title">企业列表</span>
      </el-menu-item>

      <el-submenu index="/account" v-if="level !=1">
        <template slot="title">
          <i class="fa fa-users"></i> 
          <span slot="title">账号列表</span>
        </template>
        <el-menu-item index="/account" v-if="level == 2">
          <span slot="title">员工账号</span>
        </el-menu-item>
        <el-menu-item index="/account/company" v-if="level == 2">
          <span slot="title">企业账号</span>
        </el-menu-item>
        <el-menu-item index="/account/government" v-if="level == 2">
          <span slot="title">政府账号</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="/classify" v-if="level != 1">
        <template slot="title">
          <i class="fa fa-tasks"></i> 
          <span slot="title">分类列表</span>
        </template>
        <el-menu-item index="/classify/big">
          <span slot="title">大分类</span>
        </el-menu-item>
        <el-menu-item index="/classify/small">
          <span slot="title">小分类</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="/monitoring" v-if="level == 1 || level == 2 || level == 3">
        <template slot="title">
          <i class="fa fa-cogs"></i> 
          <span slot="title">监控列表</span>
        </template>
        <el-menu-item :index="level === 3 ? '/monitoring/have/company' : '/monitoring/have'">
          <span slot="title">已监控</span>
        </el-menu-item>
        <el-menu-item :index="level === 3 ? '/monitoring/not/company' : '/monitoring/not'">
          <span slot="title">未监控</span>
        </el-menu-item>
      </el-submenu>

      <el-menu-item :index="level === 1 ? '/message/government' : '/message'" v-if="level == 1 || level == 2">
        <i class="fa fa-thumbtack"></i> 
        <span slot="title">应急消息列表</span>
      </el-menu-item>

      <el-menu-item index="/tasks" v-if="level == 3">
        <i class="fa fa-tasks"></i> 
        <span slot="title">任务信息</span>
      </el-menu-item>

      <el-menu-item index="/tasks/company" v-if="level == 2">
        <i class="fa fa-tasks"></i> 
        <span slot="title">任务信息</span>
      </el-menu-item>

      <el-menu-item index="/pictures" v-if="level == 2">
        <i class="fa el-icon-picture"></i> 
        <span slot="title">宣传图片</span>
      </el-menu-item>

      <el-menu-item index="/other" v-if="level == 2">
        <i class="fa el-icon-info"></i> 
        <span slot="title">其他资料列表</span>
      </el-menu-item>
      
    </el-menu>
    
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex';
  import * as userInfo from "@/utils/commonService/getUserInfo";

  export default {
    computed: {
      ...mapGetters([
        'sidebar',
      ])
    },
    data() {
      return {
        path: '',
        level: 0,
      };
    },
    mounted() {
      this.path = this.$route.path
    },
    watch: {
      
    },
    created () {
      let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
      if (user_info && user_info.propity) {
        this.level = user_info.propity;
      }
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
      font-size: 14px;
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

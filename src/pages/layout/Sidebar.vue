<template>
  <div class="sidebar-container">
    <el-menu class="el-menu-theme"
      mode="horizontal" 
      background-color="#324157"
      text-color="#fff"
      router 
      :default-active="path" 
      @select="handleSelect" 
      @open="handleOpen"
      @close="handleClose" >
      <el-menu-item v-if="level == 1 || level == 3" :index="level == 1 ? '/index' : '/companyIndex'">
        <i class="fa fa-home"></i> 
        <span slot="title">首页</span>
      </el-menu-item>

      <!-- 企业端 -->
      <el-submenu index="/" v-if="level == 3">
        <template slot="title">
          <i class="fa fa-code-branch"></i> 
          <span slot="title">企业管理</span>
        </template>
        <el-menu-item index="/showPage?page=1">
          <span slot="title">隐患上报</span>
        </el-menu-item>

        <el-menu-item @click="showInfoDialog()">
          <span slot="title">企业资料</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="/emerg" v-if="level == 3">
        <template slot="title">
          <i class="fa fa-thumbtack"></i> 
          <span slot="title">应急管理</span>
        </template>
        <el-menu-item index="/emerg/person">
          <span slot="title">应急人员</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="/company" v-if="level == 3">
        <template slot="title">
          <i class="fa el-icon-info"></i> 
          <span slot="title">文件资料</span>
        </template>
        <el-menu-item index="/company/zfinfo">
          <span slot="title">政府资料</span>
        </el-menu-item>
        <el-menu-item index="/company/qtinfo">
          <span slot="title">其他资料</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="/account" v-if="level == 3">
        <template slot="title">
          <i class="fa fa-users"></i> 
          <span slot="title">综合管理</span>
        </template>
        <el-menu-item index="/account">
          <span slot="title">人员管理</span>
        </el-menu-item>
        <!-- <li class="el-menu-item" @click="logout">
          <span slot="title">退出登录</span>
        </li> -->
      </el-submenu>

      <!-- <el-menu-item index="/tasks" v-if="level == 3">
        <i class="fa fa-tasks"></i> 
        <span slot="title">任务信息</span>
      </el-menu-item> -->

      <el-menu-item index="/account/government" v-if="level == 2">
        <i class="fa fa-code-branch"></i> 
        <span slot="title">政府管理</span>
      </el-menu-item>

      <el-menu-item index="/company" v-if="level == 2">
        <i class="fa fa-building"></i> 
        <span slot="title">公司管理</span>
      </el-menu-item>
      
      <el-submenu index="/classify" v-if="level == 2">
        <template slot="title">
          <i class="fa fa-tasks"></i> 
          <span slot="title">任务管理</span>
        </template>
        <el-menu-item index="/classify/big">
          <span slot="title">风险点创建</span>
        </el-menu-item>
        <el-menu-item index="/classify/small">
          <span slot="title">风险点任务创建</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="/monitoring" v-if="level == 1 || level == 2">
        <template slot="title">
          <i class="fa fa-cogs"></i> 
          <span slot="title">监控列表</span>
        </template>
        <el-menu-item :index="level === 3 ? '/monitoring/haveCompany' : '/monitoring/have'">
          <span slot="title">已监控</span>
        </el-menu-item>
        <el-menu-item :index="level === 3 ? '/monitoring/notCompany' : '/monitoring/not'">
          <span slot="title">未监控</span>
        </el-menu-item>
      </el-submenu>

      <el-menu-item :index="level === 1 ? '/message/government' : '/message'" v-if="level == 1 || level == 2">
        <i class="fa fa-thumbtack"></i> 
        <span slot="title">消息管理</span>
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
        <span slot="title">资料管理</span>
      </el-menu-item>

      <el-menu-item index="/link" v-if="level == 2">
        <i class="fa el-icon-share"></i> 
        <span slot="title">相关连接</span>
      </el-menu-item>

      <el-menu-item index="/company" v-if="level == 1">
        <i class="fa fa-building"></i> 
        <span slot="title">企业列表</span>
      </el-menu-item>
      
    </el-menu>
    
    <el-dropdown trigger="hover">
      <div class="avatar-wrapper">
        <span class="user-name">{{userInfo.userName}}</span>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <div @click="logout">
          <el-dropdown-item>
            退出登录
          </el-dropdown-item>
        </div>
      </el-dropdown-menu>
    </el-dropdown>

  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex';
  import * as userInfo from "@/utils/commonService/getUserInfo";
  // import EnterpriseInfo from '../company/EnterpriseInfo.vue';
  export default {
    components: {
      // EnterpriseInfo
    },
    computed: {
      ...mapGetters([
        'sidebar',
      ])
    },
    data() {
      return {
        path: '',
        level: 0,
        userInfo: {},
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
        this.userInfo.userName = user_info.userName;
      }
    },
    methods: {
      logout() { // 退出登录
          this.$confirm('请确认是否退出登录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              localStorage.removeItem('userInfo'); // 清除用户信息
              this.$store.dispatch('saveUser', '');
              this.$router.push('/login');
              window.location.reload();
          }).catch(() => {

          });
      },
      showInfoDialog() {
         this.$eventHub.$emit('ShowEnterpriseInfo'); 
      },
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleSelect(key, keyPath) {
        this.path = key; // 当前高亮
      },
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/assets/css/mixin.scss";

  .sidebar-container {
    display: flex;
    justify-content: space-between;

    .el-menu {
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

    .avatar-wrapper {
        height: 60px;
        line-height: 60px;
        cursor: pointer;
        position: relative;
        color: #bfcbd9;
        .user-avatar {
          width: 40px;
          height: 40px;
          display: inline-block;
          vertical-align: middle;
          @include borderRadius(50%);
          background-color: #fff;
        }
        .user-name {
          margin-left: 25px;
          padding: 0 15px;
        }
      }
  }

</style>

<template>
  <div class="header-wrapper">
    <div class="header-container flex">
      <div class="header-menu flex"
        v-loading.fullscreen="loading"
        element-loading-spinner="icon-loading">
        <div v-if="userInfo.propity == 3">
          <span>{{userInfo.companyName}}</span>
          <p>安全风险分级管控和隐患排查治理平台</p>
        </div>
        <div v-if="userInfo.propity == 1">
          <span>安全风险分级管控和隐患排查治理平台</span>
        </div>
      </div>

      <Sidebar />
    </div>
  </div>
</template>

<script>
  import * as userInfo from '@/utils/commonService/getUserInfo';
  import * as Http from "@/api/login";
  import {
    Sidebar,
  } from './index'
  export default {
    components: {
      Sidebar,
    },
    data() {
      return {
        menus: [], // 菜单
        loading: false,
        userInfo: {},
        dialogFormVisible: false,
        defaultImg: '',
      }
    },
    created() {
      this.getUserInfo();
    },
    methods: {
      getUserInfo() { //用户信息
        this.userInfo = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
      },
      logout() { // 退出登录
        this.$confirm('请确认是否退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doLogout();
        }).catch(() => {

        });
      },
      doLogout() { // 执行退出操作
        localStorage.removeItem('userInfo'); // 清除用户信息
        this.$store.dispatch('saveUser', '');
        this.$router.push('/login');
        window.location.reload();
      },
    },
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/assets/css/mixin.scss";
  .header-wrapper {
    $navHeight: 60px;

    .header-container {
      position: fixed;
      top: 0;
      width: 100%;
      height: $navHeight;
      background-color: $themeColor;
      @include flexJustify(space-between);
      @include flexAlign(center);
      padding: 0 25px 0 15px;
      z-index: 99;

    }
    .header-menu {
      flex: 1;
      @include flexAlign(center);
      font-size: 17px;
      font-weight: 500;
      color: #fff;
      p {
        color: #fff;
        font-size: 12px;
      }
      img {
        width: 48px;
        height: 48px;
        vertical-align: middle;
        margin-right: 12px;
      }
    }
  
  }

</style>

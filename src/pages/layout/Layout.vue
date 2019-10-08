<template>
  <!-- :class="{hideSidebar:!sidebar.opened}" -->
  <div class="app-wrapper">
    <Header />
    <div class="main-container" v-loading.fullscreen.lock="loadingLocal"
      element-loading-text="请稍后，正在获取数据"
      element-loading-spinner="icon-loading">
      <!-- 主内容 -->
      <App-main/>

    </div>
    <!-- <Footer /> -->

    <EnterpriseInfo v-if="dialog.infoShow"
            :infoData="dialog.infoData"   
            @cancel="dialog.infoShow = false"
            @success="dialog.infoShow = false"></EnterpriseInfo>
  </div>
</template>

<script>
  import * as Http from "@/api/home";
  import {
    Header,
    Navbar,
    Sidebar,
    AppMain,
    Footer
  } from './index'
  import { mapGetters } from 'vuex';
  import EnterpriseInfo from '../company/EnterpriseInfo.vue';

  export default {
    name: 'layout',
    components: {
      Header,
      Navbar,
      Sidebar,
      AppMain,
      Footer,
      EnterpriseInfo
    },
    computed: {
      ...mapGetters(['loadingLocal', 'enterpriseInfo']),
      sidebar() {
        return this.$store.state.app.sidebar;
      }
    },
    data() {
      return {
        isHide: false,
        dialog: {
          infoShow: false,
          infoData: {}
        }
      }
    },
    watch: {
      enterpriseInfo(data) {
        this.dialog.infoData = data;
      }
    },
    created () {
       this.$eventHub.$on('ShowEnterpriseInfo', (data) => {
        if (this.dialog.infoData && !this.dialog.infoData.ceo) {
          Http.getCompanyShowInfo().then(res => {
              this.$handleResponse(res, res => {
                  this.dialog.infoData = res.company;
                  this.$store.dispatch('GetEnterpriseInfo', res.company);
              });
          }).catch(err => {
              console.log(err)
          });
        }
        this.dialog.infoShow = true;
      })
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
      margin-top: 75px;
      // min-height: 100%;
      transition: all .28s ease-out;
      // margin-left: 200px;
    }

    .hideDiv{
      display: none;
    }
  }

</style>

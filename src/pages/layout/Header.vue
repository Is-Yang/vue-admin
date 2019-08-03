<template>
  <div class="header-wrapper">
    <div class="header-container flex">
      <div class="header-menu flex"
        v-loading.fullscreen="loading"
        element-loading-spinner="icon-loading">
        <div style="min-width: 60px;">
          {{userInfo.groupName}}
        </div>

        <el-menu class="menu-nav" mode="horizontal" router @select="handleSelect">
          <el-menu-item :class="{'is-current': path == ('/' + menu.url)}" v-for="(menu, key) in menus"
            :key="key" :index='"/" + menu.url'>
            <div v-if="menu.hide == 0">
              {{menu.title}}
            </div>
          </el-menu-item>
        </el-menu>
      </div>

      <el-menu mode="horizontal" class="avatar-container flex">
        <!-- <div>
          <router-link to="/index" class="icon">
            <i class="el-icon-search"></i>
          </router-link>
          <router-link to="/index" class="icon">
            <i class="el-icon-bell"></i>
          </router-link>
        </div> -->
        <el-dropdown trigger="click">
          <div class="avatar-wrapper">
            <img class="user-avatar" :src="userInfo.userAvatar" :onerror="defaultImg">
            <span class="user-name">{{userInfo.userName}}</span>
            <i class="el-icon-more"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <div @click="dialogFormVisible = true">
              <el-dropdown-item>
                设置
              </el-dropdown-item>
            </div>
            <div @click="logout">
              <el-dropdown-item>
                退出登录
              </el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu>
    </div>

    <!-- 修改密码弹窗 -->
    <el-dialog title="账号设置" :visible.sync="dialogFormVisible" width="500px">
      <el-form class="small-space" :model="userInfo" label-position="right" label-width="100px" style='padding-right: 60px;'>
        <el-form-item label="账号：" prop="username">
          <el-input type="text" v-model="userInfo.userName" disabled auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input type="password" placeholder="修改时密码不变请留空" v-model="userInfo.password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAccountSubmit(userInfo)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as userInfo from '@/utils/commonService/getUserInfo';
  import * as Http from "@/api/login";
  export default {
    data() {
      return {
        menus: [], // 菜单
        loading: false,
        userInfo: {},
        dialogFormVisible: false,
        path: '',
        defaultImg: '',
      }
    },
    created() {
      this.getUserInfo();

      this.$eventHub.$on('navFromVisted', (data) => { // 获取子菜单的当前项，改变当前高亮  此组件暂时用不到
        const pathName = data.split('/').slice(1, 3);
        this.path = "/" + (pathName[0] ? pathName[0] : pathName.join('/'));
        // this.menus = Object.assign([],this.menus);
        this.getSubMenu(this.path);
      })
    },
    methods: {
      getUserInfo() { //用户信息
        let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
        if (user_info) {
          this.userInfo = {
            userName: user_info.mobile,
            userAvatar: user_info.avatar,
            user_id: user_info.user_id,
            groupName: user_info.group_short_name
          }
        }
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
      handleSelect(key, keyPath) {  // 当前选中高亮
        this.path = key;
        // this.$router.push(key);
        // 防止点击时，key 跳转的链接没有追加子链接时，则跳转地址依旧是上一次记录
        // this.$router.beforeEach((to, from, next) => {
        //   if (key === to.path) {
        //     next({
        //       path: from.path
        //     })
        //   } else {
        //     next()
        //   }
        // });
        if (this.menus && this.menus.length) {
          for (let i = 0; i < this.menus.length; i++) {
            if (key == ('/' + this.menus[i].url)) {
              let child = this.menus[i].child && this.menus[i].child.length ? this.menus[i].child : []
              this.$eventHub.$emit('getNav', child, true);
              return;
            }
          }
        }else{
          this.$router.push(key);
        }
      },
      hasHash() {
        const href = window.location.href; // 当本地开发和线上都支持 mode 为 history 模式，就可以不判断了
        if (href.includes("#")) return true;
        return false;
      },
      getSubMenu(path) { // 获取菜单并传递子菜单
        const strPath = JSON.stringify(path);
        if (this.menus && this.menus.length) { // 刷新子菜单
          for (let i = 0; i < this.menus.length; i++) {
            if (strPath.indexOf(this.menus[i].url) > -1) {
              this.$eventHub.$emit('getNav', this.menus[i].child); // 传送子菜单
              return;
            }
          }
        } else {
          this.$eventHub.$emit('getNav', []);
        }
      },
      editAccountSubmit(user) {  // 账号设置
        this.loading = true;
        // 获取用户信息
        let params = {
          // 用户id
          id: this.userInfo.user_id,
          // 用户密码
          password: user.password
        }

        Http.editAccount(params).then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
             this.$alert('修改账号密码后需重新登录', '提示', {
              confirmButtonText: '确定',
            }).then(() => {
              this.$router.replace('/login');
            });
          })
        })
      }
    },
    destroyed() {
      this.$eventHub.$off('getNav');
    },
    mounted() {
      this.$eventHub.$on('activeHeader', (data) => { // 高亮当前菜单
        this.path = data;
      })
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/assets/css/mixin.scss";
  .header-wrapper {
    $navHeight: 55px;

    .header-container {
      position: fixed;
      top: 0;
      width: 100%;
      height: $navHeight;
      z-index: 10001;
      background-color: $themeColor;
      @include flexJustify(space-between);
      @include flexAlign(center);
      padding: 0 25px 0 15px;

    }
    .header-menu {
      flex: 1;
      @include flexAlign(center);
      font-size: 17px;
      font-weight: 500;
      color: #fff;
      img {
        width: 48px;
        height: 48px;
        vertical-align: middle;
        margin-right: 12px;
      }
      .menu-nav {
        padding-left: 30px;
        min-width: 680px;

        .el-menu-item {
          padding: 0;
          padding: 0 18px;
          color: #bfcbd9;

          &.is-current {
            border-bottom: 4px solid #409EFF !important;
            color: #fff;
            background: #1b1e23;
          }
        }
      }
    }
    .el-menu {
      background-color: transparent;
    }
    .el-menu--horizontal {
      border-bottom: none;
      &>.el-menu-item {
        height: $navHeight;
        line-height: $navHeight;
        &:not(.is-disabled):hover,
        &:not(.is-disabled):focus {
          background-color: transparent;
          color: #fff;
        }
        &.is-active {
          border-bottom-color: transparent;
          ;
        }
      }
    }
    .avatar-container {
      outline: none;
      min-width: 200px;
      @include flexAlign(center);
      @include flexJustify(flex-end);
      .icon {
        margin-right: 15px;
        display: inline-block;
        [class*="el-icon-"] {
          font-size: 20px;
          color: #9595ad;
        }
      }
      .avatar-wrapper {
        height: $navHeight;
        line-height: $navHeight;
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
          margin: 0 12px;
        }
      }
    }
  }

</style>

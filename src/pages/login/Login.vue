<template>
  <div class="login-container">
    <div class="login-panel" :class="{'login-panel-lg': false}">
      <h2 class="text-center">安全管理后台系统</h2>
      <el-form :model="loginData" @keyup.enter.native='submitForm("loginForm")' :rules="rules" ref="loginForm" class="login-form">
        <el-form-item prop="user_name">
          <el-input type="text" v-model.trim="loginData.user_name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input type="password" v-model.trim="loginData.pwd" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item class="remenber">
          <input type="checkbox" v-model="rememberme"/>记住用户名
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="form-btn" @click='submitForm("loginForm")' :loading="loading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import * as Http from "@/api/login";
  import md5 from 'js-md5';
  export default {
    data(){
      return {
         loginData:{
           user_name: '',
           pwd: ''
         },
         rules:{
           user_name: [{required: true, message: '请输入用户名', trigger: ['blur', 'change']}],
           pwd: [{required: true, message: '请输入密码', trigger: ['blur', 'change']}],
         },
         loading: false,
         rememberme: false
      }
    },
    created(){
      this.initData();
    },
    methods: {
      initData(){
        localStorage.removeItem('userInfo');
        if (localStorage.getItem('RememberMe')) {
          this.rememberme = true;
          const user = JSON.parse(localStorage.getItem('RememberMe'));
          this.loginData.user_name = user.user_name;
        }
      },
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.checkRemenberMe();
            this.loginFn();
          }
        });
      },
      checkRemenberMe(){
        if(this.rememberme) {
          localStorage.setItem('RememberMe', JSON.stringify({
            user_name: this.loginData.user_name
          }));
        } else {
          localStorage.removeItem('RememberMe');
        }
      },
      loginFn(){
        this.loading = true;
        let { user_name, pwd } = this.loginData;
        let params = {user_name: user_name, pwd: md5(pwd)};
        Http.login(params).then(res => {
          this.loading = false;
          this.$handleResponse(res, res=>{
            let { token } = res;
            localStorage.setItem('userInfo', JSON.stringify({token: token, userName: user_name}));
            this.$router.push({path: '/index'});
          });
        }).catch(res => {
          this.loading = false;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 600px;
    background-color: #2d3a4b;
  }
  .login-panel {
    width: 560px;
    min-height: 400px;
    background: #f4f4f4;
    border-radius: 15px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    padding: 25px 140px 50px;
    h2 {
      height: 55px;
      font-size: 18px;
    }
    .logo {
      margin: 15px 0 10px;
      width: 55px;
      height: 55px;
    }
  }
  .login-panel-lg {
    width: 580px;
  }
  .checknum {
    width: 65%;
  }

  .checkImg{
    width: 30%;
    height: 40px;
    vertical-align: middle;
  }
  .form-btn {
    width: 100%;
  }
  .remenber {
    .el-form-item__content {
      line-height: 15px;
    }
  }

  .el-form-item {
    margin-bottom: 15px;
    .el-form-item__error {
      top: 11px;
      right: -100px;
      left: 296px;
    }
  }

  .forgetPass {
    span {
      color: #222;
    }
  }
</style>



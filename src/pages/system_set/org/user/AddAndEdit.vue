<template>
  <div class="form__content" v-loading="loading">
    <el-form :model="user" :label-position="'right'" ref="userInfo" :rules="rules" @keyup.enter.native="onSubmit('userInfo')"
      label-width="100px" size="medium" style="width: 400px;">
      <el-form-item prop="username" label="姓名：">
        <el-input type="text" v-model.trim="user.username" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" label="手机号：">
        <el-input v-model.number="user.mobile" placeholder="请填写正确的手机号，此号将作为账号登录"></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <el-input type="password" v-model.trim="user.password" :placeholder="query.id ? '修改时密码不变请留空' : '密码默认为手机号后六位'"></el-input>
      </el-form-item>
      <el-form-item prop="role" label="所属角色：">
        <el-select v-model="user.role" placeholder="请选择角色" size="medium" :disabled='query.id && user.role === "超级管理员" ? true : false'>
          <el-option v-for="item in roleList" :key="item.name" :label="item.name" :value="item.name" v-if="item.type === 1">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="margin-top-30">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="onSubmit('userInfo')">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as Http from '@/api/setting'
  export default {
    data() {
      let validatorTel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (!(/^1[34578]\d{9}$/.test(value))) {
              callback(new Error('请输入有效的手机号'));
            } else {
              callback();
            }
          }
        }, 1000);
      }

      return {
        user: {
          username: '',
          mobile: null,
          role: ''
        },
        loading: false,
        roleList: [], // 角色列表
        rules: {
          username: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }],
          mobile: [{required: true, validator: validatorTel, trigger: 'blur'}],
          role: [{required: true, message: '所属角色不能为空', trigger: 'change'}]
        },
        query: {} // 路由参数
      }
    },
    created() {
      let {
        id,
        org_id
      } = this.$route.query // 获取路由参数
      this.query = {
        id: id, // 用户id
        org_id: org_id
      }

      this.init();
    },
    methods: {
      init() {
        this.getRoleFn();
        if (this.query.id) { // 编辑
          this.getUserInfo();
        }
      },
      getUserInfo() { // 查看用户信息
        this.loading = true;
        Http.viewUser(this.query.id).then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            let {
              model,
              group
            } = res;
            this.user.username = model.nickname;
            this.user.mobile = Number(model.mobile); // 将字符串转换为数字
            this.user.role = group && group[0];
          })
        }).catch(error => {
          this.loading = false;
        });
      },
      getRoleFn() { // 获取 角色的下拉列表
        this.loading = true;
        Http.getRoleList().then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.roleList = res.result;
          })
        }).catch(error => {
          this.loading = false;
        });
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let {
              username,
              mobile,
              password,
              role,
              id
            } = this.user;
            let params = {
              nickname: username,
              mobile: mobile ? mobile : '',
              org_id: this.query.org_id,
              "role[0]": role
            }
            // for (var key in role) { // 所选角色权限
            //   params["role[" + key + "]"] = role[key];
            // };

            if (!this.query.id) { // 新增
              // 密码如果为空则为手机后6位
              let strTel = mobile.toString()
              params.password = password ? password : strTel.slice(strTel.length - 6, strTel.length);

              Http.addUser(params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                  this.$message.success('新增成员成功');
                  this.handleClose();
                })
              }).catch(err => {
                this.loading = false;
              });
            } else { // 修改
              // 密码如果为空则为之前
              params.password = password ? password : null;
              Http.updataUser(this.query.id, params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                  this.$message.success('修改成员成功');
                  this.handleClose();
                })
              }).catch(err => {
                this.loading = false;
              });
            }
          }
        })
      },
      handleClose() {
        this.$router.push({
          path: '../org'
        });
      }
    }
  }

</script>
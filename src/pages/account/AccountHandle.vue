<template>
  <div>
    <bread-crumb :dataIsArr="false" isBack :breadName="$route.path"></bread-crumb>

    <div class="common-section minh768">
      <el-form :model="account" 
        :label-position="'right'" 
        v-loading="loading"
        ref="accountInfo" 
        :rules="rules" 
        @keyup.enter.native="onSubmit('accountInfo')"
        label-width="120px"
        size="medium"
        style="width:380px" class="padding-top-30">
        <el-form-item prop="user_name" label="账号：">
          <el-input type="text" v-model.trim="account.user_name" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名：">
          <el-input v-model.number="account.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item prop="pwd" label="密码：">
          <el-input type="password" v-model.trim="account.pwd" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="company_id" label="所属公司：">
          <span v-if="companyInfo.company_name">{{companyInfo.company_name}}</span>
          <el-select v-else v-model="account.company_id" placeholder="请选择公司" :disabled="propity == 2 ? true : false" @change="getDepartment">
            <el-option v-for="item in companyList" 
              :key="item.company_id" 
              :label="item.company_name" 
              :value="item.company_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门：">
          <el-select v-model="account.department_id" placeholder="请选择部门" @change="changeDepart">
            <el-option v-for="item in propity !== 3 ? departmentList : companyInfo.departments" 
              :key="item.department_id" 
              :label="item.department_name" 
              :value="item.department_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="job_level" label="岗位等级：">
          <el-select v-model="account.job_level" placeholder="请选择岗位">
            <el-option v-if="propity !== 3 ? true : item.value !== 3" v-for="item in jobList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="电话：">
          <el-input type="text" v-model.trim="account.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="允许登录：">
          <el-radio-group v-model="account.can_be_login">
            <el-radio :label="1">允许</el-radio>
            <el-radio :label="0">不允许</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="margin-top-30">
          <el-button @click="handleClose">取 消</el-button>
          <el-button @click="resetForm('accountInfo')">重置</el-button>
          <el-button type="primary" @click="onSubmit('accountInfo')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import * as Http from '@/api/home'
  import md5 from 'js-md5';
  import * as userInfo from "@/utils/commonService/getUserInfo";
  export default {
    props: ['type', 'accountParent'],
    inject: ['reload'],
    data() {
      return {
        title: "创建账号",
        dialogShow: true,
        account: {
          can_be_login: 1,
        },
        loading: false,
        companyList: [],
        departmentList: [],
        companyInfo: {},
        jobList: [
          {
            name: '岗位级',
            value: 1
          },
          {
            name: '部门级',
            value: 2
          },
          {
            name: '公司级',
            value: 3
          }
        ],
        rules: {
          user_name: [{required: true, message: '用户名称不能为空', trigger: 'blur'}],
          name: [{required: true, message: '中文名称不能为空', trigger: 'blur'}],
          pwd: [{required: true, message: '密码不能为空', trigger: 'blur'}],
          company_id: [{ required: true, message: '请选择所属公司', trigger: 'blur' }],
          // department_id: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
          job_level: [{ required: true, message: '请选择岗位等级', trigger: 'change' }]
        },
        userInfo: {},
        propity: {}
      }
    },
    created() {
      this.paramsId = this.$route.query && this.$route.query.userId;
      this.userInfo = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
      if (this.userInfo && this.userInfo.propity) {
          this.propity = this.userInfo.propity;
      }
      this.init();
    },
    methods: {
      getCompany() {
        Http.getCompanyDepartment()
          .then(res => {
            this.$handleResponse(res, res => {
              if (res.data) {
                this.companyList = res.data;

                let companyId = this.$route.query && this.$route.query.companyId;
                this.account.company_id = companyId;
                if (this.account.company_id) {
                  this.getDepartment(this.account.company_id);
                }
              }
            });
          })
          .catch(err => {
          });
      },
      getDepartment(companyId) {
        this.account.department_id = '';
        if (companyId) {
          let obj = {};
          obj = this.companyList.find(function(item){
              return item.company_id == companyId 
          });
          this.departmentList = obj && obj.departments;
        }
      },
      changeDepart(data) {
        this.$set(this.account, 'department_id', data);
        this.$forceUpdate();
      },
      getManagerCompanyDepartMent() {
        Http.getManagerCompanyDepartMent()
          .then(res => {
            this.$handleResponse(res, res => {
              if (res.data) {
                this.companyInfo = res.data;
                this.account.company_id = res.data.company_id;
              }
            });
          }).catch(err => { });
      },
      init() {
        if (this.propity !== 3) {
          // 获取公司列表
          this.getCompany();
          // 获取部门列表
          this.getDepartment();
        } else {
          this.getManagerCompanyDepartMent();
        }
        
        setTimeout(() =>{
          if (this.paramsId) { // 编辑
            this.title = "编辑账号"
            this.loading = true;
            Http.getAccountById({user_id: this.paramsId}).then(res => {
              this.loading = false;
              this.$handleResponse(res, res => {
                if (res.data) {
                  Object({}, this.account)
                  this.account = res.data;
                  // 部门列表
                  let obj = {};
                  obj = this.companyList.find(function(item){
                      return item.company_id === res.data.company_id 
                  });
                  this.departmentList = obj && obj.departments;
                  // 部门所选
                  this.account.department_id = res.data.department_id;
                  // pwd
                  this.account.pwdCopy = this.account.pwd;
                }
              })
            })
          }
        }, 500)

      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let {
              user_name,
              company_id,
              department_id,
              name,
              pwd,
              job_level,
              can_be_login,
              phone
            } = this.account;

            let params = {
                company_id: company_id,
                department_id: department_id,
                user_name: user_name,
                pwd: this.account.pwdCopy != this.account.pwd ? md5(pwd) : pwd,
                name: name,
                job_level: job_level,
                phone: phone,
                can_be_login: can_be_login
            }

            if (!this.paramsId) { // 新增
              Http.addAccount(params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                  this.$message.success('新增成功');
                  this.handleClose();
                })
              }).catch(err => {
                this.loading = false;
              });
            } else { // 修改
                params.user_id = this.paramsId;
                Http.updateAccount(params).then(res => {
                    this.loading = false;
                    this.$handleResponse(res, res => {
                    this.$message.success('修改成功');
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
          path: '../account',
          query: {
            companyId: this.account.company_id
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }

</script>
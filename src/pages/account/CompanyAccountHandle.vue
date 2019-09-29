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
          label-width="150px"
          size="medium"
          style="width: 420px">
          <el-form-item label="所属区域：" v-if="pageType != 3">
            <el-select v-model="account.manager_index" placeholder="请选择区域" size="medium">
              <el-option v-for="item in areaList" :key="item.manager_index" :label="item.area_name" :value="item.manager_index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="user_name" :label="pageType == 1 ? '政府名称：' : '账号/企业名称：'">
            <el-input type="text" v-model.trim="account.user_name" :placeholder="pageType == 1 ? '请输入政府名称' : '请输入账号/企业名称'"></el-input>
          </el-form-item>
          <el-form-item prop="pwd" label="密码：">
            <el-input type="password" v-model.trim="account.pwd" placeholder="请输入密码"></el-input>
          </el-form-item>
          <!-- <el-form-item prop="manager_index" label="管理地区：">
            <el-select v-model="account.manager_index" placeholder="请选择地区" @change="getSelectInfo">
              <el-option v-for="item in areaList" 
                :key="item.manager_index" 
                :label="item.area_name" 
                :value="item.manager_index">
              </el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item prop="company_id" label="所属公司：" v-if="pageType != 3">
            <el-select v-model="account.company_id" placeholder="请选择公司">
              <el-option v-for="item in companyList" 
                :key="item.company_id" 
                :label="item.company_name" 
                :value="item.company_id">
              </el-option>
            </el-select>
          </el-form-item> -->
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
        areaList: [],
        areaInfo: {},
        pageType: 3,
        companyId: '',
        paramsId: '',
        rules: {
          user_name: [{required: true, message: '用户名称不能为空', trigger: 'blur'}],
          pwd: [{required: true, message: '密码不能为空', trigger: 'blur'}],
          // company_id: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
          // manager_index: [{ required: true, message: '请选择管理地区', trigger: 'change' }]
        },
      }
    },
    created() {
      let routeQuery = this.$route.query;
      this.companyId = routeQuery && routeQuery.companyId;
      this.paramsId = routeQuery && routeQuery.userId;

      if (this.$route.path == '/account/addGovernment' || this.$route.path == '/account/editGovernment') {
        this.pageType = 1;
      } else if (this.$route.path == '/account/addCompany' || this.$route.path == '/account/editCompany'){
        this.pageType = 3;
      }
      this.init();
      this.getAreaSelect();
    },
    methods: {
      init() {
        // 获取下拉框信息
        if (this.pageType != 3) {
          this.getSelectInfo();
        }

        setTimeout(() =>{
          if (this.paramsId) { // 编辑
            this.title = "编辑账号"
            this.loading = true;
            Http.getMAccountById({user_id: this.paramsId}).then(res => {
              this.loading = false;
              this.$handleResponse(res, res => {
                if (res.data) {
                  Object({}, this.account)
                  this.account = res.data;
                  // 部门列表
                  // let obj = {};
                  // obj = this.companyList.find(function(item){
                  //     return item.company_id === res.data.company_id 
                  // });
                  // this.departmentList = obj.departments;
                  // // 部门所选
                  // this.account.department_id = res.data.department_id;
                  // pwd
                  this.account.pwdCopy = this.account.pwd;
                }
              })
            })
          }
        }, 500)
      },
      getAreaSelect() {
         Http.geAreaSelect().then(res => {
              this.$handleResponse(res, res => {
               this.areaList = res.data;
              })
          })
      },
      getSelectInfo() {
          Http.getSelectInfo().then(res => {
            this.$handleResponse(res, res => {
              if (res.areas) {
                this.areaInfo = res.areas;
                this.companyList = res.companies;
              }
            });
          })
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let {
              user_name,
              pwd,
              company_id,
              can_be_login
            } = this.account;


            let params = {
                user_name: user_name,
                pwd: this.account.pwdCopy != this.account.pwd ? md5(pwd) : pwd,
                propity: this.pageType,
                manager_index: this.areaInfo.manager_index,
                company_id:  this.companyId ? this.companyId : company_id,
                can_be_login: can_be_login
            }

            if (!this.paramsId) { // 新增
              Http.addCompanyAccount(params).then(res => {
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
                Http.updateAccountM(params).then(res => {
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
          path: this.pageType == 3 ? '../account/company' : '../account/government',
          // query: {
          //   companyId: this.companyId
          // }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }

</script>
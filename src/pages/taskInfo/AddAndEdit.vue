<template>
    <el-dialog :title="title" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false" :before-close="handleClose">
        <el-form :model="company" 
          :label-position="'right'" 
          ref="companyInfo" 
          :rules="rules" 
          @keyup.enter.native="onSubmit('companyInfo')"
          label-width="100px" size="medium"
          style="width:350px">
          <el-form-item prop="user_name" label="用户名称：">
            <el-input type="text" v-model.trim="company.user_name" placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item prop="name" label="中文名称：">
            <el-input v-model.number="company.name" placeholder="请输入中文名称"></el-input>
          </el-form-item>
          <el-form-item prop="pwd" label="密码：">
            <el-input type="password" v-model.trim="company.pwd" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="company_id" label="所属公司：">
            <el-select v-model="company.company_id" placeholder="请选择公司">
              <el-option v-for="item in companyList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="department_id" label="所属部门：">
            <el-select v-model="company.department_id" placeholder="请选择部门">
              <el-option v-for="item in departmentList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="job_level" label="岗位等级：">
            <el-select v-model="company.job_level" placeholder="请选择部门">
              <el-option v-for="item in jobList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="允许登录：">
            <el-radio-group v-model="company.can_be_login">
              <el-radio :label="1">允许</el-radio>
              <el-radio :label="0">不允许</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="onSubmit('companyInfo')">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import * as Http from '@/api/home'
  export default {
    props: ['type', 'accountParent'],
    inject: ['reload'],
    data() {
      return {
        title: "创建账号",
        dialogShow: true,
        company: {
          can_be_login: 1,
          pwd: '',
        },
        loading: false,
        companyList: [],
        departmentList: [],
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
          company_id: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
          department_id: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
          job_level: [{ required: true, message: '请选择岗位等级', trigger: 'change' }]
        },
      }
    },
    created() {
      // 获取公司列表
      this.getCompany();
      // 获取部门列表
      this.getDepartment();
      this.init();
    },
    methods: {
      getCompany() {
        // Http.getAccountList(params)
        //   .then(res => {
        //     this.loading = false;
        //     this.$handleResponse(res, res => {
        //       this.listData = res.data;
        //       this.page.total = res.total_page;
        //     });
        //   })
        //   .catch(err => {
        //     this.loading = false;
        //   });
      },
      getDepartment() {

      },
      init() {
         if(this.type == 'edit') {
            this.title = "编辑账号";
            this.loading = true;    
            setTimeout(() => {
                this.company = Object.assign({}, this.accountParent);
                this.loading = false;
            },0);
        }
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let {
              company_name,
              company_type,
            } = this.company;

            let params = {
                company_name: company_name,
                company_type: company_type
            }

            if (this.type == 'add') { // 新增
              Http.addCompany(params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                  this.$message.success('新增成功');
                  this.handleClose();
                })
              }).catch(err => {
                this.loading = false;
              });
            } else { // 修改
                params.company_id = this.company.company_id;
                Http.updateCompany(params).then(res => {
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
        this.$emit("cancel");
      }
    }
  }

</script>
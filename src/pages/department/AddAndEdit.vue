<template>
    <el-dialog :title="title" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false" :before-close="handleClose">
        <div class="form__content" v-loading="loading" style="width:520px">
            <el-form :model="department" :label-position="'right'" ref="departmentInfo" :rules="rules" @keyup.enter.native="onSubmit('departmentInfo')"
              label-width="100px" size="medium" style="width: 400px;">
              <el-form-item prop="company_id" label="所选公司：">
                  <el-select v-model="department.company_id" placeholder="请选择公司" size="medium">
                  <el-option v-for="item in companyList" :key="item.company_id" :label="item.company_name" :value="item.company_id">
                  </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item prop="department_name" label="部门名称：">
                  <el-input type="text" v-model.trim="department.department_name" placeholder="请输入公司名称"></el-input>
              </el-form-item>
            </el-form>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="onSubmit('departmentInfo')">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import * as Http from '@/api/home'
  export default {
    props: ['type', 'departmentParent'],
    inject: ['reload'],
    data() {
      return {
        title: "创建公司",
        dialogShow: true,
        department: {
          department_name: '',
          company_id: ''
        },
        loading: false,
        // 公司类型列表
        companyList: [],
        rules: {
          department_name: [{
            required: true,
            message: '部门名称不能为空',
            trigger: 'blur'
          }],
          company_id: [{required: true, message: '公司不能为空', trigger: 'change'}]
        },
      }
    },
    created() {
      this.getCompanyList();
      this.init();
    },
    methods: {
      init() {
         if(this.type == 'edit') {
            this.title = "编辑公司";
            this.loading = true;    
            setTimeout(() => {
                this.department = Object.assign({}, this.departmentParent);
                this.loading = false;
            },0);
        }
      },
      getCompanyList() {
        let params = {
          page: 1
        };
        Http.getCompanyList(params)
          .then(res => {
            this.$handleResponse(res, res => {
              if (res) {
                this.companyList = res.data;
              }
            });
          })
          .catch(err => {});
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let {
              department_name,
              company_id
            } = this.department;

            let params = {
                department_name: department_name,
                company_id: company_id
            }

            if (this.type == 'add') { // 新增
              Http.addDepartment(params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                  this.$message.success('新增成功');
                  this.handleClose();
                  this.reload();
                })
              }).catch(err => {
                this.loading = false;
              });
            } else { // 修改
                params.department_id = this.department.department_id;
                Http.updateDepartment(params).then(res => {
                    this.loading = false;
                    this.$handleResponse(res, res => {
                      this.$message.success('修改成功');
                      this.handleClose();
                      this.reload();
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
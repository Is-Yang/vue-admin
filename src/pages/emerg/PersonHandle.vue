<template>
    <el-dialog :title="title" :visible.sync="dialogShow" width="520px" :close-on-click-modal="false" :before-close="handleClose">
        <el-form :model="personForm" 
        :label-position="'right'" 
        v-loading="loading"
        ref="personForm" 
        :rules="rules" 
        @keyup.enter.native="onSubmit('personForm')"
        label-width="120px"
        size="medium"
        style="width:380px" class="padding-top-30">
        <el-form-item prop="user_name" label="用户名：">
            <el-input type="text" v-model.trim="personForm.user_name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="电话：">
            <el-input type="text" v-model.trim="personForm.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item prop="job_level" label="岗位等级：">
            <el-select v-model="personForm.job_level" placeholder="请选择岗位">
            <el-option v-for="item in jobList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item class="margin-top-30">
            <el-button @click="handleClose">取 消</el-button>
            <el-button @click="resetForm('personForm')">重置</el-button>
            <el-button type="primary" @click="onSubmit('personForm')">确定</el-button>
        </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
  import * as Http from '@/api/home'
  import md5 from 'js-md5';
  import * as userInfo from "@/utils/commonService/getUserInfo";
  export default {
    props: ['type', 'personData'],
    inject: ['reload'],
    data() {
      return {
        title: "创建应急人员",
        dialogShow: true,
        personForm: {},
        loading: false,
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
          job_level: [{ required: true, message: '请选择岗位等级', trigger: 'change' }]
        },
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        if(this.type == 'edit') {
            this.title = "编应急人员";
            this.loading = true;    
            setTimeout(() => {
                this.personForm = Object.assign({}, this.personData);
                this.loading = false;
            },0);
        }
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let {
              user_name,
              job_level,
              phone
            } = this.personForm;

            let params = {
                user_name: user_name,
                job_level: job_level,
                phone: phone
            }

            if (this.type == 'add') { // 新增
              Http.addCompanyContainer(params).then(res => {
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
                params.user_id = this.personForm.user_id;
                Http.updateCompanyContainer(params).then(res => {
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
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }

</script>
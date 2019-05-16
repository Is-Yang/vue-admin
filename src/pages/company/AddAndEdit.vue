<template>
    <el-dialog :title="title" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false" :before-close="handleClose">
        <div class="form__content" v-loading="loading" style="width:520px">
            <el-form :model="company" :label-position="'right'" ref="companyInfo" :rules="rules" @keyup.enter.native="onSubmit('companyInfo')"
              label-width="100px" size="medium" style="width: 400px;">
              <el-form-item prop="company_name" label="公司名称：">
                  <el-input type="text" v-model.trim="company.company_name" placeholder="请输入公司名称"></el-input>
              </el-form-item>
              <el-form-item prop="company_type" label="公司类型：">
                  <el-select v-model="company.company_type" placeholder="请选择公司类型" size="medium">
                  <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                  </el-select>
              </el-form-item>
            </el-form>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="onSubmit('companyInfo')">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import * as Http from '@/api/home'
  export default {
    props: ['type', 'companyParent'],
    inject: ['reload'],
    data() {
      return {
        title: "创建公司",
        dialogShow: true,
        company: {
          company_name: '',
          company_type: ''
        },
        loading: false,
        // 公司类型列表
        typeList: [
            {
                label: '危险化学品',
                value: 0,
            },
            {
                label: '煤矿',
                value: 1,
            },
            {
                label: '非煤矿山',
                value: 2,
            },
            {
                label: '工贸行业',
                value: 3,
            },
            {
                label: '其他',
                value: 4,
            }
        ],
        rules: {
          company_name: [{
            required: true,
            message: '公司名称',
            trigger: 'blur'
          }],
          company_type: [{required: true, message: '公司类型不能为空', trigger: 'change'}]
        },
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
         if(this.type == 'edit') {
            this.title = "编辑公司";
            this.loading = true;    
            setTimeout(() => {
                this.company = Object.assign({}, this.companyParent);
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
                  this.reload();
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
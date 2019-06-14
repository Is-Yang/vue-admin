<template>
  <el-dialog width="30%" :title="title" :visible.sync="dialogShow"  :close-on-click-modal="false" :before-close="handleClose">
    <el-form 
      :model="classForm"
      :rules="rules"
      ref="classForm"
      @keyup.enter.native="onSubmit('classForm')"
      label-width="100px" class="padding-right-30">
      <el-form-item label="标题" prop="position_name" v-if="position == 'big'">
        <el-input v-model="classForm.position_name"></el-input>
      </el-form-item>
      <el-form-item label="长标题" prop="position_detail_name" v-if="position == 'small'">
        <el-input v-model="classForm.position_detail_name"></el-input>
      </el-form-item>
      <el-form-item label="短标题" prop="position_detail_sname" v-if="position == 'small'">
        <el-input v-model="classForm.position_detail_sname"></el-input>
      </el-form-item>
      <el-form-item class="margin-top-30">
        <el-button type="primary" @click="submitForm('classForm')">确定</el-button>
        <el-button @click="resetForm('classForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import * as Http from '@/api/home'
export default {
    props: ['type', 'classParent', 'position'],
    inject: ['reload'],
    data() {
      return {
        title: "创建分类",
        dialogShow: true,
        loading: false,
        classForm: {},
        rules: {
          position_name: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          position_detail_name: [
            { required: true, message: '请输入长标题', trigger: 'blur' }
          ],
          position_detail_sname: [
            { required: true, message: '请输入短标题', trigger: 'blur' }
          ]
        }
      };
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        if(this.type == 'edit') {
            this.title = "编辑分类";
            this.loading = true;    
            setTimeout(() => {
                this.classForm = Object.assign({}, this.classParent);
                this.loading = false;
            },0);
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;

            if (this.position == 'big') {  // 大分类
                let params = {
                    position_name: this.classForm.position_name
                }

                if (this.type == 'add') { // 新增
                    Http.addPosition(params).then(res => {
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
                    params.position_id = this.classForm.position_id;
                    Http.uploadPosition(params).then(res => {
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
            } else {  // 小分类
                let params = {
                    position_detail_name: this.classForm.position_detail_name,
                    position_detail_sname: this.classForm.position_detail_sname
                }

                if (this.type == 'add') { // 新增
                    Http.addPositionDetail(params).then(res => {
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
                    params.position_id = this.classForm.position_id;
                    params.position_detail_id = this.classForm.position_detail_id;
                    Http.uploadPositionDetail(params).then(res => {
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
          }
        });
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


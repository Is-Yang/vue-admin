<template>
  <div>
      <el-dialog :title="title" :visible.sync="dialogShow" width="500px" :close-on-click-modal="false" :before-close="handleClose">
        <el-form 
          :model="picturesForm"
          :rules="rules"
          ref="picturesForm"
          @keyup.enter.native="onSubmit('picturesForm')"
          label-width="100px" class="picturesForm">
          <el-form-item label="标题" prop="title">
            <el-input v-model="picturesForm.title" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="上传文件">
            <el-upload
              :action="uploadUrl"
              :auto-upload="false"
              :before-remove="beforeRemove"
              :on-change="fileChange"
              :limit="1"
              :file-list="fileList">
              <el-button size="small">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item class="margin-top-40">
            <el-button type="primary" @click="submitForm('picturesForm')">确定</el-button>
            <el-button @click="resetForm('picturesForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>
</template>
  
<script>
import * as Http from '@/api/home'
import * as userInfo from "@/utils/commonService/getUserInfo";
let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
export default {
    props: ['type', 'fileParent', 'currentActive'],
    inject: ['reload'],
    data() {
      return {
        title: "上传资料",
        dialogShow: true,
        loading: false,
        fileList: [],
        picturesForm: {
          title: '',
          file: ''
        },
        params: {
          title: '',
        },
        uploadUrl: window.scrmApi + '/manager_file_upload?token=' + user_info.token,
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          img: [
            { required: true, message: '请上传图片', trigger: 'blur' }
          ]
        }
      };
    },
    created () {
      this.init();
    },
    methods: {
      init() {
         if(this.type == 'edit') {
            this.title = "编辑资料";
            this.loading = true;    
            setTimeout(() => {
                this.picturesForm = Object.assign({}, this.imgParent);
                this.loading = false;
            },0);
        }
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      fileChange(file, fileList) {
        this.picturesForm.file = file.raw;
        
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let {
              title,
              file
            } = this.picturesForm;

            let route = this.$route;
            let form = '';
            if (route.path == '/company/zfinfo') {
              form = 1;
            } else if (route.path == '/company/qtinfo') {
              form = 0;
            }

            let formData = new FormData();
            formData.append('title', title);
            formData.append('type', this.currentActive);
            formData.append('form', form);
            formData.append('file', file);

            if (this.type == 'add') { // 新增
              Http.uploadFile(formData).then(res => {
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
                formData.append('id', this.picturesForm.id);
                Http.updateManageImg(formData).then(res => {
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

<style lang="scss">
  .picturesForm {
    .uploader {
      width: 160px;
      height: 160px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      .el-upload {
        display: block;
      }

      .picture {
        width: 100%;
        height: 0;
        padding-top: 100%;
        overflow: hidden;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        -webkit-background-size: cover;
      }

      .el-icon-plus {
        width: 160px;
        height: 160px;
        line-height: 160px;
        font-size: 40px;
        font-weight: 600;
        color: #409eff;
      }
    }
  }
</style>


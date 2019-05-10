<template>
  <el-dialog :title="title" :visible.sync="dialogShow" width="500px" :close-on-click-modal="false" :before-close="handleClose">
    <el-form 
      :model="picturesForm"
      :rules="rules"
      ref="picturesForm"
      @keyup.enter.native="onSubmit('picturesForm')"
      label-width="100px" class="picturesForm">
      <el-form-item label="宣传标题" prop="title">
        <el-input v-model="picturesForm.title" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="宣传图" prop="imageUrl">
            <el-upload
                class="uploader"
                :action="uploadUrl"
                :data="params"
                :show-file-list="false"
                :auto-upload="false"
                :on-success="handleAvatarSuccess">
                <div v-if="picturesForm.imageUrl" :style="{backgroundImage: 'url('+ picturesForm.imageUrl +')'}" class="picture"></div>
                <i v-else class="el-icon-plus"></i>
            </el-upload>
      </el-form-item>
      <el-form-item class="margin-top-40">
        <el-button type="primary" @click="submitForm('picturesForm')">确定</el-button>
        <el-button @click="resetForm('picturesForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import * as Http from '@/api/home'
import * as userInfo from "@/utils/commonService/getUserInfo";
let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
export default {
    props: ['type', 'taskParent'],
    inject: ['reload'],
    data() {
      return {
        title: "添加宣传图",
        dialogShow: true,
        loading: false,
        picturesForm: {
          title: '',
          imageUrl: ''
        },
        params: {
          title: '',
        },
        uploadUrl: window.scrmApi + '/manager_upload_img?token=' + user_info.token,
        rules: {
          title: [
            { required: true, message: '请输入宣传标题', trigger: 'blur' }
          ],
          imageUrl: [
            { required: true, message: '请上传宣传图', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      handleAvatarSuccess(res, file) {
        if (res.ok) {
          this.picturesForm.imageUrl = URL.createObjectURL(file.raw);
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败");
        }
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


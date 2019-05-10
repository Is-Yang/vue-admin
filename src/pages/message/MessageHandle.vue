<template>
  <el-dialog :title="title" :visible.sync="dialogShow" width="520px" :close-on-click-modal="false" :before-close="handleClose">
    <el-form 
      :model="messageForm"
      :rules="rules"
      ref="messageForm"
      @keyup.enter.native="onSubmit('messageForm')"
      label-width="100px" class="messageForm">
       <el-form-item label="消息发送者" prop="message_from">
        <el-input v-model="messageForm.message_from"></el-input>
      </el-form-item>
      <el-form-item label="消息标题" prop="message_title">
        <el-input v-model="messageForm.message_title"></el-input>
      </el-form-item>
      <el-form-item label="消息内容" prop="message_content">
        <el-input type="textarea" v-model="messageForm.message_content"></el-input>
      </el-form-item>
      <el-form-item class="margin-top-30">
        <el-button type="primary" @click="submitForm('messageForm')">确定</el-button>
        <el-button @click="resetForm('messageForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import * as Http from '@/api/home'
export default {
    props: ['type', 'taskParent'],
    inject: ['reload'],
    data() {
      return {
        title: "创建任务",
        dialogShow: true,
        loading: false,
        messageForm: {},
        rules: {
          message_title: [
            { required: true, message: '请输入消息标题', trigger: 'blur' }
          ],
          message_content: [
            { required: true, message: '请输入消息内容', trigger: 'blur' }
          ],
          message_from: [
            { required: true, message: '请输入消息发送者', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let {
              message_title,
              message_content,
              message_from
            } = this.messageForm;

            let params = {
                message_title: message_title,
                message_content: message_content,
                message_from: message_from,
            }

            Http.genMessage(params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                    this.$message.success('发送成功');
                    this.handleClose();
                    this.reload();
                })
            }).catch(err => {
                this.loading = false;
                console.log(err)
            });
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



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
      <el-form-item v-if="pageType === 1" prop="company_id" label="发送对象：">
          <el-select v-model="messageForm.company_id" placeholder="请选择发送企业" size="medium">
          <el-option v-for="(item, index) in companyList" :key="index" :label="item.company_name" :value="item.company_id">
          </el-option>
          </el-select>
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
import moment from 'moment';
export default {
    props: ['pageType'],
    inject: ['reload'],
    data() {
      return {
        title: "创建消息",
        dialogShow: true,
        loading: false,
        messageForm: {},
        companyList: [],
        rules: {
          message_title: [
            { required: true, message: '请输入消息标题', trigger: 'blur' }
          ],
          company_id: [
            { required: true, message: '请选择发送对象', trigger: 'change' }
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
    created() {
      // 如果是政府端需指定发送对象
      if (this.pageType == 1) {
          this.getCompanySelect()
      }
    },
    methods: {
      // 获取所有公司列表
      getCompanySelect() {
        Http.getGovCompanySelect()
          .then(res => {
            this.$handleResponse(res, res => {
              if (res) {
                this.companyList = res.data;
              }
            });
          })
          .catch(err => {});
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let {
              message_title,
              message_content,
              message_from
            } = this.messageForm;

            let create_time = Math.round(new Date().getTime()/1000);

            // 平台端
            let pinParams = {
                message_title: message_title,
                message_content: message_content,
                message_from: message_from,
            }
            // 政府端
            let goverParams = {
                message_from: message_from,
                company_id: this.messageForm.company_id,
                title: message_title,
                content: message_content,
                create_time: create_time
            }
            // pageType 1:政府端， 2:平台端
            let queryName = this.pageType == 1 ? 'sendMessage' : 'genMessage';
            let params = this.pageType == 1 ? goverParams : pinParams;
            Http[queryName](params).then(res => {
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



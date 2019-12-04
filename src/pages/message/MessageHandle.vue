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
      <el-form-item label="发送对象：">
        <el-radio v-model="sendType" label="1">群发</el-radio>
        <el-radio v-model="sendType" label="2">单独发</el-radio>
        <br />
        <el-select style="width: 100%;" v-if="sendType == 2" v-model="messageForm.company_id" filterable placeholder="请选择发送企业" size="medium">
          <el-option v-for="(item, index) in companyList" :key="index" :label="item.company_name" :value="item.company_id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item prop="message_from" label="发送对象：">
          <el-select v-model="messageForm.company_id" filterable placeholder="请选择发送企业" size="medium">
            <el-option v-for="(item, index) in companyList" :key="index" :label="item.company_name" :value="item.company_id">
            </el-option>
          </el-select>
      </el-form-item> -->
      <el-form-item label="区域：" v-if="pageType == 2 && sendType == 1">
      <el-select v-model="messageForm.manager_index" placeholder="请选择区域" size="medium">
        <el-option v-for="item in areaList" :key="item.manager_index" :label="item.area_name" :value="item.manager_index">
        </el-option>
      </el-select>
    </el-form-item>
      <el-form-item prop="company_type" v-if="sendType == 1" label="公司类型：">
        <el-select v-model="messageForm.company_type" placeholder="请选择公司类型" size="medium">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息标题" prop="message_title">
        <el-input v-model="messageForm.message_title"></el-input>
      </el-form-item>
      <el-form-item label="消息内容" prop="message_content">
        <el-input type="textarea" v-model="messageForm.message_content"></el-input>
      </el-form-item>
       <el-form-item label="上传附件">
        <el-upload
          :action="uploadUrl"
          :before-remove="beforeRemove"
          :on-success="handleImageSuccess"
          :limit="1"
          :file-list="fileList">
          <el-button size="small">点击上传</el-button>
        </el-upload>
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
import * as userInfo from "@/utils/commonService/getUserInfo";
import store from '../../store';
let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
export default {
    props: ['pageType'],
    inject: ['reload'],
    data() {
      return {
        title: "创建消息",
        dialogShow: true,
        sendType: '1',
        loading: false,
        messageForm: {},
        companyList: [],
        fileList: [],
        areaList: [],
        // 公司类型列表
        typeList: [{
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
        imageUrl: '',
        uploadUrl: window.scrmApi + '/manager_upload_message_file?token=' + (user_info.token ? user_info.token : store.getters.userInfo.token),
        rules: {
          message_title: [
            { required: true, message: '请输入消息标题', trigger: 'blur' }
          ],
          message_content: [
            { required: true, message: '请输入消息内容', trigger: 'blur' }
          ],
          message_from: [
            { required: true, message: '请输入发送者', trigger: 'blur' }
          ]
        }
      };
    },
    created() {
        this.getCompanySelect();
        this.getAreaSelect();
    },
    methods: {
      // 获取所有公司列表
      getCompanySelect() {
        // this.pageType == 1 ? 'getGovCompanySelect' : 
        let queryName = 'getAllCompanyList';
        Http[queryName]()
          .then(res => {
            this.$handleResponse(res, res => {
              if (res) {
                this.companyList = res.data;
              }
            });
          })
          .catch(err => {});
      },
      getAreaSelect() {
         Http.geAreaSelect().then(res => {
              this.$handleResponse(res, res => {
               this.areaList = res.data;
              })
          })
      },
      handleImageSuccess(res, file) {
        if (res.file_url) {
          this.imageUrl = URL.createObjectURL(file.raw);
          this.messageForm.file_url = res.file_url; 
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败");
        }
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let {
              message_title,
              message_content,
              message_from,
              company_id,
              company_type,
              file_url,
              manager_index
            } = this.messageForm;

            let create_time = Math.round(new Date().getTime()/1000);

            // 平台端
            let pinParams = {
                message_title: message_title,
                message_content: message_content,
                message_from: message_from,
                company_id: company_id,
                company_type: company_type,
                file_url: file_url,
                manager_index: manager_index
            }
            // 政府端
            let goverParams = {
                message_title: message_title,
                message_content: message_content,
                message_from: message_from,
                company_id: company_id,
                company_type: company_type,
                file_url: file_url,
                // message_to: this.sendType == '1' ? -1 : company_id
            }
            // pageType 1:政府端， 2:平台端
            let queryName = 'sendMessage';
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

<style lang="scss">
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

</style>



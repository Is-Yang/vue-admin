<template>
  <el-form :model="company" :label-position="'right'" ref="companyInfo" :rules="rules"
    @keyup.enter.native="onSubmit('companyInfo')" label-width="100px" size="medium">
    <el-form-item prop="company_name" label="公司名称：">
      <el-input type="text" style="width: 280px;" v-model.trim="company.company_name" placeholder="请输入公司名称"></el-input>
    </el-form-item>
    <el-form-item prop="company_type" label="公司类型：">
      <el-select v-model="company.company_type" placeholder="请选择公司类型" size="medium">
        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="公司信息：">
      <el-input type="textarea" :rows="2" style="width: 280px;" v-model="company.company_info"></el-input>
    </el-form-item>
    <el-form-item label="四色图1：">
      <el-row type="flex" :gutter="10">
        <el-col :span="4">
          <el-upload class="uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleImageSuccess1">
            <div v-if="imageUrl1" :style="{backgroundImage: 'url('+ imageUrl1 +')'}" class="picture"></div>
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </el-col>
        <el-col :span="6">
          <div class="flex">
            <span style="width: 75px;">四色图2：</span>
            <el-upload class="uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleImageSuccess2">
              <div v-if="imageUrl2" :style="{backgroundImage: 'url('+ imageUrl2 +')'}" class="picture"></div>
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="flex">
            <span style="width: 75px;">四色图3：</span>
            <el-upload class="uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleImageSuccess3">
              <div v-if="imageUrl3" :style="{backgroundImage: 'url('+ imageUrl3 +')'}" class="picture"></div>
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="flex">
            <span style="width: 75px;">四色图4：</span>
            <el-upload class="uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleImageSuccess4">
              <div v-if="imageUrl4" :style="{backgroundImage: 'url('+imageUrl4 +')'}" class="picture"></div>
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="地图点">
      <v-map @selectLocation="selectLocation" :mapXY="mapXY"></v-map>
    </el-form-item>
    <el-form-item class="margin-top-30">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="onSubmit('companyInfo')">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import * as Http from '@/api/home'
  import * as userInfo from "@/utils/commonService/getUserInfo";
  import VMap from './Map'
  let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
  export default {
    inject: ['reload'],
    components: {
      VMap
    },
    data() {
      return {
        uploadUrl: window.scrmApi + '/manager_upload_company_img?token=' + user_info.token,
        dialogShow: true,
        company: {
          company_name: '',
          company_type: '',
        },
        imageUrl1: '',
        imageUrl2: '',
        imageUrl3: '',
        imageUrl4: '',
        companyId: '',
        loading: false,
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
        mapXY: {},
        rules: {
          company_name: [{
            required: true,
            message: '公司名称不能为空',
            trigger: 'blur'
          }],
          company_type: [{
            required: true,
            message: '公司类型不能为空',
            trigger: 'change'
          }],
          companyLocation: {
            lng: '',
            lat: ''
          },
        },
      }
    },
    created() {
      this.companyId = this.$route.query && this.$route.query.companyId;
      this.init();
    },
    methods: {
      init() {
        if (this.companyId) {
          this.loading = true;
          Http.getCompanyById({company_id: this.companyId}).then(res => {
              this.loading = false;
              this.$handleResponse(res, res => {
                let data = res.data;
                this.company = data;
                this.imageUrl1 = data.company_img_1;
                this.imageUrl2 = data.company_img_3;
                this.imageUrl3 = data.company_img_4;
                this.imageUrl4 = data.company_img_4;
                this.mapXY = {
                    xData: data.company_x,
                    yData: data.company_y,
                    edit: true
                }
              })
          }).catch(err => {
              this.loading = false;
          });
        }
      },
      selectLocation (location) {
        if (location && location.lng && location.lat) {
          this.companyLocation = location
        }
      },
      handleImageSuccess1(res, file) {
        if (res.ok) {
          this.imageUrl1 = URL.createObjectURL(file.raw);
          this.company.company_img_1 = res.url; 
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败");
        }
      },
      handleImageSuccess2(res, file) {
        if (res.ok) {
          this.imageUrl2 = URL.createObjectURL(file.raw);
          this.company.company_img_2 = res.url; 
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败");
        }
      },
      handleImageSuccess3(res, file) {
        if (res.ok) {
          this.imageUrl3 = URL.createObjectURL(file.raw);
          this.company.company_img_3 = res.url; 
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败");
        }
      },
      handleImageSuccess4(res, file) {
        if (res.ok) {
          this.imageUrl4 = URL.createObjectURL(file.raw);
          this.company.company_img_4 = res.url; 
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败");
        }
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            let {
              company_name,
              company_type,
              company_info,
              company_img_1,
              company_img_2,
              company_img_3,
              company_img_4,
            } = this.company;

            let params = {
              company_name: company_name,
              company_type: company_type,
              company_info: company_info,
              company_img_1: company_img_1,
              company_img_2: company_img_2,
              company_img_3: company_img_3,
              company_img_4: company_img_4,
              company_x: this.companyLocation && this.companyLocation.lng && parseFloat(this.companyLocation.lng),
              company_y: this.companyLocation && this.companyLocation.lat && parseFloat(this.companyLocation.lat)
            }


            if (!this.companyId) { // 新增
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
        this.$router.push({
          path: '../company'
        });
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

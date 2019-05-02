<template>
  <div class="m20">
    <bread-crumb :dataIsArr="false" :breadName="xgSettingListName" isBack></bread-crumb>
    <div class="common-section">
      <div class="org-edit form__content" v-loading="loading">
        <el-form
          :model="org"
          :label-position="'right'"
          ref="orgInfo"
          :rules="rules"
          @keyup.enter.native="onSubmit('roleInfo')"
          size="small"
          label-width="120px"
        >
          <el-form-item prop="name" label="子标签名称：">
            <el-input v-model.trim="org.name" placeholder="20字符内"/>
          </el-form-item>
          <!-- <el-form-item prop="brand" label="管理品牌：">
                <el-checkbox-group v-model="org.brand">
                    <el-checkbox v-for="item in brandList" :label="item.org_brand_id" :key="item.org_brand_id" name="brand">
                        {{item.brand_name}}
                    </el-checkbox>
                </el-checkbox-group>
          </el-form-item>-->
          <el-form-item label="管理4s店：">
            <el-button type="primary" @click="dialogShow('add',{})" size="small" round>选择4s店</el-button>

            <el-card class="box-card">
              <div
                v-for="(item,index) in org.relationAreasData"
                :key="index"
                class="text item"
              >{{item.name}}</div>
              <div
                v-if="!org.relationAreasData || !org.relationAreasData.length"
                class="box-card_empty"
              >无数据</div>
            </el-card>

            <div class="el-form-item__error" v-if="validatorAreas">请至少选择一个4S店</div>
          </el-form-item>

          <el-form-item class="margin-top-30">
            <el-button type="primary" @click="onSubmit('orgInfo')" size="medium" round>确 定</el-button>
            <el-button @click="handleClose" size="medium" round>取 消</el-button>
          </el-form-item>
        </el-form>

        <!-- 管理4s店弹窗 -->
        <select-area
          v-if="dialog.menuShow"
          :type="dialog.type"
          :menuId="dialog.menuId"
          :relationAreasOptions="org.relationAreasData"
          :pRelationAreasOptions="org.pRelationAreasData"
          :transProps="{
            key: 'area_id',
            label: 'name'
          }"
          v-on:areas-change="listenToAreas"
          @cancel="dialog.menuShow = !dialog.menuShow"
          @success="dialogSuccess"
        ></select-area>
      </div>
    </div>
  </div>
</template>

<script>
import * as Http from "@/api/statistics";
import * as userInfo from '@/utils/commonService/getUserInfo';
export default {
  data() {
    /* let validatorBrand = (rule, arr, callback) => {
            if (this.brandList.length > 0 && arr.length === 0) {
                return callback(new Error('请至少选择一个品牌'));
            } else {
                callback();
            }
        } */

    return {
      brandList: [], // 品牌列表
      org: {
        name: "",
        brand: [],
        relationAreasData: [],
        pRelationAreasData: []
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入子标签名称",
            trigger: "blur"
          },
          {
            min: 0,
            max: 20,
            message: "20个字符以内",
            trigger: ["blur", "change"]
          }
        ]
        // brand: [{ required: true, validator: validatorBrand, trigger: 'change' }]
      },
      loading: false,
      params: {}, // 参数
      dialog: {
        menuShow: false,
        type: "",
        menuId: 0
      },
      validatorAreas: false,
      xgSettingListName: 'xgSettingListAdd',
      user_info: ''
    };
  },
  created() {
    let label_pid = this.$route.query.pid; // 新增 获取路由参数
    this.params = {
      label_pid: label_pid // 标签id
    };
    // 获取登录成功后返回的用户信息
    this.user_info = JSON.parse(userInfo.getUserInfo());
    if (this.$route.query.type == 'edit') {   // 编辑
      // 编辑状态
      this.org.name = this.$route.query.name;
      // this.getLabelChildAreas(this.$route.query.id);
      this.xgSettingListName = 'xgSettingListEdit';
      this.getArea(this.user_info.org_id, 'add');   //传组织ID获取所有的  传标签获取已选中的
      this.getArea(this.$route.query.id, 'edit');
    } else {
      // this.org.relationAreasData = [];
      this.xgSettingListName = 'xgSettingListAdd';
      this.getArea(this.user_info.org_id, 'add');

    }

    // this.getArea();
    this.init();
  },
  methods: {
    init() {
      if (this.params.id) {
        this.loading = true;
        // 查看组织信息
        Http.getLabelChild(this.params.id).then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.params.pid = res.pid; // 父组织id
            if (this.params.name) {
              // 新增
              // 获取品牌管理列表
              this.brandList = res.brand;
              // this.org.relationAreasData = [];
              // this.org.pRelationAreasData = res.pRelationAreas;
            } else {
              // 编辑
              this.org.name = res.name;
              // this.org.relationAreasData = res.relationAreas;
              // this.org.pRelationAreasData = res.pRelationAreas;
              // 获取品牌管理列表
              /* this.brandList = res.pBrand;
                            // 选中对应的管理品牌
                            res.brand.forEach(item => {
                                this.org.brand.push(item.org_brand_id);
                            }); */
            }
          });
        });
      }
    },
    getArea(id, type) {
      // let params = type == 'add' ? {org_id: id} : {label_id: id};
      let params = {}
      let httpName = '';
      if(type == 'add'){
        httpName = 'getAreaByOrg'
      }else if(type == 'edit'){
        params = {label_id: id};
        httpName = 'getArea';
      }
      this.loading = true;
      Http[httpName](params).then(res => {
        this.loading = false;
        this.$handleResponse(res, res => {
          // res = {
          //   result: [
          //     {
          //       area_id: "1",
          //       name: "驱动4S客户管理"
          //     },
          //     {
          //       area_id: "3",
          //       name: "深圳市顺和盈汽车贸易有限公司*"
          //     },
          //     {
          //       area_id: "635",
          //       name: "广州迅锐汽车销售服务有限公司"
          //     },
          //     {
          //       area_id: "637",
          //       name: "广州安骅骅通汽车销售服务有限公司"
          //     },
          //     {
          //       area_id: "638",
          //       name: "北京合通汽车服务有限公司"
          //     },
          //     {
          //       area_id: "639",
          //       name: "盘锦宏骏销售销售服务有限公司"
          //     },
          //     {
          //       area_id: "640",
          //       name: "大连浩通汽车销售服务有限公司"
          //     },
          //     {
          //       area_id: "641",
          //       name: "新疆天邑汽车销售服务有限公司"
          //     },
          //     {
          //       area_id: "642",
          //       name: "北京达世行同驰汽车销售服务有限公司"
          //     },
          //     {
          //       area_id: "643",
          //       name: "陕西华岳汽车销售服务有限责任公司"
          //     },
          //     {
          //       area_id: "644",
          //       name: "潍坊润兰汽车销售服务有限公司"
          //     }
          //   ],
          //   page: 1,
          //   total: null
          // };
          if(type == 'add'){
            this.org.pRelationAreasData = res || [];
          }else if(type == 'edit'){
            this.org.relationAreasData = res.result || [];
            this.org.relationAreasData.forEach(element => {
              element.area_id = element.area_id + '';
            })
          }
          
        });
      });
    },
    getLabelChildAreas(id) {
      Http.getLabelChildAreas({ label_id: id }).then(res => {
        this.loading = false;
        this.$handleResponse(res, res => {
          this.org.relationAreasData = res;
        });
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            !this.org.relationAreasData ||
            !this.org.relationAreasData.length
          ) {
            this.validatorAreas = true;
            return;
          } else {
            this.validatorAreas = false;
          }
          this.loading = true;
          // let { name, brand } = this.org;
          let params = {
            label_name: this.org.name // 集团名称
          };

          // 品牌名称[key]的ID
          /* for (var key in brand) {
                        params["brand_ids[" + key + "]"] = brand[key];
                    }; */

          // 4s店
          for (var key in this.org.relationAreasData) {
            params["area_ids[" + key + "]"] = this.org.relationAreasData[
              key
            ].area_id;
          }

          if (this.$route.query.id) {
            // 编辑
            // params.pid = this.params.id;
            Http.updateLabelChild(this.$route.query.id, params).then(res => {
              this.loading = false;
              this.$handleResponse(res, res => {
                this.$message({
                  type: "success",
                  message: "修改标签成功"
                });
                this.handleClose();
              });
            });
          } else {
            // 新增
            params.label_pid = this.$route.query.pid; // 新增当前子组织时的父id为路由传递过来的id参数
            Http.addLabelChild(params)
              .then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                  this.$message({
                    type: "success",
                    message: "新增标签成功"
                  });
                  this.handleClose();
                });
              })
              .catch(err => {
                this.loading = false;
              });
          }
        }
      });
    },
    handleClose() {
      // 取消
      // this.$router.push({
      //   path: "../org"
      // });
      this.$router.go(-1);
    },
    dialogShow(type, id) {
      // 新增，编辑菜单弹窗显示
      this.dialog.type = type;
      this.dialog.menuId = id;
      this.dialog.menuShow = true;
    },
    dialogSuccess() {
      // 新增或修改成功后关闭窗口
      this.dialog.menuShow = false;
      this.getMenuData();
    },
    listenToAreas(somedata) {
      this.org.relationAreasData = somedata;
      console.log(this.org.relationAreasData);
    }
  }
};
</script>

<style lang="scss">
.org-edit.form__content {
  input.el-input__inner {
    width: auto;
    min-width: 240px;
  }
}
.box-card {
  width: 300px;
  height: 300px;
  overflow-y: auto;
  margin-top: 20px;
  background: #eef3f9;
  box-shadow: none!important;
}
.box-card_empty {
  margin: 0;
  height: 30px;
  line-height: 30px;
  padding: 6px 15px 0;
  color: #909399;
  text-align: center;
}
</style>

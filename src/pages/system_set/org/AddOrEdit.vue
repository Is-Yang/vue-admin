<template>
    <div class="org-edit form__content"  v-loading="loading">
        <el-form :model="org" :label-position="'right'" ref="orgInfo" :rules="rules"  @keyup.enter.native="onSubmit('roleInfo')"
            size="small" label-width="120px">
            <el-form-item label="上级组织：">
                <el-input v-model="org.pName" :disabled="true"/>
            </el-form-item>
            <el-form-item prop="name" label="组织名称：">
                <el-input v-model.trim="org.name" placeholder="请输入组织名称"/>
            </el-form-item>
            <!-- <el-form-item prop="brand" label="管理品牌：">
                <el-checkbox-group v-model="org.brand">
                    <el-checkbox v-for="item in brandList" :label="item.org_brand_id" :key="item.org_brand_id" name="brand">
                        {{item.brand_name}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item> -->

            <el-form-item label="管理4s店：">
                <el-button type="primary" @click="dialogShow('add',{})" size="small" round>选择4s店</el-button>

                <el-card class="box-card">
                  <div v-for="(item,index) in org.relationAreasData" :key="index" class="text item">
                    {{item.name}}
                  </div>
                  <div v-if="!org.relationAreasData || !org.relationAreasData.length" class="box-card_empty">无数据</div>
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
          v-on:areas-change="listenToAreas"
          @cancel="dialog.menuShow = !dialog.menuShow"
          @success="dialogSuccess">
        </select-area>
    </div>
</template>

<script>
import * as Http from '@/api/setting';
export default {
    components: {},
    data() {
        /* let validatorBrand = (rule, arr, callback) => {
            if (this.brandList.length > 0 && arr.length === 0) {
                return callback(new Error('请至少选择一个品牌'));
            } else {
                callback();
            }
        } */

        return {
            brandList: [],  // 品牌列表
            org: {
                name: '',
                pName: '',
                brand: [],
                relationAreasData: [],
                pRelationAreasData: [],
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入组织名称',
                        trigger: 'blur'
                    },{
                        min: 0, max: 20, message: '20个字符以内', trigger: ['blur', 'change']
                    }
                ],
                // brand: [{ required: true, validator: validatorBrand, trigger: 'change' }]
            },
            loading: false,
            params: {}, // 参数
            dialog: {
              menuShow: false,
              type: '',
              menuId: 0,
            },
            validatorAreas: false
        }
    },
    created() {
        let { id, name } = this.$route.query // 获取路由参数
        this.params = {
            id: id,  // 组织id
            name: name  // 组织昵称
        }

        this.init();
    },
    methods: {
        init() {
            if(this.params.id) {
                this.loading = true;
                // 查看组织信息
                Http.viewOrg(this.params.id).then(res => {
                    this.loading = false;
                    this.$handleResponse(res, res => {
                        this.params.pid = res.pid; // 父组织id
                        if(this.params.name) {  // 新增
                            this.org.pName = this.params.name || res.name;
                            // 获取品牌管理列表
                            this.brandList = res.brand;
                            this.org.relationAreasData = [];
                            this.org.pRelationAreasData = res.pRelationAreas;
                        } else {  // 编辑
                            this.org.pName = res.pidName;
                            this.org.name = res.name;
                            this.org.relationAreasData = res.relationAreas;
                            this.org.pRelationAreasData = res.pRelationAreas;
                            // 获取品牌管理列表
                            /* this.brandList = res.pBrand;
                            // 选中对应的管理品牌
                            res.brand.forEach(item => {
                                this.org.brand.push(item.org_brand_id);
                            }); */
                        }
                    })
                })
            } else {
                 this.$message({
                    type: "error",
                    message: '未获取到组织信息'
                })
            }
        },
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    if(!this.org.relationAreasData || !this.org.relationAreasData.length){
                      this.validatorAreas = true;
                      return;
                    }else{
                      this.validatorAreas = false;
                    }
                    this.loading = true;
                    // let { name, brand } = this.org;
                    let params = {
                        name: this.org.name  // 集团名称
                    }

                    // 品牌名称[key]的ID
                    /* for (var key in brand) {
                        params["brand_ids[" + key + "]"] = brand[key];
                    }; */

                    // 4s店
                    for (var key in this.org.relationAreasData) {
                        params["area_ids[" + key + "]"] = this.org.relationAreasData[key].area_id;
                    };

                    if(!this.params.name) {  // 编辑
                        // params.pid = this.params.id;
                        Http.updateOrg(this.params.id, params).then(res => {
                            this.loading = false;
                            this.$handleResponse(res, res => {
                                this.$message({
                                    type: "success",
                                    message: '修改组织成功'
                                })
                                this.handleClose();
                            })
                        })
                    }else {  // 新增
                        params.pid = this.params.id; // 新增当前子组织时的父id为路由传递过来的id参数
                        Http.addOrg(params).then(res => {
                            this.loading = false;
                            this.$handleResponse(res, res => {
                                this.$message({
                                    type: "success",
                                    message: '新增组织成功'
                                });
                                this.handleClose();
                            })
                        }).catch(err => {
                            this.loading = false;
                        });
                    }
                }
            })
        },
        handleClose() { // 取消
            this.$router.push({
                path: '../org'
            });
        },
        dialogShow(type, id) {  // 新增，编辑菜单弹窗显示
          this.dialog.type = type;
          this.dialog.menuId = id;
          this.dialog.menuShow = true;
        },
        dialogSuccess() { // 新增或修改成功后关闭窗口
          this.dialog.menuShow = false;
          this.getMenuData();
        },
        listenToAreas(somedata) {
          this.org.relationAreasData = somedata
          console.log(this.org.relationAreasData)
        }
    },
}
</script>

<style lang="scss">
  .org-edit.form__content {
    input.el-input__inner {
      width: auto;
      min-width: 240px;
    }
  }
  .box-card{
    width: 300px;
    height: 300px;
    overflow-y: auto;
    margin-top: 20px;
    background: #eef3f9;
    box-shadow: none!important;
  }
  .box-card_empty{
    margin: 0;
    height: 30px;
    line-height: 30px;
    padding: 6px 15px 0;
    color: #909399;
    text-align: center;
  }

</style>

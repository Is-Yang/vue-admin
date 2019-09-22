<template>
  <div>
      <el-dialog :title="title" :visible.sync="dialogShow" width="720px" :close-on-click-modal="false" :before-close="handleClose">
        <div class="enterprise-table">
            <ul>
                <li>行业类型</li>
                <li>{{infoData.company_type_text}}</li>
                <li>企业法人</li>
                <li>{{infoData.corporate}}</li>
                <li>法人手机号</li>
                <li>{{infoData.corporate_phone}}</li>
            </ul>
             <ul>
                <li>企业负责人</li>
                <li>{{infoData.ceo}}</li>
                <li>负责人手机号</li>
                <li>{{infoData.ceo_phone}}</li>
                <li>企业状态</li>
                <li>{{infoData.status}}</li>
            </ul>
             <ul>
                <li style="flex: 1;">经营范围</li>
                <li style="width: 568px;">{{infoData.scope}}</li>
            </ul>
        </div>
      </el-dialog>
  </div>
</template>
  
<script>
import * as Http from '@/api/home'
import * as userInfo from "@/utils/commonService/getUserInfo";
let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
export default {
    props: {
      infoData: {
        type: Object
      }
    },
    inject: ['reload'],
    data() {
      return {
        title: "企业基本信息",
        dialogShow: true,
        loading: false,
        enterpriseForm: {}
      };
    },
    created () {
      this.init();
    },
    methods: {
      init() {
            this.enterpriseForm = Object.assign({}, this.infoData);
      },
      handleClose() {
        this.$emit("cancel");
      }
    }
  }
</script>


<style rel="stylesheet/scss" lang="scss">
    .enterprise-table {
        border-top: 1px solid #ebeef5;
        border-left: 1px solid #ebeef5;
        ul {
            display: flex;
            list-style: none;

            li {
                width: 20%;
                height: 45px;
                line-height: 45px;
                border-right: 1px solid #ebeef5;
                border-bottom: 1px solid #ebeef5;

                &:nth-child(odd) {
                    background-color: #f5f7fa;
                    text-align: center;
                }

                &:nth-child(even) {
                    padding: 0 10px;
                }
            }
        }
    }

</style>

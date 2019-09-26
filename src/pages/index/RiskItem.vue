<template>
  <div class="home-index">
    <div class="card-num">
      <el-row :gutter="15">
        <el-col :span="8" class="flow-item" v-for="(item, key, index) in dataCount.riskInfo" :key="index">
          <el-card shadow="never">
            <h3>{{item.company_type_name}}</h3>
            <div class="info">
                <div @click="showCompanySelect(item.company_type, 3)">
                    {{item.company_type === 1 ? '重大风险' : '严重风险'}}
                    <div>{{item.risk_serious}}</div>
                </div>
                <div @click="showCompanySelect(item.company_type, 2)">
                    {{item.company_type === 1 ? '较大风险' : '高风险'}}
                    <div>{{item.risk_high}}</div>
                </div>
                <div @click="showCompanySelect(item.company_type, 1)">
                    一般风险
                    <div>{{item.risk_normal}}</div>
                </div>
                <div @click="showCompanySelect(item.company_type, 0)">
                    低风险
                    <div>{{item.risk_low}}</div>
                </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8" class="flow-item">
           <router-link :to="{path: '/monitoring/have'}">
            <el-card shadow="never">
              <h3>已监控</h3>
              <div class="info">
                  <span>{{dataCount.has_check}}</span>
              </div>
            </el-card>
           </router-link>
        </el-col>
        <el-col :span="8" class="flow-item">
          <router-link :to="{path: '/monitoring/not'}">
          <el-card shadow="never">
              <h3>未监控</h3>
              <div class="info">
                  <span>{{dataCount.un_check}}</span>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>

    <el-dialog
        title="请选择公司"
        :visible.sync="dialogVisible"
        width="30%">
            <el-select v-model="companyId" placeholder="请选择公司" size="medium" style="width: 100%;" @change="selectCompany">
                <el-option v-for="item in typeList" :key="item.company_id" :label="item.company_name" :value="item.company_id">
                </el-option>
            </el-select>
    </el-dialog>
  </div>
</template>

<script>
import * as Http from '@/api/home'
import * as userInfo from "@/utils/commonService/getUserInfo";
export default {
    data () {
        return {
            dataCount: {},
            dialogVisible: false,
            typeList: [],
            companyId: '',
            token: ''
        }
    },
    created () {
        let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
        this.token = user_info.token;
        this.init();
    },
    methods: {
        init() {
            this.$store.dispatch('openLoading', 'full');
            let params = {
                token: this.token
            }
            Http.getIndexPage(params).then(res => {
                this.$store.dispatch('closeLoading', 'full');
                this.$handleResponse(res, res => {
                        this.dataCount = res.data;
                })
            }).catch(err => {
                this.$store.dispatch('closeLoading', 'full');
                console.log(err)
            });
        },
        selectCompany() {
            if(this.companyId) {
                this.$router.push({
                    path: "monitoring/not",
                    query: {
                        company_id: this.companyId
                    }
                });
            }
        },
        showCompanySelect(type, level) {
            let params = {
                risk_level: level,
                type: type
            }
            Http.companyByType(params).then(res => {
                this.$handleResponse(res, res => {
                    if (res.data) {
                        this.typeList = res.data;
                        this.dialogVisible = true;
                    }
                })
            }).catch(err => {
                console.log(err)
            });
        }
    }
}
</script>

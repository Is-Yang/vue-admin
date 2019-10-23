<template>
  <div class="home-index">
    <div class="card-num">
      <el-row :gutter="15">
        <el-col :span="8" class="flow-item" v-for="(item, key, index) in dataCount.riskInfo" :key="index">
          <el-card shadow="never">
            <h3>{{item.company_type_name}}</h3>
            <div class="info">
                <div @click="showCompanySelect(item.company_type, 3)">
                    重大风险
                    <div>{{item.risk_serious}}</div>
                </div>
                <div @click="showCompanySelect(item.company_type, 2)">
                    较大风险
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
            <div class="card-item">
                <h3>安全风险管控情况</h3>
                <p class="text-right margin-bottom-20">完成率：
                    <span style="color: #fd6b6b; font-weight: 600;">{{complete_rate}}%</span>
                </p>
                <div class="monitoring-table">
                    <ul class="table-head">
                        <li></li>
                        <li>重大风险</li>
                        <li>较大风险</li>
                        <li>一般风险</li>
                        <li>低风险</li>
                    </ul>
                    <div class="table-body">
                        <ul>
                            <li>已监控</li>
                            <li>
                                <a href="javascript:;" @click="getTypeTask(3, 0)">{{monitoringInfo.risk_history_serious}}</a>
                            </li>
                            <li>
                                <a href="javascript:;" @click="getTypeTask(2, 0)">{{monitoringInfo.risk_history_high}}</a>
                            </li>
                            <li>
                                <a href="javascript:;" @click="getTypeTask(1, 0)">{{monitoringInfo.risk_history_normal}}</a>
                            </li>
                            <li>
                                <a href="javascript:;" @click="getTypeTask(0, 0)">{{monitoringInfo.risk_history_low}}</a>
                            </li>
                        </ul>
                        <ul class="txt-danger">
                            <li>未监控</li>
                            <li>
                                <a href="javascript:;" @click="getTypeTask(3, 1)">{{monitoringInfo.risk_undo_serious}}</a>
                            </li>
                            <li>
                                <a href="javascript:;" @click="getTypeTask(2, 1)">{{monitoringInfo.risk_undo_high}}</a>
                            </li>
                            <li>
                                <a href="javascript:;" @click="getTypeTask(1, 1)">{{monitoringInfo.risk_undo_normal}}</a>
                            </li>
                            <li>
                                <a href="javascript:;" @click="getTypeTask(0, 1)">{{monitoringInfo.risk_undo_low}}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </el-col>
        <!-- <el-col :span="8" class="flow-item">
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
        </el-col> -->
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

    <!-- 监控任务 -->
    <type-task v-if="dialog.typeShow"
        :typeTask="dialog.typeTask"
        @cancel="dialog.typeShow = false"
        @success="dialog.typeShow = false">
    </type-task>
  </div>
</template>

<script>
import * as Http from '@/api/home'
import * as userInfo from "@/utils/commonService/getUserInfo";
import TypeTask  from './TypeTask';
export default {
    components: {
        TypeTask
    },
    data () {
        return {
            dataCount: {},
            complete_rate: '',
            monitoringInfo: {},
            dialogVisible: false,
            typeList: [],
            companyId: '',
            riskLevel: '',
            token: '',
            dialog: {
                typeShow: false,
                typeTask: {},
            },
        }
    },
    created () {
        let route = this.$route;
        if (route.query.token) {
            this.token = route.query.token;
        } else {
            let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
            this.token = user_info.token;
        }
       
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
                        this.monitoringInfo = res.risk_info;
                        this.complete_rate = parseFloat(res.risk_info.complete_rate * 100).toFixed(2);
                })
            }).catch(err => {
                this.$store.dispatch('closeLoading', 'full');
                console.log(err)
            });
        },
        getTypeTask(level, type) {
            // this.dialog.typeShow = true;
            // this.dialog.typeTask = {
            //     level: level,
            //     type: type
            // };
        },
        selectCompany() {
            if(this.companyId) {
                this.$router.push({
                    path: "monitoring/not",
                    query: {
                        company_id: this.companyId,
                        risk_level: this.riskLevel
                    }
                });
            }
        },
        showCompanySelect(type, level) {
            this.riskLevel = level;
            let params = {
                risk_level: level,
                type: type,
                token: this.token
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
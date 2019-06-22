<template>
  <div class="home-index">
    <div class="card-num">
      <el-row :gutter="15">
        <el-col :span="8" class="flow-item" v-for="(item, key, index) in dataCount.riskInfo" :key="index">
          <el-card shadow="never">
            <h3>{{item.company_type_name}}</h3>
            <div class="info">
                <div @click="showCompanySelect(item.company_type, 3)">
                    严重风险
                    <div>{{item.risk_serious}}</div>
                </div>
                <div @click="showCompanySelect(item.company_type, 2)">
                    高风险
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
export default {
  data () {
    return {
      dataCount: {},
      dialogVisible: false,
      typeList: [],
      companyId: ''
    }
  },
  created () {
    this.init();
  },
  methods: {
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
    }, 
    init() {
        this.$store.dispatch('openLoading', 'full');
        Http.getIndexPage().then(res => {
            this.$store.dispatch('closeLoading', 'full');
            this.$handleResponse(res, res => {
                    this.dataCount = res.data;
            })
        }).catch(err => {
            this.$store.dispatch('closeLoading', 'full');
            console.log(err)
        });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .home-index {
      .card-num {
            .flow-item {
                margin: 10px 0;
                .el-card {
                    height: 230px;
                    color: #fff;
                    h3 {
                        color: #fff;
                        font-size: 16px;
                        font-weight: 500;
                        margin-bottom: 10px;
                    }

                    .el-card__body {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        padding: 20px 10px 20px 20px; 
                    }

                    .info {
                        flex: 1;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        flex-wrap: wrap;
                        span {
                            text-align: center;
                            word-break: break-all;
                            line-height: 80px;
                            font-size: 90px;
                            font-family: numstyle;
                        }
                        &>div{
                            width: 50%;
                            padding: 10px 0;
                            font-size: 13px;
                            text-align: center;
                            cursor: pointer;
                            transition: all .3s linear;
                            
                            &:hover {
                                padding: 0 0 20px 0;
                            }
                            &>div{
                                margin-top: 8px;
                                font-size: 28px;
                                line-height: 28px;
                            }
                        }
                    }
                }
                
                &:nth-child(1) {
                    .el-card {
                        background-image: linear-gradient(to bottom, #fd6b6b, #ef8e8e);
                    }
                }
                &:nth-child(2) {
                    .el-card {
                        background-image: linear-gradient(to bottom, #ED7C68, #FDB582);
                    }
                }
                &:nth-child(3) {
                    .el-card {
                        background-image: linear-gradient(to bottom, #1494EB, #4EC8F5);
                    }
                }
                &:nth-child(4) {
                    .el-card {
                        background-image: linear-gradient(to bottom, #736DF1, #6BC6FF);
                    }
                }
                &:nth-child(5) {
                    .el-card {
                        background-image: linear-gradient(to bottom, #4fc08d, #63e8ac);
                    }
                }
                &:nth-child(6) {
                    .el-card {
                        background-image: linear-gradient(to bottom, #4fc08d, #63e8ac);
                    }
                }
                &:nth-child(7) {
                    .el-card {
                        background-image: linear-gradient(to bottom, #697179, #98A6B5);
                    }
                }
            }
        }
  }
</style>

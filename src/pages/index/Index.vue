<template>
  <div class="home-index">
    <div class="card-num">
      <el-row :gutter="15">
        <el-col :span="8" class="flow-item" v-for="(item, key, index) in dataCount" :key="index" v-if="item.company_type_name">
          <el-card shadow="never">
            <h3>{{item.company_type_name}}</h3>
            <div class="info">
                <div>
                    严重风险
                    <div>{{item.risk_serious}}</div>
                </div>
                <div>
                    高风险
                    <div>{{item.risk_high}}</div>
                </div>
                <div>
                    一般风险
                    <div>{{item.risk_normal}}</div>
                </div>
                <div>
                    低风险
                    <div>{{item.risk_low}}</div>
                </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8" class="flow-item" v-if="check.has_check">
           <router-link :to="{path: '/monitoring/have'}">
            <el-card shadow="never">
              <h3>已监控</h3>
              <div class="info">
                  <span>{{check.has_check}}</span>
              </div>
            </el-card>
           </router-link>
        </el-col>
        <el-col :span="8" class="flow-item" v-if="check.un_check">
          <router-link :to="{path: '/monitoring/not'}">
          <el-card shadow="never">
              <h3>未监控</h3>
              <div class="info">
                  <span>{{check.un_check}}</span>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as Http from '@/api/home'
export default {
  data () {
    return {
      dataCount: {},
      check: {}
    }
  },
  created () {
    this.init();
  },
  methods: {
    init() {
      Http.getIndexPage().then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
              this.dataCount = res.data;
              this.check.has_check = res.data.has_check;
              this.check.un_check = res.data.un_check;
          })
      }).catch(err => {
          this.loading = false;
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
                            margin: 10px 0;
                            font-size: 13px;
                            text-align: center;
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
                        background-image: linear-gradient(to bottom, #4fc08d, #85d6b1);
                    }
                }
                &:nth-child(6) {
                    .el-card {
                        background-image: linear-gradient(to bottom, #697179, #98A6B5);
                    }
                }
            }
        }
  }
</style>

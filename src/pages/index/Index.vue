<template>
  <div class="home-index">
    <BZManage v-if="isShow" @manageIndex="manageIndex"></BZManage>  

    <RiskItem v-if="!isShow" :token="token"></RiskItem>
  </div>
</template>

<script>
import * as Http from '@/api/home'
import BZManage from './BZManage';
import RiskItem from './RiskItem';
import * as userInfo from "@/utils/commonService/getUserInfo";
export default {
    components: {
        BZManage,
        RiskItem
    },
    data () {
        return {
            token: '',
            isShow: false  // 是否显示巴中的所有区域
        }
    },
    created () {
        let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
        this.token = user_info.token;
    },
    methods: {
        manageIndex(data) {
            Http.getTokenReload({manager_index: data}).then(res => {
                this.$handleResponse(res, res => {
                    this.token = res.token;
                    this.isShow = true;
                })
            })
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

                    &.is-hover-shadow:hover {
                        box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.3);
                        border: none;
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
                        background-image: linear-gradient(to bottom, #607D8B, #9fb2bb);
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

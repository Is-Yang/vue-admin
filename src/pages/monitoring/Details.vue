<template>
    <div>
        <bread-crumb :dataIsArr="false" isBack breadName="monitorDetail"></bread-crumb>

        <div class="details-wrapper minh768 common-section">
            <el-alert 
                title=""
                :closable="false"
                type="success">
                    <p>风险描述： {{descData.risk_desc}}</p>
                    <p>风险定位： {{descData.risk_for}}</p>
                    <p>风险等级： {{descData.risk_level}}</p>
                    <p>导致后果： {{descData.risk_result}}</p>
                    <p>应对措施： {{descData.risk_to_do}}</p>
                    <p>应对分类： {{descData.risk_type}}</p>
            </el-alert>

            <el-row  type="flex" :gutter="15">
                <el-col>
                    <div class="info-wrap">
                        <h3>上报隐患</h3>
                        <div>上报人：<span>{{infoData.name}}</span></div>
                        <div>台&nbsp;&nbsp;&nbsp;账：<span>{{infoData.task_complete_input}}</span></div>
                        <div>照&nbsp;&nbsp;&nbsp;片：<a :href="infoData.task_complete_img" target="_blank"><img :src="infoData.task_complete_img" /></a></div>
                    </div>
                </el-col>
                <el-col>
                    <div class="info-wrap">
                        <h3>隐患处理</h3>
                        <div>隐患等级：<span>{{configData.task_risk_level == 0 ? '低风险' : 
                            configData.task_risk_level == 1 ? '一般风险' : 
                            configData.task_risk_level == 2 ? '高风险' : 
                            configData.task_risk_level == 3 ? '严重风险' : ''}}</span></div>
                        <div>整&nbsp;改&nbsp;人：<span>{{configData.eliminate_risk_name}}</span></div>
                        <div>整改期限：<span>{{configData.eliminate_risk_time_text}}</span></div>
                        <div>整改资金：<span>{{configData.eliminate_risk_money}}</span></div>
                        <div>整改措施：<span>{{configData.eliminate_risk_desc}}</span></div>
                    </div>
                </el-col>
                <el-col>
                    <div class="info-wrap">
                        <h3>整改隐患</h3>
                        <div>上报人：<span>{{submitData.eliminate_risk_name}}</span></div>
                        <div>台&nbsp;&nbsp;&nbsp;账：<span>{{submitData.task_input_forsure}}</span></div>
                        <div>照&nbsp;&nbsp;&nbsp;片：<a :href="submitData.task_complete_img" target="_blank"><img :src="submitData.task_complete_img" /></a></div>
                    </div>
                </el-col>
            </el-row>

            <div class="card-item" style="height: 420px;">
                <h3>安全风险管控情况</h3>
                <p class="text-right margin-bottom-20">完成率：
                    <span style="color: #fd6b6b; font-weight: 600;">{{monitoringInfo.complete_rate*100}}%</span>
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
                                <a href="javascript:;">{{monitoringInfo.risk_history_serious}}</a>
                            </li>
                            <li>
                                <a href="javascript:;">{{monitoringInfo.risk_history_high}}</a>
                            </li>
                            <li>
                                <a href="javascript:;">{{monitoringInfo.risk_history_normal}}</a>
                            </li>
                            <li>
                                <a href="javascript:;">{{monitoringInfo.risk_history_low}}</a>
                            </li>
                        </ul>
                        <ul class="txt-danger">
                            <li>未监控</li>
                            <li>
                                <a href="javascript:;">{{monitoringInfo.risk_undo_serious}}</a>
                            </li>
                            <li>
                                <a href="javascript:;">{{monitoringInfo.risk_undo_high}}</a>
                            </li>
                            <li>
                                <a href="javascript:;">{{monitoringInfo.risk_undo_normal}}</a>
                            </li>
                            <li>
                                <a href="javascript:;">{{monitoringInfo.risk_undo_low}}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as Http from "@/api/home"
import * as userInfo from "@/utils/commonService/getUserInfo";
export default {
    data() {
        return {
            taskId: '',
            position_id: '',
            descData: {},
            infoData: {},
            configData: {},
            submitData: {},
            monitoringInfo: {},
        }
    },
    created() {
        const route = this.$route;
        if (route.query) {
            this.taskId = route.query.taskId;
        };
        this.init();
    },
    methods: {
        init() {
            this.checkDesc();

            this.checkInfo();

            this.checkConfig();

            this.checkSubmit();

            this.checkRick();
        },
        checkRick() {
            let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
            let token = user_info.token;
            Http.getIndexPage({
                token: token
            }).then(res => {
                this.$handleResponse(res, res => {
                    this.monitoringInfo = res.risk_info;
                })
            }).catch(err => {
                console.log(err)
            });
        },
        // 任务详情
        checkDesc() {
            this.loading = true;
            let params = {
                task_id: this.taskId
            };
            Http.getCheckDesc(params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                    this.descData = res.data;
                });
            }).catch(err => {
                this.loading = false;
            });
        },
        // 上报隐患
        checkInfo() {
            this.loading = true;
            let params = {
                task_id: this.taskId,
                type: 0
            };
            Http.getCheckInfo(params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                    this.infoData = res.data;
                });
            }).catch(err => {
                this.loading = false;
            });
        },
        // 隐患处理
        checkConfig() {
            this.loading = true;
            let params = {
                task_id: this.taskId
            };
            Http.getCheckConfig(params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                    this.configData = res.data;
                });
            }).catch(err => {
                this.loading = false;
            });
        },
        // 整改隐患
        checkSubmit() {
            this.loading = true;
            let params = {
                task_id: this.taskId
            };
            Http.getCheckSubmit(params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                    this.submitData = res;
                });
            }).catch(err => {
                this.loading = false;
            });
        }
    },
}
</script>

<style lang="scss">
    .details-wrapper {
        .el-alert__description,.el-alert__content {
            p {
                font-size: 14px;
                margin: 5px 0;
            }
        }
        .info-wrap {
            margin: 25px 0;
            padding: 10px 12px;
            border: 1px solid #eee;
            &>h3{
                margin-bottom: 10px;
            }
            &>div {
                margin: 6px 0;
                img {
                    width: 80px;
                    height: 80px;
                    border: 1px solid #eee;
                    vertical-align: top;
                }
            }
        }
    }
</style>
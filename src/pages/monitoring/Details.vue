<template>
    <div class="details-wrapper">
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

        <!-- <el-row  type="flex" :gutter="15">
            <el-col>
                <div class="info-wrap">
                    <h3>上报隐患</h3>
                    <div>上报人：<span>{{infoData.name}}</span></div>
                    <div>台账：<span>{{infoData}}</span></div>
                    <div>照片：<img :src="infoData" /></div>
                </div>
            </el-col>
             <el-col>
                <div class="info-wrap">
                    <h3>隐患处理</h3>
                    <div>隐患等级：<span>{{configData}}</span></div>
                    <div>整改人：<span>{{configData}}</span></div>
                    <div>整改期限：<span>{{configData.eliminate_risk_time}}</span></div>
                    <div>整改资金：<span>{{configData.eliminate_risk_money}}</span></div>
                    <div>整改措施：<span>{{configData.eliminate_risk_desc}}</span></div>
                </div>
            </el-col>
             <el-col>
                <div class="info-wrap">
                    <h3>整改隐患</h3>
                    <div>上报人：<span>{{submitData}}</span></div>
                    <div>台账：<span>{{submitData}}</span></div>
                    <div>照片：<img :src="submitData" /></div>
                </div>
            </el-col>
        </el-row> -->
    </div>
</template>

<script>
import * as Http from "@/api/home";
export default {
    data() {
        return {
            taskId: '',
            descData: {},
            infoData: {},
            configData: {},
            submitData: {}
        }
    },
    created() {
        const route = this.$route;
        if (route.query && route.query.taskId) {
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
                    this.submitData = res.data;
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
        .el-alert__description {
            p {
                font-size: 14px;
                margin: 5px 0;
            }
        }
        .info-wrap {
            margin: 20px 0;
            padding: 10px 12px;
            border: 1px solid #eee;
            &>div {
                margin: 5px 0;
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
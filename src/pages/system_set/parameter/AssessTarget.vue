<template>
    <div class="assess-target">
        <div class="line padding-bottom-10 margin-bottom-15">
            <span style="color: #303133; font-weight: 700">销冠周考核目标</span>
        </div>
        <div class="padding-10">
            <!-- 页面释义 -->
            <el-alert title="" type="warning" :closable="false" class="margin-bottom-30">
                <ul class="padding-5">
                    <li>此模块用于设置销冠使用的考核目标，包含：任务目标完成情况（回访目标/点评目标/试驾目标）、待处理任务处理情况（跟进任务处理/客流任务处理/战败申请处理/资料缺少处理）；</li>
                    <li>此目标为周目标，每周一可查看上周考核完成情况；未满一周时，也可查看考核任务的完成进度；</li>
                    <li>顾问账号数为销售顾问/DCC邀约员/网销顾问（含销售组长）的账号数量总和，若在统计周期内有增减账号的情况，则按最少的顾问账号数作为考核依据；</li>
                </ul>
            </el-alert>

            <el-form class="margin-top-20" :model="form" label-position="right" label-width="150px" size="small" v-loading="loading">
                <el-form-item label="回访目标设置：">
                    <span>电话回访数&nbsp;&gt;&nbsp;销售顾问/DCC邀约员/网销顾问（含销售组长）的账号数*电话呼出数</span>
                    <el-input v-model="form.phone_call_no" />
                    <span>个/天*{{form.phone_call_days ? form.phone_call_days : 6}}天</span>
                </el-form-item>
                <el-form-item label="点评任务设置：">
                    <span>点评任务数&nbsp;&gt;&nbsp;销售顾问/DCC邀约员/网销顾问（含销售组长）的账号数*点评数</span>
                    <el-input v-model="form.review_no" />
                    <span>个/天*{{form.review_days ? form.review_days : 6}}天</span>
                </el-form-item>
                <el-form-item label="试驾任务设置：">
                    <span>试驾任务数&nbsp;&gt;&nbsp;销售顾问/DCC邀约员/网销顾问（含销售组长）的账号数*试驾数</span>
                    <el-input v-model="form.test_drive_no" />
                    <span>个/天*{{form.test_drive_days ? form.test_drive_days : 6}}天</span>
                </el-form-item>
                <el-form-item label="跟进任务设置：">
                    <span>逾期跟进&nbsp;&lt;</span>
                    <el-input v-model="form.overdue_follow_no" />
                    <span>批次/周为达标</span>
                </el-form-item>
                <el-form-item label="客流任务设置：">
                    <span>逾期客流&nbsp;&lt;</span>
                    <el-input v-model="form.overdue_passenger_no" />
                    <span>批次/周为达标</span>
                </el-form-item>
                <el-form-item label="待处理战败：">
                    <span>未处理战败&nbsp;&lt;</span>
                    <el-input v-model="form.untreated_defeat_no" />
                    <span>批次/周为达标</span>
                </el-form-item>
                <el-form-item label="资料缺少：">
                    <span>资料缺少数&nbsp;&lt;</span>
                    <el-input v-model="form.lack_data_no" />
                    <span>批次/周为达标</span>
                </el-form-item>

                <el-form-item class="margin-top-30" size="medium">
                    <el-button type="primary" @click="submitForm">确定</el-button>
                    <el-button @click="closeForm">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .assess-target {
        .el-input {
            width: 120px;
            margin: 0 10px;
        }
    }
</style>

<script>
import * as Http from '@/api/setting';
import * as userInfo from '@/utils/commonService/getUserInfo';
export default {
    data () {
        return {
            loading: false,
            form: {}
        }
    },
    created() {
        // 获取登录成功后返回的用户信息
        this.user_info = JSON.parse(userInfo.getUserInfo());
        this.getObjectiveInfo(this.user_info && this.user_info.group_id);
    },
    methods: {
        // 获取考核目标信息
        getObjectiveInfo(group_id) {
            this.loading = true;
            Http.groupObjectiveInfo({group_id: group_id}).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                    if (res && res !== null) {
                        this.form = {
                            phone_call_no: res.phone_call_no,
                            phone_call_days: res.phone_call_days,
                            review_no: res.review_no,
                            review_days: res.review_days,
                            test_drive_no: res.test_drive_no,
                            test_drive_days: res.test_drive_days,
                            overdue_follow_no: res.overdue_follow_no,
                            overdue_passenger_no: res.overdue_passenger_no,
                            untreated_defeat_no: res.untreated_defeat_no,
                            lack_data_no: res.lack_data_no,
                            org_objective_id: res.org_objective_id
                        }
                    }
                })
            }).catch(error => {
                this.loading = false;
                console.log(error);
            })
        },
        submitForm() {
            this.loading = true;
            let {
                phone_call_no,
                review_no,
                test_drive_no,
                overdue_follow_no,
                overdue_passenger_no,
                untreated_defeat_no,
                lack_data_no,
                org_objective_id
            } = this.form

            const params = {
                org_objective_id: org_objective_id,
                phone_call_no: phone_call_no,
                review_no: review_no,
                test_drive_no: test_drive_no,
                overdue_follow_no: overdue_follow_no,
                overdue_passenger_no: overdue_passenger_no,
                untreated_defeat_no: untreated_defeat_no,
                lack_data_no: lack_data_no
            }
            Http.objectiveSet(params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                    if (res) {
                        this.$message.success("操作成功");
                        this.closeForm();
                    }
                })
            }).catch(error => {
                this.loading = false;
                console.log(error);
            })
        },
        closeForm() {
            this.$router.push({
                path: '../parameter'
            });
        }
    }
}
</script>


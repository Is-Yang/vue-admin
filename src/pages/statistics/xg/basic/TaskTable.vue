<template>
    <div class="task-table">
        <div class="padding-5" 
            v-loading="loading"
            element-loading-spinner="icon-loading">

            <!-- 页面释义 -->
            <el-alert title="" type="warning" :closable="false" class="tips-bg">
                <ul class="padding-5">
                    <li>单店考核任务表，用于统计各店是否按要求完成集团设定的每周考核任务，每周一可查看上周考核完成情况；</li>
                    <li>筛选时，筛选某个日期，则统计该日期所在的自然周的考核数据，已经生成的过往数据将不会再变更；</li>
                    <li>考核分为：任务目标完成情况（回访目标/点评目标/试驾目标）、待处理任务处理情况（跟进任务处理/客流任务处理/战败申请处理/资料缺少处理）；</li>
                    <li>启动集团考核时，需通过“系统设置-系统功能-销冠周考核目标”设置考核目标；</li>
                </ul>
            </el-alert>

            <!-- 筛选 -->
            <div class="pos-rel line margin-top-20 margin-bottom-20">
                <el-form :inline="true" size="small">
                    <el-form-item label="统计时间">
                        <el-date-picker
                            class="basic-width"
                            v-model="filter.date"
                            type="date"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filter.time" readonly style="width: 200px;"/>
                    </el-form-item>
                    <!-- <el-form-item>
                        <el-checkbox v-model="filter.clearCache">清除缓存</el-checkbox>
                    </el-form-item> -->
                    <!-- <el-form-item class="margin-left-30">
                        <el-button type="primary" @click="searchFn">查询</el-button>
                        <el-button @click="resetFn">重置</el-button>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button
                            type="primary"
                            size="small"
                            round
                            icon="el-icon-search"
                            class="m-l-28"
                            @click="searchFn"
                        >查询</el-button>
                        <el-button plain size="small" round icon="el-icon-delete" @click="resetFn">清空查询条件</el-button>
                    </el-form-item>
                </el-form>

                <div class="question" @click="dialogShow()">
                    <el-button type="info" size="mini" icon="fas fa-question" circle></el-button>
                </div>
            </div>

            <TableExport :url="configExport.url" :params="configExport.params" :filename="configExport.filename" method="post"></TableExport>

            <el-table :data="taskTable" border size="mini">
                <el-table-column label="经销商名称" prop="area_name" width="251" fixed="left"></el-table-column>

                <el-table-column label="顾问数">
                    <el-table-column label="顾问数量" prop="emp_num" width="70"></el-table-column>
                </el-table-column>

                <el-table-column label="回访目标">
                    <el-table-column label="目标" prop="phone_plan_num" width="70"></el-table-column>
                    <el-table-column label="电话回访数" prop="phone_actual_num" width="78"></el-table-column>
                    <el-table-column label="是否达标" width="50">
                        <template slot-scope="scope">
                            <span :class="scope.row.phone_finish_status === '否' ? 'not' : ''">{{scope.row.phone_finish_status}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="点评目标">
                    <el-table-column label="目标" prop="review_plan_num" width="70"></el-table-column>
                    <el-table-column label="跟进点评数" prop="review_actual_num" width="78"></el-table-column>
                    <el-table-column label="是否达标" width="50">
                        <template slot-scope="scope">
                            <span :class="scope.row.review_finish_status === '否' ? 'not' : ''">{{scope.row.review_finish_status}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="试驾目标">
                    <el-table-column label="目标" prop="drive_plan_num" width="70"></el-table-column>
                    <el-table-column label="智能试驾数" prop="drive_actual_num" width="78"></el-table-column>
                    <el-table-column label="是否达标" width="50">
                        <template slot-scope="scope">
                            <span :class="scope.row.drive_finish_status === '否' ? 'not' : ''">{{scope.row.drive_finish_status}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="跟进任务处理">
                    <el-table-column label="目标" prop="overdue_plan_num" width="70"></el-table-column>
                    <el-table-column label="当前逾期跟进数" prop="overdue_actual_num" width="70"></el-table-column>
                    <el-table-column label="是否达标" width="50">
                        <template slot-scope="scope">
                            <span :class="scope.row.overdue_finish_status === '否' ? 'not' : ''">{{scope.row.overdue_finish_status}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="客流任务处理">
                    <el-table-column label="目标" prop="passenger_plan_num" width="70"></el-table-column>
                    <el-table-column label="当前逾期客流数" prop="passenger_actual_num" width="70"></el-table-column>
                    <el-table-column label="是否达标" width="50">
                        <template slot-scope="scope">
                            <span :class="scope.row.passenger_finish_status === '否' ? 'not' : ''">{{scope.row.passenger_finish_status}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="战败申请处理">
                    <el-table-column label="目标" prop="defeat_plan_num" width="70"></el-table-column>
                    <el-table-column label="提交申请数" prop="defeat_num" width="78"></el-table-column>
                    <el-table-column label="待处理战败" prop="defeat_actual_num" width="78"></el-table-column>
                    <el-table-column label="是否达标" width="50">
                        <template slot-scope="scope">
                            <span :class="scope.row.defeat_finish_status === '否' ? 'not' : ''">{{scope.row.defeat_finish_status}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="资料缺少处理">
                    <el-table-column label="目标" prop="lackdata_plan_num" width="70"></el-table-column>
                    <el-table-column label="资料缺少数" prop="lackdata_actual_num" width="78"></el-table-column>
                    <el-table-column label="是否达标" width="50">
                        <template slot-scope="scope">
                            <span :class="scope.row.lackdate_finish_status === '否' ? 'not' : ''">{{scope.row.lackdate_finish_status}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination 
                @size-change="sizeChange" 
                @current-change="currentChange" 
                :current-page="page.current"
                :page-size="page.size" 
                :total="page.total" 
                :page-sizes="[10, 20, 50, 100, 200]" 
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>

        <!-- 释义弹框 -->
        <Explain 
            v-if="dialog.show" 
            :type="4"
            @cancel="dialog.show = !dialog.show">
        </Explain>
    </div>
</template>


<script>
import moment from "moment";
import * as Http from '@/api/statistics';
import Explain from './Explain';
export default {
    components: {
        Explain
    },
    data() {
        return {
            taskTable: [],
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            filter: {
                date: new Date(),
                clearCache: false
            },
            loading: false,
            dialog: {
                show: false,
                type: ''
            },
            page: {
                current: 1,
                size: 20,
                total: 0
            },
            configExport: {} // 导出
        }
    },
    watch: {
        filter: {
            handler(val) {
                if(val.date) {
                    this.chageDate(val.date);
                }
            },
            deep:true
        }
    },
    created() {
        this.chageDate(this.filter.date);
        this.queryData();
    },
    methods: {
        chageDate(dateVal) {
            let date = dateVal;
            let day = date.getDay() || 7;
            // 获取当前日期的周一
            this.filter.beginDate = moment(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day)).format('YYYY-MM-DD');
            // 获取当前日期的周天
            this.filter.endDate = moment( new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7 - day)).format('YYYY-MM-DD');  

            this.filter.time = this.filter.beginDate + "  至  " + this.filter.endDate;
        },
        // 接口所需参数
        forParams () {
            let {
                beginDate,
                endDate,
                clearCache
            } = this.filter;

            this.params = {
                begin_date: beginDate,
                end_date: endDate,
                clear_cache: clearCache ? 1 : 0,
                page: this.page.current,
                per_page: this.page.size,
                is_report: 0,
            }
        },
        searchFn() {
            this.queryData();
        },
        queryData() {
            this.loading = true;
            this.forParams ();
            Http.objectiveStat(this.params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                    this.taskTable = res.result;
                    this.page.total = Number(res.totalCount);
                })
            }).catch(err => {
                console.log(err);
                this.loading = false;
            })

            // 配置导出时
            this.configExportFn();
        },
        // 配置导出方法
        configExportFn () {
            this.forParams();
            const params = Object.assign({}, this.params);
            params.is_report = 1  // 导出
            // 导出传递所需参数
            this.configExport = {
                url: '/report/objective-stat',
                params: params,
                filename: '单店考核任务表'
            }
        },
        resetFn () {
            this.filter = {
                date: new Date(),
                clearCache: false
            }

            this.chageDate(this.filter.date);
            this.queryData();
        },
        sizeChange(val) { 
            this.page.size = val;
            this.queryData();
        },
        currentChange(val) {
            this.page.current = val;
            this.queryData();
        },
        dialogShow () {
            this.dialog.show = true;
        }
    }
}
</script>

<style lang="scss">
.task-table {
    .el-date-editor.el-input__inner {
        width: auto;
    }

    .el-table__header-wrapper{
        th {
            text-align: center;
        }
    }

    .el-table__row {

        td:not(:first-child) {
            text-align: center;
        }

        .not {
            color: red;
        }
    }
    .tips-bg li{
        color: #C09B60;
        font-size: 14px;
    }
}
</style>


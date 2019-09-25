<template>
    <el-dialog :title="title" :visible.sync="dialogShow" width="1250px" :before-close="handleClose">
        <el-table :data="gridData" v-loading="loading" border tooltip-effect="dark">
            <el-table-column property="task_name" label="任务名称"></el-table-column>
            <el-table-column property="position_name" label="隐患名称" width="100px"></el-table-column>
            <el-table-column property="report_name" label="提交人" width="120px"></el-table-column>
            <el-table-column property="task_input_forsure" label="提交内容"></el-table-column>
            <el-table-column property="create_forsure_time" label="提交时间" width="105px"></el-table-column>
            <el-table-column property="task_input_fix" label="检修完成提交的内容"></el-table-column>
            <el-table-column label="检修图" width="100px">
                <template slot-scope="scope">
                    <a :href="scope.row.task_img_fix" target="_blank">
                        <img :src="scope.row.task_img_fix" style="max-width: 100%;" />
                    </a>
                </template>
            </el-table-column>
            <el-table-column property="task_fix_time" label="检修完成时间" width="105px"></el-table-column>
            <el-table-column property="eliminate_risk_user_name" label="消除隐患的用户人" width="120px"></el-table-column>
            <el-table-column property="eliminate_risk_desc" label="领导批复内容"></el-table-column>
            <el-table-column property="eliminate_config_user" label="确认的领导名称"></el-table-column>
            <el-table-column property="eliminate_config_time" label="领导确认时间" width="105px"></el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.current"
            :page-size="page.size" :total="page.total" :page-sizes="[10, 20, 50, 100, 200]"
            layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </el-dialog>
</template>

<script>
import * as Http from '@/api/home'
export default {
    props: ['level'],
    data() {
        return {
            title: '隐患治理',
            dialogShow: true,
            loading: false,
            gridData: [],
            page: {
                current: 1,
                size: 10,
                total: 0
            },
        }
    },
    created () {
        this.getListData()
    },
    methods: {
        getListData() {
            this.loading = true;
            let params = {
                page: this.page.current,
                risk_level: this.level
            }
            Http.getProblemCheckTask(params).then(res => {
                this.loading = false;
                this.$handleResponse(res, res => {
                    this.gridData = res.data;
                    this.page.total = res.total;
                })
            }).catch(err => {
                this.loading = false;
                console.log(err)
            });
        },
        sizeChange(val) {
            this.page.size = val;
            this.getListData();
        },
        currentChange(val) {
            this.page.current = val;
            this.getListData();
        },
        handleClose() {
            this.$emit("cancel");
        }
    }
}
</script>
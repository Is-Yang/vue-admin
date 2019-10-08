<template>
    <el-dialog :title="title" :visible.sync="dialogShow" width="1100px" :before-close="handleClose">
        <el-table :data="gridData" v-loading="loading" border tooltip-effect="dark">
            <el-table-column property="task_name" label="风险点名称"></el-table-column>
            <el-table-column property="position_detail_name" label="二级子项"></el-table-column>
            <el-table-column property="position_detail_sname" label="三级子项"></el-table-column>
            <el-table-column property="task_desc.risk_desc" label="风险描述"></el-table-column>
            <el-table-column property="task_desc.risk_result" label="导致后果"></el-table-column>
            <el-table-column property="task_desc.risk_to_do" label="管控措施"></el-table-column>
            <el-table-column property="task_desc.row" label="法规依据"></el-table-column>
            <el-table-column property="task_check_cycle" label="管控周期"></el-table-column>
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
            title: '企业风险信息',
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
            Http.getRiskCheckTask(params).then(res => {
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
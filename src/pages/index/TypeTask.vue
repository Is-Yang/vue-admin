<template>
    <el-dialog :title="title" :visible.sync="dialogShow" width="1100px" :before-close="handleClose">
        <el-table :data="gridData" v-loading="loading" border tooltip-effect="dark">
            <el-table-column prop="check_time" label="检查次数" width="80px"></el-table-column>
            <el-table-column prop="name" label="姓名" width="150px"></el-table-column>
            <el-table-column prop="position_name" label="位置" width="110px"></el-table-column>
            <el-table-column prop="task_check_cycle" label="检查周期" width="110px"></el-table-column>
            <el-table-column label="图片" width="120px">
                <template slot-scope="scope">
                    <a :href="scope.row.task_img_forsure" target="_blank">
                        <img :src="scope.row.task_img_forsure" style="max-width: 100%;" />
                    </a>
                </template>
            </el-table-column>
            <el-table-column prop="task_input_forsure" label="检查提交" width="120px"></el-table-column>
            <el-table-column prop="risk_desc" label="任务说明"></el-table-column>
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
    props: {
        typeTask: {
            type: Object
        }
    },
    data() {
        return {
            title: '风险管控信息',
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
                risk_level: this.typeTask.level,
                is_do: this.typeTask.type
            }
            Http.getTypeCheckTask(params).then(res => {
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
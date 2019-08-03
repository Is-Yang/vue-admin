<template>
  <div>
    <div class="margin-bottom-20 text-right">
      <el-button type="primary" size="small" @click="dialogShow('add', {})">创建任务</el-button>
    </div>
    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
      <el-table-column prop="company_name" label="公司名称" width="150px"></el-table-column>
      <el-table-column prop="department_name" label="部门名称" width="150px"></el-table-column>
      <el-table-column prop="position_detail_sname" label="小分类短名称" width="120px"></el-table-column>
      <el-table-column prop="position_detail_name" label="小分类长名称" width="120px"></el-table-column>
      <el-table-column prop="task_name" label="任务名称" width="140px"></el-table-column>
      <el-table-column prop="task_risk_init_level" label="任务初始等级" width="110px"></el-table-column>
      <el-table-column prop="task_status_text" label="任务状态"></el-table-column>
      <el-table-column prop="task_risk_level_text" label="隐患等级"></el-table-column>
      <el-table-column prop="task_desc.risk_for" label="风险定位" width="200px"></el-table-column>
      <el-table-column prop="task_desc.risk_desc" label="风险描述" width="150px"></el-table-column>
      <el-table-column prop="task_desc.risk_to_do" label="管控措施" width="100px"></el-table-column>
      <el-table-column prop="task_desc.risk_type" label="风险分类"></el-table-column>
      <el-table-column prop="task_desc.risk_result" label="导致后果" width="150px"></el-table-column>
      <el-table-column prop="task_desc.risk_evaluate_technology" label="工程技术" width="180px"></el-table-column>
      <el-table-column prop="task_desc.risk_evaluate_to_do" label="管控措施" width="150px"></el-table-column>
      <el-table-column prop="task_desc.risk_evaluate_train" label="培训教育" width="180px"></el-table-column>
      <el-table-column prop="task_desc.risk_evaluate_protect" label="个体防护"></el-table-column>
      <el-table-column prop="task_desc.risk_evaluate_emergency" label="应急处理"></el-table-column>
      <el-table-column prop="task_desc.risk_level" label="风险等级" width="100px"></el-table-column>
      <el-table-column prop="task_desc.row" label="法规依据" width="180px"></el-table-column>
      <el-table-column prop="task_deadline_text" label="任务截止时间" width="150px"></el-table-column>
      <el-table-column prop="create_time_text" label="创建时间" width="150px"></el-table-column>
      <el-table-column label="操作" width="210px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="dialogShow('edit', scope.row)"
            title="编辑"></el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row)"
            title="删除"></el-button>
          <el-button size="mini" type="primary" @click="dialogQCode(scope.row)">二维码</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 分页 -->
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.current"
      :page-size="page.size" :total="page.total" :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    
    <!-- 新增与编辑 -->
    <task-handle
      v-if="dialog.show"
      :type="dialog.type"
      :taskParent="dialog.taskParent"
      @cancel="dialog.show = !dialog.show"
      @success="dialogSuccess">
    </task-handle>

    <el-dialog
      title="二维码"
      :visible.sync="dialogVisible"
      width="400px">
        <div class="text-center">
          <vue-qr :text="qrVal"></vue-qr>
        </div>
    </el-dialog>

  </div>
</template>

<script>
import * as Http from "@/api/home";
import TaskHandle from './TaskHandle';
import VueQr from 'vue-qr'

export default {
  components: {
    TaskHandle,
    VueQr
  },
  inject: ["reload"],
  data() {
    return {
      dialogVisible: false,
      loading: false,
      listData: [],
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      dialog: {
        show: false,
        type: "",
        taskParent: {}
      },
      qrVal: ''
    };
  },
  created() {
    // 根据当前路由，对应不同统计表
    const route = this.$route;
    if (route.path === '/tasks') {
        this.tableType = 1;
    } else if (route.path === '/tasks/company') {
        this.tableType = 2;
    } 
    this.getListData();
  },
  methods: {
    getListData() {
      this.loading = true;
      let params = {
        page: this.page.current
      };

      let queryDataName = this.tableType === 1 ? 'getTaskDesc': 
                          this.tableType === 2 ? 'companyTaskList' : '';

      Http[queryDataName](params)
        .then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.listData = res.data;
            this.page.total = res.total;
          });
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 新增，编辑弹窗显示
    dialogShow(type, initData){ 
      this.dialog.type = type;
      this.dialog.taskParent = initData;
      this.dialog.show = true;
    },
    deleteFn(data) {
      // 删除
      this.$confirm("请确认是否继续删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.doDelete(data.task_id);
        })
        .catch(() => {});
    },
    doDelete(id) {
      this.loading = true;
      let params = {
        task_id: id
      };
      Http.delTaskDesc(params)
        .then(res => {
          this.$handleResponse(res, res => {
            this.$message.success("删除成功");
            this.reload();
          });
        })
        .catch(error => {
          this.loading = false;
          this.$message.error("删除失败");
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
    dialogSuccess() {
      // 新增或修改成功后关闭窗口
      this.dialog.show = false;
      this.getListData();
    },
    dialogQCode(val) {
      this.qrVal = String(val.task_desc_id);
      this.dialogVisible = true;
    }
  }
};
</script>


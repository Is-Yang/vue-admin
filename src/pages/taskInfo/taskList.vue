<template>
  <div>
    <div class="margin-bottom-20 text-right">
      <el-button type="primary" size="small" @click="dialogShow('add', {})">创建任务</el-button>
    </div>
    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
      <el-table-column prop="position_sname" label="大分类"></el-table-column>
      <el-table-column prop="position_detail_name" label="小分类"></el-table-column>
      <el-table-column prop="task_name" label="分类名称"></el-table-column>
      <el-table-column prop="risk_for" label="风险定位"></el-table-column>
      <el-table-column prop="risk_desc" label="风险描述"></el-table-column>
      <el-table-column prop="risk_to_do" label="管控措施"></el-table-column>
      <el-table-column prop="risk_type" label="风险分类"></el-table-column>
      <el-table-column prop="risk_result" label="导致后果"></el-table-column>
      <el-table-column prop="risk_evaluate_technology" label="工程技术"></el-table-column>
      <el-table-column prop="risk_evaluate_to_do" label="管控措施"></el-table-column>
      <el-table-column prop="risk_evaluate_train" label="培训教育"></el-table-column>
      <el-table-column prop="risk_evaluate_protect" label="个体防护"></el-table-column>
      <el-table-column prop="risk_evaluate_emergency" label="应急处理"></el-table-column>
      <el-table-column prop="risk_level" label="风险等级"></el-table-column>
      <el-table-column prop="row" label="法规依据"></el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="dialogShow('edit', scope.row)"
            title="编辑"></el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row)"
            title="删除"></el-button>
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

  </div>
</template>

<script>
import * as Http from "@/api/home";
import TaskHandle from './TaskHandle';
export default {
  components: {
    TaskHandle
  },
  inject: ["reload"],
  data() {
    return {
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
      }
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    getListData() {
      this.loading = true;
      let params = {
        page: this.page.current
      };
      Http.getTaskDesc(params)
        .then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.listData = res.data;
            this.page.total = res.total_page;
          });
        })
        .catch(err => {
          this.loading = false;
        });
    },
    onSearch() {
      // 搜索
      this.page.current = 1;
      this.getListData();
    },
    onReset() {
      // 清空
      this.menuCon.keyword = "";
      this.getListData();
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
          this.doDelete(data.task_desc_id);
        })
        .catch(() => {});
    },
    doDelete(id) {
      this.loading = true;
      let params = {
        task_desc_id: id
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
    }
  }
};
</script>


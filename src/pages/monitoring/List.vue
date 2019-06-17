<template>
  <div>
    <div v-if="companyInfo && companyInfo.company_name">
      <el-alert style="margin-bottom: 20px;"
        title=""
        :closable="false"
        type="warning">
        <h3>{{companyInfo.company_name}}&nbsp;&nbsp;
          <span v-if="companyInfo.company_type_text">({{companyInfo.company_type_text}})</span>
        </h3>
      </el-alert>
    </div>
    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark" ref="menuTable">
      <el-table-column prop="position_sname" label="大分类"></el-table-column>
      <el-table-column prop="position_detail_name" label="小分类"></el-table-column>
      <el-table-column prop="task_name" label="分类名称"></el-table-column>
      <el-table-column prop="task_status_text" label="任务状态"></el-table-column>
      <el-table-column prop="task_risk_level_text" label="隐患等级"></el-table-column>
      <el-table-column prop="create_time_text" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="80px">
        <template slot-scope="scope">
            <el-button size="mini" type="primary" plain icon="el-icon-view" @click="viewDetails(scope.row)" title="查看任务详情">
            </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.current"
      :page-size="page.size" :total="page.total" :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
  </div>
</template>

<script>
import * as Http from "@/api/home";
export default {
  components: {
  },
  inject: ["reload"],
  data() {
    return {
      loading: false,
      listData: [],
      tableType: 1,
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      menuCon: {
        keyword: "",
        state: ""
      },
      dialog: {
        show: false,
        type: "",
        taskId: 0
      },
      companyId: '',
      companyInfo: {}
    };
  },
  created() {
    // 根据当前路由，对应不同统计表
    const route = this.$route;
    if (route.path === '/monitoring/have') {
        this.tableType = 1;
    } else if (route.path === '/monitoring/not') {
        this.tableType = 2;
        if (route.query && route.query.company_id) {
          this.companyId = route.query.company_id;
        }
    } 

    this.getListData();
  },
  methods: {
    getListData() {
      // 菜单列表数据
      this.loading = true;
      let params = {
        page: this.page.current
      };
      let queryDataName = this.tableType === 1 ? 'getCheckList': 
                          this.tableType === 2 && !this.companyId ? 'getUCheckList' : 
                          this.tableType === 2 && this.companyId ? 'companyUncheck' : '';
      this.companyId ? params.company_id = this.companyId : params
      if (queryDataName) {
        Http[queryDataName](params)
          .then(res => {
            this.loading = false;
            this.$handleResponse(res, res => {
              this.listData = res.data;
              this.page.total = res.total;
              if (res.company) {
                this.companyInfo = res.company;
              }
            });
          })
          .catch(err => {
            this.loading = false;
          });
      }
    },
    viewDetails(data){
      this.$router.push({
        path: "details",
        query: {
          taskId: data.task_id
        }
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
    dialogShow(type, id) {
      this.dialog.type = type;
      this.dialog.taskId = id;
      this.dialog.show = true;
    },
    deleteFn(id) {
      // 删除
      this.$confirm("请确认是否继续删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.doDelete(id);
        })
        .catch(() => {});
    },
    doDelete(id) {
      this.loading = true;
    //   Http.deleteMenu(id)
    //     .then(res => {
    //       this.$handleResponse(res, res => {
    //         this.$message.success("删除成功");
    //         this.reload();
    //       });
    //     })
    //     .catch(error => {
    //       this.loading = false;
    //       this.$message.error("删除失败");
    //     });
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


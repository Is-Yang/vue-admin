<template>
  <div>
    <bread-crumb v-if="this.$route.meta.specialModule" :dataIsArr="true" isBack :initBread="customBread"></bread-crumb>

    <div :class="[{ 'minh768 common-section': this.$route.meta.specialModule }]">
      <el-row type="flex">
        <el-col :span="20">
          <el-form :inline="true" :model="searchInfo" size="small">
            <el-form-item label="三级子项">
              <el-select v-model="searchInfo.position_detail_id" placeholder="请选择">
                <el-option v-for="item in positionDetailList" :key="item.position_detail_id"
                  :label="item.position_detail_sname" :value="item.position_detail_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                round
                icon="el-icon-search"
                @click="onSearch"
              >查询</el-button>
              <el-button plain size="small" round icon="el-icon-delete" @click="onReset">清空查询条件</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <el-col :span="4" class="text-right margin-bottom-20">
          <el-button type="primary" size="small" @click="dialogShow('add', {})">创建任务</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
        <!-- <el-table-column prop="company_name" label="公司名称" width="150px"></el-table-column> -->
        <el-table-column prop="task_name" label="风险点名称"></el-table-column>
        <el-table-column prop="position_detail_sname" label="二级子项"></el-table-column>
        <el-table-column prop="position_detail_name" label="三级子项"></el-table-column>
        <!-- <el-table-column prop="task_status_text" label="任务状态"></el-table-column> -->
        <!-- <el-table-column prop="task_risk_level_text" label="隐患等级"></el-table-column> -->
        <el-table-column prop="task_desc.risk_desc" label="风险描述"></el-table-column>
        <!-- <el-table-column prop="task_desc.risk_type" label="风险分类"></el-table-column> -->
        <!-- <el-table-column prop="task_desc.risk_for" label="风险评估" width="200px"></el-table-column> -->
        <el-table-column prop="task_desc.risk_result" label="导致后果"></el-table-column>
        <!-- <el-table-column prop="task_risk_init_level" label="风险级别" width="110px"></el-table-column> -->
        <el-table-column prop="task_desc.risk_level" label="风险级别"></el-table-column>
        <el-table-column label="现有措施" header-align="center">
          <el-table-column prop="task_desc.risk_evaluate_technology" label="工程技术"></el-table-column>
          <el-table-column prop="task_desc.risk_to_do" label="管控措施"></el-table-column>
          <el-table-column prop="task_desc.risk_evaluate_train" label="培训教育"></el-table-column>
          <el-table-column prop="task_desc.risk_evaluate_protect" label="个体防护"></el-table-column>
          <el-table-column prop="task_desc.risk_evaluate_emergency" label="应急处理"></el-table-column>
        </el-table-column>
        <el-table-column prop="task_desc.row" label="法规依据"></el-table-column>
        <el-table-column prop="task_desc.risk_evaluate_to_do" label="新增管控措施"></el-table-column>
        <el-table-column prop="task_check_cycle" label="管控周期"></el-table-column>
        <el-table-column prop="department_name" label="部门名称" width="110px"></el-table-column>
        <!-- <el-table-column prop="task_deadline_text" label="任务截止时间" width="150px"></el-table-column> -->
        <!-- <el-table-column prop="create_time_text" label="创建时间" width="150px"></el-table-column> -->
        <el-table-column label="操作" width="125px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="dialogShow('edit', scope.row)"
              title="编辑"></el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row)"
              title="删除"></el-button>
            <!-- <el-button size="mini" type="primary" @click="dialogQCode(scope.row)">二维码</el-button> -->
          </template>
        </el-table-column>
      </el-table>


      <!-- 分页 -->
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.current"
        :page-size="page.size" :total="page.total" :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"></el-pagination>
     </div>
    
    <!-- 新增与编辑 -->
    <task-handle
      v-if="dialog.show"
      :type="dialog.type"
      :companyId="dialog.companyId"
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

    <table-slider-bar></table-slider-bar>

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
        companyId: '',
        taskParent: {}
      },
      qrVal: '',
      searchInfo: {},
      positionDetailList: [],
      customBread: []
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
    let companyId = route.query && route.query.companyId;
    let positionId = route.query && route.query.positionId;

    this.customBread.push({
      'name': route.query && route.query.brea_name
    });

    this.getPositionDetailList(companyId, positionId);
    this.getListData(companyId, positionId);
  },
  methods: {
    getPositionDetailList(companyId, positionId) {
      Http.getPositionDetailList(
        {
          company_id: companyId,
          position_id: positionId
        }
      ).then(res => {
          this.$handleResponse(res, res => {
            if (res) {
              this.positionDetailList = res;
            }
          });
        })
        .catch(err => {});
    },
    getListData(companyId, positionId) {
      this.loading = true;
      let params = {
        page: this.page.current
      };

      let queryDataName = this.tableType === 1 ? 'getTaskDesc': 
                          this.tableType === 2 ? 'companyTaskList' : '';

     

      if (this.tableType === 2) {
        params.company_id = companyId;
        params.position_id = positionId;
        params.position_detail_id = this.searchInfo.position_detail_id;
      }

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
      // 如果为企业端，则传一个companyId
      if (this.tableType === 1) {
        this.dialog.companyId = this.listData[0].company_id;
      }
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
    },
    onSearch() {
      // 搜索
      this.page.current = 1;
      this.getListData();
    },
    onReset() {
      // 清空
      this.searchInfo = {};
      this.getListData();
    },
  }
};
</script>


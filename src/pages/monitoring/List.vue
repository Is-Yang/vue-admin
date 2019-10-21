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
    <el-row type="flex">
      <el-col :span="24">
        <el-form :inline="true" :model="searchInfo" size="small">
          <el-form-item label="风险点名称">
            <el-input v-model="searchInfo.keyword" placeholder="请输入关键字"></el-input>
          </el-form-item>
          <el-form-item label="一级子项">
            <el-select v-model="searchInfo.position_id" placeholder="请选择" @change="changePostion">
              <el-option v-for="item in positionList" :key="item.position_id" :label="item.position_name"
                :value="item.position_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级子项">
            <el-select v-model="searchInfo.position_detail_id" placeholder="请选择"
              @change="changePostionDetail">
              <el-option v-for="item in positionDetailList" :key="item.position_detail_id"
                :label="item.position_detail_name" :value="item.position_detail_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="三级子项">
            <el-select v-model="searchInfo.position_three_id" placeholder="请选择"
              @change="changeThree">
              <el-option v-for="item in positionThreeList" :key="item.position_three_id"
                :label="item.position_three_name" :value="item.position_three_id">
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
    </el-row>
    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark" ref="menuTable">
      <el-table-column prop="position_name" label="风险点名称"></el-table-column>
      <el-table-column prop="position_detail_name" label="二级子项"></el-table-column>
      <el-table-column prop="position_three_name" label="三级子项"></el-table-column>
      <!-- <el-table-column prop="task_name" label="任务名称"></el-table-column> -->
      <el-table-column prop="task_status_text" label="任务状态"></el-table-column>
      <el-table-column prop="task_risk_level_text" label="隐患等级"></el-table-column>
      <el-table-column prop="task_check_cycle_text" label="管控周期文字"></el-table-column>
      <el-table-column prop="create_time_text" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="80px">
        <template slot-scope="scope">
            <el-button size="mini" type="primary" plain icon="el-icon-view" @click="viewDetails(scope.row)" title="查看隐患整改详情">
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
      riskLevel: '',
      companyInfo: {},
      searchInfo: {},
      positionList: [],
      positionDetailList: [],
      positionThreeList: []
    };
  },
  created() {
    // 根据当前路由，对应不同统计表
    const route = this.$route;
    if (route.path === '/monitoring/have') {
        this.tableType = 1;
    } else if (route.path === '/monitoring/not') {
        this.tableType = 2;
    } else if (route.path === '/monitoring/haveCompany') {
        this.tableType = 3;
    } else if (route.path === '/monitoring/notCompany') {
        this.tableType = 4;
    }

    this.companyId = route.query && route.query.company_id;
    this.riskLevel = route.query && route.query.risk_level;
    
    this.getPositionList();
    this.getListData();
  },
  methods: {
    changePostion() {
      this.getPositionDetailList(this.searchInfo.position_id);
    },
    changePostionDetail() {
      this.searchInfo.position_three_id = '';
      this.getPositionThreeList(this.searchInfo.position_detail_id);
    },
    changeThree(data) {
      this.$set(this.searchInfo, 'position_three_id', data);
      this.$forceUpdate();
    },
    getPositionThreeList(position_detail_id) {
      Http.mGetThree(
        {
          page: 0,
          position_detail_id: position_detail_id
        }
      ).then(res => {
        this.$handleResponse(res, res => {
          if (res) {
            this.positionThreeList = res.data;
          }
        });
      }).catch(err => {});
    },
    getPositionDetailList(position_id) {
      Http.getPositionDetailList({
        position_id: position_id
      })
        .then(res => {
          this.$handleResponse(res, res => {
            if (res) {
              this.positionDetailList = res;
            }
          });
        })
        .catch(err => {});
    },
    getPositionList() {
      Http.getPositionList({
        company_id: this.companyId
      })
        .then(res => {
          this.$handleResponse(res, res => {
            if (res) {
              this.positionList = res;
            }
          });
        })
        .catch(err => {});
    },
    getListData() {
      // 菜单列表数据
      this.loading = true;
      let {
        keyword,
        position_id,
        position_detail_id,
        position_three_id
      } = this.searchInfo;
      let params = {
        page: this.page.current,
        key: keyword,  // 风险点名称
        position_id: position_id,  // 一级子项
        position_detail_id: position_detail_id,  // 二级子项
        position_three_id: position_three_id,  // 三级子项
        risk_level: this.riskLevel
      };
      let queryDataName = this.tableType === 1 ? 'getCheckList': 
                          this.tableType === 2 && !this.companyId ? 'getUCheckList' : 
                          this.tableType === 2 && this.companyId ? 'getRiskCheckTask' : 
                          this.tableType === 3 ? 'companyCheckList' : 
                          this.tableType === 4 ? 'companyUncheck' : '';
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
    }
  }
};
</script>


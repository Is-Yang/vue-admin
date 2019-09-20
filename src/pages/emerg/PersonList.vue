<template>
  <div>
    <el-row>
      <el-col :span="20">
        <el-form :inline="true" :model="searchInfo" size="small">
          <el-form-item label="用户名：">
            <el-input v-model="searchInfo.keyword" placeholder="请输入用户名"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small" round icon="el-icon-search" @click="onSearch">查询</el-button>
            <el-button plain size="small" round icon="el-icon-delete" @click="onReset">清空查询条件</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="4" class="text-right">
        <el-button type="primary" size="small" @click="dialogShow('add', {})">创建应急人员</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
      <el-table-column prop="user_name" label="用户名"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="job" label="岗位等级"></el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="dialogShow('edit', scope.row)" title="编辑">
          </el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row)" title="删除">
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="page.current"
      :page-size="page.size" :total="page.total" :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>

    <person-handle v-if="dialog.show"
        :type="dialog.type"
        :personData="dialog.personData"
        @cancel="dialog.show = !dialog.show"
        @success="dialogSuccess">
    </person-handle>
  </div>
</template>

<script>
  import * as Http from "@/api/home";
  import * as userInfo from "@/utils/commonService/getUserInfo";
  import PersonHandle from './PersonHandle';
  export default {
    inject: ["reload"],
    components: {
      PersonHandle
    },
    data() {
      return {
        loading: false,
        listData: [],
        searchInfo: {

        },
        page: {
          current: 1,
          size: 10,
          total: 0
        },
        dialog: {
          show: false,
          type: "",
          personData: {}
        },
        userInfo: {},
      };
    },
    created() {
      this.getListData();
    },
    methods: {
      getListData() {
        this.loading = true;
        let params = {
          page: this.page.current,
          key: this.searchInfo.keyword
        };

        Http.getCompanyContainer(params)
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
      onSearch() {
        // 搜索
        this.page.current = 1;
        this.getListData();
      },
      onReset() {
        // 清空
        this.searchInfo.keyword = "";
        this.getListData();
      },
      dialogShow(type, data) {
        this.dialog.type = type;
        this.dialog.personData = data;
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
            this.doDelete(data.user_id);
          })
          .catch(() => {});
      },
      doDelete(id) {
        this.loading = true;
        let params = {
          user_id: id
        };
        Http.deleteCompanyContainer(params)
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

<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogShow"
    width="800px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <div class="role-manage">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" size="mini">
            <el-form-item label>
              <el-input v-model="filter.keyword" placeholder="4S店名称搜索"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="searchFn">查询</el-button>
              <el-button @click="resetFn">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-table border v-loading="loading" :data="roleList" size="small">
        <!-- <el-table-column prop="name" label="序号"></el-table-column> -->
        <el-table-column label="序号">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="4S店名称"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="page.current"
        :page-size="page.size"
        :total="page.total"
        :page-sizes="[10]"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import * as Http from "@/api/statistics";
export default {
  props: ["id", "pname"],
  data() {
    return {
      title: "包含4s店",
      dialogShow: true,
      filter: {},
      roleList: [],
      loading: false,
      page: {
        current: 1,
        size: 10,
        total: 0
      }
    };
  },
  created() {
    this.getRoleData();
  },
  methods: {
    getRoleData() {
      // 角色列表
      this.loading = true;
      let { keyword } = this.filter;
      let params = {
        page: this.page.current,
        pageSize: this.page.size,
        keyword: keyword,
        // org_id: this.id
      };
      params[this.pname] = this.id;

      Http.getArea(params)
        .then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.roleList = res.result;
            this.page.total = res.total;
          });
        })
        .catch(err => {
          this.loading = false;
        });
    },
    searchFn() {
      // 搜索
      this.page.current = 1;
      this.getRoleData();
    },
    resetFn() {
      // 清空
      this.filter = {};
      this.getRoleData();
    },
    sizeChange(val) {
      this.page.size = val;
      this.getRoleData();
    },
    currentChange(val) {
      this.page.current = val;
      this.getRoleData();
    },
    handleClose() {
      this.$emit("cancel");
    }
  }
};
</script>

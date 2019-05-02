<template>
  <div class="role-manage">
    <el-row>
      <el-col :span="20">
        <el-form :inline="true" size="small">
          <el-form-item label="角色名称：">
            <el-input v-model="filter.keyword" placeholder="请输入角色名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="small"
              round
              icon="el-icon-search"
              class="m-l-28"
              @click="searchFn"
            >查询</el-button>
            <el-button plain size="small" round icon="el-icon-delete" @click="resetFn">清空查询条件</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="4">
        <router-link to="role/add">
          <el-button type="primary" size="small" class="f-r">新增角色</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-table border v-loading="loading" :data="roleList" size="small">
      <el-table-column prop="name" label="角色名"></el-table-column>
      <el-table-column prop="memberNum" label="使用成员数量"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            icon="el-icon-edit"
            @click="editFn(scope.row.name)"
            title="编辑"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            icon="el-icon-delete"
            @click="deleteFn(scope.row)"
            title="删除"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="page.current"
      :page-size="page.size"
      :total="page.total"
      :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
import * as Http from "@/api/setting";
export default {
  data() {
    return {
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
        keyword: keyword
      };
      Http.getRoleList(params)
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
    deleteFn(row) {
      // 删除
      this.$confirm("确定是否删除此角色？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (row.memberNum > 0) {
            this.$message.error("已有成员使用该角色，请先转移成员再删除！");
            return;
          }
          this.doDelete(row.name);
        })
        .catch(error => {
          console.log(error);
        });
    },
    editFn(name) {
      // 编辑
      this.$router.push({
        path: "role/edit",
        query: {
          name: name
        }
      });
    },
    doDelete(name) {
      this.loading = true;
      Http.deleteRole(name)
        .then(res => {
          this.$handleResponse(res, res => {
            this.$message.success("删除成功");
            this.getRoleData();
          });
        })
        .catch(error => {
          this.loading = false;
          this.$message.error("删除失败");
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
    }
  }
};
</script>

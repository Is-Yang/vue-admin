<template>
  <div v-loading="loading">
    <el-row>
      <el-col :span="20">
        <el-form :inline="true" :model="searchInfo" size="small">
          <el-form-item label="人员姓名：">
            <el-input v-model="searchInfo.keyword" placeholder="请输入人员姓名"></el-input>
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

      <el-col :span="4" class="text-right">
        <router-link :to="{ path: 'account/add', query: {companyId: companyId}}">
          <el-button type="primary" size="small">创建员工账号</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
      <el-table-column prop="company" label="公司"></el-table-column>
      <el-table-column prop="department" label="部门"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="user_name" label="账号"></el-table-column>
      <el-table-column prop="job" label="岗位等级"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column label="是否允许登录">
        <template slot-scope="scope">
         {{scope.row.can_be_login === 1 ? '允许' : '不允许'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="editFn(scope.row.user_id)"
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
  
  </div>
</template>

<script>
import * as Http from "@/api/home";
import * as userInfo from "@/utils/commonService/getUserInfo";
export default {
  inject: ["reload"],
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
        type: ""
      },
      userInfo: {},
      propity: 0,
      companyId: ''
    };
  },
  created() {
    this.userInfo = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
    if (this.userInfo && this.userInfo.propity) {
        this.propity = this.userInfo.propity;
    }
    this.companyId = this.$route.query && this.$route.query.companyId;

    this.getListData();
  },
  methods: {
    getListData() {
      this.loading = true;
      let params = {
        page: this.page.current,
        key: this.searchInfo.keyword,
        company_id: this.companyId
      };
      let queryName = this.propity === 3 ? 'getManagerAccountList' : this.propity === 2 ? 'getAccountList' : 'getManagerUserList';
      Http[queryName](params)
        .then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.listData = this.propity === 1 ? res.managerUsers : res.data;
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
    editFn(user_id) {
      // 编辑
      this.$router.push({
        path: "account/edit",
        query: {
          userId: user_id,
          companyId: this.companyId
        }
      });
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
      Http.delAccount(params)
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


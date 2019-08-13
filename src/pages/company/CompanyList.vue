<template>
  <div>
    <div class="margin-bottom-20 text-right">
      <router-link to="company/add">
        <el-button type="primary" size="small">创建公司</el-button>
      </router-link>
    </div>
    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
      <el-table-column prop="company_name" label="公司名字"></el-table-column>
      <el-table-column prop="company_type_text" label="公司类型"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit"  @click="editFn(scope.row)"
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
  components: {
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
        companyParent: {}
      }
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    getListData() {
      // 菜单列表数据
      this.loading = true;
      let propity = 2;
      let user_info = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());
      propity = user_info && user_info.propity;
      
      let params = {
        propity: propity,
        page: this.page.current
      };
      Http.getCompanyList(params)
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
    editFn(data){ 
       // 编辑
      this.$router.push({
        path: "company/edit",
        query: {
          companyId: data.company_id
        }
      });
    },
    deleteFn(data) {
      // 删除
      this.$confirm("请确认是否继续删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.doDelete(data.company_id);
      }).catch(() => {});
    },
    doDelete(id) {
      this.loading = true;
      let params = {
        company_id: id
      };
      Http.delCompany(params)
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
    }
  }
};
</script>


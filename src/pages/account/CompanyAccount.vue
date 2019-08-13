<template>
  <div>
    <el-row type="flex" class="margin-bottom-20" justify="space-between">
      <!-- <el-col style="font-size: 16px; color: #67C23A;">管理地区: {{areaInfo.area_name}}</el-col> -->
      <el-col class="text-right">
        <router-link to="addCompany">
          <el-button type="primary" size="small">{{pageType == 1 ? '创建政府账号':'创建企业账号'}}</el-button>
        </router-link></el-col>
    </el-row>
    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
      <el-table-column prop="company.company_name" label="公司"></el-table-column>
      <el-table-column prop="user_name" label="名称"></el-table-column>
      <el-table-column prop="area_name" label="区域"></el-table-column>
      <el-table-column prop="propity" label="用户等级"></el-table-column>
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
      areaInfo: '',
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      userInfo: {},
      dialog: {
        show: false,
        type: ""
      },
      pageType: 3
    };
  },
  created() {
    this.userInfo = userInfo.getUserInfo() && JSON.parse(userInfo.getUserInfo());

    const route = this.$route;
    if (route.path === '/account/company') {
        this.pageType = 3;
    } else if (route.path === '/account/government') {
        this.pageType = 1;
    } 
    this.getListData();
  },
  methods: {
    getListData() {
      this.loading = true;
      let propity = 0;
      if (this.userInfo && this.userInfo.propity) {
        propity = this.userInfo.propity;
      }
      let params = {
        page: this.page.current,
        type: propity == 2 ? 1 : 0,  // type未1表示平台端，默认为0表示政府端
        propity: this.pageType   // 企业账户3， 政府账户2，平台账户列表1
      };
      Http.getCompanyAccount(params)
        .then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.listData = res.data;
            this.areaInfo = res.area;
            this.page.total = res.total;
          });
        })
        .catch(err => {
          this.loading = false;
        });
    },
    editFn(user_id) {
      // 编辑
      this.$router.push({
        path: "/account/editCompany",
        query: {
          userId: user_id
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
      Http.deleteAccountM(params)
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

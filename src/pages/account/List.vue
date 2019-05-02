<template>
  <div>
    <div class="margin-bottom-20 text-right">
      <el-button type="primary" size="small" @click="dialogShow('add', {})">创建账号</el-button>
    </div>
    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
      <el-table-column prop="company" label="公司"></el-table-column>
      <el-table-column prop="department" label="部门"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="user_name" label="用户名"></el-table-column>
      <el-table-column prop="job" label="岗位等级"></el-table-column>
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
  
    <!-- 新增和编辑 -->
    <add-and-edit
      v-if="dialog.show"
      :type="dialog.type"
      :accountParent="dialog.accountParent"
      @cancel="dialog.show = !dialog.show"
      @success="dialogSuccess"
    ></add-and-edit>
  </div>
</template>

<script>
import * as Http from "@/api/home";
import AddAndEdit from "./AddAndEdit";
export default {
  components: {
    AddAndEdit
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
        accountParent: {}
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
      let params = {
        page: this.page.current
      };
      Http.getAccountList(params)
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
      this.dialog.accountParent = initData;
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
        token: this.user_info.token,
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


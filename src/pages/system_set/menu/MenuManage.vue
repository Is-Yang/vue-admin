<template>
  <div class="menu-manage">
    <el-row>
      <el-col :span="20">
        <el-form :inline="true" :model="menuCon" size="small">
          <el-form-item label="菜单关键词：">
            <el-input v-model="menuCon.keyword" placeholder="请输入菜单名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="small"
              round
              icon="el-icon-search"
              class="m-l-28"
              @click="onSearch"
            >查询</el-button>
            <el-button plain size="small" round icon="el-icon-delete" @click="onReset">清空查询条件</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="4">
        <el-button type="primary" size="small" class="f-r" @click="dialogShow('add', {})">新增菜单</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" border :data="menuList" tooltip-effect="dark" ref="menuTable" size="small">
      <el-table-column prop="pid" label="PID" width="80px"></el-table-column>
      <el-table-column prop="title" label="名称"></el-table-column>
      <!-- <el-table-column label="分组">
        <template slot-scope="scope">
          {{scope.row.group ? scope.row.group : "--"}}
        </template>
      </el-table-column>-->
      <el-table-column prop="url" label="前端路由"></el-table-column>
      <el-table-column prop="api" label="urls" width="400px"></el-table-column>
      <el-table-column prop="sort" label="排序" width="80px"></el-table-column>
      <el-table-column label="是否隐藏" width="80px">
        <template slot-scope="scope">{{scope.row.hide===0?'显示':'隐藏'}}</template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            icon="el-icon-edit"
            @click="dialogShow('edit', scope.row.menu_id)"
            title="编辑"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            icon="el-icon-delete"
            @click="deleteFn(scope.row.menu_id)"
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

    <!-- 新增和编辑弹窗 -->
    <menu-add-and-edit
      v-if="dialog.menuShow"
      :type="dialog.type"
      :menuId="dialog.menuId"
      @cancel="dialog.menuShow = !dialog.menuShow"
      @success="dialogSuccess"
    ></menu-add-and-edit>
  </div>
</template>

<script>
import * as Http from "@/api/setting";
import MenuAddAndEdit from "./MenuAddAndEdit";
export default {
  components: {
    MenuAddAndEdit
  },
  inject: ["reload"],
  data() {
    return {
      loading: false,
      menuList: [],
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
        menuShow: false,
        type: "",
        menuId: 0
      }
    };
  },
  created() {
    this.getMenuData();
  },
  methods: {
    getMenuData() {
      // 菜单列表数据
      this.loading = true;
      let params = {
        page: this.page.current,
        pageSize: this.page.size,
        keyword: this.menuCon.keyword
      };
      Http.menuList(params)
        .then(res => {
          this.loading = false;
          this.$handleResponse(res, res => {
            this.menuList = res.result;
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
      this.getMenuData();
    },
    onReset() {
      // 清空
      this.menuCon.keyword = "";
      this.getMenuData();
    },
    dialogShow(type, id) {
      // 新增，编辑菜单弹窗显示
      this.dialog.type = type;
      this.dialog.menuId = id;
      this.dialog.menuShow = true;
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
      Http.deleteMenu(id)
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
      this.getMenuData();
    },
    currentChange(val) {
      this.page.current = val;
      this.getMenuData();
    },
    dialogSuccess() {
      // 新增或修改成功后关闭窗口
      this.dialog.menuShow = false;
      this.getMenuData();
    }
  }
};
</script>

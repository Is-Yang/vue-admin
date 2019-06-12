<template>
  <div>
    <el-table v-if="tableType === 1" v-loading="loading" border :data="listData" tooltip-effect="dark" ref="menuTable">
      <el-table-column prop="position_name" label="标题"></el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row.position_id, 'position_id')"
            title="删除"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="tableType === 2" v-loading="loading" border :data="listData" tooltip-effect="dark" ref="menuTable">
      <el-table-column prop="position_detail_name" label="长标题"></el-table-column>
      <el-table-column prop="position_detail_sname" label="短标题"></el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="dialogShow('edit', scope.row)"
            title="编辑"></el-button> -->
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="deleteFn(scope.row.position_detail_id, 'position_detail_id')"
            title="删除"></el-button>
        </template>
      </el-table-column>
    </el-table>
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
      dialog: {
        show: false,
        type: "",
        taskId: 0
      },
    };
  },
  created() {
    // 根据当前路由，对应不同分类数据
    const route = this.$route;
    if (route.path === '/classify/big') {
        this.tableType = 1;
    } else if (route.path === '/classify/small') {
        this.tableType = 2;
    } 

    this.getListData();
  },
  methods: {
    getListData() {
      // 菜单列表数据
      this.loading = true;
      let queryDataName = this.tableType === 1 ? 'getPositionList': 
                          this.tableType === 2 ? 'getPositionDetailList' : '';
      if (queryDataName) {
        Http[queryDataName]()
          .then(res => {
            this.loading = false;
            this.$handleResponse(res, res => {
              this.listData = res;
              this.page.total = res.total;
              console.log(this.listData)
            });
          })
          .catch(err => {
            this.loading = false;
          });
      }
    },
    dialogShow(type, id) {
      // 新增，编辑菜单弹窗显示
      this.dialog.type = type;
      this.dialog.taskId = id;
      this.dialog.show = true;
    },
    deleteFn(id, type) {
      // 删除
      this.$confirm("请确认是否继续删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.doDelete(id, type);
        })
        .catch(() => {});
    },
    doDelete(id, type) {
        this.loading = true;
        let queryDataName = this.tableType === 1 ? 'delPosition': 
                          this.tableType === 2 ? 'delPositionDetail' : '';
        if (queryDataName) {
            let params = {};
            params[type] = id;
            Http[queryDataName](params).then(res => {
                this.$handleResponse(res, res => {
                    this.$message.success("删除成功");
                    this.reload();
                });
            }).catch(error => {
                this.loading = false;
                this.$message.error("删除失败");
            });
        }
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


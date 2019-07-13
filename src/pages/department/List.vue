<template>
  <div>
    <div class="margin-bottom-20 text-right">
    <el-button type="primary" size="small" @click="createDepartment">创建部门</el-button>
    </div>
    <el-table v-loading="loading" border :data="listData" tooltip-effect="dark">
      <el-table-column prop="department_name" label="部门名称"></el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="editFn(scope.row)"
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
export default {
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
        type: ""
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
      Http.getDepartmentList(params)
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
      this.menuCon.keyword = "";
      this.getListData();
    },
    createDepartment() {
         this.$prompt('', '添加部门', {
          confirmButtonText: '提交',
          cancelButtonText: '取消',
        }).then(({ value }) => {
            Http.addDepartment({
                department_name: value
            }).then(res => {
                this.loading = false;
                console.log(res)
                this.$handleResponse(res, res => {
                    this.$message.success('添加成功');
                    this.reload();
                })
            }).catch(err => {
                this.loading = false;
                console.log(err)
            });
        }).catch(() => {
                
        });
    },
    editFn(data) {
       this.$prompt('原始部门名称为：' + data.department_name, '编辑', {
          confirmButtonText: '提交',
          cancelButtonText: '取消',
        }).then(({ value }) => {
            let params = {
                company_id: data.company_id,
                department_id: data.department_id,
                department_name: value
            }
            Http.updateDepartment(params).then(res => {
                this.loading = false;
                console.log(res)
                this.$handleResponse(res, res => {
                    this.$message.success('修改成功');
                    this.reload();
                })
            }).catch(err => {
                this.loading = false;
                console.log(err)
            });
        }).catch(() => {
                
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
          this.doDelete(data.department_id);
        })
        .catch(() => {});
    },
    doDelete(id) {
      this.loading = true;
      let params = {
        departmentId: id
      };
      Http.delDepartment(params)
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

